/**
 * High-precision 3D Perspective Tilt & Specular Reflection Sheen
 * Calculates normalized mouse delta from center and updates CSS transform & coordinates
 */

export function initWorksTilt() {
  const cards = document.querySelectorAll('.work-card');

  cards.forEach(card => {
    let bounds = card.getBoundingClientRect();
    let isHovered = false;

    card.addEventListener('pointerenter', () => {
      isHovered = true;
      bounds = card.getBoundingClientRect();
    });

    card.addEventListener('pointermove', (e) => {
      if (!isHovered) return;

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Update specular sheen position
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);

      // 3D perspective angles (max 8 degrees tilt)
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      const rotateY = xPct * 12;
      const rotateX = -yPct * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      isHovered = false;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });

    // Update bounds on scroll/resize
    window.addEventListener('resize', () => {
      bounds = card.getBoundingClientRect();
    });
  });
}

