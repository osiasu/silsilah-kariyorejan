/* ═══════════════════════════════════════════════════════════════════
   SCROLL ANIMATIONS — GSAP + ScrollTrigger + Lenis
   Silsilah Trah Kariyorejan — Premium Motion Engine
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Reduced Motion Check ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all content immediately
    document.documentElement.classList.add('gsap-ready');
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('is-revealed');
    });
    document.querySelectorAll('.clip-reveal__inner').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  // ── Wait for GSAP + Lenis ──
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
    console.warn('[scroll-animations] GSAP, ScrollTrigger, or Lenis not loaded.');
    return;
  }

  // ── Register Plugins ──
  gsap.registerPlugin(ScrollTrigger);

  // ── Lenis Smooth Scroll ──
  const lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    orientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
  });

  // Sync Lenis → ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Connect to GSAP ticker
  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Expose lenis globally for per-page control
  window.__lenis = lenis;

  // ── Mark DOM ready for animations ──
  document.documentElement.classList.add('gsap-ready');

  // ── Scroll Position Restoration ──
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('scrollPos_' + location.pathname, String(lenis.scroll));
  });

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      var savedPos = sessionStorage.getItem('scrollPos_' + location.pathname);
      if (savedPos) {
        lenis.scrollTo(parseInt(savedPos), { immediate: true });
      }
    }
  });

  // ── Global Reveal System ──
  function initReveals() {
    var reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(function (el) {
      var direction = el.getAttribute('data-reveal');
      var delay = parseFloat(el.getAttribute('data-delay')) || 0;
      var duration = parseFloat(el.getAttribute('data-duration')) || 0.9;

      var props = {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        clearProps: 'will-change',
        onComplete: function () { el.classList.add('is-revealed'); },
      };

      // Direction-specific
      if (direction === 'up') props.y = 0;
      else if (direction === 'down') props.y = 0;
      else if (direction === 'left') props.x = 0;
      else if (direction === 'right') props.x = 0;
      else if (direction === 'scale') props.scale = 1;

      gsap.to(el, props);
    });
  }

  // ── Parallax System ──
  function initParallax() {
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    document.querySelectorAll('[data-speed]').forEach(function (el) {
      var speed = parseFloat(el.dataset.speed) || 0.5;
      var range = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--parallax-range')) || 120;

      gsap.to(el, {
        scrollTrigger: {
          trigger: el.closest('.parallax-scene') || el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: speed * range,
        ease: 'none',
      });
    });
  }

  // ── Image Scale Reveal ──
  function initImageReveals() {
    document.querySelectorAll('.scroll-image__inner').forEach(function (img) {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.closest('.scroll-image'),
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1,
        },
        scale: 1,
        ease: 'none',
      });
    });
  }

  // ── Image Expansion (width grow on scroll) ──
  function initImageExpansion() {
    document.querySelectorAll('.scroll-image--expand').forEach(function (el) {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 0.5,
        },
        width: '100%',
        borderRadius: 0,
        ease: 'none',
      });
    });
  }

  // ── Custom Cursor ──
  function initCursor() {
    var isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    var mouseX = 0, mouseY = 0;
    var dotX = 0, dotY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!dot.classList.contains('is-visible')) {
        dot.classList.add('is-visible');
      }
    });

    document.addEventListener('mouseleave', function () {
      dot.classList.remove('is-visible');
    });

    // Hover detection on interactive elements
    var hoverTargets = 'a, button, [role="button"], input, textarea, select, [data-magnetic]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add('is-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove('is-hover');
      }
    });

    // Smooth follow via GSAP ticker
    gsap.ticker.add(function () {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
    });
  }

  // ── Stagger Groups ──
  function initStaggerGroups() {
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      // Skip sections handled by bio-magnet.js (has its own per-char reveal)
      if (group.hasAttribute('data-magnet-split')) return;

      var children = group.children;
      var staggerVal = parseFloat(group.getAttribute('data-stagger')) || 0.1;

      gsap.from(children, {
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: staggerVal,
        ease: 'power3.out',
      });
    });
  }

  // ── Clip Reveals ──
  function initClipReveals() {
    document.querySelectorAll('.clip-reveal').forEach(function (wrapper) {
      var inner = wrapper.querySelector('.clip-reveal__inner');
      if (!inner) return;

      gsap.to(inner, {
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: '0%',
        duration: 0.9,
        ease: 'power3.out',
        onComplete: function () { inner.classList.add('is-revealed'); },
      });
    });
  }

  // ── Initialize All ──
  function init() {
    initReveals();
    initParallax();
    initImageReveals();
    initImageExpansion();
    // Cursor now handled by standalone cursor.js
    initStaggerGroups();
    initClipReveals();

    // Refresh ScrollTrigger after everything is set
    ScrollTrigger.refresh();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
