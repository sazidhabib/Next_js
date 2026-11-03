/**
 * Canvas Engine 01: Hero Interactive Particle Field (#particles)
 * 60-120 FPS high-density constellation with magnetic repulsion & spring dampening
 */

export function initHeroParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse coordinate state
  const mouse = { x: -9999, y: -9999, isHovering: false };
  let particles = [];
  let isVisible = true;
  let rafId = null;

  // Responsive device pixel ratio (capped at 2 for performance)
  function getDPR() {
    return Math.min(window.devicePixelRatio || 1, 2);
  }

  // Particle Constructor / Pool
  class Particle {
    constructor(w, h) {
      this.init(w, h, true);
    }

    init(w, h, randomPos = false) {
      this.originX = Math.random() * w;
      this.originY = Math.random() * h;
      this.x = randomPos ? this.originX : (Math.random() > 0.5 ? 0 : w);
      this.y = randomPos ? this.originY : (Math.random() > 0.5 ? 0 : h);
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = 0.8 + Math.random() * 1.6;
      this.baseAlpha = 0.15 + Math.random() * 0.45;
      this.alpha = this.baseAlpha;
      // Spring dampening state
      this.fx = 0;
      this.fy = 0;
    }

    update(w, h, m) {
      // Natural ambient drift
      this.originX += this.vx;
      this.originY += this.vy;

      // Wrap around bounds
      if (this.originX < 0) this.originX = w;
      if (this.originX > w) this.originX = 0;
      if (this.originY < 0) this.originY = h;
      if (this.originY > h) this.originY = 0;

      // Mouse repulsion physics
      const dx = this.x - m.x;
      const dy = this.y - m.y;
      const dist = Math.hypot(dx, dy);
      const repelDist = 130;

      if (dist < repelDist && dist > 0.1) {
        const force = (1 - dist / repelDist) * 8.0;
        this.fx += (dx / dist) * force;
        this.fy += (dy / dist) * force;
        this.alpha = Math.min(0.9, this.baseAlpha + (1 - dist / repelDist) * 0.5);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      // Spring pull back to origin
      const springK = 0.04;
      const damping = 0.88;

      this.fx += (this.originX - this.x) * springK;
      this.fy += (this.originY - this.y) * springK;

      this.fx *= damping;
      this.fy *= damping;

      this.x += this.fx;
      this.y += this.fy;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      context.fill();
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    width = parent.clientWidth;
    height = parent.clientHeight;
    dpr = getDPR();

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Density: roughly 1 particle per 10,000 px^2 (approx 80-140 particles on laptops)
    const count = Math.floor((width * height) / 10000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(width, height));
    }
  }

  // Pointer listeners
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isHovering = true;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.isHovering = false;
  });

  // RAF Animation Loop
  function loop() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Draw proximity lines between close particles
    const maxLinkDist = 75;
    ctx.lineWidth = 0.75;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update(width, height, mouse);
      p1.draw(ctx);

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < maxLinkDist) {
          const lineAlpha = (1 - dist / maxLinkDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  // IntersectionObserver to pause loop when scrolled away
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!rafId) rafId = requestAnimationFrame(loop);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  observer.observe(canvas);

  // Resize handler with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });

  // Initial setup
  resize();
  rafId = requestAnimationFrame(loop);
}

