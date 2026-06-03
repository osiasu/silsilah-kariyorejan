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
- **When switching to `main`**: always run `git pull --ff-only` first to keep local up to date.

## Session 2026-06-02c — Attendance + Request-list audit

### attendance.html
- ~1645 lines. IIFE, `'use strict'`. Inline `onclick` on attendance-header toggle + event delegation for `.attendance-action`
- **Person picker**: custom combobox (keyboard nav, member/spouse groups, localStorage `attendance_person`)
- **Current event**: date===today + status ongoing, hero card with absen button, countdown badge
- **Upcoming events**: horizontal scroll snap, RSVP buttons, countdown labels refresh every 60s
- **Charts**: Chart.js CDN (bar/donut/line). Donut has `::before`/`::after` 3D glow. Tab switching destroys & recreates line chart to fix mobile resize
- **Attendance list**: paginated (10), expand/collapse per event with attendee grid, search by title/location/attendee name
- **Admin**: PIN overlay (8-digit), cookie `trah_attendance_admin` (30d), CRUD events via modal, delete cascades attendance rows
- **Offline**: localStorage cache `attendance_cache` fallback on fetch failure
- **Mobile breakpoint**: `767px` (not 680px — intentional deviation)
- **Danger**: duplicate `crossAlign: 'far'` on bar chart y-axis ticks (line 1170-1171); duplicate `mouseenter`/`mouseleave` mapping in `deleteEvent`
- **Credentials**: live Supabase (not placeholders)

### request-list.html
- ~610 lines. Globals + inline `onclick` (no IIFE). PIN gate before content renders
- **Access gate**: two tabs (guest/admin), accepts either PIN, cookie `trah_auth` (30d)
- **Status filter tabs**: all/pending/in_progress/completed/rejected + refresh button
- **Auto-load more**: scroll-based (160px offset, 350ms debounce), sentinel dots
- **Detail modal**: preview grid with dynamic field rendering, action buttons conditional on `isAdmin`
- **Admin actions**: approve (writes to `members`/`spouses` table + sets completed), reject, delete, in_progress
- **Request types**: `add_member`, `add_spouse`, `update_member`, `update_spouse` — each maps to different Supabase POST/PATCH
- **Data flow**: `nullify` helper converts empty strings → null to avoid DB constraint violations
- **Pending badge**: `updatePendingBadge()` fetches pending count, updates `#navPendingBadge`
- **Credentials**: live Supabase (not placeholders). Uses both `ADMIN_PIN` and `GUEST_PIN`
- **Danger**: `load-more-sentinel` always burns visible even when no more data (conditional render only checks `> PAGE_SIZE` for "done" message but not 0 remaining); `getFilteredRequests()` called multiple times per render cycle (can optimize)

## Session 2026-06-02d — Code clean-up attendance + request-list

### attendance.html
- **Meta tags**: split inline `<meta />` onto separate lines (project standard)
- **CSS dedup**: removed duplicate `.attendance-count` and `.attendance-detail-inner` (second override was canonical)
- **Chart ticks**: removed duplicate `crossAlign: 'far'` in bar chart y-axis config (line 1170-1171)

### request-list.html
- **Meta tags**: split inline `<meta />` onto separate lines (project standard)
- **IIFE + strict mode**: wrapped entire script block in IIFE with `'use strict'`; exposed 14 functions (`switchPinTab`, `confirmGate`, `setFilter`, `loadAndRender`, `toggleAdminUpgrade`, `confirmAdminPin`, `closePinOverlay`, `openDetail`, `closeDetail`, `deleteRequest`, `updateStatus`, `rejectRequest`, `approveRequest`, `logoutAdmin`) via `window.*` for inline onclick handlers. Matches project convention (other pages use IIFE pattern).
- **Filter cache**: `getFilteredRequests()` now uses `_filteredCache` (invalidated in `loadAndRender()` and `setFilter()`), eliminating redundant array filtering when `handleAutoLoadScroll` + `autoLoadMore` fire in the same paint cycle (was up to 3x per frame).
- **Sentinel done message**: changed `filtered.length > PAGE_SIZE` → `_visibleLimit >= PAGE_SIZE` so "Semua permintaan sudah ditampilkan." appears when exactly PAGE_SIZE items are shown (was missing for 10 items exactly).

## Session 2026-06-02e — Dashboard generasi fix + index.html code clean-up

### dashboard.html
- **Fixed generasi stat**: added `nullslast` to `ORDER BY generasi.desc.nullslast` + `deleted_at=is.null` filter. Bug: null row returned first under `DESC NULLS FIRST` default, dashboard showed `0` instead of `5`.
- Verified via curl: query now correctly returns `generasi: "5"`.

### index.html code clean-up
- ~3587 lines. Massive inline `<style>` (~1148 lines) + JS (~2163 lines).
- **Removed**: dead CSS `#searchBox:not(:placeholder-shown) ~ #clearBtn` (JS always overrides via inline style)
- **Removed**: duplicate `.clickable-name` block (second instance at old line 461)
- **Removed**: duplicate `.filter-chip` block (first instance, completely overridden by second)
- **Removed**: duplicate `#filterBar::-webkit-scrollbar` (redundant)
- **Removed**: duplicate `@keyframes spin` (second identical instance)
- **Removed**: unused `const searchFeedback` from `handleSearch()` (declared but never read)
- Verified by tester subagent — all 5 cleanups safe, no regressions.

## Session 2026-06-02f — Default page: index.html → tree.html + redirector

### index.html rename + redirector
- **Renamed** `index.html` (family tree, ~3587 lines) → `tree.html`
- **Created** new `index.html` as thin JS redirector (uses `window.location.replace`) with `__DEFAULT_PAGE__` placeholder
- **Configurable** via GitHub Variable `DEFAULT_PAGE` (default: `dashboard.html`) — change anytime in Settings → Secrets & variables → Variables
- **Updated** 8 `href="index.html"` → `href="tree.html"` across `dashboard.html`, `request-list.html`, `attendance.html`, `misc.html`, `biography.html`, `introduction.html`
- **Updated** `js/menu.js`: menu link (line 334), root fallback (line 230) to `dashboard.html`
- **Updated** `js/data.js`: comment references
- **Updated** `deploy.yml`: added `__DEFAULT_PAGE__` sed replacement

## Session 2026-06-02g — misc.html Markdown + Cloudinary image upload + YouTube embed
**Follow-up:** added preview button + fixed card render (images/videos viewable in card + detail)

- **Preview button**: `#previewBtn` in modal form, opens detail modal with rendered content before save
- **Card render fix**: changed `<p class="news-body">${esc(n.content)}</p>` → `<div class="news-body">${renderDetailHTML(n.content)}</div>` so images/videos render inline in cards; removed `renderCardPreview()`
- **CSS**: `.news-card .news-body` uses `max-height:7em` + hides iframes, images capped at 80px
- **YouTube embed fix**: replaced placeholder approach (which caused `<p>` wrapping invalid HTML → stripped) with direct iframe replacement **before** `marked.parse()`. YouTube URLs now properly render as playable iframes in detail modal. Removed `youtubePlaceholders`/`replaceYouTubeIframes` helpers.
- **🔥 CRITICAL BUG**: `renderDetailHTML()` checked `t.startsWith('<')` **before** `t.startsWith('<!-- md -->')`. Since `<!-- md -->` starts with `<`, markdown content was returned as raw text and never processed. Fixed by swapping check order.

### misc.html (original session)
- **Markdown toggle**: checkbox `#useMarkdown` in news form, stores content with `<!-- md -->` prefix
- **Dependencies**: `marked.js` + `DOMPurify` from CDN (loaded before config.local.js)
- **Cloudinary upload**: preset `trah_news_unsigned`, cloud `dteeybsew`, paste/drop image → upload → insert `![gambar](url)` at cursor
- **YouTube embed**: auto-detect `youtube.com/watch?v=` / `youtu.be/` URLs (incl. extra params like `&list=`), replaces with responsive iframe at render time (before marked.parse to avoid invalid nesting)
- **Rendering**: `renderDetailHTML()` renders markdown via marked → DOMPurify → innerHTML; card uses same fn (images show capped at 80px, iframes hidden in cards)
- **Legacy compatibility**: plain text content unchanged; HTML content (starts with `<`) rendered directly
- **Safety**: DOMPurify sanitizes with `ADD_TAGS:['iframe']`, `ADD_ATTR:['allow','allowfullscreen','frameborder']`; try-catch fallback to escaped plain text
- **New CSS**: `.markdown-toggle-row`, `.check-row-toggle`, `.markdown-hint`, enhanced `.detail-body` (img/iframe/a/ul/ol/blockquote), `.news-card .news-body` (max-height, img/iframe styling)

## Session 2026-06-02h — misc.html YouTube embed: DOM API approach + thumbnail in cards

### Problem
YouTube embed Error 153 persisted through regex+iframe-in-markdown pipeline. `marked.parse()` + `DOMPurify.sanitize()` chain mangled iframe config (CSS margin, attributes stripped, etc.).

### Fix: bypass DOMPurify for iframes
- **`renderDetailHTML()`**: stripped YouTube URL→iframe conversion. YouTube URLs become `<a>` links via marked autolink, pass through DOMPurify clean.
- **`embedYouTubeLinks(el)`**: new function. Post-processes DOM after `innerHTML` — finds `<a>` with YouTube `href`, replaces with `<div class="youtube-embed"><iframe></iframe></div>` via `document.createElement()`. Bypasses DOMPurify entirely for iframe creation.
- **`openDetail()` + preview handler**: call `embedYouTubeLinks(detailBody)` after setting innerHTML.
- **Cards**: no longer contain hidden iframes (was `display:none`). YouTube URL shows as clickable link.

### Fix: YouTube thumbnail in cards
- **`renderDetailHTML()`**: replaces YouTube URLs with `<a class="yt-card-thumb"><img src=".../mqdefault.jpg"></a>` **before** `marked.parse()`.
- **CSS**: `.yt-card-thumb` — flex container, 8px radius, image capped 120px with object-fit, ▶ play button overlay (centered, semi-transparent), hover scale + opacity.
- **Detail modal**: `embedYouTubeLinks()` catches `<a class="yt-card-thumb">` and replaces it with embed iframe (same as plain links).
- **Thumbnail URL**: `https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg` (320×180, always exists).

### Fix: YouTube embed not centered in detail modal
- **Root cause**: `.detail-body iframe { margin: .8rem 0 }` applied to absolutely-positioned embed iframe, shifting it down.
- **Fix**: added `.youtube-embed iframe { margin: 0 !important }` to override.

## Rules
- **Clarify before acting**: when given a task, present findings + proposed scope first. Ask if unclear. Don't assume or over-engineer.
- **When switching to `main`**: always run `git pull --ff-only` first to keep local up to date.

## Session 2026-06-03 — Phase 1: Button redesign (askape.com hallmark)

### Scope
- 4 files: `tree.html`, `attendance.html`, `request-list.html`, `misc.html`
- 80 insertions, 61 deletions

### Button system changes (all buttons, all pages)
- **Radius**: `10px` → `9999px` (pill, matches askape)
- **Shadow**: glow → shelf (`0 2px 0 0 color-mix(in srgb, var(--gold), #000 25%)`)
- **Hover**: `translateY(-1px)` → `translateY(-2px)` + shelf shadow deepens to `0 4px`
- **Active**: new — solid darker bg, `box-shadow: none`, `translateY(0)`
- **Transition**: standardized to `all 200ms cubic-bezier(0.4,0,0.2,1)`

### Files affected
- **tree.html**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-cancel` (×2), `.btn-save` (×2), `#adminFab`, `.filter-chip`
- **attendance.html**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-save`, `.btn-cancel`, `.btn-success`, `.btn-danger`, `.load-more-btn`
- **request-list.html**: `.btn`, `.btn-primary`, `.btn-save`, `.btn-cancel`, `.btn-approve`, `.btn-reject`, `.btn-delete`, `.btn-action`
- **misc.html**: `.primary-btn`, `.ghost-btn`, `.icon-btn`, `.filter-btn`, `#addNewsBtn`, `.modal-actions .primary-btn`, `#pinConfirmBtn`

### Safety
- Git tag `askape-before-v1` created before changes
- All changes unstaged — review via `git diff`

### Follow-up — Button consistency fix (Masuk & Batal)
- **attendance.html**: PIN Masuk `btn-save` → `btn btn-primary`; PIN Batal `btn-cancel` → `btn btn-secondary`
- **misc.html**: Removed `#pinConfirmBtn` CSS override (solid gold mismatch); updated `.primary-btn` to `font-weight:600`, `padding:12px 24px`, `font-size:0.875rem`; added `.btn-secondary` class; changed modal/PIN button classes from `ghost-btn`/`primary-btn` → `btn-secondary`/`btn-primary`
- **Reference used**: request-list `.btn-primary` for Masuk; attendance RSVP konfirmasi `.btn-secondary` for Batal

### Pending (user review needed)
- Phase 2: Transition unification (non-button elements)
- Phase 3: Font option (Bricolage Grotesque)
- Phase 4: Layout polish

## Session 2026-06-03b — Login/admin button consistency fix

### Bug fixes
- **misc.html**: Masuk button `class="btn-primary"` → `class="primary-btn"` (class didn't exist in misc.html CSS — rendered as unstyled white block). Reverted to native `primary-btn` class which already has gradient gold matching reference.
- **tree.html**: 4× `btn-cancel` → `btn btn-secondary` (PIN overlay, Edit Anggota, Edit Pasangan, Request sheet)
- **request-list.html**: Batal PIN `btn-cancel` → `btn btn-secondary` + added `.btn-secondary` CSS (surface2 bg, text color, border, shelf shadow, hover -2px, active press)

### Status
- **attendance.html**: ✅ Already fixed in previous session
- **misc.html**: ✅ Masuk fixed (revert to primary-btn)
- **tree.html**: ✅ All 4 Batal → btn btn-secondary
- **request-list.html**: ✅ Batal → btn btn-secondary + CSS added

## Session 2026-06-03c — PIN layout fix + hover/active flash fix

### tree.html — PIN overlay reorder (match request-list)
- **CSS**: `#pinBox` changed from `text-align:center` → `display:flex; flex-direction:column; gap:0.75rem` (matches `.pin-box` in other pages). Removed individual `margin-bottom` on h3/p/input/error (gap handles spacing). Removed `.pin-actions` wrapper and CSS.
- **HTML**: Removed `.pin-actions` div, buttons are now direct children of `#pinBox`. Order: Masuk (btn-primary) first, Batal (btn-secondary) second — matching request-list reference.

### misc.html — Hover/click flash fix (Phase 1)
- **Root cause**: `.primary-btn` had `transition:all` defined but **no `:hover` or `:active` rules**. Transition animated undefined state changes, causing visual flash on hover/click.
- **Fix**: Added `:hover` (translateY -2px, shadow deepens) and `:active` (solid bg, no shadow, translateY 0) rules matching project pattern, with light mode overrides.
- **Affects**: Both Masuk and Simpan buttons (both use `.primary-btn`).

### misc.html — Hover flash still occurred in dark mode (Phase 2 — final fix)
- **Root cause (final)**: Two issues compounded:
  1. `.primary-btn` was in a shared group (`.primary-btn,.ghost-btn,.icon-btn,.filter-btn`) with `transition:all` + `background:var(--surface)` + `border:1px` — causing cascade conflicts when line 21 overrode these. `transition:all` attempted to animate between cascade levels.
  2. `transition:all` tried to animate `background` from `linear-gradient(...)` (base) to `color-mix(...)` (active) — CSS cannot interpolate between `<gradient>` and `<color>` types, causing a flash. Dark mode only because `color-mix() + var()` adds evaluation overhead.
- **Fix (dual agent)**:
  - **FE-Engineer**: Removed `.primary-btn` from shared group (line 20), deleted old duplicate `.primary-btn` block (line 20) and old hover rules — eliminated cascade conflicts
  - **FE-Designer**: Changed `transition:all` → `transition:transform,box-shadow` on `.primary-btn` (line 21) and `#addNewsBtn` (line 22) — prevents background/gradient animation
- **Result**: Smooth hover/active with no flash in dark mode.

## Session 2026-06-03d — Button consistency: misc.html sizing + missing CSS

### Problem
After fixing cascade conflicts (removed old `.primary-btn` from line 20), `.primary-btn` lost its sizing/layout properties. Simpan/Masuk buttons rendered with 0 padding (tiny hit target) and 16px font (too big). `.btn-secondary` had different padding/font-size than reference.

### Multi-agent findings

**uiux-senior** — Architecture audit:
- misc.html uses standalone classes (`primary-btn`, `btn-secondary`) instead of `.btn` base + modifier pattern used by all other pages
- `.primary-btn` missing 9 properties vs `.btn` base: `position:relative`, `display:inline-flex`, `align-items`, `justify-content`, `gap:8px`, `padding:12px 24px`, `font-size:0.875rem`, `font-weight:600`, `line-height:1`, `cursor:pointer`
- `.btn-secondary` missing same layout props + wrong `padding:0.65rem 0.95rem` and `font-size:0.85rem`

**fe-designer** — Found hidden bugs:
- `--surface3` undefined in misc.html — hover/active background for `.btn-secondary` broken (no visible change)
- `.modal-actions` CSS missing — modal buttons had no layout

**fe-engineer** — Applied sizing fixes:
- `.primary-btn`: added `display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;font-size:0.875rem;font-weight:600;line-height:1;`
- `.btn-secondary`: same + `padding:12px 24px;font-size:0.875rem;font-weight:600;line-height:1;`

### Additional fixes applied after agents
- `--surface3:#2d2720` added to `:root` (dark mode) — matches attendance
- `--surface3:#e8e4da` added to `[data-theme="light"]` — matches attendance
- `.modal-actions{display:flex;flex-direction:column;gap:10px}` with full-width buttons
- Mobile media query: `.modal-actions{flex-direction:row-reverse}` with `width:auto;flex:1`

### Result
All buttons across all 4 pages now render identically — pill shape, gold gradient primary, surface2 secondary, 12px 24px padding, 0.875rem font, 600 weight, shelf shadow, same hover/active behavior.

### Git
- Active branch: `main`
- Remote: `https://github.com/osiasu/silsilah-kariyorejan.git`
