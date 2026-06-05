# Silsilah Trah Kariyorejan — Agent Memory

## Project
Static genealogy site (family tree). Indonesian language. Pages: `tree.html` (main tree), `index.html` (configurable redirector → `dashboard.html`), `introduction.html`, `biography.html`, `attendance.html`, `request-list.html`, `misc.html`.

## Must-know
- **No build system** — pure HTML/CSS/JS. No npm, package.json, bundler.
- **Deploy**: GitHub Actions → `sed` replaces placeholders `__SUPABASE_URL__`, `__SUPABASE_KEY__`, `__ADMIN_PIN__`, `__GUEST_PIN__`, `__DEFAULT_PAGE__` in all `*.html`. **Never commit real credentials**.
- **Data**: Static CSV fallback in `js/data.js` (`window.CSV_DATA`). Supabase backend for live CRUD.
- **Theme**: `localStorage` key = `trah_theme`. CSS vars under `:root` / `[data-theme="light"]`. Logo swaps in `menu.js:30-34`.
- **Events**: Inline `onclick`/`oninput` in HTML, not delegated. Search in HTML for handlers.
- **Menu**: Fullscreen overlay built by `menu.js` IIFE — creates DOM via `createMenuHTML()`. Focus trap, stagger animation.
- **CDN deps**: GSAP, ScrollTrigger, Lenis (`scroll-animations.js`), Anime.js (`bio-magnet.js`), Google Fonts. Each page loads them individually.
- **Cursor**: `js/cursor.js` + `css/cursor.css` — standalone dot+trail. `mix-blend-mode: difference`. Hides on touch.
- **Header HTML** duplicated across all pages. No template — edit each file.
- **Mobile breakpoint**: 680px. Header height collapses from 56px → 48px, tab bar 62px → 56px.
- **`.opencode/`** is gitignored. OpenCode local config lives there.

## Danger zones
- `tree.html` (formerly `index.html`) is ~150KB with massive inline `<style>`. Don't reformat or move things without testing.
- `bio-magnet.js` has its own cursor code duplication (disabled — uses `cursor.js` instead).
- `scroll-animations.js` has another cursor init (commented out). Don't re-enable without removing the standalone one.
- Logo position switches DOM parent on resize < 680px (`menu.js:36-47`). Don't hardcode logo location.
- All pages use the same `menu.js` but have their own inline styles and scripts.

## Patterns
- CSS: BEM-lite. JS: IIFE wrappers, `'use strict'`. No modules/imports.
- Progress bar reads scroll, shows `0%`–`100%`. Pill in header + menu panel.
- Filter chips in `tree.html` use `data-gen` attribute. Tree view has zoom controls.
- Sheet UI pattern: overlay + centered modal with sheet-header/sheet-body.
- Admin mode: PIN overlay (8-digit), banner, FAB for add, edit/delete buttons in detail sheet.
- Request system: type selection → form → preview → submit to Supabase.

## Useful
- Dev test: open any `.html` directly in browser (file:// works, CORS handled by `data.js`).
- Before editing, check `js/menu.js` for shared behavior touched by all pages.

## Rules
- **Clarify before acting**: when given a task, present findings + proposed scope first. Ask if unclear. Don't assume or over-engineer.
- **Prefer the simplest approach that satisfies the requirement.** This codebase values clarity and minimalism over elegance.
- **Always create PR/MR** for every change. Direct push to `main` only when exact phrase **"push to main"** or **"push directly"** appears in user instruction. "commit push git" or "push" alone do NOT qualify.
- **When switching to `main`**: always run `git pull --ff-only` first to keep local up to date.

## Phase status
- **Phase 1 (Button redesign)**: ✅ Complete — pill radius, shelf shadow, active press, all pages consistent
- **Phase 2 (Transition unification)**: ⏸️ Pending
- **Phase 3 (Font option)**: ⏸️ Pending
- **Phase 4 (Layout polish)**: ⏸️ Pending
