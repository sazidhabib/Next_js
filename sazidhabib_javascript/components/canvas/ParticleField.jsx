'use client';

import { useEffect, useRef, useCallback } from 'react';

function createParticle(canvasW, canvasH, driftSpeed = 0.35) {
  return {
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    vx: (Math.random() - 0.5) * driftSpeed,
    vy: (Math.random() - 0.5) * driftSpeed,
    baseRadius: 1.2 + Math.random() * 2.2,
    radius: 0,
    opacity: 0.35 + Math.random() * 0.55,
    pulseOffset: Math.random() * Math.PI * 2,
    isAccent: Math.random() > 0.6,
  };
}

const ParticleField = ({
  particleCount = 100,
  lineOpacity = 0.22,
  repulsionRadius = 140,
  repulsionStrength = 1.2,
  connectionDistance = 110,
  className = "absolute inset-0 w-full h-full pointer-events-none z-0",
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);
  const timeRef = useRef(0);

  const initParticles = useCallback((w, h) => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(w, h));
    }
    particlesRef.current = particles;
  }, [particleCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Sizing ---
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      } else {
        particlesRef.current.forEach((p) => {
          if (p.x > w) p.x = Math.random() * w;
          if (p.y > h) p.y = Math.random() * h;
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // --- Mouse tracking ---
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      ) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.active = true;
      } else {
        mouseRef.current.active = false;
      }
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // --- Animation loop ---
    const animate = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // --- Update particles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Magnetic mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulsionRadius && dist > 0) {
            const force = (1 - dist / repulsionRadius) * repulsionStrength;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Apply velocity with smooth damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Subtle constant drift
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < -15) p.x = w + 15;
        if (p.x > w + 15) p.x = -15;
        if (p.y < -15) p.y = h + 15;
        if (p.y > h + 15) p.y = -15;

        // Pulsing radius
        p.radius = p.baseRadius + Math.sin(t * 0.02 + p.pulseOffset) * 0.6;
      }

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // --- Draw constellation connections ---
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const rawAlpha = (1 - dist / connectionDistance) * lineOpacity;
            const alpha = isLight ? Math.min(rawAlpha * 1.8, 0.45) : rawAlpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            // Cyan/sky in dark, rich royal blue / indigo in light mode
            if (isLight) {
              ctx.strokeStyle = a.isAccent
                ? `rgba(2, 132, 199, ${alpha})`
                : `rgba(79, 70, 229, ${alpha})`;
            } else {
              ctx.strokeStyle = a.isAccent
                ? `rgba(56, 189, 248, ${alpha})`
                : `rgba(99, 102, 241, ${alpha})`;
            }
            ctx.lineWidth = isLight ? 0.9 : 0.8;
            ctx.stroke();
          }
        }
      }

      // --- Draw glowing particles ---
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const r = Math.max(p.radius, 0.8);

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        if (isLight) {
          if (p.isAccent) {
            gradient.addColorStop(0, `rgba(2, 132, 199, ${p.opacity * 0.75})`);
            gradient.addColorStop(0.5, `rgba(2, 132, 199, ${p.opacity * 0.25})`);
            gradient.addColorStop(1, `rgba(2, 132, 199, 0)`);
          } else {
            gradient.addColorStop(0, `rgba(71, 85, 105, ${p.opacity * 0.65})`);
            gradient.addColorStop(0.5, `rgba(99, 102, 241, ${p.opacity * 0.2})`);
            gradient.addColorStop(1, `rgba(99, 102, 241, 0)`);
          }
        } else {
          if (p.isAccent) {
            gradient.addColorStop(0, `rgba(56, 189, 248, ${p.opacity})`);
            gradient.addColorStop(0.5, `rgba(56, 189, 248, ${p.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(56, 189, 248, 0)`);
          } else {
            gradient.addColorStop(0, `rgba(165, 180, 252, ${p.opacity})`);
            gradient.addColorStop(0.5, `rgba(99, 102, 241, ${p.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(99, 102, 241, 0)`);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? p.isAccent
            ? '#0284c7'
            : '#475569'
          : p.isAccent
          ? '#ffffff'
          : '#c7d2fe';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [initParticles, lineOpacity, repulsionRadius, repulsionStrength, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
    />
  );
};

export { ParticleField };
export default ParticleField;
