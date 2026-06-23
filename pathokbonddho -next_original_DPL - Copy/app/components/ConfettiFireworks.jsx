"use client";
import { useEffect, useRef, useCallback } from 'react';

// ─── Pure Canvas Confetti – Fireworks ───────────────────────────────
// No external dependencies – works on every hosting platform (cPanel, Vercel, etc.)
// Uses clearRect (no dark overlay) so it's safe for popup ad contexts.

const COLORS = [
    '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00bfff',
    '#8a2be2', '#ff69b4', '#ffd700', '#ff5e7e', '#26ccff',
    '#a25afd', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff',
];

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createFireworkBurst(x, y, count = 40) {
    const particles = [];
    const burstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const useMultiColor = Math.random() > 0.5;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + randomBetween(-0.2, 0.2);
        const speed = randomBetween(5, 10);
        const color = useMultiColor
            ? COLORS[Math.floor(Math.random() * COLORS.length)]
            : burstColor;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: randomBetween(2, 4),
            gravity: 0.05,
            drag: 0.97,
            opacity: 1,
            fadeRate: randomBetween(0.008, 0.018),
            trail: [{ x, y }],
            trailMax: Math.floor(randomBetween(4, 8)),
            sparkle: Math.random() > 0.6,
        });
    }
    return particles;
}

function createRisingShell(canvasWidth, canvasHeight) {
    const x = randomBetween(canvasWidth * 0.1, canvasWidth * 0.9);
    const targetY = randomBetween(canvasHeight * 0.1, canvasHeight * 0.4);
    const startY = canvasHeight + 20;

    return {
        x,
        y: startY,
        targetY,
        vy: -randomBetween(8, 14),
        color: '#ffd700',
        size: 3,
        opacity: 1,
        isShell: true,
        trail: [{ x, y: startY }],
        trailMax: 10,
    };
}

function drawTrail(ctx, trail, color, opacity, lineWidth) {
    if (trail.length < 2) return;
    for (let i = 1; i < trail.length; i++) {
        const segmentOpacity = (i / trail.length) * opacity * 0.4;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = segmentOpacity;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
}

function drawDot(ctx, x, y, size, color, opacity, sparkle) {
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle glow
    if (sparkle && Math.random() > 0.5) {
        ctx.globalAlpha = opacity * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function ConfettiFireworks({ triggerOnLoad = true, duration = 5000 }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const shellsRef = useRef([]);
    const emitUntilRef = useRef(0);
    const lastShellTimeRef = useRef(0);

    const launchShell = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        shellsRef.current.push(createRisingShell(canvas.width, canvas.height));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            // Full clear each frame – no dark overlay residue
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = Date.now();
            const isEmitting = now < emitUntilRef.current;

            // Launch new shells periodically
            if (isEmitting && now - lastShellTimeRef.current > randomBetween(200, 500)) {
                launchShell();
                lastShellTimeRef.current = now;
            }

            // ── Update & draw shells ──
            shellsRef.current = shellsRef.current.filter((s) => {
                s.y += s.vy;
                s.vy *= 0.98;

                // Track trail
                s.trail.push({ x: s.x, y: s.y });
                if (s.trail.length > s.trailMax) s.trail.shift();

                // Draw trail + dot
                drawTrail(ctx, s.trail, s.color, s.opacity, s.size * 0.5);
                drawDot(ctx, s.x, s.y, s.size, s.color, s.opacity, false);

                // Explode when reaching target or slowing down
                if (s.y <= s.targetY || s.vy > -2) {
                    const burstCount = Math.floor(randomBetween(25, 50));
                    const burst = createFireworkBurst(s.x, s.y, burstCount);
                    particlesRef.current.push(...burst);
                    return false; // remove shell
                }
                return true;
            });

            // ── Update & draw burst particles ──
            particlesRef.current = particlesRef.current.filter((p) => {
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.fadeRate;

                // Track trail
                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > p.trailMax) p.trail.shift();

                // Draw trail + dot
                drawTrail(ctx, p.trail, p.color, p.opacity, p.size * 0.4);
                drawDot(ctx, p.x, p.y, p.size, p.color, p.opacity, p.sparkle);

                return p.opacity > 0.05;
            });

            // Reset globalAlpha
            ctx.globalAlpha = 1;

            // Keep animating while there's something to show
            if (particlesRef.current.length > 0 || shellsRef.current.length > 0 || isEmitting) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Final wipe – ensures no stray dot remains
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        if (triggerOnLoad) {
            emitUntilRef.current = Date.now() + duration;
            lastShellTimeRef.current = Date.now();
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particlesRef.current = [];
            shellsRef.current = [];
        };
    }, [triggerOnLoad, duration, launchShell]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}
