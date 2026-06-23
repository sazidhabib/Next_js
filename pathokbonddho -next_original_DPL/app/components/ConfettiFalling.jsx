"use client";
import { useEffect, useRef } from 'react';

// Vibrant color palette for the papers
const COLORS = [
    '#ff2a6d', '#05d9e8', '#01f9c6', '#f3e5ab', '#ffa500', 
    '#ff00ff', '#9d00ff', '#39ff14', '#ff5e7e', '#88ff5a', 
    '#fcff42', '#ffa62d', '#ff36ff', '#1877f2', '#00d2fc'
];

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// Generates a single particle's initial properties
function createParticle(w, h, initial = false) {
    const size = randomBetween(8, 14);
    return {
        x: randomBetween(0, w),
        // If initial load, disperse vertically across screen; otherwise start above viewport
        y: initial ? randomBetween(-h, h) : randomBetween(-60, -10),
        vx: randomBetween(-1.2, 1.2),
        vy: randomBetween(1.8, 4.0),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        width: size,
        height: size * randomBetween(0.5, 0.8),
        shape: Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'ribbon'),
        rotation: randomBetween(0, 360),
        rotationSpeed: randomBetween(-3, 3),
        wobble: randomBetween(0, 2 * Math.PI),
        wobbleSpeed: randomBetween(0.015, 0.04),
        scaleX: 1
    };
}

function updateParticle(p) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.wobble) * 0.8;
    p.wobble += p.wobbleSpeed;
    p.rotation += p.rotationSpeed;
    // Oscillates scaleX between -1 and 1 for 3D flip illusion
    p.scaleX = Math.sin(p.wobble * 1.5);
}

function drawParticle(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.scale(p.scaleX, 1);
    ctx.fillStyle = p.color;

    if (p.shape === 'rect') {
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.width / 2, 0, Math.PI * 2);
        ctx.fill();
    } else { // ribbon
        ctx.fillRect(-p.width / 1.5, -p.height / 4, p.width * 1.3, p.height / 2);
    }

    ctx.restore();
}

export default function ConfettiFalling({ density = 75 }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);

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

        // Initialize particles scattered throughout viewport height
        particlesRef.current = Array.from({ length: density }, () => 
            createParticle(canvas.width, canvas.height, true)
        );

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width;
            const h = canvas.height;

            for (let i = 0; i < particlesRef.current.length; i++) {
                const p = particlesRef.current[i];
                updateParticle(p);

                // Recycle particle if it falls below bottom or drifts completely off-screen horizontally
                if (p.y > h + 20 || p.x < -30 || p.x > w + 30) {
                    particlesRef.current[i] = createParticle(w, h, false);
                }

                drawParticle(ctx, p);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particlesRef.current = [];
        };
    }, [density]);

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
