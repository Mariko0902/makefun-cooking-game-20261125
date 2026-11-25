const KEYS = {
  left: new Set(['ArrowLeft', 'KeyA']),
  right: new Set(['ArrowRight', 'KeyD']),
  up: new Set(['ArrowUp', 'KeyW']),
  down: new Set(['ArrowDown', 'KeyS']),
};

export function createInput(canvas) {
  const held = new Set();
  let interact = false;
  let pointer = null;
  let confirm = false;
  let restart = false;

  window.addEventListener('keydown', (event) => {
    if (Object.values(KEYS).some((set) => set.has(event.code))) {
      held.add(event.code);
      event.preventDefault();
    } else if (['Space', 'KeyE', 'Enter'].includes(event.code)) {
      if (!event.repeat) {
        interact = true;
        if (event.code !== 'KeyE') confirm = true;
      }
      event.preventDefault();
    } else if (event.code === 'KeyR') {
      if (!event.repeat) restart = true;
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', (event) => held.delete(event.code));
  window.addEventListener('blur', () => held.clear());
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    pointer = { x: event.clientX, y: event.clientY };
    confirm = true;
  });

  return {
    take() {
      const down = (set) => [...set].some((code) => held.has(code));
      const result = {
        dx: (down(KEYS.right) ? 1 : 0) - (down(KEYS.left) ? 1 : 0),
        dy: (down(KEYS.down) ? 1 : 0) - (down(KEYS.up) ? 1 : 0),
        interact, pointer, confirm, restart,
      };
      interact = false;
      pointer = null;
      confirm = false;
      restart = false;
      return result;
    },
  };
}
