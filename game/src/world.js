import { BURN_SECONDS, CHEF_SPEED, DAY_ORDER_GAP, DAY_PATIENCE, DAY_SECONDS, STAR_TARGETS, STATIONS } from './config.js';
import { componentFor, recipeForItems, recipesForDay } from './recipes.js';

const REACH = 68;
const MAX_TICKETS = 4;
const PROCESS_KINDS = new Set(['chop', 'grill', 'boil', 'fry']);
const SLOT_COUNT = { grill: 2, chop: 1, boil: 1, fry: 1 };

function makeStation(definition) {
  return { ...definition, slots: PROCESS_KINDS.has(definition.kind) ? Array(SLOT_COUNT[definition.kind]).fill(null) : [] };
}

function copyFood(item) {
  return { ingredient: item.ingredient, state: item.state, progress: item.progress, age: item.age };
}

export function createWorld(random) {
  const chef = { x: 650, y: 700, facing: 1 };
  const stations = STATIONS.map(makeStation);
  const state = {
    chef, stations, carried: null, plateItems: [], plateAtAssembly: true,
    tickets: [], day: 1, dayTime: DAY_SECONDS, dayEarned: 0, servedToday: 0,
    coins: 0, score: 0, combo: 0, bestCombo: 0, lost: 0, spawnTimer: 0,
    dayComplete: false, lastServe: null, message: '', messageTime: 0,
  };
  let nextTicketId = 1;
  let targetId = null;
  let targetAuto = false;
  let shake = 0;

  function station(id) {
    return stations.find((entry) => entry.id === id) ?? null;
  }

  function spawnTicket() {
    if (state.tickets.length >= MAX_TICKETS || state.dayComplete) return false;
    const available = recipesForDay(state.day);
    const recipe = available[Math.floor(random() * available.length)];
    const patience = DAY_PATIENCE.min + random() * (DAY_PATIENCE.max - DAY_PATIENCE.min);
    state.tickets.push({ id: nextTicketId++, recipe, remaining: patience, patience });
    return true;
  }

  function gap() {
    const range = DAY_ORDER_GAP[state.day - 1];
    return range.min + random() * (range.max - range.min);
  }

  function beginDay(day) {
    state.day = day;
    state.dayTime = DAY_SECONDS;
    state.dayEarned = 0;
    state.servedToday = 0;
    state.tickets = [];
    state.dayComplete = false;
    state.spawnTimer = gap();
    spawnTicket();
    state.spawnTimer = gap();
    state.plateItems = [];
    state.plateAtAssembly = true;
    state.carried = null;
  }

  function reset() {
    chef.x = 650;
    chef.y = 700;
    chef.facing = 1;
    for (const entry of stations) entry.slots.fill(null);
    state.carried = null;
    state.plateItems = [];
    state.plateAtAssembly = true;
    state.tickets = [];
    state.day = 1;
    state.coins = 0;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.lost = 0;
    state.lastServe = null;
    state.message = '';
    state.messageTime = 0;
    targetId = null;
    targetAuto = false;
    shake = 0;
    nextTicketId = 1;
    beginDay(1);
  }

  function nearestStation(x = chef.x, y = chef.y) {
    let best = null;
    let bestDistance = Infinity;
    for (const entry of stations) {
      const distance = Math.hypot(entry.x - x, entry.y - y);
      if (distance < bestDistance) { bestDistance = distance; best = entry; }
    }
    return bestDistance <= REACH ? best : null;
  }

  function interactAt(id, events = []) {
    const entry = station(id);
    if (!entry || state.dayComplete) return events;
    if (entry.kind === 'pantry') {
      if (state.carried) return events;
      const component = componentFor(entry.ingredient);
      if (!component) return events;
      state.carried = { kind: 'food', ingredient: entry.ingredient, state: component.station === 'pantry' ? 'ready' : 'raw', progress: 0, age: 0 };
      events.push('click');
      return events;
    }
    if (PROCESS_KINDS.has(entry.kind)) {
      if (state.carried?.kind === 'food' && state.carried.state === 'raw') {
        const component = componentFor(state.carried.ingredient);
        const slot = entry.slots.findIndex((value) => value === null);
        if (component?.station === entry.kind && slot >= 0) {
          entry.slots[slot] = { ...state.carried, required: component.time };
          state.carried = null;
          events.push(entry.kind === 'chop' ? 'chop' : 'sizzle');
        }
      } else if (!state.carried) {
        const readySlot = entry.slots.findIndex((value) => value && value.state !== 'raw');
        if (readySlot >= 0) {
          state.carried = entry.slots[readySlot];
          entry.slots[readySlot] = null;
          events.push('click');
        }
      }
      return events;
    }
    if (entry.kind === 'assembly') {
      if (state.carried?.kind === 'food' && state.carried.state === 'ready') {
        state.plateItems.push(copyFood(state.carried));
        state.carried = null;
        events.push('click');
      } else if (state.carried?.kind === 'plate') {
        state.carried = null;
        state.plateAtAssembly = true;
        events.push('click');
      } else if (!state.carried && state.plateAtAssembly) {
        state.carried = { kind: 'plate' };
        state.plateAtAssembly = false;
        events.push('click');
      }
      return events;
    }
    if (entry.kind === 'pass') {
      if (state.carried?.kind !== 'plate') return events;
      const recipe = recipeForItems(state.plateItems, state.day);
      const ticketIndex = recipe ? state.tickets.findIndex((ticket) => ticket.recipe.id === recipe.id) : -1;
      if (ticketIndex < 0) {
        shake = 0.65;
        state.message = 'Not quite that order';
        state.messageTime = 1.4;
        events.push('wrong');
        return events;
      }
      const ticket = state.tickets[ticketIndex];
      const tip = Math.ceil(ticket.recipe.price * 0.4 * (ticket.remaining / ticket.patience));
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      const multiplier = Math.min(2, 1 + (state.combo - 1) * 0.1);
      const earned = Math.round((ticket.recipe.price + tip) * multiplier);
      state.coins += earned;
      state.score += earned;
      state.dayEarned += earned;
      state.servedToday += 1;
      state.lastServe = { recipe: ticket.recipe.name, earned, multiplier };
      state.tickets.splice(ticketIndex, 1);
      state.carried = null;
      state.plateItems = [];
      state.plateAtAssembly = true;
      state.message = `Served! +${earned}`;
      state.messageTime = 1.6;
      events.push('serve');
      return events;
    }
    if (entry.kind === 'bin') {
      if (state.carried?.kind === 'food' && state.carried.state === 'burnt') {
        state.carried = null;
        state.message = 'Composted';
        state.messageTime = 1;
        events.push('click');
      } else if (state.carried?.kind === 'food') {
        state.carried = null;
        events.push('click');
      } else if (state.carried?.kind === 'plate') {
        state.carried = null;
        state.plateItems = [];
        state.plateAtAssembly = true;
        events.push('click');
      }
      return events;
    }
    return events;
  }

  function requestStation(id) {
    if (!station(id)) return;
    targetId = id;
    targetAuto = true;
  }

  function step(dt, controls = {}) {
    const events = [];
    if (state.dayComplete) return events;
    state.dayTime = Math.max(0, state.dayTime - dt);
    if (state.messageTime > 0) state.messageTime = Math.max(0, state.messageTime - dt);
    if (shake > 0) shake = Math.max(0, shake - dt);
    for (const ticket of state.tickets) ticket.remaining -= dt;
    const expired = state.tickets.filter((ticket) => ticket.remaining <= 0);
    if (expired.length) {
      state.tickets = state.tickets.filter((ticket) => ticket.remaining > 0);
      state.lost += expired.length;
      state.combo = 0;
      state.message = 'Order lost — keep the fire alive';
      state.messageTime = 1.8;
      events.push('lost');
    }
    if (state.dayTime <= 0) {
      state.dayComplete = true;
      targetId = null;
      events.push('day-end');
      return events;
    }

    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      if (spawnTicket()) state.spawnTimer = gap();
      else state.spawnTimer = 1;
      if (state.tickets.length) events.push('ding');
    }

    for (const entry of stations) {
      for (const item of entry.slots) {
        if (!item || item.state === 'burnt') continue;
        if (item.state === 'raw') {
          item.progress += dt;
          if (item.progress >= item.required) {
            item.state = 'ready';
            item.age = 0;
            events.push('ding');
          }
        } else {
          item.age += dt;
          if (item.age >= BURN_SECONDS) {
            item.state = 'burnt';
            events.push('burn');
          }
        }
      }
    }

    if (controls.station) requestStation(controls.station);
    if (controls.interact) {
      const nearby = nearestStation();
      if (nearby) {
        targetId = nearby.id;
        targetAuto = true;
      } else {
        let closest = stations[0];
        let distance = Infinity;
        for (const entry of stations) {
          const next = Math.hypot(entry.x - chef.x, entry.y - chef.y);
          if (next < distance) { distance = next; closest = entry; }
        }
        targetId = closest.id;
        targetAuto = true;
      }
    }

    const hasManualDirection = controls.dx !== 0 || controls.dy !== 0;
    if (hasManualDirection) {
      targetId = null;
      targetAuto = false;
      const magnitude = Math.hypot(controls.dx, controls.dy) || 1;
      chef.x += (controls.dx / magnitude) * CHEF_SPEED * dt;
      chef.y += (controls.dy / magnitude) * CHEF_SPEED * dt;
      chef.x = Math.max(58, Math.min(1220, chef.x));
      chef.y = Math.max(200, Math.min(746, chef.y));
      if (controls.dx) chef.facing = Math.sign(controls.dx);
    } else if (targetId) {
      const destination = station(targetId);
      const dx = destination.x - chef.x;
      const dy = destination.y - chef.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= 5) {
        if (targetAuto) events.push(...interactAt(targetId, []));
        targetId = null;
        targetAuto = false;
      } else {
        const movement = Math.min(distance, CHEF_SPEED * dt);
        chef.x += (dx / distance) * movement;
        chef.y += (dy / distance) * movement;
        if (dx) chef.facing = Math.sign(dx);
      }
    }
    return events;
  }

  function nextDay() {
    if (!state.dayComplete || state.day >= 3) return false;
    state.combo = 0;
    for (const entry of stations) entry.slots.fill(null);
    beginDay(state.day + 1);
    return true;
  }

  function stageInteract(id) {
    const entry = station(id);
    if (!entry) return [];
    chef.x = entry.x;
    chef.y = entry.y;
    return interactAt(id, []);
  }

  function stageSetDay(day) {
    beginDay(day);
    state.spawnTimer = 10000;
  }

  function stageTickets(ids) {
    state.tickets = [];
    for (const id of ids.slice(0, MAX_TICKETS)) {
      const recipe = recipesForDay(state.day).find((candidate) => candidate.id === id);
      if (recipe) state.tickets.push({ id: nextTicketId++, recipe, remaining: 64, patience: 64 });
    }
  }

  function stageFinishDay() {
    state.dayTime = 0;
    return step(1);
  }

  reset();
  return {
    state, reset, step, requestStation, stageInteract, nextDay,
    stageSetDay, stageTickets, stageFinishDay,
    get shake() { return shake; },
  };
}
