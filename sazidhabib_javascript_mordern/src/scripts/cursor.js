/**
 * High-performance Magnetic Cursor & Dynamic State Engine
 * Follows mouse with lerp dampening, 0ms input lag
 */

export function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  const mouse = { x: -100, y: -100 };
  const pos = { x: -100, y: -100 };
  const dotPos = { x: -100, y: -100 };
  let isMoving = false;
  let targetMagnetic = null;

  // Show cursor on initial movement
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!isMoving) {
      document.body.classList.add('has-cursor');
      isMoving = true;
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    document.body.classList.remove('has-cursor');
    isMoving = false;
  });

  // Check hover targets for interactive states
  const interactives = document.querySelectorAll('a, button, .interactive, .btn-primary, .btn-secondary, .nav-status');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      targetMagnetic = el;
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      targetMagnetic = null;
    });
  });

  // RAF Lerp Loop
  function renderCursor() {
    let targetX = mouse.x;
    let targetY = mouse.y;

    if (targetMagnetic) {
      const rect = targetMagnetic.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // Subtle magnetic pull toward button center
      targetX = targetX + (centerX - targetX) * 0.35;
      targetY = targetY + (centerY - targetY) * 0.35;
    }

    // Smooth lerp
    pos.x += (targetX - pos.x) * 0.16;
    pos.y += (targetY - pos.y) * 0.16;

    dotPos.x += (mouse.x - dotPos.x) * 0.65;
    dotPos.y += (mouse.y - dotPos.y) * 0.65;

    cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

