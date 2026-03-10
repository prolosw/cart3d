# Mart Cart Run

`Mart Cart Run` is a lightweight browser arcade prototype. The player rides a shopping cart through a supermarket, dodges random shoppers and obstacles across three lanes, and reaches the target product zone.

## Controls

- Keyboard: `Left Arrow`, `Right Arrow`
- Touch: tap the on-screen left and right buttons
- Quick restart: `Enter` or `Space` after game over or clear

## Run locally

1. Open a terminal in `E:\codex_work`
2. Run `npm start`
3. Visit [http://localhost:4173](http://localhost:4173)

## Prototype features

- Single-screen pseudo-3D supermarket lane runner
- Three-lane left/center/right movement only
- Random shopper and obstacle spawning
- Goal distance meter and score tracking
- Keyboard and touch controls
- Retry and clear overlays

## Project files

- [index.html](/E:/codex_work/index.html): Game UI shell and controls
- [styles.css](/E:/codex_work/styles.css): Arcade supermarket visual style
- [src/app.js](/E:/codex_work/src/app.js): Game loop, rendering, input, and collision logic
- [src/data.js](/E:/codex_work/src/data.js): Goal item and obstacle balance data
