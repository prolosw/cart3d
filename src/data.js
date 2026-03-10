export const lanePositions = [-1, 0, 1];

export const products = [
  {
    id: "strawberries",
    name: "딸기",
    aisle: "과일 코너",
    color: "#ff5a7a",
    shape: "berry",
    icon: "🍓",
    cardStyle: { from: "#fff0f4", to: "#ffc7d5", accent: "#ff5a7a" },
    pointValue: 32
  },
  {
    id: "milk",
    name: "우유",
    aisle: "유제품 코너",
    color: "#73d5ff",
    shape: "bottle",
    icon: "🥛",
    cardStyle: { from: "#eefaff", to: "#c8f0ff", accent: "#42b8ff" },
    pointValue: 28
  },
  {
    id: "onion",
    name: "양파",
    aisle: "채소 코너",
    color: "#d7b56d",
    shape: "round",
    icon: "🧅",
    cardStyle: { from: "#fff6e8", to: "#efd7a2", accent: "#b98d39" },
    pointValue: 22
  },
  {
    id: "bread",
    name: "식빵",
    aisle: "베이커리",
    color: "#f3b77a",
    shape: "loaf",
    icon: "🍞",
    cardStyle: { from: "#fff5e8", to: "#ffd6ad", accent: "#dd9152" },
    pointValue: 26
  },
  {
    id: "fish",
    name: "생선",
    aisle: "수산 코너",
    color: "#5ec5d8",
    shape: "fish",
    icon: "🐟",
    cardStyle: { from: "#ecfcff", to: "#c6f3fb", accent: "#39a7be" },
    pointValue: 38
  },
  {
    id: "cereal",
    name: "시리얼",
    aisle: "아침식사 코너",
    color: "#ffc24b",
    shape: "box",
    icon: "🥣",
    cardStyle: { from: "#fff8e6", to: "#ffe29b", accent: "#efad15" },
    pointValue: 30
  }
];

export const obstacleTypes = [
  { id: "shopper", label: "손님", color: "#ff8b6b", speed: 1.08, width: 1.5, depth: 1.5 },
  { id: "employee", label: "직원", color: "#5f8cff", speed: 1.14, width: 1.5, depth: 1.5 },
  { id: "box", label: "손님 카트", color: "#d7a46e", speed: 0.92, width: 1.9, depth: 1.7 },
  { id: "cone", label: "안전콘", color: "#ffb02e", speed: 1.0, width: 1.3, depth: 1.2 },
  { id: "trolley", label: "수레", color: "#92a7b7", speed: 1.1, width: 1.9, depth: 1.6 }
];

export const gameBalance = {
  maxHits: 3,
  baseSpeedStart: 170,
  baseSpeedStep: 14,
  maxSpeedStart: 245,
  maxSpeedStep: 18,
  accelerationStart: 6,
  accelerationStep: 0.65,
  obstacleSpawnStart: 1.22,
  obstacleSpawnStep: 0.08,
  itemSpawnStart: 0.94,
  itemSpawnStep: 0.04,
  minObstacleSpawnGap: 0.44,
  minItemSpawnGap: 0.48,
  touchStepCooldown: 130,
  playerHitRadius: 1.6,
  itemHitRadius: 1.45,
  hitInvulnerability: 1.05,
  hitSlowdownSeconds: 0.42
};

