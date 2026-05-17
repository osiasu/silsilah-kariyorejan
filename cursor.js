(function() {
  'use strict';

  var isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch) return;

  // ── Dot cursor element ──
  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  // ── Canvas for trailing particles ──
  var canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Get computed color from CSS variable (adapts to light/dark) ──
  function getTrailColor() {
    var style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--gold-light').trim() || '#d4a55a';
  }

  // ── State ──
  var mouseX = 0, mouseY = 0;
  var dotX = 0, dotY = 0;
  var particles = [];
  var spawnTimer = 0;
  var SPAWN_INTERVAL = 3;
  var MAX_PARTICLES = 8;

  // ── Mouse events ──
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!dot.classList.contains('is-visible')) {
      dot.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseleave', function() {
    dot.classList.remove('is-visible');
  });

  // Hover detection
  var hoverTargets = 'a, button, [role="button"], input, textarea, select, [data-magnetic]';
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hover');
    }
  });

  // ── Particle class ──
  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1.5;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.02;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
  }

  // ── Animation loop ──
  function tick() {
    // Smooth follow
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    dot.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';

    // Spawn particles
    spawnTimer++;
    if (spawnTimer >= SPAWN_INTERVAL && particles.length < MAX_PARTICLES) {
      particles.push(new Particle(dotX, dotY));
      spawnTimer = 0;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get trail color (adapts to theme)
    var color = getTrailColor();

    // Update & draw particles as dots
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life * 0.7;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
