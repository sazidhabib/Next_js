/**
 * Canvas Engine 04: Vector Bezier Drafting Pen (#abCv)
 * Mathematical vector path tracer with tangent vectors, control anchors, and drawing head
 * Draws the letter "S" with rounded corners and glowing laser craft
 */

export function initVectorPen() {
  const canvas = document.getElementById('abCv');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const C = [
    [0, 0], [400, 0], [400, 110], [110, 110], [110, 170], [400, 170],
    [400, 450], [0, 450], [0, 340], [290, 340], [290, 280], [0, 280]
  ];
  const OUTER = [0, 1, 6, 7], R = 22, BW = 400, BH = 450;

  let width = 0, height = 0, dpr = 1, t = 0;

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

  function loop() {
    t += 0.005;
    if (t > 1) t = 0;

    ctx.clearRect(0, 0, width, height);

    const sc = Math.min(width * 0.75 / BW, height * 0.75 / BH);
    const ox = (width - BW * sc) / 2;
    const oy = (height - BH * sc) / 2;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(sc, sc);

    // Draw the rounded polygon path for letter S
    ctx.beginPath();
    C.forEach((v, i) => {
      const a = C[(i - 1 + C.length) % C.length], b = C[(i + 1) % C.length];
      const dx1 = a[0] - v[0], dy1 = a[1] - v[1], l1 = Math.hypot(dx1, dy1) || 1;
      const dx2 = b[0] - v[0], dy2 = b[1] - v[1], l2 = Math.hypot(dx2, dy2) || 1;
      const ua = [dx1 / l1, dy1 / l1], ub = [dx2 / l2, dy2 / l2];
      const startX = v[0] + ua[0] * R, startY = v[1] + ua[1] * R;
      const endX = v[0] + ub[0] * R, endY = v[1] + ub[1] * R;
      if (i === 0) ctx.moveTo(startX, startY);
      else ctx.lineTo(startX, startY);
      ctx.quadraticCurveTo(v[0], v[1], endX, endY);
    });
    ctx.closePath();

    ctx.strokeStyle = '#0D99FF';
    ctx.lineWidth = 2.5 / sc;
    ctx.stroke();
    ctx.fillStyle = 'rgba(13, 153, 255, 0.08)';
    ctx.fill();

    // Draw control anchor dots
    C.forEach((v, idx) => {
      ctx.fillStyle = OUTER.includes(idx) ? '#FFF' : '#0D99FF';
      ctx.fillRect(v[0] - 3.5 / sc, v[1] - 3.5 / sc, 7 / sc, 7 / sc);
    });

    ctx.restore();

    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}
