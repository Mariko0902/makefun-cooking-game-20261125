export function createAudio() {
  let context = null;
  let muted = false;

  function getContext() {
    if (context) return context;
    const Audio = globalThis.AudioContext ?? globalThis.webkitAudioContext;
    if (!Audio) return null;
    try {
      context = new Audio();
      return context;
    } catch {
      return null;
    }
  }

  function tone(frequency, duration, type = 'sine', volume = 0.045, endFrequency = frequency) {
    if (muted) return;
    const audio = getContext();
    if (!audio) return;
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  const sounds = {
    chop: () => { tone(420, 0.06, 'triangle', 0.04, 260); },
    sizzle: () => { tone(180, 0.28, 'sawtooth', 0.025, 340); },
    ding: () => { tone(780, 0.18, 'sine', 0.04, 1120); },
    serve: () => { tone(540, 0.16); setTimeout(() => tone(820, 0.22, 'sine', 0.045, 1040), 85); },
    burn: () => { tone(210, 0.38, 'square', 0.035, 65); },
    click: () => { tone(360, 0.045, 'triangle', 0.025, 300); },
  };

  return {
    play(name) { sounds[name]?.(); },
    toggle() { muted = !muted; return muted; },
    get muted() { return muted; },
  };
}
