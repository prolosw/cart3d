import * as THREE from "../node_modules/three/build/three.module.js";
import { gameBalance, lanePositions, obstacleTypes, products } from "./data.js";

const canvas = document.getElementById("gameCanvas");
const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;
let renderPausedForContextLoss = false;

const ui = {
  levelValue: document.getElementById("levelValue"),
  shoppingList: document.getElementById("shoppingList"),
  cartInventory: document.getElementById("cartInventory"),
  chanceValue: document.getElementById("chanceValue"),
  chanceCount: document.getElementById("chanceCount"),
  chanceStars: document.getElementById("chanceStars"),
  scoreValue: document.getElementById("scoreValue"),
  bestValue: document.getElementById("bestValue"),
  progressText: document.getElementById("progressText"),
  statusText: document.getElementById("statusText"),
  progressFill: document.getElementById("progressFill"),
  overlayCard: document.getElementById("overlayCard"),
  overlayEyebrow: document.getElementById("overlayEyebrow"),
  overlayTitle: document.getElementById("overlayTitle"),
  overlayBody: document.getElementById("overlayBody"),
  overlayMissionList: document.getElementById("overlayMissionList"),
  overlayCountdown: document.getElementById("overlayCountdown"),
  overlayButton: document.getElementById("overlayButton"),
  startButton: document.getElementById("startButton"),
  leftButton: document.getElementById("leftButton"),
  rightButton: document.getElementById("rightButton"),
  pickupToast: document.getElementById("pickupToast"),
  overlayRanking: document.getElementById("overlayRanking"),
  rankingStatus: document.getElementById("rankingStatus"),
  rankingList: document.getElementById("rankingList"),
  rankingMine: document.getElementById("rankingMine"),
  nameForm: document.getElementById("nameForm"),
  playerNameInput: document.getElementById("playerNameInput"),
  saveNameButton: document.getElementById("saveNameButton"),
  nameHelp: document.getElementById("nameHelp"),
  overlayPanel: document.querySelector(".overlay-panel")
};

const isKoreanLocale = (navigator.languages || [navigator.language || "ko"])
  .some((value) => String(value || "").toLowerCase().startsWith("ko"));

const productLocale = {
  strawberries: { ko: "딸기", en: "Strawberries" },
  milk: { ko: "우유", en: "Milk" },
  onion: { ko: "양파", en: "Onion" },
  bread: { ko: "식빵", en: "Bread" },
  fish: { ko: "생선", en: "Fish" },
  cereal: { ko: "시리얼", en: "Cereal" }
};

const translations = {
  ko: {
    title: "마트 카트 런",
    shoppingEyebrow: "장보기 리스트",
    shoppingTitle: "필요한 상품만 정확히 담기",
    levelLabel: "레벨",
    chanceLabel: "기회 / 별",
    scoreLabel: "점수",
    ready: "준비",
    start3d: "3D 마트 장보기를 시작하세요",
    introBody: "시작 버튼을 누르면 이번 레벨의 장보기 리스트가 화면 가운데에 크게 나타나고, 3초 카운트다운 뒤 출발합니다. 모든 상품을 정확히 담으면 바로 끝나지 않고 계산대까지 5초 더 달립니다.",
    startGame: "게임 시작",
    restart: "다시 시작",
    loadingRanking: "랭킹을 불러오는 중...",
    nameLabel: "이름 등록 / 수정",
    namePlaceholder: "이름을 입력하세요",
    save: "저장",
    saveNameHint: "최고기록을 세우면 이름을 저장할 수 있어요.",
    bestLevel: (level) => `최고 레벨 ${level}`,
    progressDone: (current, total) => `${current} / ${total} 완료`,
    statusCleared: "계산 완료, 다음 장보기 준비",
    statusFailed: "수량 초과 또는 충돌 3회로 실패",
    statusCheckout: (sec) => `장보기 완료, 계산대까지 ${sec}초`,
    statusCountdown: (sec) => `출발까지 ${sec}초`,
    statusRunning: "장애물을 피하면서 목표 수량을 정확히 담으세요",
    missionCheckTitle: "장보기 리스트 확인",
    missionCheckBody: "필요한 상품을 정확히 담은 뒤 계산대까지 도착하세요. 3초 뒤 출발합니다.",
    shoppingDoneToast: "장보기 완료! 계산대로 이동하세요",
    collectToast: (name, current, target) => `${name} ${current}/${target} 담았어요`,
    failEyebrow: "도전 실패",
    currentScoreLine: (score) => ` 현재 점수는 ${score}점입니다. 다시 시작하면 1레벨부터 시작합니다.`,
    restartFromBeginning: "처음부터 다시",
    checkoutEyebrow: "계산 완료",
    clearTitle: (level) => `레벨 ${level} 클리어`,
    clearBody: (checkoutPoints, starBonus, levelBonus) => `계산대에 도착해서 상품 점수 ${checkoutPoints}점, 별 보너스 ${starBonus}점, 레벨 보너스 ${levelBonus}점을 정산했어요.`,
    nextLevel: "다음 레벨",
    rankingExistingName: "기존 이름을 수정할 수 있어요.",
    rankingEnterName: "이름을 입력하면 내 기록에 반영돼요.",
    rankingPersonalBest: "신기록이에요. 내 이름을 눌러 바로 저장하거나 수정해 보세요.",
    rankingLive: "실시간 최고 기록 랭킹",
    noRecord: "기록 없음",
    myRank: "내 순위",
    unnamed: "이름 미등록",
    rankingHelpPersonalBest: "신기록을 세웠어요. 랭킹의 내 이름을 누르면 바로 저장하거나 수정할 수 있어요.",
    rankingHelpLocked: "이름 수정은 신기록을 세웠을 때만 할 수 있어요.",
    rankingHelpNew: "신기록을 세우면 랭킹에 이름을 등록할 수 있어요.",
    rankingLoadFailed: "랭킹을 불러오지 못했어요.",
    serverCheck: "서버 연결을 확인해 주세요",
    enterNameLonger: "이름을 1글자 이상 입력해 주세요.",
    savingName: "이름을 저장하는 중...",
    nameSaved: "이름이 저장됐어요.",
    nameSaveFailed: "이름을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    mobilePause: "잠시 멈춤",
    gpuReconnect: "그래픽 장치가 다시 연결되는 중이에요",
    gpuBody: "모바일 기기에서 그래픽 메모리가 잠깐 부족해질 수 있어요. 잠시 후 다시 시작 버튼을 눌러 이어가세요.",
    shopperFailed: (level) => `레벨 ${level}의 장보기를 끝내지 못했어요.`,
    knockedTitle: "3번 부딪혀서 카트가 뒤집혔어요",
    cartFell: "카트가 넘어졌어요",
    tooMany: (name) => `${name}을 너무 많이 담았어요`,
    tooManyBody: (name, target, current) => `${name} 목표는 ${target}개인데 ${current}개를 담아서 수량이 초과됐어요.`,
    goalTarget: (count) => `목표 ${count}개`,
    points: (value) => `${value}점`,
    rank: (value) => `${value}위`
  },
  en: {
    title: "Mart Cart Run",
    shoppingEyebrow: "Shopping List",
    shoppingTitle: "Collect only the exact items you need",
    levelLabel: "Level",
    chanceLabel: "Lives / Stars",
    scoreLabel: "Score",
    ready: "Ready",
    start3d: "Start the 3D supermarket run",
    introBody: "Tap Start to see this level's shopping list in the center, then dash off after a 3-second countdown. Even after collecting everything exactly, you still need to survive 5 more seconds to reach checkout.",
    startGame: "Start Game",
    restart: "Restart",
    loadingRanking: "Loading ranking...",
    nameLabel: "Save / Edit Name",
    namePlaceholder: "Enter your name",
    save: "Save",
    saveNameHint: "Set a high score to save your name.",
    bestLevel: (level) => `Best Level ${level}`,
    progressDone: (current, total) => `${current} / ${total} done`,
    statusCleared: "Checkout complete, next run ready",
    statusFailed: "Failed from over-picking or 3 crashes",
    statusCheckout: (sec) => `Shopping done, checkout in ${sec}s`,
    statusCountdown: (sec) => `Starts in ${sec}s`,
    statusRunning: "Avoid obstacles and collect the exact target count",
    missionCheckTitle: "Check Your Shopping List",
    missionCheckBody: "Collect every required item exactly, then make it to checkout. You start in 3 seconds.",
    shoppingDoneToast: "Shopping complete! Head to checkout",
    collectToast: (name, current, target) => `${name} ${current}/${target} collected`,
    failEyebrow: "Challenge Failed",
    currentScoreLine: (score) => ` Your current score is ${score}. Restarting begins again from Level 1.`,
    restartFromBeginning: "Restart from Level 1",
    checkoutEyebrow: "Checkout Complete",
    clearTitle: (level) => `Level ${level} Cleared`,
    clearBody: (checkoutPoints, starBonus, levelBonus) => `You reached checkout and scored ${checkoutPoints} item points, ${starBonus} star bonus points, and ${levelBonus} level bonus points.`,
    nextLevel: "Next Level",
    rankingExistingName: "You can update your saved name.",
    rankingEnterName: "Enter a name to attach it to this record.",
    rankingPersonalBest: "New record. Tap your name to save or edit it.",
    rankingLive: "Live Top Rankings",
    noRecord: "No record",
    myRank: "My Rank",
    unnamed: "No name",
    rankingHelpPersonalBest: "New record. Tap your name in the ranking to save or edit it.",
    rankingHelpLocked: "You can edit your name only when you set a new personal best.",
    rankingHelpNew: "Set a new personal best to register your name in the ranking.",
    rankingLoadFailed: "Could not load ranking.",
    serverCheck: "Please check the server connection",
    enterNameLonger: "Please enter at least 1 character.",
    savingName: "Saving your name...",
    nameSaved: "Your name was saved.",
    nameSaveFailed: "Could not save your name. Please try again shortly.",
    mobilePause: "Paused",
    gpuReconnect: "Reconnecting the graphics device",
    gpuBody: "Graphics memory may briefly run low on mobile devices. Please tap restart again in a moment to continue.",
    shopperFailed: (level) => `You couldn't finish the shopping run on Level ${level}.`,
    knockedTitle: "The cart flipped after 3 crashes",
    cartFell: "The cart tipped over",
    tooMany: (name) => `Too many ${name}`,
    tooManyBody: (name, target, current) => `The target for ${name} was ${target}, but you picked ${current}, so the count went over.`,
    goalTarget: (count) => `Target ${count}`,
    points: (value) => `${value} pts`,
    rank: (value) => `#${value}`
  }
};

const i18n = translations[isKoreanLocale ? "ko" : "en"];

function localizedProductName(product) {
  return productLocale[product.id]?.[isKoreanLocale ? "ko" : "en"] || product.name;
}

function t(key, ...args) {
  const value = i18n[key];
  return typeof value === "function" ? value(...args) : value;
}

function applyStaticTranslations() {
  document.documentElement.lang = isKoreanLocale ? "ko" : "en";
  document.title = t("title");
  const topEyebrow = document.querySelector(".hud-top-copy .eyebrow");
  const topTitle = document.querySelector(".hud-top-copy h1");
  const labels = document.querySelectorAll(".hud-side .label");
  const nameLabel = document.querySelector(".name-label");

  if (topEyebrow) topEyebrow.textContent = t("shoppingEyebrow");
  if (topTitle) topTitle.textContent = t("shoppingTitle");
  if (labels[0]) labels[0].textContent = t("levelLabel");
  if (labels[1]) labels[1].textContent = t("chanceLabel");
  if (labels[2]) labels[2].textContent = t("scoreLabel");
  if (ui.overlayEyebrow) ui.overlayEyebrow.textContent = t("ready");
  if (ui.overlayTitle) ui.overlayTitle.textContent = t("start3d");
  if (ui.overlayBody) ui.overlayBody.textContent = t("introBody");
  if (ui.startButton) ui.startButton.textContent = t("startGame");
  if (ui.overlayButton) ui.overlayButton.textContent = t("restart");
  if (ui.rankingStatus) ui.rankingStatus.textContent = t("loadingRanking");
  if (nameLabel) nameLabel.textContent = t("nameLabel");
  if (ui.playerNameInput) ui.playerNameInput.placeholder = t("namePlaceholder");
  if (ui.saveNameButton) ui.saveNameButton.textContent = t("save");
  if (ui.nameHelp) ui.nameHelp.textContent = t("saveNameHint");
}
const audioState = {
  context: null,
  unlocked: false
};

let pickupToastTimer = 0;

const rankingState = {
  player: null,
  top10: [],
  isPersonalBest: false
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobileDevice, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.25 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf4e5c6, 35, 110);

const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 320);
camera.position.set(0, 22, 44);
camera.lookAt(0, 2, -36);

const laneXs = lanePositions.map((value) => value * 4.3);
const playerZ = 12;
const spawnZ = -92;
const despawnZ = 24;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff2de, 2.4);
sunLight.position.set(10, 22, 12);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 80;
scene.add(sunLight);

const fillLight = new THREE.PointLight(0xb8f0ff, 0.85, 100);
fillLight.position.set(0, 18, -20);
scene.add(fillLight);

const checkoutStartZ = spawnZ - 12;

const world = {
  floorStripes: [],
  shelves: [],
  checkout: null,
  checkoutGlow: null
};

const state = {
  running: false,
  gameOver: false,
  cleared: false,
  score: 0,
  bestLevel: 1,
  level: 1,
  levelConfig: null,
  speed: 0,
  obstacleSpawnTimer: 0,
  itemSpawnTimer: 0,
  lastTime: 0,
  hits: 0,
  hitFlash: 0,
  invulnerableTimer: 0,
  slowdownTimer: 0,
  player: {
    lane: 1,
    shake: 0,
    bob: 0,
    knocked: false,
    knockTimer: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    spin: 0,
    failTitle: "",
    failBody: ""
  },
  introCountdown: 0,
  countdownTick: 0,
  checkoutTimer: 0,
  inCheckout: false,
  shoppingGoals: [],
  obstacles: [],
  items: [],
  particles: [],
  lastTouchMove: 0
};

const shared = {
  materials: {
    metal: new THREE.MeshStandardMaterial({ color: 0x8799a9, metalness: 0.6, roughness: 0.28 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x31404d, metalness: 0.5, roughness: 0.42 }),
    cartRed: new THREE.MeshStandardMaterial({ color: 0xff7d66, roughness: 0.4, metalness: 0.1 }),
    wheel: new THREE.MeshStandardMaterial({ color: 0x222a33, roughness: 0.85, metalness: 0.15 }),
    shelf: new THREE.MeshStandardMaterial({ color: 0xef8c5c, roughness: 0.78, metalness: 0.1 }),
    shelfAccent: new THREE.MeshStandardMaterial({ color: 0xffd675, roughness: 0.75, metalness: 0.05 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xf2e5c7, roughness: 0.98, metalness: 0 }),
    stripe: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82, metalness: 0 }),
    basketGlass: new THREE.MeshStandardMaterial({ color: 0xd9f0f8, transparent: true, opacity: 0.45, roughness: 0.08, metalness: 0.3 })
  }
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;");
}

function isHumanObstacle(type) {
  return type.id === "shopper" || type.id === "employee" || type.id === "box";
}


function ensureAudio() {
  if (!audioState.context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }
    audioState.context = new AudioContextClass();
  }
  if (audioState.context.state === "suspended") {
    audioState.context.resume();
  }
  audioState.unlocked = true;
  return audioState.context;
}

function playCollectSound() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.085, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  gain.connect(audioContext.destination);

  const a = audioContext.createOscillator();
  a.type = "sine";
  a.frequency.setValueAtTime(784, now);
  a.connect(gain);
  a.start(now);
  a.stop(now + 0.14);

  const b = audioContext.createOscillator();
  b.type = "triangle";
  b.frequency.setValueAtTime(1174, now + 0.12);
  b.connect(gain);
  b.start(now + 0.12);
  b.stop(now + 0.34);
}

function playHitScreamSound(type = { id: "shopper" }) {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const profile = type.id === "employee"
    ? { base: 480, peak: 760, voice: "sawtooth", yelp: "triangle" }
    : type.id === "box"
      ? { base: 420, peak: 620, voice: "square", yelp: "square" }
      : { base: 560, peak: 920, voice: "square", yelp: "triangle" };

  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  gain.connect(audioContext.destination);

  const voice = audioContext.createOscillator();
  voice.type = profile.voice;
  voice.frequency.setValueAtTime(profile.base + Math.random() * 70, now);
  voice.frequency.exponentialRampToValueAtTime(profile.base * 0.7 + Math.random() * 40, now + 0.22);
  voice.connect(gain);
  voice.start(now);
  voice.stop(now + 0.24);

  const yelp = audioContext.createOscillator();
  yelp.type = profile.yelp;
  yelp.frequency.setValueAtTime(profile.peak + Math.random() * 120, now + 0.03);
  yelp.frequency.exponentialRampToValueAtTime(profile.peak * 0.72 + Math.random() * 60, now + 0.2);
  yelp.connect(gain);
  yelp.start(now + 0.03);
  yelp.stop(now + 0.22);
}

function playClearMelody() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const now = audioContext.currentTime;
  const notes = [659.25, 783.99, 987.77, 1318.51];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index % 2 === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.11);
    gain.gain.setValueAtTime(0.0001, now + index * 0.11);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.11 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.11 + 0.22);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + index * 0.11);
    oscillator.stop(now + index * 0.11 + 0.24);
  });
}

function playGameOverMelody() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const now = audioContext.currentTime;
  const notes = [392, 349.23, 293.66, 220];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index < 2 ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.14);
    gain.gain.setValueAtTime(0.0001, now + index * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.1, now + index * 0.14 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.14 + 0.28);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + index * 0.14);
    oscillator.stop(now + index * 0.14 + 0.3);
  });
}

function playCountdownBeep(step) {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = step <= 1 ? "square" : "triangle";
  oscillator.frequency.setValueAtTime(step <= 1 ? 980 : 720, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.16);
}

function playCountdownGoSound() {
  const audioContext = ensureAudio();
  if (!audioContext || !audioState.unlocked) {
    return;
  }

  const now = audioContext.currentTime;
  const notes = [880, 1174];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);
    gain.gain.setValueAtTime(0.0001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.1, now + index * 0.08 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.16);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.18);
  });
}

function spawnImpactBurst(position, direction) {
  const tint = new THREE.Color(direction > 0 ? 0xffe066 : 0xff8b6b);
  for (let index = 0; index < 5; index += 1) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: tint.clone().offsetHSL(0, 0, Math.random() * 0.08) }));
    mesh.position.copy(position);
    mesh.position.y += 2 + Math.random() * 0.7;
    mesh.rotation.z = index * 0.55;
    scene.add(mesh);
    state.particles.push({
      mesh,
      life: 0.22 + Math.random() * 0.12,
      age: 0,
      velocity: new THREE.Vector3(direction * (1.8 + Math.random() * 2.2), 1.4 + Math.random() * 1.6, (Math.random() - 0.5) * 0.8)
    });
  }
}

function beginPlayerKnockout(title, body) {
  state.running = false;
  state.player.knocked = true;
  state.player.knockTimer = 1.1;
  state.player.failTitle = title;
  state.player.failBody = body;
  state.player.velocityX = (Math.random() > 0.5 ? 1 : -1) * (3.4 + Math.random() * 0.9);
  state.player.velocityY = 3.9 + Math.random() * 0.8;
  state.player.velocityZ = -1.9 - Math.random() * 0.6;
  state.player.spin = Math.sign(state.player.velocityX || 1) * (0.9 + Math.random() * 0.35);
  playHitScreamSound();
}
function createFloor() {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 150), shared.materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -20);
  floor.receiveShadow = true;
  scene.add(floor);

  for (let lane = 0; lane < 4; lane += 1) {
    const x = -6.45 + lane * 4.3;
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(lane === 0 || lane === 3 ? 0.18 : 0.09, 0.02, 150),
      new THREE.MeshStandardMaterial({ color: lane === 0 || lane === 3 ? 0x8aa0b1 : 0xb9c7d0, roughness: 0.9 })
    );
    line.position.set(x, 0.01, -20);
    line.receiveShadow = true;
    scene.add(line);
  }

  for (let index = 0; index < 16; index += 1) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 2.8), shared.materials.stripe);
    stripe.position.set(0, 0.03, -75 + index * 9);
    stripe.receiveShadow = true;
    world.floorStripes.push(stripe);
    scene.add(stripe);
  }
}

function createShelfChunk(x, z) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 4.4, 3.5),
    new THREE.MeshStandardMaterial({ color: 0xd7e1e8, roughness: 0.78, metalness: 0.14 })
  );
  body.position.set(0, 2.2, 0);
  body.castShadow = false;
  body.receiveShadow = false;
  group.add(body);

  const inner = new THREE.Mesh(
    new THREE.BoxGeometry(2.18, 3.96, 3.08),
    new THREE.MeshStandardMaterial({ color: 0x8ab7d1, transparent: true, opacity: 0.18, roughness: 0.16, metalness: 0.08 })
  );
  inner.position.set(0, 2.16, 0.08);
  inner.castShadow = false;
  group.add(inner);

  const topPanel = new THREE.Mesh(
    new THREE.BoxGeometry(2.64, 0.34, 3.7),
    new THREE.MeshStandardMaterial({ color: 0x5bb7d6, roughness: 0.42, metalness: 0.1 })
  );
  topPanel.position.set(0, 4.42, 0);
  topPanel.castShadow = false;
  group.add(topPanel);

  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 3.9, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xa3b1bc, roughness: 0.38, metalness: 0.24 })
  );
  doorFrame.position.set(0, 2.16, 1.46);
  doorFrame.castShadow = false;
  group.add(doorFrame);

  for (const paneX of [-0.58, 0.58]) {
    const glassPane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 3.56),
      new THREE.MeshStandardMaterial({ color: 0xe9f7ff, transparent: true, opacity: 0.2, roughness: 0.04, metalness: 0.08, side: THREE.DoubleSide })
    );
    glassPane.position.set(paneX, 2.14, 1.54);
    group.add(glassPane);
  }

  for (const y of [1.04, 2.1, 3.16]) {
    const shelfLine = new THREE.Mesh(
      new THREE.BoxGeometry(2.04, 0.08, 2.74),
      new THREE.MeshStandardMaterial({ color: 0xf4fbff, emissive: 0x9edcff, emissiveIntensity: 0.16, roughness: 0.28 })
    );
    shelfLine.position.set(0, y, 0.02);
    shelfLine.castShadow = false;
    group.add(shelfLine);
  }

  for (const y of [1.06, 2.12, 3.18]) {
    const productBand = new THREE.Mesh(
      new THREE.BoxGeometry(1.88, 0.22, 2.42),
      new THREE.MeshStandardMaterial({ color: y < 2 ? 0xffb36e : y < 3 ? 0x8ed0ff : 0x9be28e, roughness: 0.52 })
    );
    productBand.position.set(0, y + 0.16, -0.08);
    productBand.castShadow = false;
    group.add(productBand);
  }

  const coolerGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.06, 3.74),
    new THREE.MeshBasicMaterial({ color: 0xb9eeff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })
  );
  coolerGlow.position.set(0, 2.16, 1.5);
  group.add(coolerGlow);

  group.position.set(x, 0, z);
  group.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
  scene.add(group);
  return group;
}
function createShelves() {
  for (let index = 0; index < 10; index += 1) {
    const z = -68 + index * 12;
    world.shelves.push(createShelfChunk(-10.3, z));
    world.shelves.push(createShelfChunk(10.3, z));
  }
}

function createCheckoutMesh() {
  const group = new THREE.Group();

  const base = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.72, 4.2), new THREE.MeshStandardMaterial({ color: 0xe2d6bd, roughness: 0.92 }));
  base.position.y = 0.36;
  base.receiveShadow = false;
  group.add(base);

  const counter = new THREE.Mesh(new THREE.BoxGeometry(7.3, 2.2, 1.9), new THREE.MeshStandardMaterial({ color: 0xf7f0de, roughness: 0.58 }));
  counter.position.set(0, 1.46, -0.35);
  counter.castShadow = false;
  counter.receiveShadow = false;
  group.add(counter);

  const belt = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.18, 1.35), new THREE.MeshStandardMaterial({ color: 0x33404c, roughness: 0.5, metalness: 0.18 }));
  belt.position.set(1.0, 2.03, 0.34);
  belt.castShadow = false;
  group.add(belt);

  const scanner = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.62, 0.7), new THREE.MeshStandardMaterial({ color: 0xff855f, roughness: 0.4 }));
  scanner.position.set(-1.82, 2.28, 0.2);
  scanner.castShadow = false;
  group.add(scanner);

  const monitor = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.72, 0.12), new THREE.MeshStandardMaterial({ color: 0x8de3ff, emissive: 0x3aa7d1, emissiveIntensity: 0.5, roughness: 0.28 }));
  monitor.position.set(-0.94, 2.82, -0.08);
  monitor.castShadow = false;
  group.add(monitor);

  const sign = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.68, 0.16), new THREE.MeshStandardMaterial({ color: 0xffd056, emissive: 0xe49b1c, emissiveIntensity: 0.45, roughness: 0.4 }));
  sign.position.set(0, 3.92, -0.86);
  sign.castShadow = false;
  group.add(sign);

  const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.1, 0.18), shared.materials.darkMetal);
  gateLeft.position.set(-3.2, 1.05, 0.9);
  gateLeft.castShadow = false;
  group.add(gateLeft);
  const gateRight = gateLeft.clone();
  gateRight.position.x = 3.2;
  group.add(gateRight);

  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.4),
    new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.28, depthWrite: false })
  );
  glow.position.set(0, 3.8, 1.32);
  group.add(glow);

  group.position.set(0, 0, checkoutStartZ);
  group.visible = false;
  scene.add(group);
  world.checkout = group;
  world.checkoutGlow = glow;
}

function createCartMesh() {
  const group = new THREE.Group();

  const basketShell = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.36, 3.02),
    new THREE.MeshStandardMaterial({ color: 0xc3ccd5, transparent: true, opacity: 0.52, roughness: 0.2, metalness: 0.16 })
  );
  basketShell.position.set(0.06, 2.18, -0.08);
  basketShell.castShadow = true;
  group.add(basketShell);

  const basketInner = new THREE.Mesh(
    new THREE.BoxGeometry(2.08, 1.02, 2.62),
    new THREE.MeshStandardMaterial({ color: 0xdde3e8, transparent: true, opacity: 0.18, roughness: 0.12, metalness: 0.06 })
  );
  basketInner.position.copy(basketShell.position);
  group.add(basketInner);

  for (const rimBar of [
    [2.52, 0.08, 0.1, 0.06, 2.9, -1.6],
    [2.52, 0.08, 0.1, 0.06, 2.9, 1.44],
    [0.1, 0.08, 2.9, -1.16, 2.9, -0.08],
    [0.1, 0.08, 2.9, 1.28, 2.9, -0.08]
  ]) {
    const rimMesh = new THREE.Mesh(
      new THREE.BoxGeometry(rimBar[0], rimBar[1], rimBar[2]),
      new THREE.MeshStandardMaterial({ color: 0xaeb8c2, roughness: 0.34, metalness: 0.28 })
    );
    rimMesh.position.set(rimBar[3], rimBar[4], rimBar[5]);
    rimMesh.castShadow = true;
    group.add(rimMesh);
  }

  const basketBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 2.68), new THREE.MeshStandardMaterial({ color: 0x95a2ae, roughness: 0.34, metalness: 0.24 }));
  basketBase.position.set(0.06, 1.42, -0.08);
  basketBase.castShadow = true;
  group.add(basketBase);

  const sideFrameGeometry = new THREE.BoxGeometry(0.14, 1.78, 0.14);
  for (const support of [
    [-1.08, 1.95, -1.34],
    [1.2, 1.95, -1.34],
    [-1.08, 1.95, 1.18],
    [1.2, 1.95, 1.18]
  ]) {
    const mesh = new THREE.Mesh(sideFrameGeometry, shared.materials.metal);
    mesh.position.set(...support);
    mesh.castShadow = true;
    group.add(mesh);
  }

  const undercarriage = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 2.02), shared.materials.darkMetal);
  undercarriage.position.set(0.06, 0.78, 0.02);
  undercarriage.castShadow = true;
  group.add(undercarriage);

  const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.38, 0.18), new THREE.MeshStandardMaterial({ color: 0xe1e6ea, transparent: true, opacity: 0.58, roughness: 0.22, metalness: 0.12 }));
  frontPanel.position.set(0.06, 1.78, 1.34);
  frontPanel.castShadow = true;
  group.add(frontPanel);

  const handlePostGeometry = new THREE.BoxGeometry(0.12, 1.18, 0.12);
  const leftHandlePost = new THREE.Mesh(handlePostGeometry, shared.materials.metal);
  leftHandlePost.position.set(-0.92, 2.36, 1.72);
  leftHandlePost.rotation.x = -0.2;
  leftHandlePost.castShadow = true;
  group.add(leftHandlePost);
  const rightHandlePost = leftHandlePost.clone();
  rightHandlePost.position.x = 1.04;
  group.add(rightHandlePost);

  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.26, 18), new THREE.MeshStandardMaterial({ color: 0xb7c0c9, roughness: 0.28, metalness: 0.3 }));
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0.06, 2.98, 2.02);
  handleBar.castShadow = true;
  group.add(handleBar);

  const cargoGroup = new THREE.Group();
  cargoGroup.position.set(0.06, 2.02, -0.02);
  group.add(cargoGroup);

  const adultBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.46, 1.28, 6, 10), new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.62 }));
  adultBody.position.set(0.06, 2.02, 2.88);
  adultBody.castShadow = true;
  group.add(adultBody);

  const adultHead = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffdfc2, roughness: 0.72 }));
  adultHead.position.set(0.06, 3.52, 2.96);
  adultHead.castShadow = true;
  group.add(adultHead);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({ color: 0x403128, roughness: 0.8 }));
  hair.position.set(0.06, 3.62, 2.96);
  hair.castShadow = true;
  group.add(hair);

  const armGeometry = new THREE.CapsuleGeometry(0.1, 0.92, 4, 8);
  const leftArm = new THREE.Mesh(armGeometry, new THREE.MeshStandardMaterial({ color: 0xffd6be, roughness: 0.78 }));
  leftArm.position.set(-0.74, 2.58, 2.32);
  leftArm.rotation.x = Math.PI / 2.75;
  leftArm.rotation.z = -0.16;
  leftArm.castShadow = true;
  group.add(leftArm);
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.86;
  rightArm.rotation.z = 0.16;
  group.add(rightArm);

  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.84, 4, 8);
  const leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x28303a, roughness: 0.8 }));
  leftLeg.position.set(-0.26, 0.86, 3.02);
  leftLeg.rotation.z = 0.08;
  leftLeg.castShadow = true;
  group.add(leftLeg);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.38;
  rightLeg.rotation.z = -0.08;
  group.add(rightLeg);

  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.22, 18);
  for (const wheel of [
    [-0.9, 0.4, -1.06],
    [-0.9, 0.4, 1.02],
    [1.02, 0.4, -1.06],
    [1.02, 0.4, 1.02]
  ]) {
    const mesh = new THREE.Mesh(wheelGeometry, shared.materials.wheel);
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(...wheel);
    mesh.castShadow = true;
    group.add(mesh);
  }

  group.userData.cargoGroup = cargoGroup;
  group.userData.cargoSlots = [
    [-0.56, 0.18, -0.82],
    [0.12, 0.2, -0.48],
    [0.64, 0.18, -0.8],
    [-0.42, 0.5, -0.02],
    [0.34, 0.48, -0.04],
    [0, 0.8, -0.42],
    [0.58, 0.82, 0.22],
    [-0.58, 0.82, 0.22]
  ];
  group.position.set(0, 0, playerZ);
  group.scale.setScalar(0.96);
  scene.add(group);
  return group;
}
function createObstacleMesh(type) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(type.color);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.56, metalness: 0.12 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: baseColor.clone().offsetHSL(0, 0.06, 0.12), roughness: 0.48, metalness: 0.08 });

  if (type.id === "shopper" || type.id === "employee") {
    const outfit = new THREE.Mesh(new THREE.CapsuleGeometry(0.66, 1.42, 7, 14), bodyMaterial);
    outfit.position.y = 1.92;
    outfit.castShadow = true;
    group.add(outfit);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 18), new THREE.MeshStandardMaterial({ color: 0xffdfc2, roughness: 0.74 }));
    head.position.y = 3.56;
    head.castShadow = true;
    group.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: type.id === "employee" ? 0x2e3f69 : 0x533428, roughness: 0.78 }));
    hair.position.y = 3.7;
    hair.castShadow = true;
    group.add(hair);

    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.75, 4, 8);
    const leftArm = new THREE.Mesh(armGeometry, new THREE.MeshStandardMaterial({ color: 0xffd4bb, roughness: 0.8 }));
    leftArm.position.set(-0.58, 2.05, 0);
    leftArm.rotation.z = 0.45;
    leftArm.castShadow = true;
    group.add(leftArm);
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.58;
    rightArm.rotation.z = -0.55;
    group.add(rightArm);

    const legGeometry = new THREE.CapsuleGeometry(0.14, 0.82, 4, 8);
    const leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x2c3138, roughness: 0.78 }));
    leftLeg.position.set(-0.24, 0.62, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.24;
    group.add(rightLeg);

    const accessory = type.id === "employee"
      ? new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.6, 0.1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42 }))
      : new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.38), new THREE.MeshStandardMaterial({ color: 0xf3d15a, roughness: 0.55 }));
    accessory.position.set(type.id === "employee" ? 0.68 : -0.78, 2.1, type.id === "employee" ? 0.18 : 0.02);
    accessory.rotation.z = type.id === "employee" ? -0.35 : 0.26;
    accessory.castShadow = true;
    group.add(accessory);
  } else if (type.id === "box") {
    const cartBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 2.1), shared.materials.metal);
    cartBase.position.set(0.05, 1.0, -0.08);
    cartBase.castShadow = true;
    group.add(cartBase);

    const basket = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.82, 1.9), shared.materials.basketGlass);
    basket.position.set(0.05, 1.56, -0.08);
    basket.castShadow = true;
    group.add(basket);

    const topRail = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.08, 2.02), shared.materials.metal);
    topRail.position.set(0.05, 2.02, -0.08);
    topRail.castShadow = true;
    group.add(topRail);

    const pushHandle = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.12, 0.12), shared.materials.metal);
    pushHandle.position.set(0.05, 2.56, 1.18);
    pushHandle.castShadow = true;
    group.add(pushHandle);

    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.78, 0.08), shared.materials.metal);
    leftPost.position.set(-0.62, 2.18, 0.92);
    leftPost.castShadow = true;
    group.add(leftPost);
    const rightPost = leftPost.clone();
    rightPost.position.x = 0.72;
    group.add(rightPost);

    const helperBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.44, 1.2, 6, 10), new THREE.MeshStandardMaterial({ color: 0x8a5f42, roughness: 0.66 }));
    helperBody.position.set(0.02, 1.96, 2.02);
    helperBody.castShadow = true;
    group.add(helperBody);

    const helperHead = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffdfc2, roughness: 0.74 }));
    helperHead.position.set(0.02, 3.36, 2.04);
    helperHead.castShadow = true;
    group.add(helperHead);

    const helperHair = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({ color: 0x36261f, roughness: 0.82 }));
    helperHair.position.set(0.02, 3.46, 2.04);
    helperHair.castShadow = true;
    group.add(helperHair);

    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.72, 4, 8);
    const leftArm = new THREE.Mesh(armGeometry, new THREE.MeshStandardMaterial({ color: 0xffd4bb, roughness: 0.8 }));
    leftArm.position.set(-0.58, 2.28, 1.56);
    leftArm.rotation.x = Math.PI / 2.7;
    leftArm.castShadow = true;
    group.add(leftArm);
    const rightArm = leftArm.clone();
    rightArm.position.x = 0.62;
    group.add(rightArm);

    const legGeometry = new THREE.CapsuleGeometry(0.12, 0.78, 4, 8);
    const leftLeg = new THREE.Mesh(legGeometry, new THREE.MeshStandardMaterial({ color: 0x2d343d, roughness: 0.78 }));
    leftLeg.position.set(-0.24, 0.72, 2.06);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.28;
    group.add(rightLeg);

    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.14, 14);
    for (const wheel of [[-0.58, 0.24, -0.72], [-0.58, 0.24, 0.62], [0.68, 0.24, -0.72], [0.68, 0.24, 0.62]]) {
      const mesh = new THREE.Mesh(wheelGeometry, shared.materials.wheel);
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(...wheel);
      mesh.castShadow = true;
      group.add(mesh);
    }

    const grocery = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.42), new THREE.MeshStandardMaterial({ color: 0xf0c655, roughness: 0.5 }));
    grocery.position.set(0.18, 1.98, -0.12);
    grocery.castShadow = true;
    group.add(grocery);
  } else if (type.id === "cone") {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.08, 0.18, 20), new THREE.MeshStandardMaterial({ color: 0x3b4148, roughness: 0.82 }));
    base.position.y = 0.09;
    base.castShadow = true;
    group.add(base);

    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.72, 2.0, 24), bodyMaterial);
    cone.position.y = 1.1;
    cone.castShadow = true;
    group.add(cone);

    const stripeOne = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 10, 18), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38 }));
    stripeOne.rotation.x = Math.PI / 2;
    stripeOne.position.y = 0.95;
    group.add(stripeOne);
    const stripeTwo = stripeOne.clone();
    stripeTwo.scale.setScalar(0.76);
    stripeTwo.position.y = 1.38;
    group.add(stripeTwo);
  } else {
    const basket = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 1.45), accentMaterial);
    basket.position.y = 1.45;
    basket.castShadow = true;
    group.add(basket);

    const tray = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.2, 1.62), bodyMaterial);
    tray.position.y = 0.92;
    tray.castShadow = true;
    group.add(tray);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.08, 10, 18, Math.PI), shared.materials.darkMetal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(-0.96, 2.06, 0);
    handle.castShadow = true;
    group.add(handle);

    const wheelGeometry = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 14);
    for (const wheel of [[-0.7, 0.28, -0.48], [-0.7, 0.28, 0.48], [0.75, 0.28, -0.48], [0.75, 0.28, 0.48]]) {
      const mesh = new THREE.Mesh(wheelGeometry, shared.materials.wheel);
      mesh.rotation.z = Math.PI / 2;
      mesh.position.set(...wheel);
      mesh.castShadow = true;
      group.add(mesh);
    }

    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), new THREE.MeshStandardMaterial({ color: 0xf6cf62, roughness: 0.56 }));
    crate.position.set(0.2, 2.0, 0);
    crate.castShadow = true;
    group.add(crate);
  }

  return group;
}

function createProductMesh(product) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(product.color);
  const material = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.42, metalness: 0.08 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: baseColor.clone().offsetHSL(0, 0.08, 0.14), roughness: 0.34, metalness: 0.05 });

  if (product.shape === "berry") {
    for (const part of [[0, 1.18, 0, 0.58], [-0.24, 1.02, 0.1, 0.46], [0.24, 1.02, 0.1, 0.46]]) {
      const berry = new THREE.Mesh(new THREE.SphereGeometry(part[3], 20, 20), material);
      berry.position.set(part[0], part[1], part[2]);
      berry.scale.set(1, 1.12, 1);
      berry.castShadow = true;
      group.add(berry);
    }
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x67bc58, roughness: 0.62 });
    for (let index = 0; index < 4; index += 1) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.46, 6), leafMaterial);
      leaf.position.set(Math.sin(index * 1.5) * 0.18, 1.78, Math.cos(index * 1.5) * 0.18);
      leaf.rotation.z = Math.PI;
      leaf.rotation.y = index * 1.2;
      group.add(leaf);
    }
  } else if (product.shape === "bottle") {
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 1.72, 18), material);
    bottle.position.y = 1.18;
    bottle.castShadow = true;
    group.add(bottle);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.42, 16), accentMaterial);
    neck.position.y = 2.08;
    neck.castShadow = true;
    group.add(neck);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32 }));
    cap.position.y = 2.38;
    cap.castShadow = true;
    group.add(cap);
    const label = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.68, 0.9), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42 }));
    label.position.set(0, 1.2, 0.02);
    group.add(label);
  } else if (product.shape === "round") {
    const onion = new THREE.Mesh(new THREE.SphereGeometry(0.74, 20, 20), material);
    onion.scale.set(1, 1.08, 1);
    onion.position.y = 1.02;
    onion.castShadow = true;
    group.add(onion);
    const root = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 8), new THREE.MeshStandardMaterial({ color: 0x8f5f34, roughness: 0.84 }));
    root.position.y = 0.26;
    root.rotation.x = Math.PI;
    group.add(root);
    const stem = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0x6aa45d, roughness: 0.66 }));
    stem.position.y = 1.82;
    group.add(stem);
  } else if (product.shape === "loaf") {
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.74, 1.0), material);
    base.position.y = 0.72;
    base.castShadow = true;
    group.add(base);
    for (const x of [-0.38, 0, 0.38]) {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), accentMaterial);
      dome.position.set(x, 1.18, 0);
      dome.scale.set(1, 0.92, 1.2);
      dome.castShadow = true;
      group.add(dome);
    }
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.18, 1.06), new THREE.MeshStandardMaterial({ color: 0xf7efe1, roughness: 0.44 }));
    band.position.y = 0.56;
    group.add(band);
  } else if (product.shape === "fish") {
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.72, 18, 18), material);
    body.scale.set(1.5, 0.78, 0.88);
    body.position.y = 1.0;
    body.castShadow = true;
    group.add(body);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.82, 4), accentMaterial);
    tail.rotation.z = -Math.PI / 2;
    tail.position.set(1.1, 1.0, 0);
    tail.castShadow = true;
    group.add(tail);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 4), new THREE.MeshStandardMaterial({ color: 0x9edceb, roughness: 0.42 }));
    fin.position.set(-0.1, 1.48, 0);
    fin.rotation.z = Math.PI;
    group.add(fin);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), new THREE.MeshStandardMaterial({ color: 0x1f2a35, roughness: 0.28 }));
    eye.position.set(-0.58, 1.08, 0.42);
    group.add(eye);
  } else {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.65, 0.96), material);
    box.position.y = 1.06;
    box.castShadow = true;
    group.add(box);
    const frontLabel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.02, 1.0), new THREE.MeshStandardMaterial({ color: 0xfff4d4, roughness: 0.36 }));
    frontLabel.position.set(0, 1.06, 0.02);
    group.add(frontLabel);
    const topFold = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.16, 0.9), accentMaterial);
    topFold.position.y = 1.92;
    topFold.castShadow = true;
    group.add(topFold);
  }

  return group;
}

function createDynamicEntity(mesh, lane, z) {
  const base = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.88, 20), new THREE.MeshBasicMaterial({ color: 0x23323f, transparent: true, opacity: 0.18 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  base.add(shadow);
  base.add(mesh);
  base.position.set(laneXs[lane], 0, z);
  scene.add(base);
  return base;
}

function getGoalTypeCount(level) {
  return Math.min(4, 2 + Math.floor((level - 1) / 2));
}

function createShoppingGoals(level) {
  const goalTypeCount = getGoalTypeCount(level);
  const chosen = shuffle(products).slice(0, goalTypeCount);
  return chosen.map((product, index) => ({
    ...product,
    target: clamp(2 + Math.floor(level / 2) + Math.floor(Math.random() * 2) - (index === chosen.length - 1 ? 1 : 0), 1, Math.min(6, 2 + Math.floor(level / 2))),
    collected: 0
  }));
}

function totalRequiredItems() {
  return state.shoppingGoals.reduce((sum, goal) => sum + goal.target, 0);
}

function totalCollectedItems() {
  return state.shoppingGoals.reduce((sum, goal) => sum + goal.collected, 0);
}

function renderShoppingList() {
  const shoppingColumnCount = Math.min(5, Math.max(1, state.shoppingGoals.length));
  ui.shoppingList.style.setProperty("--shopping-columns", String(shoppingColumnCount));
  ui.shoppingList.parentElement?.style.setProperty("--shopping-columns", String(shoppingColumnCount));

  ui.shoppingList.innerHTML = state.shoppingGoals
    .map((goal) => {
      const doneClass = goal.collected === goal.target ? "done" : "";
      return `<span class="shopping-chip ${doneClass}"><span class="shopping-icon">${goal.icon}</span><span class="shopping-meta"><span class="shopping-name">${localizedProductName(goal)}</span><span class="shopping-count">${goal.collected}/${goal.target}</span></span></span>`;
    })
    .join("");
}

function renderCartInventory() {
  if (!ui.cartInventory) {
    return;
  }

  const filled = state.shoppingGoals.filter((goal) => goal.collected > 0);
  if (filled.length === 0) {
    ui.cartInventory.innerHTML = isKoreanLocale
      ? '<span class="shopping-chip"><span class="shopping-icon">🛒</span><span class="shopping-meta"><span>빈 카트</span><span class="shopping-count">아직 담은 상품이 없어요</span></span></span>'
      : '<span class="shopping-chip"><span class="shopping-icon">🛒</span><span class="shopping-meta"><span>Empty Cart</span><span class="shopping-count">No items collected yet</span></span></span>';
    return;
  }

  ui.cartInventory.innerHTML = filled
    .map((goal) => `<span class="cart-chip"><span class="cart-icon">${goal.icon}</span><span class="cart-meta"><span class="cart-name">${goal.name}</span><span class="cart-count">x${goal.collected}</span></span></span>`)
    .join("");
}
function refreshCartCargo() {
  const cargoGroup = world.playerCart?.userData?.cargoGroup;
  const cargoSlots = world.playerCart?.userData?.cargoSlots || [];
  if (!cargoGroup) {
    return;
  }

  while (cargoGroup.children.length > 0) {
    const cargoChild = cargoGroup.children[0];
    cargoGroup.remove(cargoChild);
    disposeObject3D(cargoChild);
  }

  const collectedItems = [];
  for (const goal of state.shoppingGoals) {
    const visibleCount = Math.min(goal.collected, 3);
    for (let index = 0; index < visibleCount; index += 1) {
      collectedItems.push(goal);
    }
  }

  collectedItems.slice(0, cargoSlots.length).forEach((goal, index) => {
    const cargoMesh = createProductMesh(goal);
    const slot = cargoSlots[index];
    cargoMesh.scale.setScalar(goal.shape === "box" ? 0.34 : 0.4);
    cargoMesh.position.set(slot[0], slot[1], slot[2]);
    cargoMesh.rotation.y = index * 0.6;
    cargoMesh.position.y += goal.shape === "bottle" ? 0.12 : 0;
    cargoGroup.add(cargoMesh);
  });
}


function getMissionCardStyle(goal) {
  return `background: linear-gradient(180deg, ${goal.cardStyle.from}, ${goal.cardStyle.to}); border: 1px solid ${goal.cardStyle.accent}33;`;
}

function renderMissionListMarkup(goals, showCurrent = false) {
  return goals
    .map((goal) => {
      const localizedName = localizedProductName(goal);
      const countLabel = showCurrent ? `${goal.collected}/${goal.target}` : t("goalTarget", goal.target);
      return `<div class="overlay-mission-item" style="${getMissionCardStyle(goal)}"><span class="overlay-mission-thumb">${goal.icon}</span><span><span class="overlay-mission-name">${localizedName}</span><span class="overlay-mission-count">${countLabel}</span></span></div>`;
    })
    .join("");
}

function showPickupToast(message) {
  ui.pickupToast.textContent = message;
  ui.pickupToast.classList.remove("hidden");
  window.clearTimeout(pickupToastTimer);
  pickupToastTimer = window.setTimeout(() => {
    ui.pickupToast.classList.add("hidden");
  }, 1000);
}

function updateCountdownOverlay() {
  if (state.introCountdown <= 0) {
    ui.overlayCountdown.textContent = "";
    ui.overlayCountdown.classList.add("hidden");
    return;
  }

  ui.overlayCountdown.textContent = String(Math.max(1, Math.ceil(state.introCountdown)));
  ui.overlayCountdown.classList.remove("hidden");
  ui.overlayCountdown.classList.remove("countdown-burst");
  void ui.overlayCountdown.offsetWidth;
  ui.overlayCountdown.classList.add("countdown-burst");
}

function beginLevelCountdown() {
  state.running = false;
  state.gameOver = false;
  state.cleared = false;
  state.inCheckout = false;
  state.checkoutTimer = 0;
  state.introCountdown = 3;
  state.countdownTick = Math.ceil(state.introCountdown);
  playCountdownBeep(state.countdownTick);

  showOverlay(
    `${t("levelLabel")} ${state.level}` ,
    t("missionCheckTitle"),
    t("missionCheckBody"),
    t("restart"),
    {
      missionMarkup: renderMissionListMarkup(state.shoppingGoals, false),
      countdown: String(state.countdownTick),
      showStart: false,
      showSecondary: false
    }
  );
}

function updateIntroCountdown(delta) {
  if (state.introCountdown <= 0) {
    return false;
  }

  state.introCountdown = Math.max(0, state.introCountdown - delta);
  const nextTick = Math.max(1, Math.ceil(state.introCountdown));
  if (nextTick !== state.countdownTick) {
    state.countdownTick = nextTick;
    playCountdownBeep(state.countdownTick);
    updateCountdownOverlay();
  }

  if (state.introCountdown === 0) {
    playCountdownGoSound();
    hideOverlay();
    state.running = true;
    syncHud();
  }

  return true;
}

function beginCheckoutRun() {
  state.inCheckout = true;
  state.checkoutTimer = 5;
  state.itemSpawnTimer = 0;
  state.obstacleSpawnTimer = 0;

  if (world.checkout) {
    world.checkout.visible = true;
    world.checkout.position.set(0, 0, checkoutStartZ);
  }

  showPickupToast(t("shoppingDoneToast"));
}
function syncHud() {
  ui.levelValue.textContent = String(state.level);
  const remainingChances = Math.max(0, gameBalance.maxHits - state.hits);
  if (ui.chanceCount) {
    ui.chanceCount.textContent = String(remainingChances);
  }
  if (ui.chanceStars) {
    ui.chanceStars.innerHTML = Array.from({ length: gameBalance.maxHits }, (_, index) => {
      const active = index < remainingChances;
      return `<span class="hud-star${active ? " is-active" : " is-spent"}"><span class="hud-star-core"></span></span>`;
    }).join("");
  }
  if (!ui.chanceCount && ui.chanceValue) {
    ui.chanceValue.textContent = String(remainingChances);
  }
  ui.scoreValue.textContent = String(state.score);
  ui.bestValue.textContent = t("bestLevel", state.bestLevel);
  ui.progressText.textContent = t("progressDone", totalCollectedItems(), totalRequiredItems());
  ui.progressFill.style.width = `${totalRequiredItems() === 0 ? 0 : (totalCollectedItems() / totalRequiredItems()) * 100}%`;
  renderShoppingList();
  renderCartInventory();
  refreshCartCargo();

  if (state.cleared) {
    ui.statusText.textContent = t("statusCleared");
  } else if (state.gameOver) {
    ui.statusText.textContent = t("statusFailed");
  } else if (state.inCheckout) {
    ui.statusText.textContent = t("statusCheckout", Math.max(1, Math.ceil(state.checkoutTimer)));
  } else if (state.introCountdown > 0) {
    ui.statusText.textContent = t("statusCountdown", Math.max(1, Math.ceil(state.introCountdown)));
  } else if (state.invulnerableTimer > 0) {
    ui.statusText.textContent = isKoreanLocale ? `부딪힘 ${state.hits}/3, 계속 진행 중` : `Crash ${state.hits}/3, keep going`;
  } else if (state.running) {
    ui.statusText.textContent = t("statusRunning");
  } else {
    ui.statusText.textContent = t("statusRunning");
  }
}

function resetRankingPanel() {
  if (!ui.overlayRanking) {
    return;
  }

  ui.overlayRanking.classList.add("hidden");
  ui.rankingStatus.textContent = t("loadingRanking");
  ui.rankingList.innerHTML = "";
  ui.rankingMine.innerHTML = "";
  ui.rankingMine.classList.add("hidden");
  ui.nameForm.classList.add("hidden");
  ui.playerNameInput.value = "";
  ui.nameHelp.textContent = t("saveNameHint");
  ui.saveNameButton.disabled = false;
  rankingState.player = null;
  rankingState.top10 = [];
  rankingState.isPersonalBest = false;
}

function showRankingLoading() {
  if (!ui.overlayRanking) {
    return;
  }
  ui.overlayRanking.classList.remove("hidden");
  ui.rankingStatus.textContent = t("loadingRanking");
  ui.rankingList.innerHTML = "";
  ui.rankingMine.classList.add("hidden");
  ui.nameForm.classList.add("hidden");
}

function openNameEditor() {
  if (!ui.nameForm || !rankingState.player || !rankingState.player.score) {
    return;
  }

  ui.nameForm.classList.remove("hidden");
  ui.playerNameInput.value = rankingState.player.name || "";
  ui.playerNameInput.focus();
  ui.playerNameInput.select();
  ui.nameHelp.textContent = rankingState.player.name
    ? t("rankingExistingName")
    : t("rankingEnterName");
}

function renderRankingPanel(payload, helpMessage = "") {
  if (!ui.overlayRanking) {
    return;
  }

  rankingState.player = payload.player || null;
  rankingState.top10 = payload.top10 || [];
  rankingState.isPersonalBest = Boolean(payload.isPersonalBest);

  ui.overlayRanking.classList.remove("hidden");
  ui.rankingStatus.textContent = payload.isPersonalBest
    ? t("rankingPersonalBest")
    : t("rankingLive");

  ui.rankingList.innerHTML = Array.from({ length: 10 }, (_, index) => {
    const rank = index + 1;
    const entry = rankingState.top10.find((row) => row.rank === rank);
    if (!entry) {
      return `<div class="ranking-row"><span>${t("rank", rank)}</span><strong class="ranking-name">${t("noRecord")}</strong><div class="ranking-stats"><span class="score">-</span><span class="level">-</span></div></div>`;
    }

    const isMine = Boolean(payload.player && payload.player.rank === entry.rank);
    const canEditHere = isMine && payload.isPersonalBest;
    const nameMarkup = canEditHere
      ? `<strong class="ranking-name ranking-name-editable" data-ranking-edit="true" role="button" tabindex="0">${escapeHtml(entry.name)}</strong>`
      : `<strong class="ranking-name">${escapeHtml(entry.name)}</strong>`;

    return `<div class="ranking-row${isMine ? " is-me" : ""}"><span>${t("rank", entry.rank)}</span>${nameMarkup}<div class="ranking-stats"><span class="score">${t("points", entry.score)}</span><span class="level">Lv.${entry.level}</span></div></div>`;
  }).join("");

  if (payload.player && payload.player.rank && payload.player.rank > 10) {
    const canEditMine = Boolean(payload.isPersonalBest);
    const mineName = canEditMine
      ? `<strong class="ranking-name ranking-name-editable" data-ranking-edit="true" role="button" tabindex="0">${escapeHtml(payload.player.name || t("unnamed"))}</strong>`
      : `<strong class="ranking-name">${escapeHtml(payload.player.name || t("unnamed"))}</strong>`;

    ui.rankingMine.classList.remove("hidden");
    ui.rankingMine.innerHTML = `<div class="ranking-me is-me"><span>${t("myRank")}</span>${mineName}<div class="ranking-stats"><span class="score">${t("points", payload.player.score)}</span><span class="level">${t("rank", payload.player.rank)}</span></div></div>`;
  } else {
    ui.rankingMine.classList.add("hidden");
    ui.rankingMine.innerHTML = "";
  }

  ui.nameForm.classList.add("hidden");
  ui.playerNameInput.value = payload.player?.name || "";
  ui.nameHelp.textContent = helpMessage || (payload.isPersonalBest
    ? t("rankingHelpPersonalBest")
    : payload.player?.name
      ? t("rankingHelpLocked")
      : t("rankingHelpNew"));
}
async function loadRankingForRun(outcome) {
  showRankingLoading();
  try {
    const response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: state.score,
        level: state.level,
        hits: state.hits,
        outcome
      })
    });
    if (!response.ok) {
      throw new Error(`score request failed: ${response.status}`);
    }
    const payload = await response.json();
    renderRankingPanel(payload);
  } catch (error) {
    ui.overlayRanking.classList.remove("hidden");
    ui.rankingStatus.textContent = t("rankingLoadFailed");
    ui.rankingList.innerHTML = `<div class="ranking-row"><span>-</span><strong class="ranking-name">${t("serverCheck")}</strong><div class="ranking-stats"><span class="score">-</span><span class="level">-</span></div></div>`;
    ui.rankingMine.classList.add("hidden");
    ui.nameForm.classList.add("hidden");
  }
}

async function handleNameSave(event) {
  event.preventDefault();
  const name = ui.playerNameInput.value.trim().slice(0, 12);
  if (!name) {
    ui.nameHelp.textContent = t("enterNameLonger");
    return;
  }

  ui.saveNameButton.disabled = true;
  ui.nameHelp.textContent = t("savingName");

  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      throw new Error(`profile request failed: ${response.status}`);
    }
    const payload = await response.json();
    renderRankingPanel(payload, t("nameSaved"));
  } catch (error) {
    ui.nameHelp.textContent = t("nameSaveFailed");
  } finally {
    ui.saveNameButton.disabled = false;
  }
}

function showOverlay(eyebrow, title, body, buttonLabel, options = {}) {
  ui.overlayEyebrow.textContent = eyebrow;
  ui.overlayTitle.textContent = title;
  ui.overlayBody.innerHTML = body;
  ui.overlayButton.textContent = buttonLabel;

  const {
    missionMarkup = "",
    countdown = "",
    showStart = false,
    showSecondary = true,
    showRanking = false,
    theme = "default"
  } = options;

  ui.overlayMissionList.innerHTML = missionMarkup;
  ui.overlayMissionList.classList.toggle("hidden", !missionMarkup);
  ui.overlayCountdown.textContent = countdown;
  ui.overlayCountdown.classList.toggle("hidden", !countdown);
  ui.startButton.classList.toggle("hidden", !showStart);
  ui.overlayButton.classList.toggle("hidden", !showSecondary);
  ui.overlayCard.classList.toggle("fail-theme", theme === "fail");
  if (!showRanking) {
    resetRankingPanel();
  }
  ui.overlayCard.classList.remove("hidden");
}

function hideOverlay() {
  ui.overlayMissionList.innerHTML = "";
  ui.overlayCountdown.textContent = "";
  ui.overlayMissionList.classList.add("hidden");
  ui.overlayCountdown.classList.add("hidden");
  resetRankingPanel();
  ui.overlayCard.classList.remove("fail-theme");
  ui.overlayCard.classList.add("hidden");
}

function disposeObject3D(object) {
  if (!object) {
    return;
  }

  object.traverse((child) => {
    if (child.geometry && typeof child.geometry.dispose === "function") {
      child.geometry.dispose();
    }

    const materials = Array.isArray(child.material) ? child.material : child.material ? [child.material] : [];
    for (const material of materials) {
      if (material && typeof material.dispose === "function") {
        material.dispose();
      }
    }
  });
}

function removeAndDispose(object) {
  if (!object) {
    return;
  }
  scene.remove(object);
  disposeObject3D(object);
}

function clearEntities(list) {
  for (const entry of list) {
    removeAndDispose(entry.group);
  }
  list.length = 0;
}

function prepareLevel(level, keepScore = true) {
  state.level = level;
  state.levelConfig = {
    baseSpeed: gameBalance.baseSpeedStart + (level - 1) * gameBalance.baseSpeedStep,
    maxSpeed: gameBalance.maxSpeedStart + (level - 1) * gameBalance.maxSpeedStep,
    acceleration: gameBalance.accelerationStart + (level - 1) * gameBalance.accelerationStep,
    obstacleSpawnEvery: Math.max(gameBalance.minObstacleSpawnGap, gameBalance.obstacleSpawnStart - (level - 1) * gameBalance.obstacleSpawnStep),
    itemSpawnEvery: Math.max(gameBalance.minItemSpawnGap, gameBalance.itemSpawnStart - (level - 1) * gameBalance.itemSpawnStep),
    availableObstacles: obstacleTypes.slice(0, Math.min(obstacleTypes.length, 2 + Math.floor((level + 1) / 2)))
  };
  state.running = false;
  state.gameOver = false;
  state.cleared = false;
  state.introCountdown = 0;
  state.countdownTick = 0;
  state.checkoutTimer = 0;
  state.inCheckout = false;
  state.speed = state.levelConfig.baseSpeed;
  state.obstacleSpawnTimer = 0;
  state.itemSpawnTimer = 0;
  state.lastTime = 0;
  state.hits = 0;
  state.hitFlash = 0;
  state.invulnerableTimer = 0;
  state.slowdownTimer = 0;
  state.player.lane = 1;
  state.player.shake = 0;
  state.player.bob = 0;
  state.player.knocked = false;
  state.player.knockTimer = 0;
  state.player.velocityX = 0;
  state.player.velocityY = 0;
  state.player.velocityZ = 0;
  state.player.spin = 0;
  state.player.failTitle = "";
  state.player.failBody = "";
  state.shoppingGoals = createShoppingGoals(level);
  clearEntities(state.obstacles);
  clearEntities(state.items);
  if (!keepScore) {
    state.score = 0;
  }
  syncHud();
  beginLevelCountdown();
}

function startFreshRun() {
  state.score = 0;
  prepareLevel(1, true);
}

function startNextLevel() {
  const nextLevel = state.level + 1;
  state.bestLevel = Math.max(state.bestLevel, nextLevel);
  prepareLevel(nextLevel, true);
}

function failRun(title, body) {
  state.running = false;
  state.gameOver = true;
  state.cleared = false;
  state.inCheckout = false;
  state.checkoutTimer = 0;

  if (world.checkout) {
    world.checkout.visible = false;
    world.checkout.position.set(0, 0, checkoutStartZ);
  }

  syncHud();
  playGameOverMelody();
  showOverlay(t("failEyebrow"), title, `${body}${t("currentScoreLine", state.score)}`, t("restartFromBeginning"), { showRanking: true, theme: "fail" });
  loadRankingForRun("game_over");
}

function finishLevel() {
  state.running = false;
  state.cleared = true;
  state.gameOver = false;
  state.inCheckout = false;
  state.checkoutTimer = 0;
  state.bestLevel = Math.max(state.bestLevel, state.level);

  if (world.checkout) {
    world.checkout.visible = false;
    world.checkout.position.set(0, 0, checkoutStartZ);
  }

  const checkoutPoints = state.shoppingGoals.reduce((sum, goal) => sum + goal.collected * (goal.pointValue || 25), 0);
  const stars = Math.max(0, 3 - state.hits);
  const starBonus = stars * 180;
  const levelBonus = state.level * 60;
  const totalBonus = checkoutPoints + starBonus + levelBonus;
  state.score += totalBonus;
  syncHud();
  playClearMelody();
  showOverlay(
    t("checkoutEyebrow"),
    t("clearTitle", state.level),
    t("clearBody", checkoutPoints, starBonus, levelBonus),
    t("nextLevel"),
    { missionMarkup: renderMissionListMarkup(state.shoppingGoals, true), showSecondary: true }
  );
}

function burstParticles(position, color, count = 14) {
  const material = new THREE.MeshBasicMaterial({ color });
  for (let index = 0; index < count; index += 1) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), material.clone());
    mesh.position.copy(position);
    scene.add(mesh);
    state.particles.push({
      mesh,
      life: 0.5 + Math.random() * 0.4,
      age: 0,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 4.5, Math.random() * 2.4, (Math.random() - 0.5) * 2.2)
    });
  }
}

function spawnObstacle() {
  const type = randomItem(state.levelConfig.availableObstacles);
  const lane = Math.floor(Math.random() * 3);
  const mesh = createObstacleMesh(type);
  const group = createDynamicEntity(mesh, lane, spawnZ);
  state.obstacles.push({ id: `o-${performance.now()}-${Math.random()}`, type, lane, z: spawnZ, wobble: Math.random() * Math.PI * 2, speedFactor: type.speed + Math.min(0.45, state.level * 0.05), group, knocked: false, velocityX: 0, velocityY: 0, velocityZ: 0, spin: 0, life: 0, flailTimer: 0, impactDirection: 0 });
}

function spawnItem() {
  const product = randomItem(state.shoppingGoals);
  const lane = Math.floor(Math.random() * 3);
  const mesh = createProductMesh(product);
  const group = createDynamicEntity(mesh, lane, spawnZ - 6);
  state.items.push({ id: `i-${performance.now()}-${Math.random()}`, product, lane, z: spawnZ - 6, wobble: Math.random() * Math.PI * 2, speedFactor: 0.9 + Math.min(0.35, state.level * 0.03), group });
}

function handleHit(obstacle) {
  if (state.invulnerableTimer > 0 || !state.running || obstacle.knocked) {
    return;
  }

  state.hits += 1;
  state.hitFlash = 0.42;
  state.invulnerableTimer = gameBalance.hitInvulnerability;
  state.slowdownTimer = gameBalance.hitSlowdownSeconds;
  state.player.shake = 0.6;
  state.score = Math.max(0, state.score - 30);
  burstParticles(obstacle.group.position, obstacle.type.color);

  if (isHumanObstacle(obstacle.type)) {
    const offsetX = obstacle.group.position.x - laneXs[state.player.lane];
    const direction = Math.abs(offsetX) < 0.08 ? (Math.random() > 0.5 ? 1 : -1) : (offsetX > 0 ? 1 : -1);
    const sideBias = 7.2 + Math.abs(offsetX) * 2.4 + Math.random() * 2.2;
    obstacle.knocked = true;
    obstacle.life = 1.0;
    obstacle.flailTimer = 0.38;
    obstacle.impactDirection = direction;
    obstacle.velocityX = direction * sideBias;
    obstacle.velocityY = 6.2 + Math.random() * 2.1;
    obstacle.velocityZ = 0.9 + Math.random() * 0.9;
    obstacle.spin = direction * (6.2 + Math.random() * 2.8);
    obstacle.group.rotation.y += direction * 0.6;
    obstacle.group.rotation.z = direction * 0.34;
    obstacle.group.rotation.x = -0.22;
    spawnImpactBurst(obstacle.group.position, direction);
    playHitScreamSound(obstacle.type);
  } else {
    removeAndDispose(obstacle.group);
    state.obstacles = state.obstacles.filter((entry) => entry !== obstacle);
  }

  if (state.hits >= gameBalance.maxHits) {
    beginPlayerKnockout(t("knockedTitle"), t("shopperFailed", state.level));
  } else {
    syncHud();
  }
}

function collectItem(item) {
  const goal = state.shoppingGoals.find((entry) => entry.id === item.product.id);
  if (!goal || !state.running) {
    return;
  }

  goal.collected += 1;
  state.score += 45;
  playCollectSound();
  showPickupToast(t("collectToast", localizedProductName(goal), goal.collected, goal.target));
  burstParticles(item.group.position, item.product.color, 10);
  removeAndDispose(item.group);
  state.items = state.items.filter((entry) => entry !== item);

  if (goal.collected > goal.target) {
    const localizedName = localizedProductName(goal);
    failRun(t("tooMany", localizedName), t("tooManyBody", localizedName, goal.target, goal.collected));
    return;
  }

  if (state.shoppingGoals.every((entry) => entry.collected === entry.target)) {
    beginCheckoutRun();
    syncHud();
    return;
  }

  syncHud();
}

function updateDynamicObjects(delta) {
  state.obstacleSpawnTimer += delta;
  state.itemSpawnTimer += delta;

  if (!state.inCheckout && state.obstacleSpawnTimer >= state.levelConfig.obstacleSpawnEvery) {
    state.obstacleSpawnTimer = 0;
    spawnObstacle();
  }
  if (!state.inCheckout && state.itemSpawnTimer >= state.levelConfig.itemSpawnEvery) {
    state.itemSpawnTimer = 0;
    spawnItem();
  }

  const playerX = laneXs[state.player.lane];

  for (const obstacle of state.obstacles) {
    if (obstacle.knocked) {
      obstacle.life -= delta;
      obstacle.flailTimer = Math.max(0, obstacle.flailTimer - delta);
      obstacle.group.position.x += obstacle.velocityX * delta;
      obstacle.group.position.y = Math.max(0, obstacle.group.position.y + obstacle.velocityY * delta);
      obstacle.group.position.z += obstacle.velocityZ * delta;
      obstacle.velocityX *= 0.992;
      obstacle.velocityY -= delta * 12;
      obstacle.group.rotation.z += obstacle.spin * delta;
      obstacle.group.rotation.x += obstacle.spin * 0.45 * delta;
      obstacle.group.rotation.y += obstacle.spin * 0.14 * delta;

      if (obstacle.flailTimer > 0) {
        const flail = Math.sin((0.38 - obstacle.flailTimer) * 28);
        obstacle.group.rotation.z += flail * 0.16 * obstacle.impactDirection;
        obstacle.group.rotation.x += Math.abs(flail) * 0.08;
        const leftArm = obstacle.group.children[2];
        const rightArm = obstacle.group.children[3];
        const leftLeg = obstacle.group.children[4];
        const rightLeg = obstacle.group.children[5];
        if (leftArm && rightArm && leftLeg && rightLeg) {
          leftArm.rotation.z += flail * 0.26;
          rightArm.rotation.z -= flail * 0.26;
          leftLeg.rotation.z -= flail * 0.18;
          rightLeg.rotation.z += flail * 0.18;
        }
      }
      continue;
    }

    obstacle.z += delta * state.speed * obstacle.speedFactor * 0.095;
    obstacle.wobble += delta * 4;
    obstacle.group.position.set(laneXs[obstacle.lane] + Math.sin(obstacle.wobble) * 0.18, 0, obstacle.z);
    obstacle.group.rotation.y = Math.sin(obstacle.wobble) * 0.2;

    if (Math.abs(obstacle.group.position.z - playerZ) < 1.9 && Math.abs(laneXs[obstacle.lane] - playerX) < 1.7) {
      handleHit(obstacle);
      break;
    }
  }

  for (const item of state.items) {
    item.z += delta * state.speed * item.speedFactor * 0.09;
    item.wobble += delta * 4.5;
    item.group.position.set(laneXs[item.lane], 0, item.z);
    item.group.rotation.y += delta * 2.2;
    item.group.children[1].position.y = 1 + Math.sin(item.wobble) * 0.25;

    if (!state.inCheckout && Math.abs(item.group.position.z - playerZ) < 1.45 && Math.abs(laneXs[item.lane] - playerX) < 1.6) {
      collectItem(item);
      break;
    }
  }

  state.obstacles = state.obstacles.filter((entry) => {
    if (entry.knocked) {
      if (entry.life <= 0 || entry.group.position.y <= 0.02 && entry.velocityY < 0) {
        removeAndDispose(entry.group);
        return false;
      }
      return true;
    }

    if (entry.z > despawnZ) {
      removeAndDispose(entry.group);
      return false;
    }
    return true;
  });

  state.items = state.items.filter((entry) => {
    if (entry.z > despawnZ) {
      removeAndDispose(entry.group);
      return false;
    }
    return true;
  });
}

function updateParticles(delta) {
  state.particles = state.particles.filter((particle) => {
    particle.age += delta;
    particle.mesh.position.addScaledVector(particle.velocity, delta);
    particle.velocity.y -= delta * 3.2;
    particle.mesh.material.opacity = 1 - particle.age / particle.life;
    particle.mesh.material.transparent = true;
    if (particle.age >= particle.life) {
      removeAndDispose(particle.mesh);
      return false;
    }
    return true;
  });
}

function updatePlayer(delta, elapsed) {
  state.player.shake = Math.max(0, state.player.shake - delta * 1.8);
  state.player.bob = Math.sin(elapsed * 5.5) * 0.12;
  state.hitFlash = Math.max(0, state.hitFlash - delta);
  state.invulnerableTimer = Math.max(0, state.invulnerableTimer - delta);
  state.slowdownTimer = Math.max(0, state.slowdownTimer - delta);

  const playerMesh = world.playerCart;

  if (state.player.knocked) {
    state.player.knockTimer = Math.max(0, state.player.knockTimer - delta);
    playerMesh.position.x += state.player.velocityX * delta;
    playerMesh.position.y = Math.max(0, playerMesh.position.y + state.player.velocityY * delta);
    playerMesh.position.z += state.player.velocityZ * delta;
    state.player.velocityY -= delta * 11.2;
    state.player.velocityX *= 0.986;

    const fallProgress = 1 - state.player.knockTimer / 1.1;
    const sideTilt = clamp(state.player.spin * 0.7, -0.82, 0.82);
    const backTilt = -0.3 - fallProgress * 0.46;
    playerMesh.rotation.z = THREE.MathUtils.lerp(playerMesh.rotation.z, sideTilt, 0.16);
    playerMesh.rotation.x = THREE.MathUtils.lerp(playerMesh.rotation.x, backTilt, 0.14);
    playerMesh.rotation.y = THREE.MathUtils.lerp(playerMesh.rotation.y, state.player.spin * 0.08, 0.08);

    if (playerMesh.position.y <= 0.02) {
      playerMesh.position.y = 0;
      state.player.velocityY = 0;
      state.player.velocityZ *= 0.94;
    }

    if (state.player.knockTimer === 0) {
      state.player.knocked = false;
      failRun(state.player.failTitle || t("cartFell"), state.player.failBody || t("shopperFailed", state.level));
    }
    return;
  }

  playerMesh.position.x = THREE.MathUtils.lerp(playerMesh.position.x, laneXs[state.player.lane], 0.18);
  playerMesh.position.y = state.player.bob;
  playerMesh.position.z = playerZ;
  playerMesh.rotation.x = 0;
  playerMesh.rotation.z = Math.sin(elapsed * 16) * 0.03 * state.player.shake;
  playerMesh.rotation.y = Math.sin(elapsed * 18) * 0.06 * state.player.shake;

  if (state.slowdownTimer > 0) {
    state.speed = clamp(state.speed - delta * 95, state.levelConfig.baseSpeed * 0.72, state.levelConfig.maxSpeed);
  } else {
    state.speed = clamp(state.speed + delta * state.levelConfig.acceleration * 14, state.levelConfig.baseSpeed, state.levelConfig.maxSpeed);
  }
}

function updateFloor(delta) {
  for (const stripe of world.floorStripes) {
    stripe.position.z += delta * state.speed * 0.095;
    if (stripe.position.z > 18) {
      stripe.position.z = -90;
    }
  }

  if (world.checkout && world.checkout.visible) {
    world.checkout.position.z += delta * state.speed * 0.08;
    world.checkout.position.y = Math.sin(performance.now() * 0.0024) * 0.03;
    if (world.checkoutGlow) {
      world.checkoutGlow.material.opacity = 0.22 + Math.sin(performance.now() * 0.004) * 0.04;
    }
  }

  for (const shelf of world.shelves) {
    shelf.position.z += delta * state.speed * 0.095;
    if (shelf.position.z > 20) {
      shelf.position.z -= 120;
    }
  }
}

function update(delta, elapsed) {
  if (state.introCountdown > 0) {
    updateParticles(delta);
    updateIntroCountdown(delta);
    syncHud();
    return;
  }

  if (state.player.knocked) {
    updatePlayer(delta, elapsed);
    updateParticles(delta);
    return;
  }

  if (!state.running) {
    updateParticles(delta);
    return;
  }

  updatePlayer(delta, elapsed);
  updateFloor(delta);
  updateDynamicObjects(delta);
  updateParticles(delta);
  state.score += Math.round(delta * (10 + state.level * 2));

  if (state.inCheckout) {
    state.checkoutTimer = Math.max(0, state.checkoutTimer - delta);
    if (world.checkout && world.checkout.visible && world.checkout.position.z >= playerZ - 4.5) {
      finishLevel();
      return;
    }
    if (state.checkoutTimer === 0) {
      finishLevel();
      return;
    }
  }

  syncHud();
}

function render() {
  const t = Math.min(1, state.hitFlash * 2.2);
  renderer.setClearColor(new THREE.Color().lerpColors(new THREE.Color(0xc6ecff), new THREE.Color(0xffc0b8), t), 1);
  renderer.render(scene, camera);
}

function resize() {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.25 : 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function handleMove(direction) {
  ensureAudio();
  if (!state.running) {
    return;
  }
  state.player.lane = clamp(state.player.lane + direction, 0, 2);
}

function handleTouchMove(direction) {
  const now = performance.now();
  if (now - state.lastTouchMove < gameBalance.touchStepCooldown) {
    return;
  }
  state.lastTouchMove = now;
  handleMove(direction);
}

function handleOverlayAction() {
  ensureAudio();
  if (state.introCountdown > 0 || state.inCheckout) {
    return;
  }
  if (state.cleared) {
    startNextLevel();
    return;
  }
  startFreshRun();
}

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    handleMove(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    handleMove(1);
  }
  if ((event.key === " " || event.key === "Enter") && !state.running) {
    event.preventDefault();
    handleOverlayAction();
  }
});

if (ui.leftButton) {
  ui.leftButton.addEventListener("pointerdown", () => handleTouchMove(-1));
}
if (ui.rightButton) {
  ui.rightButton.addEventListener("pointerdown", () => handleTouchMove(1));
}
ui.startButton.addEventListener("click", handleOverlayAction);
ui.overlayButton.addEventListener("click", handleOverlayAction);
if (ui.nameForm) {
  ui.nameForm.addEventListener("submit", handleNameSave);
}
if (ui.overlayRanking) {
  ui.overlayRanking.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-ranking-edit='true']");
    if (!trigger) {
      return;
    }
    openNameEditor();
  });
}
canvas.addEventListener("pointerdown", (event) => {
  ensureAudio();
  const bounds = canvas.getBoundingClientRect();
  const midpoint = bounds.left + bounds.width / 2;
  handleTouchMove(event.clientX < midpoint ? -1 : 1);
});
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  renderPausedForContextLoss = true;
  showOverlay(
    t("mobilePause"),
    t("gpuReconnect"),
    t("gpuBody"),
    t("restart"),
    { showStart: false, showSecondary: true }
  );
});
canvas.addEventListener("webglcontextrestored", () => {
  renderPausedForContextLoss = false;
  resize();
});
window.addEventListener("resize", resize);

createFloor();
createShelves();
createCheckoutMesh();
world.playerCart = createCartMesh();
state.shoppingGoals = createShoppingGoals(1);
resize();
applyStaticTranslations();
syncHud();
showOverlay(
  t("ready"),
  t("start3d"),
  t("introBody"),
  t("restart"),
  { showStart: true, showSecondary: false }
);

function loop(time) {
  const elapsed = time * 0.001;
  if (!state.lastTime) {
    state.lastTime = time;
  }
  const delta = Math.min(0.033, (time - state.lastTime) / 1000);
  state.lastTime = time;

  if (!renderPausedForContextLoss) {
    update(delta, elapsed);
    render();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);














if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}









