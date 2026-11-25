import { STEP } from './config.js';
import { SCREEN_DAY_END, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

function advance(world, seconds) {
  const count = Math.ceil(seconds / STEP);
  for (let index = 0; index < count; index += 1) world.step(STEP);
}

function makeTart(world, components = 3) {
  const ingredients = ['pastry', 'berries', 'cream'];
  for (const ingredient of ingredients.slice(0, components)) {
    world.stageInteract(ingredient);
    world.stageInteract('assembly');
  }
}

function stageStart(world) {
  world.reset();
  return { screen: SCREEN_TITLE };
}

function stageAssembly(world) {
  world.reset();
  world.stageSetDay(2);
  world.stageTickets(['berry-tart', 'fish-chips', 'oak-salmon', 'smoky-burger']);
  makeTart(world, 2);
  world.stageInteract('cream');
  return { screen: SCREEN_PLAY };
}

function stageRush(world) {
  world.reset();
  world.stageSetDay(2);
  world.stageTickets(['berry-tart', 'fish-chips', 'oak-salmon', 'smoky-burger']);
  for (const [ingredient, station] of [['fish', 'fryer'], ['salmon', 'grill'], ['tomato', 'board'], ['pasta', 'pot']]) {
    world.stageInteract(ingredient);
    world.stageInteract(station);
  }
  advance(world, 4.25);
  makeTart(world);
  world.stageInteract('assembly');
  return { screen: SCREEN_PLAY };
}

function stageService(world) {
  world.reset();
  world.stageSetDay(3);
  world.stageTickets(['berry-tart', 'fish-chips', 'mushroom-risotto', 'oak-salmon']);
  makeTart(world);
  world.stageInteract('assembly');
  world.stageInteract('pass');
  world.stageFinishDay();
  return { screen: SCREEN_DAY_END };
}

export function stageShot(name, world) {
  if (name === 'rush') return stageRush(world);
  if (name === 'assembly') return stageAssembly(world);
  if (name === 'service') return stageService(world);
  return stageStart(world);
}
