from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "rankings.db"
PORT = int(os.environ.get("PORT", "4173"))


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def get_connection() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT NOT NULL UNIQUE,
                name TEXT DEFAULT '',
                best_score INTEGER NOT NULL DEFAULT 0,
                best_level INTEGER NOT NULL DEFAULT 0,
                best_hits INTEGER NOT NULL DEFAULT 0,
                best_outcome TEXT NOT NULL DEFAULT '',
                best_updated_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00+00:00',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_id INTEGER NOT NULL,
                score INTEGER NOT NULL,
                level INTEGER NOT NULL,
                hits INTEGER NOT NULL,
                outcome TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY(player_id) REFERENCES players(id)
            );
            """
        )


def get_client_ip(handler: SimpleHTTPRequestHandler) -> str:
    forwarded_for = handler.headers.get("X-Forwarded-For", "").strip()
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    real_ip = handler.headers.get("X-Real-IP", "").strip()
    if real_ip:
        return real_ip
    return handler.client_address[0]


def get_client_identity(handler: SimpleHTTPRequestHandler) -> str:
    ip = get_client_ip(handler)
    user_agent = handler.headers.get("User-Agent", "").strip()
    model = handler.headers.get("Sec-CH-UA-Model", "").strip()
    platform = handler.headers.get("Sec-CH-UA-Platform", "").strip()
    parts = [part for part in (ip, platform, model, user_agent) if part]
    return " | ".join(parts) if parts else ip


def ensure_player(conn: sqlite3.Connection, ip: str) -> sqlite3.Row:
    now = utc_now()
    conn.execute(
        """
        INSERT INTO players (ip, name, best_score, best_level, best_hits, best_outcome, best_updated_at, created_at, updated_at)
        VALUES (?, '', 0, 0, 0, '', '1970-01-01T00:00:00+00:00', ?, ?)
        ON CONFLICT(ip) DO UPDATE SET updated_at = excluded.updated_at
        """,
        (ip, now, now),
    )
    conn.commit()
    return conn.execute("SELECT * FROM players WHERE ip = ?", (ip,)).fetchone()


def get_top_ten(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute(
        """
        SELECT
            ROW_NUMBER() OVER (
                ORDER BY best_score DESC, best_level DESC, best_updated_at ASC, id ASC
            ) AS rank,
            id,
            name,
            best_score,
            best_level
        FROM players
        WHERE best_score > 0
        ORDER BY best_score DESC, best_level DESC, best_updated_at ASC, id ASC
        LIMIT 10
        """
    ).fetchall()
    return [
        {
            "rank": row["rank"],
            "name": row["name"] or f"손님 {row['id']}",
            "score": row["best_score"],
            "level": row["best_level"],
        }
        for row in rows
    ]


def get_player_rank(conn: sqlite3.Connection, player_id: int) -> dict | None:
    row = conn.execute(
        """
        SELECT
            p.id,
            p.name,
            p.best_score,
            p.best_level,
            p.best_hits,
            p.best_outcome,
            CASE
                WHEN p.best_score <= 0 THEN NULL
                ELSE 1 + (
                    SELECT COUNT(*)
                    FROM players other
                    WHERE other.best_score > p.best_score
                       OR (other.best_score = p.best_score AND other.best_level > p.best_level)
                       OR (other.best_score = p.best_score AND other.best_level = p.best_level AND other.best_updated_at < p.best_updated_at)
                       OR (other.best_score = p.best_score AND other.best_level = p.best_level AND other.best_updated_at = p.best_updated_at AND other.id < p.id)
                )
            END AS rank
        FROM players p
        WHERE p.id = ?
        """,
        (player_id,),
    ).fetchone()
    if not row:
        return None
    return {
        "id": row["id"],
        "name": row["name"] or "",
        "score": row["best_score"],
        "level": row["best_level"],
        "hits": row["best_hits"],
        "outcome": row["best_outcome"],
        "rank": row["rank"],
    }


def build_ranking_payload(conn: sqlite3.Connection, player_id: int, *, is_personal_best: bool = False) -> dict:
    top_ten = get_top_ten(conn)
    player = get_player_rank(conn, player_id)
    top_ten_ids = {entry["rank"] for entry in top_ten}
    return {
        "top10": top_ten,
        "player": player,
        "isPersonalBest": is_personal_best,
        "inTop10": bool(player and player["rank"] and player["rank"] <= 10),
        "serverTime": utc_now(),
    }


def save_score(conn: sqlite3.Connection, player_id: int, score: int, level: int, hits: int, outcome: str) -> bool:
    now = utc_now()
    previous = conn.execute("SELECT best_score FROM players WHERE id = ?", (player_id,)).fetchone()
    previous_best = previous["best_score"] if previous else 0

    conn.execute(
        "INSERT INTO scores (player_id, score, level, hits, outcome, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (player_id, score, level, hits, outcome, now),
    )

    is_personal_best = score > previous_best
    if is_personal_best:
        conn.execute(
            """
            UPDATE players
            SET best_score = ?, best_level = ?, best_hits = ?, best_outcome = ?, best_updated_at = ?, updated_at = ?
            WHERE id = ?
            """,
            (score, level, hits, outcome, now, now, player_id),
        )
    else:
        conn.execute("UPDATE players SET updated_at = ? WHERE id = ?", (now, player_id))

    conn.commit()
    return is_personal_best


class GameRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/rankings":
            with get_connection() as conn:
                player = ensure_player(conn, get_client_identity(self))
                self._send_json(build_ranking_payload(conn, player["id"]))
            return
        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/score":
            payload = self._read_json()
            score = max(0, int(payload.get("score", 0)))
            level = max(0, int(payload.get("level", 0)))
            hits = max(0, int(payload.get("hits", 0)))
            outcome = str(payload.get("outcome", "game_over"))[:24]
            with get_connection() as conn:
                player = ensure_player(conn, get_client_identity(self))
                is_best = save_score(conn, player["id"], score, level, hits, outcome)
                self._send_json(build_ranking_payload(conn, player["id"], is_personal_best=is_best))
            return

        if parsed.path == "/api/profile":
            payload = self._read_json()
            name = str(payload.get("name", "")).strip()[:12]
            with get_connection() as conn:
                player = ensure_player(conn, get_client_identity(self))
                conn.execute("UPDATE players SET name = ?, updated_at = ? WHERE id = ?", (name, utc_now(), player["id"]))
                conn.commit()
                self._send_json(build_ranking_payload(conn, player["id"], is_personal_best=bool(name)))
            return

        self._send_json({"error": "not_found"}, HTTPStatus.NOT_FOUND)


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("0.0.0.0", PORT), GameRequestHandler)
    print(f"Mart Cart Run server listening on http://0.0.0.0:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
