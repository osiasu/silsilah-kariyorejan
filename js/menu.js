/* ═══════════════════════════════════════════════════════════════════
   MENU JAVASCRIPT — Fourmula.ai Fullscreen Overlay
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  let isMenuOpen = false;
  let currentTheme = localStorage.getItem('trah_theme') || 'dark';
  let lastFocusedElement = null;
  let staggerTimers = [];
  const LOGO_DARK = 'https://res.cloudinary.com/dteeybsew/image/upload/v1778418213/logo-dark_qfsc2j.png';
  const LOGO_LIGHT = 'https://res.cloudinary.com/dteeybsew/image/upload/v1778418213/logo-light_jocjef.png';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderBehavior();
    initTheme();
    initMenu();
    initScrollProgress();
    initPageTransitions();
  });

  function initHeaderBehavior() {
    positionLogoForMobile();
    updateLogo();
    window.addEventListener('resize', positionLogoForMobile, { passive: true });
    new MutationObserver(updateLogo).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  function updateLogo() {
    const logoImg = document.querySelector('.logo-img');
    if (!logoImg) return;
    logoImg.src = currentTheme === 'dark' ? LOGO_DARK : LOGO_LIGHT;
  }

  function positionLogoForMobile() {
    const logoLink = document.querySelector('.logo-link');
    const headerLeft = document.querySelector('.header__left');
    const headerRight = document.querySelector('.header__right');
    if (!logoLink || !headerRight) return;

    if (window.innerWidth < 680) {
      headerRight.appendChild(logoLink);
    } else if (headerLeft) {
      headerLeft.appendChild(logoLink);
    }
  }

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
    updateLogo();
    
    // Update aria-label for theme button
    const themeBtn = document.querySelector('.header__theme');
    if (themeBtn) {
      const label = theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.removeAttribute('aria-pressed');
    }
    
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
    const doc = document.documentElement;
    const maxScroll = Math.max(0, doc.scrollHeight - doc.clientHeight);
    const progressEls = document.querySelectorAll('.header__prc, .menu-progress-pill');
    
    // Always show progress bar
    progressEls.forEach(el => { el.style.display = 'flex'; });

    const rawPct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    const pct = Number.isFinite(rawPct) ? Math.min(100, Math.max(0, Math.round(rawPct))) : 0;
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

    menuBtn?.setAttribute('aria-controls', 'menuOverlay');
    menuBtn?.setAttribute('aria-expanded', 'false');

    menuBtn?.addEventListener('click', toggleMenu);
    closeBtn?.addEventListener('click', closeMenu);

    // Close when clicking the dark backdrop (outside the panel)
    overlay?.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
      if (e.key === 'Tab' && isMenuOpen) trapFocus(e);
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
    lastFocusedElement = document.activeElement;
    const headerMenu = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.menu-close-btn');
    const overlay = document.getElementById('menuOverlay');

    headerMenu?.classList.add('open');
    headerMenu?.setAttribute('aria-expanded', 'true');
    closeBtn?.classList.add('open');

    const menuTxt = document.querySelector('.header__menu-txt');
    if (menuTxt) menuTxt.textContent = 'Close';

    overlay?.classList.add('open');
    document.body.classList.add('menu-open');

    triggerStaggerAnimation();
    requestAnimationFrame(() => closeBtn?.focus());
  }

  function triggerStaggerAnimation() {
    clearStaggerTimers();
    const primaryLinks = document.querySelectorAll('.menu-section.primary .menu-link');
    const secondaryLinks = document.querySelectorAll('.menu-section.secondary .menu-link');

    const startTimer = setTimeout(() => {
      primaryLinks.forEach((link, i) => {
        const timer = setTimeout(() => link.classList.add('is-visible'), i * 60);
        staggerTimers.push(timer);
      });

      secondaryLinks.forEach((link, i) => {
        const timer = setTimeout(() => link.classList.add('is-visible'), (primaryLinks.length + i) * 60);
        staggerTimers.push(timer);
      });
    }, 200);
    staggerTimers.push(startTimer);
  }

  function clearStaggerTimers() {
    staggerTimers.forEach(timer => clearTimeout(timer));
    staggerTimers = [];
  }

  function closeMenu() {
    isMenuOpen = false;
    const headerMenu = document.querySelector('.header__menu');
    const closeBtn = document.querySelector('.menu-close-btn');
    const overlay = document.getElementById('menuOverlay');
    const allLinks = document.querySelectorAll('.menu-link');

    clearStaggerTimers();
    headerMenu?.classList.remove('open');
    headerMenu?.setAttribute('aria-expanded', 'false');
    closeBtn?.classList.remove('open');

    const menuTxt = document.querySelector('.header__menu-txt');
    if (menuTxt) menuTxt.textContent = 'Menu';

    overlay?.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('hide-scrollbar');

    setTimeout(() => {
      allLinks.forEach(link => link.classList.remove('is-visible'));
    }, 400);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function trapFocus(e) {
    const panel = document.getElementById('menuPanel');
    if (!panel) return;
    const focusable = panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function setActiveMenuLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
      if (link.getAttribute('href') === page) link.classList.add('active');
    });
  }

  /* ── PAGE TRANSITIONS ── */
  function initPageTransitions() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link || !shouldTransitionLink(link, e)) return;

      e.preventDefault();
      closeMenuInstant();
      document.body.classList.add('page-leaving');

      setTimeout(() => {
        window.location.href = link.href;
      }, 220);
    });

    window.addEventListener('pageshow', function () {
      document.body.classList.remove('page-leaving');
    });
  }

  function shouldTransitionLink(link, event) {
    const url = new URL(link.href, window.location.href);
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

    if (isModifiedClick) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.hash) return false;
    if (!url.pathname.endsWith('.html') && url.pathname !== '/' && url.pathname !== '') return false;

    return url.href !== window.location.href;
  }

  function closeMenuInstant() {
    if (!isMenuOpen) return;

    isMenuOpen = false;
    clearStaggerTimers();

    document.querySelector('.header__menu')?.classList.remove('open');
    document.querySelector('.header__menu')?.setAttribute('aria-expanded', 'false');
    document.querySelector('.menu-close-btn')?.classList.remove('open');
    document.getElementById('menuOverlay')?.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('hide-scrollbar');

    const menuTxt = document.querySelector('.header__menu-txt');
    if (menuTxt) menuTxt.textContent = 'Menu';

    document.querySelectorAll('.menu-link').forEach(link => link.classList.remove('is-visible'));
  }

  /* ── BUILD MENU HTML ── */
  function createMenuHTML() {
    const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none"><path d="M14.845 8.36965C14.7735 9.69243 14.3205 10.9662 13.5406 12.037C12.7607 13.1079 11.6874 13.9298 10.4503 14.4036C9.21321 14.8774 7.86538 14.9827 6.56972 14.7068C5.27407 14.431 4.08605 13.7857 3.14929 12.849C2.21253 11.9123 1.56714 10.7244 1.29113 9.42878C1.01511 8.13315 1.12029 6.78531 1.59395 5.54818C2.06762 4.31106 2.88948 3.23761 3.9602 2.45761C5.03092 1.67761 6.30465 1.22444 7.62741 1.1529C7.93599 1.13613 8.09752 1.50337 7.9337 1.7647C7.38581 2.64132 7.15121 3.67774 7.26818 4.70485C7.38515 5.73196 7.84679 6.6891 8.57776 7.42008C9.30873 8.15105 10.2659 8.61269 11.293 8.72966C12.3201 8.84662 13.3565 8.61203 14.2331 8.06413C14.4953 7.90033 14.8617 8.06108 14.845 8.36965Z" stroke="currentColor" stroke-width="1.71429" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const sunSVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="currentColor"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
    const listSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="m3 6 1 1 2-2"/><path d="m3 12 1 1 2-2"/><path d="m3 18 1 1 2-2"/></svg>`;
    const calendarSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>`;
    const settingsSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.72l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const instagramSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><path d="M17.5 6.5h.01"/></svg>`;

    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    overlay.className = 'menu-overlay';

    overlay.innerHTML = `
      <div id="menuPanel" class="menu-panel" role="dialog" aria-modal="true" aria-label="Menu navigasi">

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
            <a href="request-list.html" class="menu-link"><span class="menu-icon">${listSVG}</span>Antrian Permintaan</a>
            <a href="attendance.html"   class="menu-link"><span class="menu-icon">${calendarSVG}</span>Kehadiran Keluarga</a>
            <a href="misc.html"         class="menu-link"><span class="menu-icon">${settingsSVG}</span>Newsletter</a>
          </div>
        </div>

        <!-- Social + footer -->
        <div class="menu-social">
          <div class="menu-social-title">Social media</div>
          <div class="menu-social-row">
            <div class="menu-social-links">
              <a href="https://www.instagram.com/masenorr" target="_blank" rel="noopener noreferrer" class="menu-social-link">
                ${instagramSVG}<span>Instagram</span>
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
