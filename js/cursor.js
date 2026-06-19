(function() {
  'use strict';

  var isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  // ── Dot cursor element (fast follower) ──
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  // ── Ring element (slow trailing follower) ──
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(ring);

  // ── State ──
  var mouseX = 0, mouseY = 0;
  var dotX = 0, dotY = 0;
  var ringX = 0, ringY = 0;

  // Smoothness factors (lerp): higher = snappier
  var DOT_SMOOTHNESS = 0.2;
  var RING_SMOOTHNESS = 0.1;

  // ── Mouse events ──
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!dot.classList.contains('is-visible')) {
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseleave', function() {
    dot.classList.remove('is-visible');
    ring.classList.remove('is-visible');
  });

  // Hover detection
  var hoverTargets = 'a, button, [role="button"], input, textarea, select, [data-magnetic]';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    }
  });

  // ── Animation loop ──
  function tick() {
    // Fast-following dot
    dotX += (mouseX - dotX) * DOT_SMOOTHNESS;
    dotY += (mouseY - dotY) * DOT_SMOOTHNESS;
    dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';

    // Slow-following ring
    ringX += (mouseX - ringX) * RING_SMOOTHNESS;
    ringY += (mouseY - ringY) * RING_SMOOTHNESS;
    ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
