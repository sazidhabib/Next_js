/**
 * Canvas Engine 02: Terminator HUD & Cybernetic Eye Scanner (#tmCv)
 * Interactive Sci-Fi target reticles, glowing crimson lenses, and coordinate trackers
 */

export function initTerminatorHUD() {
  const canvas = document.getElementById('tmCv');
  const portrait = document.getElementById('portrait') || (canvas ? canvas.parentElement : null);
  if (!canvas || !portrait) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Normalized eye locations relative to portrait box
  const EYES = [[0.44, 0.392], [0.5725, 0.392]];
  const mouse = { x: -999, y: -999, isHovering: false };
  let activation = 0; // 0 (hidden) to 1 (full HUD)
  let scanY = 0;
  let scanDir = 1;
  let angle = 0;

  function resize() {
    width = portrait.clientWidth;
    height = portrait.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  portrait.addEventListener('pointerenter', () => {
    mouse.isHovering = true;
  });

  portrait.addEventListener('pointermove', (e) => {
    const rect = portrait.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovering = true;
  });

  portrait.addEventListener('pointerleave', () => {
    mouse.isHovering = false;
  });

  function drawReticle(cx, cy, r, rot, alpha) {
    ctx.save();
    ctx.translate(cx, cy);

    // Glowing core
    const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    radGrad.addColorStop(0, `rgba(255, 45, 85, ${alpha * 0.8})`);
    radGrad.addColorStop(0.5, `rgba(255, 45, 85, ${alpha * 0.3})`);
    radGrad.addColorStop(1, 'rgba(255, 45, 85, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Rotating dashed target ring
    ctx.rotate(rot);
    ctx.strokeStyle = `rgba(255, 60, 60, ${alpha * 0.9})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, 0, Math.PI * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.65, Math.PI, Math.PI * 1.8);
    ctx.stroke();

    // Precision crosshairs
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
    ctx.lineWidth = 1;
    const len = r * 0.4;
    ctx.beginPath();
    ctx.moveTo(-len, 0); ctx.lineTo(len, 0);
    ctx.moveTo(0, -len); ctx.lineTo(0, len);
    ctx.stroke();

    ctx.restore();
  }

  function loop() {
    // Smooth activation lerp
    const targetActivation = mouse.isHovering ? 1 : 0.08;
    activation += (targetActivation - activation) * 0.08;

    ctx.clearRect(0, 0, width, height);

    if (activation > 0.01) {
      angle += 0.035;

      // Update vertical scanning laser
      scanY += scanDir * 2.5;
      if (scanY > height) scanDir = -1;
      if (scanY < 0) scanDir = 1;

      // Draw faint HUD scanning beam
      if (mouse.isHovering) {
        const beamGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
        beamGrad.addColorStop(0, 'rgba(13, 153, 255, 0)');
        beamGrad.addColorStop(0.5, `rgba(13, 153, 255, ${activation * 0.35})`);
        beamGrad.addColorStop(1, 'rgba(13, 153, 255, 0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, scanY - 15, width, 30);

        // Core laser hairline
        ctx.strokeStyle = `rgba(255, 255, 255, ${activation * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      // Draw Eye Reticles
      EYES.forEach(([nx, ny], idx) => {
        const ex = width * nx;
        const ey = height * ny;
        const r = Math.max(22, width * 0.075);
        const rot = idx === 0 ? angle : -angle;
        drawReticle(ex, ey, r, rot, activation);

        // HUD Coordinate text beside right eye
        if (idx === 1 && activation > 0.4) {
          ctx.font = '10px "Geist Mono", monospace';
          ctx.fillStyle = `rgba(255, 255, 255, ${activation * 0.75})`;
          ctx.fillText(`SYS: LOCKED`, ex + r + 10, ey - 6);
          ctx.fillText(`[${ex.toFixed(0)}, ${ey.toFixed(0)}]`, ex + r + 10, ey + 10);
        }
      });
    }

    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

