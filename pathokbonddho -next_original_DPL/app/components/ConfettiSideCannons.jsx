"use client";
import { useEffect, useRef, useCallback } from 'react';

// ─── Pure Canvas Confetti – Side Cannons ────────────────────────────
// No external dependencies – works on every hosting platform.

const COLORS = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticle(x, y, angle) {
    const rad = (angle * Math.PI) / 180;
    const speed = randomBetween(8, 15);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = randomBetween(4, 8);
    const shape = Math.random() > 0.5 ? 'rect' : 'circle';
    const rotation = randomBetween(0, 360);
    const rotationSpeed = randomBetween(-15, 15);

    return {
        x,
        y,
        vx: Math.cos(rad) * speed + randomBetween(-1, 1),
        vy: Math.sin(rad) * speed * -1 + randomBetween(-2, 0),
        color,
        size,
        shape,
        rotation,
        rotationSpeed,
        gravity: 0.12,
        drag: 0.98,
        opacity: 1,
        fadeRate: randomBetween(0.003, 0.008),
        wobble: randomBetween(0, 10),
        wobbleSpeed: randomBetween(0.05, 0.15),
    };
}

function drawParticle(ctx, p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

function updateParticle(p) {
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.gravity;
    p.x += p.vx + Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.wobble += p.wobbleSpeed;
    p.rotation += p.rotationSpeed;
    p.opacity -= p.fadeRate;
}

export default function ConfettiSideCannons({ triggerOnLoad = true, duration = 3000 }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);
    const emitUntilRef = useRef(0);

    const emit = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = canvas.width;
        const h = canvas.height;

        // Left cannon – shoot toward top-right
        for (let i = 0; i < 5; i++) {
            particlesRef.current.push(
                createParticle(0, h * 0.8, randomBetween(25, 70))
            );
        }

        // Right cannon – shoot toward top-left
        for (let i = 0; i < 5; i++) {
            particlesRef.current.push(
                createParticle(w, h * 0.8, randomBetween(110, 155))
            );
        }
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Emit new particles while within duration
            if (Date.now() < emitUntilRef.current) {
                emit();
            }

            // Update & draw
            particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);
            for (const p of particlesRef.current) {
                updateParticle(p);
                drawParticle(ctx, p);
            }

            // Keep animating while particles exist or still emitting
            if (particlesRef.current.length > 0 || Date.now() < emitUntilRef.current) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        if (triggerOnLoad) {
            emitUntilRef.current = Date.now() + duration;
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particlesRef.current = [];
        };
    }, [triggerOnLoad, duration, emit]);

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
