# Silsilah Trah Kariyorejan — Agent Memory

## Project
Static genealogy site (family tree). Indonesian language. Pages: `index.html` (main tree), `dashboard.html`, `introduction.html`, `biography.html`, `attendance.html`, `request-list.html`, `misc.html`.

## Must-know
- **No build system** — pure HTML/CSS/JS. No npm, package.json, bundler.
- **Deploy**: GitHub Actions → `sed` replaces placeholders `__SUPABASE_URL__`, `__SUPABASE_KEY__`, `__ADMIN_PIN__`, `__GUEST_PIN__` in all `*.html`. **Never commit real credentials**.
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
- `index.html` is ~150KB with massive inline `<style>`. Don't reformat or move things without testing.
- `bio-magnet.js` has its own cursor code duplication (disabled — uses `cursor.js` instead).
- `scroll-animations.js` has another cursor init (commented out). Don't re-enable without removing the standalone one.
- Logo position switches DOM parent on resize < 680px (`menu.js:36-47`). Don't hardcode logo location.
- All pages use the same `menu.js` but have their own inline styles and scripts.

## Patterns
- CSS: BEM-lite. JS: IIFE wrappers, `'use strict'`. No modules/imports.
- Progress bar reads scroll, shows `0%`–`100%`. Pill in header + menu panel.
- Filter chips in `index.html` use `data-gen` attribute. Tree view has zoom controls.
- Sheet UI pattern: overlay + centered modal with sheet-header/sheet-body.
- Admin mode: PIN overlay (8-digit), banner, FAB for add, edit/delete buttons in detail sheet.
- Request system: type selection → form → preview → submit to Supabase.

## Useful
- Dev test: open any `.html` directly in browser (file:// works, CORS handled by `data.js`).
- Before editing, check `js/menu.js` for shared behavior touched by all pages.

## Session 2026-06-02 — Dashboard + Introduction polish

### dashboard.html
- **Built out** from placeholder (cover image only) → full homepage
- Sections: hero welcome, cover image (280px), 4 stat cards (Supabase live), 6 nav cards
- Stats fetched from Supabase `members` table: total, generasi, gender breakdown
- Cards follow same gold/surface theme, hover lift effects, responsive grid
- IIFE pattern, zero inline handlers

### introduction.html
- Added `transition` + hover effect on `.intro-card` (border glow + shadow lift)
- Extracted inline `<p style="...">` → `.closing-salam` CSS class
- Added missing `-ms-overflow-style: none` on `<html>` (IE consistency)
- `padding: 1rem 1rem` → `padding: 1rem` shorthand
- Mobile breakpoint `640px` → `680px` (project standard)
- Removed extra blank line

### Supabase credentials (committed live, not placeholders)
- All pages use real creds directly: `https://lckowkndmwiadwifilsv.supabase.co`
- Key in: `attendance.html`, `request-list.html`, `dashboard.html`
- Tables: `members`, `events`, `attendance`, `spouses`, `data_requests`

## Session 2026-06-02b — Biography + Misc cleanup

### biography.html
- Separated `<meta>` tags (were on same line with `/>`)
- Mobile breakpoint `560px` → `680px` (project standard)
- Adjusted mobile `.bio-title` from `1.55rem` → `1.35rem`; mobile `.bio-copy` now uses `clamp` sizing instead of redundant `text-align/line-height`
- Removed extra blank line after `<body>`

### misc.html
- Expanded theme script from one-liner to multi-line IIFE (matches other pages)
- Mobile breakpoint `820px` → `680px` (project standard)
- No functional changes

## Rules
- **Clarify before acting**: when given a task, present findings + proposed scope first. Ask if unclear. Don't assume or over-engineer.

### Git
- Active branch: `release/20260602-credential-safety`
- Remote: `https://github.com/osiasu/silsilah-kariyorejan.git`
