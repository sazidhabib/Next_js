"use client";
import { useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';

export default function ConfettiFireworks({ triggerOnLoad = true, duration = 5000 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const confetti = confettiModule.default || confettiModule;
        const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        });

        if (triggerOnLoad) {
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                
                myConfetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                myConfetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [triggerOnLoad, duration]);

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
                zIndex: 9999
            }}
        />
    );
}
