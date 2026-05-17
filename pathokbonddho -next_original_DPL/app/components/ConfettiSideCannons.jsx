"use client";
import { useEffect } from 'react';
export default function ConfettiSideCannons({ triggerOnLoad = true, duration = 3000 }) {
    useEffect(() => {
        if (triggerOnLoad) {
            triggerSideCannons();
        }
    }, [triggerOnLoad]);

    const triggerSideCannons = async () => {
        const confetti = (await import('canvas-confetti')).default;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    };

    return null; // Hidden component
}
