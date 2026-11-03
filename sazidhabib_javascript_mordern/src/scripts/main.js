import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/animations.css';
import '../styles/components.css';
import '../styles/figma-sim.css';
import '../styles/works.css';

import { initCursor } from './cursor.js';
import { initSmoothScroll } from './lenis-scroll.js';
import { initHeroParticles } from './canvas/01-hero-particles.js';
import { initTerminatorHUD } from './canvas/02-terminator-hud.js';
import { initBlueprintScan } from './canvas/03-blueprint-scan.js';
import { initFigmaPlayground } from './figma-playground.js';
import { initWorksTilt } from './works-tilt.js';
import { initVectorPen } from './canvas/04-vector-pen.js';
import { initDotRipple } from './canvas/05-dot-ripple.js';
import { initFooterAssembler } from './canvas/06-footer-assembler.js';

// Ambient Orb mouse tracking
function initAmbientOrbs() {
  const o1 = document.getElementById('o1');
  const o2 = document.getElementById('o2');
  const o3 = document.getElementById('o3');
  if (!o1 || !o2 || !o3) return;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 80;
    my = (e.clientY / window.innerHeight - 0.5) * 80;
  }, { passive: true });

  function tick() {
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;

    o1.style.transform = `translate3d(${cx * 0.8}px, ${cy * 0.8}px, 0)`;
    o2.style.transform = `translate3d(${-cx * 0.6}px, ${-cy * 0.6}px, 0)`;
    o3.style.transform = `translate3d(${cx * 0.4}px, ${-cy * 0.4}px, 0)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Lifecycle Boot
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initSmoothScroll();
  initAmbientOrbs();
  initHeroParticles();
  initTerminatorHUD();
  initBlueprintScan();
  initFigmaPlayground();
  initWorksTilt();
  initVectorPen();
  initDotRipple();
  initFooterAssembler();
  console.log('⚡ All 8 Canvas & Interaction Engines initialized successfully!');
});
