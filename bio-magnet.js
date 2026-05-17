/* ═══════════════════════════════════════════════════════════════════
   BIO-MAGNET — Text Splitter + Character Magnet Effect
   Silsilah Trah Kariyorejan — biography.html
   Dependencies: GSAP, ScrollTrigger, Anime.js (optional stagger)
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Guards ──
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[bio-magnet] GSAP or ScrollTrigger not loaded.');
    return;
  }

  // ── Config (reads CSS custom properties) ──
  var root = getComputedStyle(document.documentElement);
  var RADIUS = parseFloat(root.getPropertyValue('--magnet-radius')) || 80;
  var MAX_DISP = parseFloat(root.getPropertyValue('--magnet-displacement')) || 12;
  var RADIUS_SQ = RADIUS * RADIUS;

  // ── Target Section ──
  var section = document.querySelector('.bio-copy[data-magnet-split]');
  if (!section) return;

  var paragraphs = section.querySelectorAll('p');
  if (!paragraphs.length) return;

  // ══════════════════════════════════════════════════════════════════
  // TEXT SPLITTER
  // Splits each <p> into <span data-word> > <span data-char> structure
  // ══════════════════════════════════════════════════════════════════

  function splitText(el) {
    var text = el.textContent;
    var words = text.split(/(\s+)/); // preserve whitespace tokens
    var html = '';

    // Store original text for accessibility
    el.setAttribute('aria-label', text);

    words.forEach(function (word) {
      if (/^\s+$/.test(word)) {
        // Whitespace — single space char span
        html += '<span data-char data-whitespace aria-hidden="true"> </span>';
      } else {
        // Word wrapper for line-breaking
        html += '<span data-word>';
        for (var i = 0; i < word.length; i++) {
          html += '<span data-char aria-hidden="true">' + word[i] + '</span>';
        }
        html += '</span>';
      }
    });

    el.innerHTML = html;
  }

  // Split all paragraphs
  paragraphs.forEach(splitText);

  // Collect all char elements
  var chars = section.querySelectorAll('[data-char]');
  if (!chars.length) return;

  // ══════════════════════════════════════════════════════════════════
  // SCROLL REVEAL — Stagger entrance using Anime.js (with GSAP trigger)
  // ══════════════════════════════════════════════════════════════════

  // Set initial state
  section.classList.add('is-revealing');

  // Use Anime.js for stagger reveal if available, otherwise GSAP
  function revealChars() {
    section.classList.remove('is-revealing');

    if (typeof anime !== 'undefined') {
      // Anime.js stagger reveal
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: [18, 0],
        easing: 'easeOutExpo',
        duration: 600,
        delay: anime.stagger(15),
        complete: function () {
          onRevealComplete();
        }
      });
    } else {
      // Fallback: GSAP stagger
      gsap.fromTo(chars,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.015,
          ease: 'expo.out',
          onComplete: onRevealComplete
        }
      );
    }
  }

  function onRevealComplete() {
    section.classList.add('is-revealed');
    // Small delay before enabling magnet (let user see the settled text)
    setTimeout(function () {
      section.classList.add('is-magnetic');
      initMagnet();
    }, 300);
  }

  // ScrollTrigger to fire reveal when section enters viewport
  ScrollTrigger.create({
    trigger: section,
    start: 'top 85%',
    once: true,
    onEnter: revealChars
  });

  // ══════════════════════════════════════════════════════════════════
  // MAGNET EFFECT — rAF-driven cursor proximity repulsion
  // ══════════════════════════════════════════════════════════════════

  var charPositions = []; // cached {el, cx, cy} for each char
  var mouseX = 0, mouseY = 0;
  var isHovering = false;
  var rafId = null;

  function cachePositions() {
    charPositions = [];
    chars.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      charPositions.push({
        el: el,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height
      });
    });
  }

  function magnetLoop() {
    if (!isHovering) {
      rafId = null;
      return;
    }

    for (var i = 0; i < charPositions.length; i++) {
      var c = charPositions[i];

      // Skip whitespace chars
      if (c.el.hasAttribute('data-whitespace')) continue;

      var dx = c.cx - mouseX;
      var dy = c.cy - mouseY;
      var distSq = dx * dx + dy * dy;

      if (distSq < RADIUS_SQ && distSq > 0) {
        // Within radius — calculate repulsion
        var dist = Math.sqrt(distSq);
        var force = (1 - dist / RADIUS) * (1 - dist / RADIUS); // inverse square falloff
        var displaceX = (dx / dist) * force * MAX_DISP;
        var displaceY = (dy / dist) * force * MAX_DISP;

        c.el.style.transform = 'translate3d(' + displaceX.toFixed(1) + 'px,' + displaceY.toFixed(1) + 'px,0)';
      } else {
        // Outside radius — reset
        if (c.el.style.transform !== 'translate3d(0px,0px,0)' && c.el.style.transform !== '') {
          c.el.style.transform = 'translate3d(0,0,0)';
        }
      }
    }

    rafId = requestAnimationFrame(magnetLoop);
  }

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isHovering) {
      isHovering = true;
      section.classList.add('is-hovering');
      cachePositions(); // refresh positions on enter
      rafId = requestAnimationFrame(magnetLoop);
    }
  }

  function onMouseLeave() {
    isHovering = false;
    section.classList.remove('is-hovering');

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    // Reset all transforms (CSS transition handles smooth return)
    chars.forEach(function (el) {
      el.style.transform = '';
    });
  }

  function initMagnet() {
    // Cache initial positions
    cachePositions();

    // Recache on scroll/resize (debounced)
    var recacheTimer = null;
    function debouncedRecache() {
      clearTimeout(recacheTimer);
      recacheTimer = setTimeout(cachePositions, 150);
    }

    window.addEventListener('scroll', debouncedRecache, { passive: true });
    window.addEventListener('resize', debouncedRecache, { passive: true });

    // Mouse events on section
    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', onMouseLeave);
  }

})();
