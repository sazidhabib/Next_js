/**
 * Food Ordering System - Universal Website Modal Widget
 * Embeddable ordering button and modal popup script for external websites (WordPress, Wix, Squarespace, Webflow, Shopify, Custom HTML)
 */
(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__FOOD_ORDERING_WIDGET_LOADED__) return;
  window.__FOOD_ORDERING_WIDGET_LOADED__ = true;

  // Determine current script tag and base host URL
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('widget.js') !== -1) {
          return scripts[i];
        }
      }
      return null;
    })();

  var baseUrl = '';
  if (currentScript && currentScript.src) {
    var a = document.createElement('a');
    a.href = currentScript.src;
    baseUrl = a.protocol + '//' + a.host;
  } else {
    baseUrl = window.location.origin;
  }

  // Configuration options from script data attributes
  var defaultSlug = currentScript ? currentScript.getAttribute('data-restaurant') : '';
  var floatingPosition = currentScript ? currentScript.getAttribute('data-floating') : null;
  var buttonText = (currentScript && currentScript.getAttribute('data-text')) || 'Order Online';
  var primaryColor = (currentScript && currentScript.getAttribute('data-color')) || '#ea580c';

  // Modal State & DOM elements
  var overlayEl = null;
  var modalEl = null;
  var iframeEl = null;
  var spinnerEl = null;
  var isOpen = false;
  var previousBodyOverflow = '';

  // Ensure CSS Styles are injected
  function injectStyles() {
    if (document.getElementById('fow-widget-styles')) return;

    var style = document.createElement('style');
    style.id = 'fow-widget-styles';
    style.innerHTML = [
      '/* Food Ordering System Widget Styles */',
      '.fow-overlay {',
      '  position: fixed;',
      '  top: 0; left: 0; width: 100vw; height: 100vh;',
      '  background: rgba(0, 0, 0, 0.25);',
      '  backdrop-filter: blur(1.5px);',
      '  -webkit-backdrop-filter: blur(1.5px);',
      '  z-index: 9999999;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  opacity: 0;',
      '  pointer-events: none;',
      '  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);',
      '  padding: 16px;',
      '  box-sizing: border-box;',
      '}',
      '.fow-overlay.fow-active {',
      '  opacity: 1;',
      '  pointer-events: auto;',
      '}',
      '.fow-modal-container {',
      '  width: 100%;',
      '  max-width: 1080px;',
      '  height: 90vh;',
      '  background: #0f172a;',
      '  border-radius: 20px;',
      '  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12);',
      '  display: flex;',
      '  flex-direction: column;',
      '  overflow: hidden;',
      '  position: relative;',
      '  transform: scale(0.96) translateY(8px);',
      '  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);',
      '}',
      '.fow-overlay.fow-active .fow-modal-container {',
      '  transform: scale(1) translateY(0);',
      '}',
      '.fow-close-btn {',
      '  position: absolute;',
      '  top: 14px;',
      '  right: 14px;',
      '  z-index: 50;',
      '  width: 34px;',
      '  height: 34px;',
      '  border-radius: 10px;',
      '  background: rgba(15, 23, 42, 0.85);',
      '  border: 1px solid rgba(255, 255, 255, 0.2);',
      '  color: #ffffff;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  font-size: 18px;',
      '  font-weight: bold;',
      '  cursor: pointer;',
      '  transition: all 0.2s ease;',
      '  line-height: 1;',
      '}',
      '.fow-close-btn:hover {',
      '  background: #ea580c;',
      '  border-color: #ea580c;',
      '  transform: scale(1.08);',
      '}',
      '.fow-spinner-container {',
      '  position: absolute;',
      '  top: 0; left: 0; width: 100%; height: 100%;',
      '  display: flex;',
      '  flex-direction: column;',
      '  align-items: center;',
      '  justify-content: center;',
      '  background: #0f172a;',
      '  color: #94a3b8;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '  gap: 12px;',
      '  z-index: 20;',
      '  transition: opacity 0.3s ease;',
      '}',
      '.fow-spinner {',
      '  width: 38px;',
      '  height: 38px;',
      '  border: 3px solid rgba(234, 88, 12, 0.25);',
      '  border-top-color: #ea580c;',
      '  border-radius: 50%;',
      '  animation: fow-spin 0.8s linear infinite;',
      '}',
      '@keyframes fow-spin { to { transform: rotate(360deg); } }',
      '.fow-iframe {',
      '  width: 100%;',
      '  height: 100%;',
      '  border: none;',
      '  background: #f8fafc;',
      '  position: relative;',
      '  z-index: 10;',
      '}',
      '/* Responsive Mobile Fullscreen */',
      '@media (max-width: 640px) {',
      '  .fow-overlay { padding: 0; }',
      '  .fow-modal-container {',
      '    height: 100vh;',
      '    max-width: 100vw;',
      '    border-radius: 0;',
      '  }',
      '  .fow-close-btn { top: 12px; right: 12px; }',
      '}',
      '/* Optional Floating Action Button */',
      '.fow-floating-btn {',
      '  position: fixed;',
      '  z-index: 999999;',
      '  bottom: 24px;',
      '  right: 24px;',
      '  background: ' + primaryColor + ';',
      '  color: #ffffff;',
      '  padding: 14px 22px;',
      '  border-radius: 9999px;',
      '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      '  font-size: 15px;',
      '  font-weight: 800;',
      '  border: none;',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 10px;',
      '  box-shadow: 0 10px 25px -5px rgba(234, 88, 12, 0.5), 0 8px 10px -6px rgba(234, 88, 12, 0.3);',
      '  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;',
      '}',
      '.fow-floating-btn:hover {',
      '  transform: translateY(-3px) scale(1.03);',
      '  box-shadow: 0 16px 30px -5px rgba(234, 88, 12, 0.6);',
      '}',
      '.fow-floating-btn.fow-float-left { left: 24px; right: auto; }',
    ].join('\n');

    document.head.appendChild(style);
  }

  // Build the Modal DOM structure
  function createModalDOM() {
    if (overlayEl) return;

    overlayEl = document.createElement('div');
    overlayEl.className = 'fow-overlay';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');

    modalEl = document.createElement('div');
    modalEl.className = 'fow-modal-container';

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'fow-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close Online Ordering Modal');
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      closeModal();
    };

    // Spinner
    spinnerEl = document.createElement('div');
    spinnerEl.className = 'fow-spinner-container';
    spinnerEl.innerHTML = '<div class="fow-spinner"></div><span style="font-size:13px; font-weight:600;">Loading Ordering Menu...</span>';

    // Iframe
    iframeEl = document.createElement('iframe');
    iframeEl.className = 'fow-iframe';
    iframeEl.setAttribute('allow', 'payment *; camera *; geolocation *');
    iframeEl.onload = function () {
      if (spinnerEl) spinnerEl.style.opacity = '0';
      setTimeout(function () {
        if (spinnerEl) spinnerEl.style.display = 'none';
      }, 300);
    };

    modalEl.appendChild(closeBtn);
    modalEl.appendChild(spinnerEl);
    modalEl.appendChild(iframeEl);
    overlayEl.appendChild(modalEl);

    // Close on clicking backdrop outside container
    overlayEl.onclick = function (e) {
      if (e.target === overlayEl) {
        closeModal();
      }
    };

    document.body.appendChild(overlayEl);
  }

  // Open the Modal
  function openModal(slug) {
    var targetSlug = slug || defaultSlug || 'bellavista-pizza';
    injectStyles();
    createModalDOM();

    if (spinnerEl) {
      spinnerEl.style.display = 'flex';
      spinnerEl.style.opacity = '1';
    }

    var embedUrl = baseUrl + '/embed/' + encodeURIComponent(targetSlug);
    if (iframeEl.src !== embedUrl) {
      iframeEl.src = embedUrl;
    }

    overlayEl.classList.add('fow-active');
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    isOpen = true;
  }

  // Close the Modal
  function closeModal() {
    if (!overlayEl || !isOpen) return;
    overlayEl.classList.remove('fow-active');
    document.body.style.overflow = previousBodyOverflow || '';
    isOpen = false;
  }

  // Setup click listeners for any button or link
  function setupListeners() {
    document.addEventListener('click', function (e) {
      var target = e.target;
      var trigger = null;

      while (target && target !== document) {
        if (
          target.hasAttribute &&
          (target.hasAttribute('data-gl-restaurant') ||
            target.hasAttribute('data-restaurant') ||
            target.hasAttribute('data-order-modal') ||
            (target.className &&
              typeof target.className === 'string' &&
              (target.className.indexOf('gl-order-btn') !== -1 ||
                target.className.indexOf('food-order-btn') !== -1)))
        ) {
          trigger = target;
          break;
        }

        // Also check if an anchor link points to a menu or embed page
        if (target.tagName === 'A' && target.href) {
          if (target.href.indexOf('/menu/') !== -1 || target.href.indexOf('/embed/') !== -1) {
            trigger = target;
            break;
          }
        }

        target = target.parentNode;
      }

      if (trigger) {
        e.preventDefault();
        e.stopPropagation();

        var slug =
          trigger.getAttribute('data-restaurant') ||
          trigger.getAttribute('data-gl-restaurant') ||
          trigger.getAttribute('data-order-modal');

        if (!slug && trigger.tagName === 'A' && trigger.href) {
          var match = trigger.href.match(/\/(menu|embed)\/([a-zA-Z0-9_-]+)/);
          if (match && match[2]) {
            slug = match[2];
          }
        }

        openModal(slug);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    });

    // Listen for postMessage from embedded iframe
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'CLOSE_FOOD_ORDERING_MODAL') {
        closeModal();
      }
    });
  }

  // Create optional floating action button
  function createFloatingButton() {
    if (!floatingPosition) return;

    injectStyles();
    var btn = document.createElement('button');
    btn.className = 'fow-floating-btn';
    if (floatingPosition === 'bottom-left' || floatingPosition === 'left') {
      btn.className += ' fow-float-left';
    }

    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>' +
      '</svg><span>' +
      buttonText +
      '</span>';

    btn.onclick = function () {
      openModal(defaultSlug);
    };

    document.body.appendChild(btn);
  }

  // Initialize on load
  function init() {
    injectStyles();
    setupListeners();
    createFloatingButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.FoodOrderingModal = {
    open: openModal,
    close: closeModal,
    isOpen: function () {
      return isOpen;
    },
  };
  window.GloriaFoodWidget = window.FoodOrderingModal;
})();
