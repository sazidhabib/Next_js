/**
 * Canvas Engine 05: Interactive Dot Matrix Grid Ripple (#cpDots)
 * Pre-rendered 22px dot matrix with dynamic cursor ripple & ring wave physics
 */

export function initDotRipple() {
  const canvas = document.getElementById('cpDots');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  const mouse = { x: -9999, y: -9999, isHover: false };
  const waves = [];

  function resize() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHover = true;
  });

  canvas.addEventListener('pointerleave', () => {
    mouse.isHover = false;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    waves.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: 0,
      maxR: Math.max(width, height) * 0.75,
      alpha: 1,
    });
  });

  function loop() {
    ctx.clearRect(0, 0, width, height);

    const pitch = 22;
    const baseRadius = 1.2;

    // Update active click waves
    for (let w = waves.length - 1; w >= 0; w--) {
      const wave = waves[w];
      wave.r += 6;
      wave.alpha = 1 - wave.r / wave.maxR;
      if (wave.alpha <= 0) {
        waves.splice(w, 1);
      }
    }

    // Render dot matrix
    for (let x = pitch / 2; x < width; x += pitch) {
      for (let y = pitch / 2; y < height; y += pitch) {
        let r = baseRadius;
        let alpha = 0.08;

        // Mouse proximity reaction
        const distM = Math.hypot(x - mouse.x, y - mouse.y);
        if (distM < 160) {
          const factor = 1 - distM / 160;
          r += factor * 2.5;
          alpha += factor * 0.65;
        }

        // Wave reactions
        for (let w = 0; w < waves.length; w++) {
          const wave = waves[w];
          const distW = Math.hypot(x - wave.x, y - wave.y);
          const diff = Math.abs(distW - wave.r);
          if (diff < 30) {
            const waveFactor = (1 - diff / 30) * wave.alpha;
            r += waveFactor * 2.0;
            alpha += waveFactor * 0.5;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

