import { COLORS, FIELD, FONT, STATIONS, STAR_TARGETS } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_DAY_END = 'day-end';
export const SCREEN_OVER = 'over';

const INGREDIENT_COLORS = {
  pasta: '#e4bd70', tomato: '#d95843', cheese: '#f0d477', salmon: '#e99571', lemon: '#f0cf51',
  herbs: '#6e9a62', patty: '#75483a', lettuce: '#80a866', bun: '#c88c50', pastry: '#d4a86b',
  berries: '#934d72', cream: '#fff2d6', chips: '#d9ac51', fish: '#91b8bd', rice: '#eee1c4',
  mushroom: '#ac8564',
};

function rounded(context, x, y, width, height, radius, fill, stroke) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  if (fill) { context.fillStyle = fill; context.fill(); }
  if (stroke) { context.strokeStyle = stroke; context.lineWidth = 2; context.stroke(); }
}

function text(context, value, x, y, size, color = COLORS.ink, align = 'left', weight = 500) {
  context.font = `${weight} ${size}px ${FONT}`;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = 'middle';
  context.fillText(value, x, y);
}

function line(context, x1, y1, x2, y2, color, width = 2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}

function drawIngredient(context, ingredient, x, y, size) {
  const color = INGREDIENT_COLORS[ingredient] ?? COLORS.gold;
  context.save();
  context.translate(x, y);
  const scale = size / 44;
  context.scale(scale, scale);
  context.fillStyle = color;
  context.strokeStyle = 'rgba(56,38,31,.45)';
  context.lineWidth = 2.2;
  context.beginPath();
  switch (ingredient) {
    case 'tomato':
      context.arc(0, 2, 16, 0, Math.PI * 2); context.fill(); context.stroke();
      context.fillStyle = '#638257'; context.beginPath(); context.moveTo(-2, -11); context.lineTo(1, -20); context.lineTo(6, -12); context.lineTo(14, -15); context.lineTo(9, -7); context.closePath(); context.fill(); break;
    case 'lemon':
      context.ellipse(0, 0, 18, 12, -.3, 0, Math.PI * 2); context.fill(); context.stroke();
      line(context, -9, 0, 10, 0, 'rgba(255,255,255,.55)', 2); break;
    case 'salmon':
    case 'fish':
      context.ellipse(-1, 0, 18, 11, -.15, 0, Math.PI * 2); context.fill(); context.stroke();
      context.beginPath(); context.moveTo(14, 0); context.lineTo(25, -9); context.lineTo(23, 1); context.lineTo(26, 9); context.closePath(); context.fill(); context.stroke();
      context.fillStyle = COLORS.cream; context.beginPath(); context.arc(-7, -2, 2, 0, Math.PI * 2); context.fill(); break;
    case 'mushroom':
      context.fillRect(-6, -1, 12, 17); context.strokeRect(-6, -1, 12, 17);
      context.beginPath(); context.ellipse(0, -4, 17, 12, 0, Math.PI, Math.PI * 2); context.fill(); context.stroke(); break;
    case 'berries':
      for (const [bx, by] of [[-8, -3], [4, -7], [9, 5], [-4, 8]]) {
        context.beginPath(); context.arc(bx, by, 7, 0, Math.PI * 2); context.fill(); context.stroke();
      } break;
    case 'herbs':
      for (let i = 0; i < 4; i += 1) {
        context.save(); context.rotate(i * .7 - 1); context.beginPath(); context.ellipse(0, -6, 5, 13, 0, 0, Math.PI * 2); context.fill(); context.restore();
      }
      line(context, -10, 14, 12, -14, '#52764c', 2); break;
    case 'pasta':
      context.lineWidth = 4;
      for (let i = 0; i < 4; i += 1) {
        context.beginPath(); context.moveTo(-15, -8 + i * 5); context.bezierCurveTo(-3, -18 + i * 4, 7, 15 - i * 3, 15, -8 + i * 5); context.strokeStyle = color; context.stroke();
      } break;
    case 'cheese':
      context.beginPath(); context.moveTo(-16, 10); context.lineTo(-12, -9); context.lineTo(12, -14); context.lineTo(16, 8); context.closePath(); context.fill(); context.stroke();
      context.fillStyle = '#c99d51'; context.beginPath(); context.arc(3, -5, 2.2, 0, Math.PI * 2); context.fill(); context.beginPath(); context.arc(-7, 4, 2, 0, Math.PI * 2); context.fill(); break;
    case 'lettuce':
      for (const [lx, ly, rot] of [[-8, 2, -.5], [2, -4, .4], [9, 4, -.1]]) {
        context.save(); context.rotate(rot); context.beginPath(); context.ellipse(lx, ly, 9, 14, 0, 0, Math.PI * 2); context.fill(); context.stroke(); context.restore();
      } break;
    case 'patty':
      context.beginPath(); context.ellipse(0, 1, 17, 12, 0, 0, Math.PI * 2); context.fill(); context.stroke();
      line(context, -10, -2, 11, 3, '#4d302a', 2); break;
    case 'bun':
      context.beginPath(); context.ellipse(0, 3, 18, 12, 0, 0, Math.PI * 2); context.fill(); context.stroke();
      context.beginPath(); context.ellipse(0, -3, 18, 12, 0, Math.PI, Math.PI * 2); context.fill(); context.stroke();
      for (const sx of [-7, 0, 7]) { context.beginPath(); context.ellipse(sx, -9, 1.4, 3, -.3, 0, Math.PI * 2); context.fillStyle = '#fff0bd'; context.fill(); } break;
    case 'pastry':
      context.beginPath(); context.moveTo(-17, 12); context.lineTo(-12, -10); context.lineTo(10, -15); context.lineTo(17, 11); context.closePath(); context.fill(); context.stroke();
      line(context, -10, 2, 10, -1, '#f4d296', 2); break;
    case 'cream':
      context.beginPath(); context.moveTo(-12, 12); context.lineTo(-10, -5); context.quadraticCurveTo(-18, -17, -4, -14); context.quadraticCurveTo(10, -21, 8, -8); context.quadraticCurveTo(18, -1, 11, 12); context.closePath(); context.fill(); context.stroke(); break;
    case 'chips':
      for (let i = -1; i <= 1; i += 1) { context.save(); context.rotate(i * .27); context.fillRect(-4 + i * 9, -13, 8, 27); context.strokeRect(-4 + i * 9, -13, 8, 27); context.restore(); } break;
    case 'rice':
      for (const [rx, ry] of [[-8, -5], [2, -9], [9, -2], [-3, 3], [8, 8], [-11, 8]]) {
        context.beginPath(); context.ellipse(rx, ry, 4, 2.3, -.4, 0, Math.PI * 2); context.fill(); context.stroke();
      } break;
    default:
      context.beginPath(); context.arc(0, 0, 16, 0, Math.PI * 2); context.fill(); context.stroke();
  }
  context.restore();
}

function drawPlate(context, x, y, items, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.fillStyle = '#fff9ed';
  context.strokeStyle = '#c7b89c';
  context.lineWidth = 3;
  context.beginPath(); context.ellipse(0, 3, 48, 30, 0, 0, Math.PI * 2); context.fill(); context.stroke();
  context.strokeStyle = '#e2d2b5'; context.lineWidth = 2;
  context.beginPath(); context.ellipse(0, 3, 37, 22, 0, 0, Math.PI * 2); context.stroke();
  const places = [[-18, -5], [3, -7], [21, 1], [-7, 12], [13, 14]];
  items.slice(0, 5).forEach((item, index) => drawIngredient(context, item.ingredient, places[index][0], places[index][1], 28));
  context.restore();
}

function drawKitchen(context, state) {
  context.fillStyle = COLORS.floor;
  context.fillRect(0, 184, FIELD.width, 616);
  context.fillStyle = '#e7d4b0';
  for (let x = 0; x < FIELD.width; x += 96) {
    for (let y = 184; y < FIELD.height; y += 84) {
      if ((Math.floor(x / 96) + Math.floor(y / 84)) % 2 === 0) context.fillRect(x, y, 48, 42);
    }
  }
  context.fillStyle = '#b88f69';
  context.fillRect(0, 184, FIELD.width, 10);
  context.fillStyle = COLORS.darkOak;
  context.fillRect(0, 194, FIELD.width, 8);

  rounded(context, 48, 218, 462, 490, 24, '#8a6347', '#64452f');
  rounded(context, 60, 230, 438, 462, 18, '#b1865e');
  text(context, 'FRESH PANTRY', 78, 214, 15, '#fff0d6', 'left', 800);
  rounded(context, 546, 222, 674, 220, 22, '#8a6347', '#64452f');
  rounded(context, 558, 234, 650, 196, 16, '#c69b6b');
  rounded(context, 548, 470, 674, 236, 22, '#8a6347', '#64452f');
  rounded(context, 560, 482, 650, 212, 16, '#c69b6b');
  line(context, 560, 490, 1210, 490, '#dfbd91', 4);

  const pantry = STATIONS.filter((entry) => entry.kind === 'pantry');
  for (const entry of pantry) {
    rounded(context, entry.x - 45, entry.y - 36, 90, 72, 12, '#ead4ad', '#8e674b');
    rounded(context, entry.x - 42, entry.y - 33, 84, 66, 10, '#f5e6ca', '#c4a780');
    drawIngredient(context, entry.ingredient, entry.x, entry.y - 4, 37);
    text(context, entry.name, entry.x, entry.y + 23, 12, COLORS.ink, 'center', 700);
  }

  drawEquipment(context, state, 'board', 612, 300, 'CHOP');
  drawEquipment(context, state, 'grill', 828, 300, 'OAK GRILL');
  drawEquipment(context, state, 'pot', 1012, 300, 'SIMMER');
  drawEquipment(context, state, 'fryer', 1166, 300, 'FRY');
  drawAssembly(context, state);
  drawPass(context, state);
  drawBin(context, state);

  for (const x of [634, 850, 1034, 1188]) {
    context.fillStyle = 'rgba(67,44,33,.12)';
    context.beginPath(); context.ellipse(x, 442, 34, 8, 0, 0, Math.PI * 2); context.fill();
  }
}

function drawProgress(context, x, y, item, radius = 28) {
  if (!item) return;
  const progress = item.state === 'raw' ? Math.min(1, item.progress / item.required) : Math.min(1, item.age / 8);
  context.lineWidth = 5;
  context.strokeStyle = item.state === 'burnt' ? COLORS.red : item.state === 'ready' ? COLORS.sage : COLORS.flame;
  context.beginPath(); context.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress); context.stroke();
  if (item.state === 'burnt') text(context, '!', x, y, 22, COLORS.red, 'center', 900);
}

function drawEquipment(context, state, id, x, y, label) {
  const entry = state.stations.find((station) => station.id === id);
  context.save();
  if (id === 'board') {
    rounded(context, x - 68, y - 52, 136, 104, 13, '#d7b17e', '#805d3e');
    rounded(context, x - 59, y - 43, 118, 86, 10, '#e8c99a', '#b08b5f');
    line(context, x - 43, y + 22, x + 36, y + 22, '#bd9a70', 2);
    context.fillStyle = '#888276';
    context.beginPath(); context.moveTo(x + 24, y - 26); context.lineTo(x + 50, y - 10); context.lineTo(x + 47, y - 5); context.lineTo(x + 21, y - 20); context.closePath(); context.fill();
  } else if (id === 'grill') {
    rounded(context, x - 86, y - 54, 172, 108, 16, '#56504b', '#37312d');
    rounded(context, x - 76, y - 45, 152, 88, 12, '#252321', '#75695f');
    for (let i = -2; i <= 2; i += 1) line(context, x + i * 25, y - 34, x + i * 25, y + 32, '#837a6e', 4);
    context.fillStyle = '#e38148';
    context.globalAlpha = .6;
    context.beginPath(); context.ellipse(x, y + 36, 24, 9, 0, 0, Math.PI * 2); context.fill();
    context.globalAlpha = 1;
  } else if (id === 'pot') {
    context.fillStyle = '#6f7773';
    context.beginPath(); context.moveTo(x - 53, y - 20); context.lineTo(x + 53, y - 20); context.lineTo(x + 43, y + 38); context.quadraticCurveTo(x, y + 53, x - 43, y + 38); context.closePath(); context.fill();
    context.strokeStyle = '#434b48'; context.lineWidth = 5; context.stroke();
    context.fillStyle = '#dba14f'; context.beginPath(); context.ellipse(x, y - 20, 57, 12, 0, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#efd194'; context.beginPath(); context.ellipse(x, y - 20, 47, 7, 0, 0, Math.PI * 2); context.fill();
  } else {
    rounded(context, x - 51, y - 39, 102, 80, 14, '#8c5a36', '#5f3d29');
    rounded(context, x - 44, y - 32, 88, 66, 11, '#b77a43', '#754b31');
    context.fillStyle = '#f1b34f'; context.globalAlpha = .7;
    for (let i = -1; i <= 1; i += 1) { context.beginPath(); context.arc(x + i * 17, y + 13, 7, Math.PI, Math.PI * 2); context.fill(); }
    context.globalAlpha = 1;
  }

  const items = entry?.slots ?? [];
  items.forEach((item, index) => {
    if (!item) return;
    const offset = items.length > 1 ? (index === 0 ? -31 : 31) : 0;
    drawIngredient(context, item.ingredient, x + offset, y - 4, 39);
    drawProgress(context, x + offset, y - 4, item, 28);
  });
  text(context, label, x, y + 69, 13, '#fff1db', 'center', 800);
  context.restore();
}

function drawAssembly(context, state) {
  const x = 672; const y = 554;
  rounded(context, x - 88, y - 55, 176, 112, 16, '#e0bd8e', '#956d48');
  rounded(context, x - 78, y - 46, 156, 94, 12, '#f0d7ae', '#b48b5c');
  if (state.plateAtAssembly) drawPlate(context, x, y - 4, state.plateItems, .75);
  text(context, `ASSEMBLY  ${state.plateItems.length}`, x, y + 73, 13, '#fff1db', 'center', 800);
}

function drawPass(context, state) {
  const x = 970; const y = 554;
  rounded(context, x - 80, y - 55, 160, 112, 16, '#9d6243', '#71442f');
  rounded(context, x - 69, y - 44, 138, 90, 12, '#d19461', '#734932');
  rounded(context, x - 57, y - 32, 114, 64, 10, '#f1d8ae', '#b3845a');
  line(context, x - 46, y - 17, x + 45, y - 17, '#c7986a', 3);
  drawPlate(context, x, y + 1, [], .56);
  text(context, 'SERVE', x, y + 73, 13, '#fff1db', 'center', 800);
}

function drawBin(context, state) {
  const x = 1162; const y = 554;
  rounded(context, x - 45, y - 34, 90, 70, 12, '#596d54', '#405141');
  context.fillStyle = '#789078';
  context.beginPath(); context.moveTo(x - 51, y - 27); context.lineTo(x + 51, y - 27); context.lineTo(x + 43, y + 31); context.lineTo(x - 43, y + 31); context.closePath(); context.fill();
  line(context, x - 48, y - 28, x + 48, y - 28, '#d1d1ad', 5);
  text(context, 'COMPOST', x, y + 58, 12, '#fff1db', 'center', 800);
}

function drawChef(context, state) {
  const { x, y, facing } = state.chef;
  context.fillStyle = 'rgba(56,38,31,.2)';
  context.beginPath(); context.ellipse(x, y + 25, 30, 9, 0, 0, Math.PI * 2); context.fill();
  context.fillStyle = '#486654';
  context.beginPath(); context.roundRect(x - 21, y - 17, 42, 42, [12, 12, 8, 8]); context.fill();
  context.fillStyle = '#fff3dc';
  context.beginPath(); context.arc(x, y - 28, 17, 0, Math.PI * 2); context.fill();
  context.fillStyle = '#fffaf0';
  context.beginPath(); context.ellipse(x, y - 43, 23, 7, 0, Math.PI, Math.PI * 2); context.fill();
  context.fillRect(x - 14, y - 44, 28, 5);
  context.fillStyle = COLORS.ink;
  context.beginPath(); context.arc(x + facing * 6, y - 28, 2, 0, Math.PI * 2); context.fill();
  if (state.carried?.kind === 'food') {
    rounded(context, x - 36, y - 91, 72, 50, 14, '#fff8e9', '#b89c78');
    drawIngredient(context, state.carried.ingredient, x, y - 68, 34);
    if (state.carried.state === 'burnt') text(context, 'BURN!', x, y - 101, 12, COLORS.red, 'center', 900);
  } else if (state.carried?.kind === 'plate') {
    drawPlate(context, x, y - 57, state.plateItems, .72);
  }
}

function drawTickets(context, state) {
  const cardW = 298;
  for (let slot = 0; slot < 4; slot += 1) {
    const x = 18 + slot * 311;
    const ticket = state.tickets[slot];
    rounded(context, x, 14, cardW, 119, 14, ticket ? '#fff7e8' : 'rgba(255,247,232,.48)', ticket ? '#c39a68' : '#cbb896');
    if (!ticket) {
      text(context, 'OPEN TICKET', x + 17, 39, 12, '#a18c70', 'left', 800);
      text(context, 'Waiting for an order', x + 17, 76, 15, '#98846b', 'left');
      continue;
    }
    const recipe = ticket.recipe;
    rounded(context, x + 10, 24, 36, 36, 10, recipe.color);
    text(context, String(slot + 1).padStart(2, '0'), x + 28, 42, 15, '#fff7e8', 'center', 900);
    text(context, recipe.name, x + 56, 38, recipe.name.length > 21 ? 14 : 16, COLORS.ink, 'left', 800);
    text(context, `${recipe.price}¢`, x + cardW - 13, 39, 14, COLORS.oak, 'right', 800);
    const barX = x + 15; const barY = 62; const barW = cardW - 30;
    const progress = Math.max(0, ticket.remaining / ticket.patience);
    rounded(context, barX, barY, barW, 8, 4, '#e5d7c0');
    rounded(context, barX, barY, barW * progress, 8, 4, progress > .5 ? '#789078' : progress > .25 ? '#e2a04b' : '#c74e41');
    text(context, `${Math.ceil(ticket.remaining)}s`, x + cardW - 14, 80, 11, progress < .25 ? COLORS.red : '#836e55', 'right', 700);
    recipe.components.forEach((part, index) => {
      const iconX = x + 23 + index * 61;
      drawIngredient(context, part.ingredient, iconX, 105, 26);
      text(context, part.station === 'pantry' ? 'raw' : part.station, iconX, 125, 9, '#806c55', 'center', 700);
    });
  }
}

function drawHud(context, state, muted) {
  context.fillStyle = '#58382b'; context.fillRect(0, 0, FIELD.width, 184);
  context.fillStyle = '#704832'; context.fillRect(0, 0, FIELD.width, 8);
  drawTickets(context, state);
  text(context, `DAY ${state.day} / 3`, 24, 160, 14, '#fff1db', 'left', 900);
  const timerX = 118; const timerY = 154; const timerW = 680;
  rounded(context, timerX, timerY, timerW, 12, 6, '#382b26');
  rounded(context, timerX, timerY, timerW * (state.dayTime / 180), 12, 6, state.dayTime < 35 ? '#d95e42' : '#e5ad59');
  text(context, `${Math.ceil(state.dayTime)}s`, timerX + timerW + 12, 160, 13, '#fff1db', 'left', 700);
  text(context, `COINS  ${state.coins}`, 920, 160, 15, '#ffe2a2', 'left', 800);
  const multiplier = Math.min(2, 1 + Math.max(0, state.combo - 1) * .1);
  text(context, `COMBO  ${state.combo ? `x${multiplier.toFixed(1)}` : '—'}`, 1090, 160, 14, state.combo ? '#f5c46d' : '#d6c3a9', 'left', 800);
  rounded(context, 1205, 143, 54, 32, 9, '#79503b', '#b7875c');
  text(context, muted ? '♫×' : '♫', 1232, 159, 16, '#fff3dc', 'center', 800);
  text(context, 'MUTE', 1232, 178, 8, '#d6c3a9', 'center', 700);
}

function drawMessage(context, state) {
  if (state.messageTime <= 0 || !state.message) return;
  rounded(context, 520, 195, 240, 40, 13, 'rgba(56,38,31,.92)');
  text(context, state.message, 640, 215, 15, '#fff3dc', 'center', 800);
}

function drawPanel(context, title, subtitle, lines, prompt) {
  context.fillStyle = 'rgba(39, 28, 22, .58)';
  context.fillRect(0, 0, FIELD.width, FIELD.height);
  const height = 340 + Math.max(0, lines.length - 2) * 32;
  const x = 310; const y = (FIELD.height - height) / 2;
  rounded(context, x, y, 660, height, 28, '#fff2dc', '#d2ad79');
  context.fillStyle = '#bd6043';
  context.beginPath(); context.roundRect(x, y, 660, 12, [28, 28, 0, 0]); context.fill();
  text(context, title, 640, y + 67, 37, COLORS.ink, 'center', 900);
  text(context, subtitle, 640, y + 110, 17, COLORS.oak, 'center', 600);
  lines.forEach((value, index) => text(context, value, 640, y + 164 + index * 34, 17, COLORS.ink, 'center', index === 0 ? 700 : 500));
  rounded(context, 500, y + height - 66, 280, 42, 15, COLORS.terracotta);
  text(context, prompt, 640, y + height - 45, 15, COLORS.white, 'center', 800);
}

function drawTitle(context, state) {
  context.fillStyle = 'rgba(48, 31, 24, .38)';
  context.fillRect(0, 184, FIELD.width, FIELD.height - 184);
  rounded(context, 292, 220, 696, 380, 32, '#fff3df', '#c69b6b');
  rounded(context, 308, 236, 664, 348, 24, '#fff9ec', '#e3c9a1');
  context.fillStyle = COLORS.terracotta;
  context.beginPath(); context.arc(640, 311, 35, 0, Math.PI * 2); context.fill();
  text(context, 'E', 640, 312, 42, '#fff3df', 'center', 900);
  text(context, 'EMBER & OAK', 640, 374, 42, COLORS.ink, 'center', 900);
  text(context, 'WOOD-FIRED KITCHEN', 640, 411, 15, COLORS.terracotta, 'center', 900);
  line(context, 470, 440, 810, 440, '#dec49d', 2);
  text(context, 'A little heat. A lot of heart.', 640, 468, 18, COLORS.oak, 'center', 600);
  text(context, 'Click a station to walk over & work', 640, 505, 15, COLORS.ink, 'center');
  text(context, 'WASD / arrows to move    •    E / Space to interact', 640, 531, 14, '#816d55', 'center');
  rounded(context, 515, 548, 250, 46, COLORS.terracotta);
  text(context, 'OPEN THE KITCHEN', 640, 571, 15, COLORS.white, 'center', 900);
}

function drawServePlate(context, state) {
  const isMatch = state.plateItems.length > 0;
  if (isMatch) drawPlate(context, 970, 555, state.plateItems, .45);
}

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0, ratio: 1 };
  function resize() {
    view.ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * view.ratio);
    const height = Math.round(window.innerHeight * view.ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }
  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const px = (clientX - rect.left) * view.ratio;
    const py = (clientY - rect.top) * view.ratio;
    return { x: (px - view.x) / view.scale, y: (py - view.y) / view.scale };
  }
  function draw(state, screen, muted = false) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = '#35261f';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    context.fillStyle = COLORS.cream;
    context.fillRect(0, 0, FIELD.width, FIELD.height);
    drawKitchen(context, state);
    drawServePlate(context, state);
    drawChef(context, state);
    drawHud(context, state, muted);
    drawMessage(context, state);
    if (screen === SCREEN_TITLE) drawTitle(context, state);
    else if (screen === SCREEN_DAY_END) {
      const day = Number.isInteger(state.day) ? state.day : 1;
      const earned = Number.isFinite(state.dayEarned) ? state.dayEarned : 0;
      const served = Number.isFinite(state.servedToday) ? state.servedToday : 0;
      const lost = Number.isFinite(state.lost) ? state.lost : 0;
      const stars = earned >= STAR_TARGETS[2] ? 3 : earned >= STAR_TARGETS[1] ? 2 : earned >= STAR_TARGETS[0] ? 1 : 0;
      const next = day < 3 ? `Day ${day + 1} unlocks more recipes and a faster service.` : 'One last shift, one unforgettable little kitchen.';
      drawPanel(context, `Day ${day} / 3 complete`, `${served} dishes served  •  ${lost} orders lost`, [
        `Shift earnings   ${earned} coins`,
        `Kitchen stars   ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`,
        next,
      ], day < 3 ? 'Press Space to start next day' : 'Press Space for your final score');
    } else if (screen === SCREEN_OVER) {
      drawPanel(context, 'A kitchen remembered', 'Three days by the fire', [
        `Final earnings   ${state.coins} coins`,
        `Dishes served   ${state.servedToday} this shift  •  Best combo x${Math.min(2, 1 + Math.max(0, state.bestCombo - 1) * .1).toFixed(1)}`,
        'Thank you for cooking with us.',
      ], 'Press R or click to cook again');
    }
  }
  resize();
  window.addEventListener('resize', resize);
  return { draw, toLogical };
}
