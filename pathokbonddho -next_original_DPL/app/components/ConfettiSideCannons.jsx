"use client";
import { useEffect, useRef } from 'react';
import * as confettiModule from 'canvas-confetti';

export default function ConfettiSideCannons({ triggerOnLoad = true, duration = 3000 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        
        const confetti = confettiModule.default || confettiModule;
        const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        });

        if (triggerOnLoad) {
            const end = Date.now() + duration;

            const frame = () => {
                myConfetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
                    zIndex: 9999
                });
                myConfetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
                    zIndex: 9999
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
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
