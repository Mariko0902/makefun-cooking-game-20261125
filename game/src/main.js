import { STEP, STATIONS } from './config.js';
import { createRandom } from './random.js';
import { createWorld } from './world.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer, SCREEN_DAY_END, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';
import { stageShot } from './shots.js';

const MAX_FRAME = 0.25;
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedValue = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedValue) ? seedValue : Math.floor(Math.random() * 4294967296);
const canvas = document.getElementById('game');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);
const audio = createAudio();

if (shot) {
  const scene = stageShot(shot, world);
  let paintCount = 0;
  const paintShot = () => {
    renderer.draw(world.state, scene.screen, audio.muted);
    paintCount += 1;
    if (paintCount < 2) requestAnimationFrame(paintShot);
    else window.__shotReady = true;
  };
  requestAnimationFrame(paintShot);
} else {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let accumulator = 0;
  let last = performance.now();
  let pendingInteract = false;

  function startGame() {
    world.reset();
    screen = SCREEN_PLAY;
    accumulator = 0;
    pendingInteract = false;
  }

  function advanceScreen() {
    if (screen === SCREEN_TITLE) startGame();
    else if (screen === SCREEN_DAY_END) {
      if (world.state.day < 3) {
        world.nextDay();
        screen = SCREEN_PLAY;
      } else screen = SCREEN_OVER;
    } else if (screen === SCREEN_OVER) startGame();
  }

  function onPointer(pointer) {
    const point = renderer.toLogical(pointer.x, pointer.y);
    if (point.x > 1195 && point.x < 1270 && point.y > 136 && point.y < 184) {
      const muted = audio.toggle();
      if (!muted) audio.play('click');
      return;
    }
    if (screen !== SCREEN_PLAY) {
      advanceScreen();
      return;
    }
    let nearest = null;
    let distance = Infinity;
    for (const station of STATIONS) {
      const next = Math.hypot(station.x - point.x, station.y - point.y);
      if (next < distance) { distance = next; nearest = station; }
    }
    if (nearest && distance <= 92) {
      world.requestStation(nearest.id);
      audio.play('click');
    }
  }

  function playEvents(events) {
    for (const event of events) {
      if (event === 'day-end') screen = SCREEN_DAY_END;
      else if (event === 'chop') audio.play('chop');
      else if (event === 'sizzle') audio.play('sizzle');
      else if (event === 'wrong' || event === 'lost') audio.play('burn');
      else audio.play(event);
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const actions = input.take();
    if (actions.pointer) onPointer(actions.pointer);
    const wasScreen = screen;
    if (actions.confirm && screen !== SCREEN_PLAY) advanceScreen();
    if (actions.restart && screen === SCREEN_OVER) startGame();
    if (screen === SCREEN_PLAY && wasScreen === SCREEN_PLAY && actions.interact) pendingInteract = true;

    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP && screen === SCREEN_PLAY) {
        playEvents(world.step(STEP, {
          dx: actions.dx,
          dy: actions.dy,
          interact: pendingInteract,
        }));
        pendingInteract = false;
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world.state, screen, audio.muted);
  }

  requestAnimationFrame(frame);
}
