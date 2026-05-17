"use client";
import { useEffect } from 'react';
export default function ConfettiFireworks({ triggerOnLoad = true, duration = 5000 }) {
    useEffect(() => {
        if (triggerOnLoad) {
            triggerFireworks();
        }
    }, [triggerOnLoad]);

    const triggerFireworks = async () => {
        const confetti = (await import('canvas-confetti')).default;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    return null; // Hidden component
}
