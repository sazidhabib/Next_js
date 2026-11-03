/**
 * Canvas Engine 06: Typographic Dot-Matrix Assembler (#ftName)
 * Rasterizes typography into offscreen buffer, instantiates particles, and snaps on scroll
 */

export function initFooterAssembler() {
  const canvas = document.getElementById('ftName');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let isAssembled = false;
  const mouse = { x: -9999, y: -9999 };

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
    rasterizeTypography();
  }

  function rasterizeTypography() {
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const octx = offscreen.getContext('2d');

    const text = 'SAZID HABIB';
    const fontSize = Math.min(width / 6.5, height * 0.7);
    octx.font = `800 ${fontSize}px "Geist", system-ui, sans-serif`;
    octx.fillStyle = '#FFF';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(text, width / 2, height / 2);

    const imgData = octx.getImageData(0, 0, width, height).data;
    particles = [];
    const step = Math.max(3, Math.round(width / 240));

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData[idx + 3] > 128) {
          particles.push({
            targetX: x,
            targetY: y,
            x: x + (Math.random() - 0.5) * 350,
            y: y + (Math.random() - 0.5) * 350,
            vx: 0,
            vy: 0,
            radius: step * 0.45,
            alpha: 0.2 + Math.random() * 0.7,
          });
        }
      }
    }
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function loop() {
    ctx.clearRect(0, 0, width, height);

    const spring = 0.06;
    const friction = 0.82;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 80) {
        const force = (1 - dist / 80) * 12;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Spring pull to target position
      const ax = (p.targetX - p.x) * spring;
      const ay = (p.targetY - p.y) * spring;

      p.vx = (p.vx + ax) * friction;
      p.vy = (p.vy + ay) * friction;

      p.x += p.vx;
      p.y += p.vy;

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

