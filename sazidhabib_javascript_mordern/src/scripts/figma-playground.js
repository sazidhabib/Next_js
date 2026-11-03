/**
 * Interactive Figma Workspace Playground Engine
 * Multiplayer simulated cursors, smart measurement distance guides, and live selection boxes
 */

export function initFigmaPlayground() {
  const container = document.getElementById('figmaWorkspace');
  const canvasArea = document.getElementById('figmaCanvasArea');
  const selectionBox = document.getElementById('fgSel');
  const dimensionsPill = document.getElementById('fgDim');
  const guideLineH = document.getElementById('fgGuideH');
  const guideLineV = document.getElementById('fgGuideV');
  const guidePillH = document.getElementById('fgGuidePillH');
  const guidePillV = document.getElementById('fgGuidePillV');

  if (!container || !canvasArea || !selectionBox) return;

  // 1. Interactive Elements Selection inside the Canvas
  const selectableItems = canvasArea.querySelectorAll('.fig-selectable');
  const layerRows = document.querySelectorAll('.figma-layer-row');
  let selectedElement = selectableItems[0] || null;

  function updateSelection(el) {
    if (!el) {
      selectionBox.classList.remove('active');
      return;
    }
    selectedElement = el;

    const areaRect = canvasArea.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const top = elRect.top - areaRect.top;
    const left = elRect.left - areaRect.left;
    const width = elRect.width;
    const height = elRect.height;

    selectionBox.style.top = `${top}px`;
    selectionBox.style.left = `${left}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    selectionBox.classList.add('active');

    if (dimensionsPill) {
      dimensionsPill.textContent = `${Math.round(width)} × ${Math.round(height)}`;
    }

    // Sync active layer row
    const layerId = el.getAttribute('data-layer');
    layerRows.forEach(row => {
      if (row.getAttribute('data-layer') === layerId) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });

    // Update inspector values
    const inspectW = document.getElementById('inspectW');
    const inspectH = document.getElementById('inspectH');
    const inspectX = document.getElementById('inspectX');
    const inspectY = document.getElementById('inspectY');
    if (inspectW) inspectW.textContent = Math.round(width);
    if (inspectH) inspectH.textContent = Math.round(height);
    if (inspectX) inspectX.textContent = Math.round(left);
    if (inspectY) inspectY.textContent = Math.round(top);
  }

  selectableItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSelection(item);
    });

    item.addEventListener('pointerenter', () => {
      if (item !== selectedElement && selectedElement) {
        showDistanceGuides(selectedElement, item);
      }
    });

    item.addEventListener('pointerleave', () => {
      hideDistanceGuides();
    });
  });

  // Layer list clicks
  layerRows.forEach(row => {
    row.addEventListener('click', () => {
      const targetId = row.getAttribute('data-layer');
      const targetEl = canvasArea.querySelector(`[data-layer="${targetId}"]`);
      if (targetEl) {
        updateSelection(targetEl);
      }
    });
  });

  // Click outside to deselect or select artboard
  canvasArea.addEventListener('click', (e) => {
    if (e.target === canvasArea) {
      const artboard = canvasArea.querySelector('.figma-artboard');
      updateSelection(artboard);
    }
  });

  // 2. Smart Measurement Distance Guides (#fgHov)
  function showDistanceGuides(source, target) {
    if (!guideLineH || !guideLineV) return;

    const areaRect = canvasArea.getBoundingClientRect();
    const sRect = source.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    // Check vertical distance
    if (tRect.top >= sRect.bottom) {
      const distV = Math.round(tRect.top - sRect.bottom);
      const centerX = Math.min(sRect.left + sRect.width / 2, tRect.left + tRect.width / 2) - areaRect.left;
      guideLineV.style.left = `${centerX}px`;
      guideLineV.style.top = `${sRect.bottom - areaRect.top}px`;
      guideLineV.style.height = `${distV}px`;
      guideLineV.style.display = 'flex';
      if (guidePillV) guidePillV.textContent = `${distV}px`;
    } else {
      guideLineV.style.display = 'none';
    }

    // Check horizontal distance
    if (tRect.left >= sRect.right) {
      const distH = Math.round(tRect.left - sRect.right);
      const centerY = Math.min(sRect.top + sRect.height / 2, tRect.top + tRect.height / 2) - areaRect.top;
      guideLineH.style.top = `${centerY}px`;
      guideLineH.style.left = `${sRect.right - areaRect.left}px`;
      guideLineH.style.width = `${distH}px`;
      guideLineH.style.display = 'flex';
      if (guidePillH) guidePillH.textContent = `${distH}px`;
    } else {
      guideLineH.style.display = 'none';
    }
  }

  function hideDistanceGuides() {
    if (guideLineH) guideLineH.style.display = 'none';
    if (guideLineV) guideLineV.style.display = 'none';
  }

  // 3. Autonomous Multiplayer Collaborator Cursors (#fgMs)
  const collaborators = [
    {
      id: 'c1',
      name: 'Sarah (Product)',
      color: '#A259FF',
      el: document.getElementById('curSarah'),
      x: 120, y: 150,
      targetX: 180, targetY: 220,
      speed: 0.04
    },
    {
      id: 'c2',
      name: 'Alex (Lead Dev)',
      color: '#FF6E28',
      el: document.getElementById('curAlex'),
      x: 320, y: 280,
      targetX: 240, targetY: 180,
      speed: 0.03
    }
  ];

  function moveCollaborators() {
    const areaW = canvasArea.clientWidth;
    const areaH = canvasArea.clientHeight;

    collaborators.forEach(c => {
      if (!c.el) return;

      // Pick new target if close
      if (Math.hypot(c.x - c.targetX, c.y - c.targetY) < 10) {
        c.targetX = 60 + Math.random() * (areaW - 120);
        c.targetY = 60 + Math.random() * (areaH - 120);
      }

      c.x += (c.targetX - c.x) * c.speed;
      c.y += (c.targetY - c.y) * c.speed;

      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
    });

    requestAnimationFrame(moveCollaborators);
  }

  requestAnimationFrame(moveCollaborators);

  // 4. Tool buttons toggling
  const toolButtons = document.querySelectorAll('.figma-tool-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Initial selection
  setTimeout(() => {
    const defaultSelect = canvasArea.querySelector('.mockup-balance-card');
    if (defaultSelect) updateSelection(defaultSelect);
  }, 100);

  window.addEventListener('resize', () => {
    if (selectedElement) updateSelection(selectedElement);
  });
}

