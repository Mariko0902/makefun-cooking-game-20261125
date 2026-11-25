export const FIELD = { width: 1280, height: 800 };
export const STEP = 1 / 60;
export const DAY_SECONDS = 180;
export const BURN_SECONDS = 8;
export const CHEF_SPEED = 310;
export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export const COLORS = {
  ink: '#38261f',
  cream: '#fff3dc',
  paper: '#f5e5c7',
  terracotta: '#bd6043',
  flame: '#f2a344',
  oak: '#70452f',
  darkOak: '#4b3027',
  sage: '#789078',
  paleSage: '#bdc8a9',
  gold: '#e8b65b',
  red: '#c74e41',
  floor: '#d9c39d',
  tile: '#e8d4af',
  smoke: 'rgba(77, 52, 39, .12)',
  white: '#fffaf0',
};

export const STATIONS = [
  { id: 'pasta', name: 'Pasta', kind: 'pantry', x: 112, y: 268, ingredient: 'pasta' },
  { id: 'tomato', name: 'Tomato', kind: 'pantry', x: 222, y: 268, ingredient: 'tomato' },
  { id: 'cheese', name: 'Cheese', kind: 'pantry', x: 332, y: 268, ingredient: 'cheese' },
  { id: 'salmon', name: 'Salmon', kind: 'pantry', x: 442, y: 268, ingredient: 'salmon' },
  { id: 'lemon', name: 'Lemon', kind: 'pantry', x: 112, y: 392, ingredient: 'lemon' },
  { id: 'herbs', name: 'Herbs', kind: 'pantry', x: 222, y: 392, ingredient: 'herbs' },
  { id: 'patty', name: 'Patty', kind: 'pantry', x: 332, y: 392, ingredient: 'patty' },
  { id: 'lettuce', name: 'Lettuce', kind: 'pantry', x: 442, y: 392, ingredient: 'lettuce' },
  { id: 'bun', name: 'Bun', kind: 'pantry', x: 112, y: 516, ingredient: 'bun' },
  { id: 'pastry', name: 'Pastry', kind: 'pantry', x: 222, y: 516, ingredient: 'pastry' },
  { id: 'berries', name: 'Berries', kind: 'pantry', x: 332, y: 516, ingredient: 'berries' },
  { id: 'cream', name: 'Cream', kind: 'pantry', x: 442, y: 516, ingredient: 'cream' },
  { id: 'chips', name: 'Chips', kind: 'pantry', x: 112, y: 640, ingredient: 'chips' },
  { id: 'fish', name: 'Fish', kind: 'pantry', x: 222, y: 640, ingredient: 'fish' },
  { id: 'rice', name: 'Rice', kind: 'pantry', x: 332, y: 640, ingredient: 'rice' },
  { id: 'mushroom', name: 'Mushroom', kind: 'pantry', x: 442, y: 640, ingredient: 'mushroom' },
  { id: 'board', name: 'Chop board', kind: 'chop', x: 612, y: 300 },
  { id: 'grill', name: 'Oak grill', kind: 'grill', x: 828, y: 300 },
  { id: 'pot', name: 'Boiling pot', kind: 'boil', x: 1012, y: 300 },
  { id: 'fryer', name: 'Fryer', kind: 'fry', x: 1166, y: 300 },
  { id: 'assembly', name: 'Assembly', kind: 'assembly', x: 672, y: 554 },
  { id: 'pass', name: 'Serving pass', kind: 'pass', x: 970, y: 554 },
  { id: 'bin', name: 'Compost bin', kind: 'bin', x: 1162, y: 554 },
];

export const DAY_ORDER_GAP = [
  { min: 14, max: 20 },
  { min: 11, max: 16 },
  { min: 8, max: 13 },
];
export const DAY_PATIENCE = { min: 50, max: 70 };
export const STAR_TARGETS = [160, 280, 400];
