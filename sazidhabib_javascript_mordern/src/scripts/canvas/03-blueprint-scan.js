/**
 * Canvas Engine 03: Blueprint Edge-Detection Wireframe Scanner (#bpCv)
 * Computes luminance deltas (Sobel-style edge detection) and sweeps a laser CAD wireframe
 */

export function initBlueprintScan() {
  const canvas = document.getElementById('bpCv');
  const heroImg = document.getElementById('heroImg');
  const portrait = document.getElementById('portrait');
  if (!canvas || !heroImg || !portrait) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  let scanProgress = 0;
  let isScanning = true;
  let edgesCalculated = false;
  let edgePoints = [];

  function calculateEdges() {
    if (!heroImg.naturalWidth || edgesCalculated) return;

    try {
      // Offscreen canvas to downsample and analyze luminance
      const oc = document.createElement('canvas');
      const step = 4;
      const ow = Math.round(width / step);
      const oh = Math.round(height / step);
      if (ow <= 0 || oh <= 0) return;

      oc.width = ow;
      oc.height = oh;
      const octx = oc.getContext('2d');
      octx.drawImage(heroImg, 0, 0, ow, oh);

      const imgData = octx.getImageData(0, 0, ow, oh).data;
      const lum = new Float32Array(ow * oh);

      // Convert RGB to Luminance
      for (let i = 0; i < lum.length; i++) {
        const idx = i * 4;
        lum[i] = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
      }

      edgePoints = [];
      const threshold = 18;

      // Simple horizontal/vertical gradient delta check
      for (let y = 1; y < oh - 1; y++) {
        for (let x = 1; x < ow - 1; x++) {
          const curr = lum[y * ow + x];
          const right = lum[y * ow + (x + 1)];
          const down = lum[(y + 1) * ow + x];
          const diff = Math.abs(curr - right) + Math.abs(curr - down);

          if (diff > threshold) {
            edgePoints.push({
              x: x * step,
              y: y * step,
              alpha: Math.min(1, diff / 60),
            });
          }
        }
      }
      edgesCalculated = true;
    } catch (e) {
      // Cross-origin fallback for external mock images: generate synthetic CAD wireframe points
      generateFallbackBlueprint();
    }
  }

  function generateFallbackBlueprint() {
    edgePoints = [];
    // Architectural grid curves & silhouette
    for (let y = 20; y < height - 20; y += 6) {
      for (let x = 20; x < width - 20; x += 6) {
        const dx = x - width / 2;
        const dy = y - height * 0.45;
        const d = Math.hypot(dx, dy);
        if (d > 70 && d < 130 && Math.random() > 0.4) {
          edgePoints.push({ x, y, alpha: 0.6 });
        }
      }
    }
    edgesCalculated = true;
  }

  function resize() {
    width = portrait.clientWidth;
    height = portrait.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    edgesCalculated = false;
    calculateEdges();
  }

  if (heroImg.complete) {
    resize();
  } else {
    heroImg.addEventListener('load', resize, { once: true });
  }

  window.addEventListener('resize', resize);

  // Animation Loop: sweeps laser down, revealing the blueprint then photo
  function loop() {
    if (isScanning && edgesCalculated) {
      scanProgress += 0.008;
      if (scanProgress > 1.4) {
        scanProgress = 0; // loops periodically
      }

      ctx.clearRect(0, 0, width, height);
      const scanY = scanProgress * height;

      // Draw CAD blueprint points around the scan line
      ctx.fillStyle = '#0D99FF';
      for (let i = 0; i < edgePoints.length; i++) {
        const pt = edgePoints[i];
        const dist = Math.abs(pt.y - scanY);
        if (dist < 60) {
          const fade = (1 - dist / 60) * pt.alpha;
          ctx.fillStyle = `rgba(13, 153, 255, ${fade * 0.75})`;
          ctx.fillRect(pt.x, pt.y, 1.5, 1.5);
        }
      }

      // Sweeping Laser Wire
      if (scanProgress <= 1.0) {
        ctx.strokeStyle = 'rgba(13, 153, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.35, scanY);
        ctx.lineTo(width * 0.65, scanY);
        ctx.stroke();
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

