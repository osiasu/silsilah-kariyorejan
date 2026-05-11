/* ═══════════════════════════════════════════════════════════════════
   MENU JAVASCRIPT — Fourmula.ai Fullscreen Overlay
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let isMenuOpen = false;
  let currentTheme = localStorage.getItem('trah_theme') || 'dark';

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMenu();
    initScrollProgress();
  });

  /* ── THEME ── */
  function initTheme() {
    applyTheme(currentTheme);
    document.querySelector('.header__theme')?.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('trah_theme', currentTheme);
    applyTheme(currentTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // Sync all theme icons (header + menu panel)
    document.querySelectorAll('.header__theme-night, .menu-theme-night').forEach(el => {
      el.style.display = theme === 'dark' ? 'flex' : 'none';
    });
    document.querySelectorAll('.header__theme-day, .menu-theme-day').forEach(el => {
      el.style.display = theme === 'light' ? 'flex' : 'none';
    });
  }

  /* ── SCROLL PROGRESS ── */
  function initScrollProgress() {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight <= 0 ? 0 : Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));
    const txt = pct + '%';
    document.querySelectorAll('.header__prc-txt, .menu-progress-pill').forEach(el => {
      el.textContent = txt;
    });
  }

  /* ── MENU ── */
  function initMenu() {
    if (!document.getElementById('menuOverlay')) createMenuHTML();

    const overlay = document.getElementById('menuOverlay');
    const menuBtn = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.menu-close-btn');

    menuBtn?.addEventListener('click', toggleMenu);
    closeBtn?.addEventListener('click', closeMenu);

    // Close when clicking the dark backdrop (outside the panel)
    overlay?.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    // Wire theme button inside menu panel
    document.querySelector('.menu-theme-btn')?.addEventListener('click', toggleTheme);

    setActiveMenuLink();
    updateProgress(); // fill progress pill in panel
  }

  function toggleMenu() {
    isMenuOpen ? closeMenu() : openMenu();
  }

  function openMenu() {
    isMenuOpen = true;
    const headerMenu = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.menu-close-btn');
    const overlay = document.getElementById('menuOverlay');

    headerMenu?.classList.add('open');
    closeBtn?.classList.add('open');

    const menuTxt = document.querySelector('.header__menu-txt');
    if (menuTxt) menuTxt.textContent = 'Close';

    overlay?.classList.add('open');
    document.body.classList.add('menu-open');

    triggerStaggerAnimation();
  }

  function triggerStaggerAnimation() {
    const primaryLinks = document.querySelectorAll('.menu-section.primary .menu-link');
    const secondaryLinks = document.querySelectorAll('.menu-section.secondary .menu-link');

    setTimeout(() => {
      primaryLinks.forEach((link, i) => {
        setTimeout(() => link.classList.add('is-visible'), i * 60);
      });

      secondaryLinks.forEach((link, i) => {
        setTimeout(() => link.classList.add('is-visible'), (primaryLinks.length + i) * 60);
      });
    }, 200);
  }

  function closeMenu() {
    isMenuOpen = false;
    const headerMenu = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.menu-close-btn');
    const overlay = document.getElementById('menuOverlay');
    const allLinks = document.querySelectorAll('.menu-link');

    headerMenu?.classList.remove('open');
    closeBtn?.classList.remove('open');

    const menuTxt = document.querySelector('.header__menu-txt');
    if (menuTxt) menuTxt.textContent = 'Menu';

    overlay?.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('hide-scrollbar');

    setTimeout(() => {
      allLinks.forEach(link => link.classList.remove('is-visible'));
    }, 400);
  }

  function setActiveMenuLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
      if (link.getAttribute('href') === page) link.classList.add('active');
    });
  }

  /* ── BUILD MENU HTML ── */
  function createMenuHTML() {
    const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none"><path d="M14.845 8.36965C14.7735 9.69243 14.3205 10.9662 13.5406 12.037C12.7607 13.1079 11.6874 13.9298 10.4503 14.4036C9.21321 14.8774 7.86538 14.9827 6.56972 14.7068C5.27407 14.431 4.08605 13.7857 3.14929 12.849C2.21253 11.9123 1.56714 10.7244 1.29113 9.42878C1.01511 8.13315 1.12029 6.78531 1.59395 5.54818C2.06762 4.31106 2.88948 3.23761 3.9602 2.45761C5.03092 1.67761 6.30465 1.22444 7.62741 1.1529C7.93599 1.13613 8.09752 1.50337 7.9337 1.7647C7.38581 2.64132 7.15121 3.67774 7.26818 4.70485C7.38515 5.73196 7.84679 6.6891 8.57776 7.42008C9.30873 8.15105 10.2659 8.61269 11.293 8.72966C12.3201 8.84662 13.3565 8.61203 14.2331 8.06413C14.4953 7.90033 14.8617 8.06108 14.845 8.36965Z" stroke="currentColor" stroke-width="1.71429" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const sunSVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="currentColor"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.className = 'menu-overlay';

    overlay.innerHTML = `
      <div id="menuPanel" class="menu-panel">

        <!-- Panel header — single pill matching the closed-state pill -->
        <div class="menu-header">
          <div class="menu-header-pill">
            <button class="menu-close-btn" aria-label="Tutup menu">
              <span class="menu-close-icon">
                <span class="menu-close-line is-top"></span>
                <span class="menu-close-line is-bottom"></span>
              </span>
              <span class="menu-close-txt">Close</span>
            </button>
            <div class="menu-header-spacer"></div>
            <button class="menu-theme-btn" aria-label="Ganti tema">
              <span class="menu-theme-night">${moonSVG}</span>
              <span class="menu-theme-day">${sunSVG}</span>
            </button>
            <div class="menu-progress-pill">0%</div>
          </div>
        </div>

        <!-- Nav content -->
        <div class="menu-content">
          <div class="menu-section primary">
            <div class="menu-section-title">Menu</div>
            <a href="dashboard.html"    class="menu-link">Beranda</a>
            <a href="introduction.html" class="menu-link">Pengenalan</a>
            <a href="biography.html"    class="menu-link">Biografi</a>
            <a href="index.html"        class="menu-link">Pohon Silsilah</a>
          </div>

          <div class="menu-divider"></div>

          <div class="menu-section secondary">
            <div class="menu-section-title">Other</div>
            <a href="request-list.html" class="menu-link"><span class="menu-icon">📋</span>Antrian Permintaan</a>
            <a href="attendance.html"   class="menu-link"><span class="menu-icon">📅</span>Kehadiran Keluarga</a>
            <a href="misc.html"         class="menu-link"><span class="menu-icon">⚙️</span>Lainnya</a>
          </div>
        </div>

        <!-- Social + footer -->
        <div class="menu-social">
          <div class="menu-social-title">Social media</div>
          <div class="menu-social-row">
            <div class="menu-social-links">
              <a href="https://www.instagram.com/masenorr" target="_blank" rel="noopener noreferrer" class="menu-social-link">
                <span>📷</span><span>Instagram</span>
              </a>
            </div>
            <div class="menu-footer-text">masenorr © 2025</div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);
  }

})();