import confetti from 'canvas-confetti';

export function fireGrandConfetti() {
  try {
    const count = 200;
    const defaults: confetti.Options = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      try {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      } catch {}
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff0055', '#ff5050', '#ffcc00', '#00e5ff', '#a855f7'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ffd700', '#ff69b4', '#00ffff'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#ff007f', '#7928ca', '#4299e1', '#48bb78'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      shapes: ['circle' as confetti.Shape],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      shapes: ['star' as confetti.Shape],
      colors: ['#FFE838', '#FFB703', '#FB8500'],
    });
  } catch {}
}

export function fireSideCannons() {
  try {
    const end = Date.now() + 2 * 1000;
    const colors = ['#ec4899', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981'];

    (function frame() {
      try {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors,
          zIndex: 9999,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors,
          zIndex: 9999,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      } catch {}
    })();
  } catch {}
}

export function fireHeartConfetti() {
  try {
    const heartShapes: confetti.Shape[] = ['circle' as confetti.Shape, 'square' as confetti.Shape];

    confetti({
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: heartShapes,
      colors: ['#ff1493', '#ff69b4', '#ff85c0', '#ffd700'],
      zIndex: 9999,
      particleCount: 50,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.5 },
    });
  } catch {}
}

