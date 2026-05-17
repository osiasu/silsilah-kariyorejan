# OpenCode Swarm-Agent Summary

## Config Summary

### Global Config

File: `/Users/NO8138/.config/opencode/opencode.json`

- Default model: `snifoxai/anthropic/claude-opus-4.7`
- Provider: `snifoxai` via OpenAI-compatible SDK
- Context/output limit: `100000`
- MCP enabled: Context7 remote docs server
- Main primary agent: `orchestrator`
- Available subagents: `coder`, `reviewer`, `tester`, `researcher`, `uiux-senior`, `fe-designer`, `fe-engineer`
- `researcher` uses `snifoxai/openai/gpt-5.5`
- Other agents mostly use Claude Opus 4.7

Security note: the global config contains API keys. Do not commit or share it publicly.

### Local Project Config

File: `.opencode/opencode.json`

- Project type: static web project using HTML, CSS, and JavaScript
- Local instruction: use `@orchestrator` for complex multi-agent tasks
- Local orchestrator description: frontend/web coordinator
- Local orchestrator can call:
  - `coder`
  - `reviewer`
  - `tester`
  - `researcher`
  - `uiux-senior`
  - `fe-designer`
  - `fe-engineer`
- Local orchestrator has permissions for edit, read, bash, glob, and grep

## Project Shape Observed

- Main files include `index.html`, `menu.css`, and `menu.js`
- Additional pages include `introduction.html`, `dashboard.html`, `request-list.html`, `misc.html`, `attendance.html`, and `biography.html`
- Shared navigation/theme behavior is centralized mostly in `menu.js` and `menu.css`
- Pages currently use inline styles and inline scripts heavily
- Theme is persisted with `localStorage` key `trah_theme`
- Shared menu script is loaded with `menu.js`

## Recommended Swarm Workflows

### 1. Build Feature Swarm

Use this when adding a visible feature, page, component, or interaction.

```text
@orchestrator build [feature description].

Use this swarm:
1. @researcher: inspect existing files and patterns related to the feature.
2. @uiux-senior: define UX, accessibility, mobile behavior, and edge cases.
3. @fe-designer: propose visual layout, spacing, components, and design-token usage.
4. @fe-engineer: implement interactive frontend behavior.
5. @coder: integrate HTML/CSS/JS changes cleanly with existing pages.
6. @tester: verify behavior manually or with available commands.
7. @reviewer: review final diff for bugs, regressions, accessibility, and maintainability.
```

Best for:

- New navigation behavior
- Search/filter features
- New content pages
- Dashboard widgets
- Responsive UI improvements

Sample:
```
@orchestrator Build feature: Add searchable family member cards

Goal:
Users can search family members by name, branch, or generation from index.html.

Constraints:
- Static HTML/CSS/JS only.
- Must work on mobile.
- Must preserve dark/light theme.
- Must be keyboard accessible.
- No external search library.

Swarm plan:
1. @researcher inspect index.html, menu.js, menu.css for current search/UI patterns.
2. @uiux-senior define search UX and empty/loading states.
3. @fe-designer design card/search/filter visual states.
4. @fe-engineer implement JS search/filter logic.
5. @coder integrate markup/styles/scripts.
6. @tester test desktop/mobile/theme/search edge cases.
7. @reviewer review final changes.

Return:
- Files changed
- Summary
- Verification steps
- Known limitations
```

### 2. Refactor Swarm

Use this when cleaning duplicate HTML/CSS/JS or improving structure without changing behavior.

```text
@orchestrator refactor [area]. Preserve current behavior.

Use this swarm:
1. @researcher: map duplication and dependencies.
2. @coder: propose the smallest safe refactor.
3. @fe-engineer: verify JS behavior remains equivalent.
4. @tester: check affected pages and interactions.
5. @reviewer: review for behavior changes and missed edge cases.
```

Best for:

- Reducing repeated header markup
- Moving repeated inline CSS into shared CSS
- Consolidating theme code
- Cleaning large files gradually

Sample:
```
@orchestrator Refactor: Extract shared styles and scripts from index.html

Goal:
Move reusable CSS/JS patterns from index.html into shared files while preserving the exact visual behavior.

Constraints:
- Do not change content.
- Do not change menu behavior.
- Preserve theme behavior.
- Keep all pages loading correctly.

Swarm plan:
1. @researcher identify shared style/script blocks in index.html and other HTML pages.
2. @fe-designer classify styles into tokens, layout, components, page-specific styles.
3. @fe-engineer classify JS into shared behavior vs page-specific behavior.
4. @coder extract only low-risk shared code first.
5. @tester verify all pages still load, theme toggles, menu opens/closes, search works.
6. @reviewer review for accidental behavior changes.

Return:
- What changed structurally
- What behavior was preserved
- Risk areas
- Manual test checklist
```

### 3. Audit Swarm

Use this when you want a report before editing.

```text
@orchestrator audit this project.

Use this swarm:
1. @researcher: map file structure, dependencies, and risky areas.
2. @uiux-senior: audit UX, accessibility, navigation, and mobile behavior.
3. @fe-designer: audit visual consistency, spacing, typography, and themes.
4. @fe-engineer: audit JS performance, event handling, and browser behavior.
5. @reviewer: rank issues by severity and suggest fix order.
```

Sample:
```
@orchestrator Audit project

Scope:
- Structure
- HTML semantics
- CSS maintainability
- JavaScript quality
- Accessibility
- Responsive/mobile behavior
- Performance
- Security/privacy
- SEO/basic metadata
- Broken links/assets

Constraints:
- Read-only audit first.
- Do not edit files.
- Rank findings by severity.
- Include concrete fix recommendations.

Swarm plan:
1. @researcher map project structure, assets, dependencies, repeated patterns.
2. @uiux-senior audit UX flows, accessibility, keyboard behavior, mobile usability.
3. @fe-designer audit visual consistency, design tokens, spacing, themes.
4. @fe-engineer audit JS architecture, event handling, performance, browser compatibility.
5. @tester identify test gaps and create manual QA checklist.
6. @reviewer produce final prioritized risk report.

Return:
- Executive summary
- Critical issues
- High priority issues
- Medium/low improvements
- Suggested implementation roadmap
```

Recommended first audit command:
```
@orchestrator Audit project

Scope:
Full static-site audit for the current playtest project:
HTML, CSS, JS, accessibility, responsive behavior, performance, maintainability, SEO, broken links/assets, and theme/menu behavior.

Constraints:
- Read-only audit.
- Do not edit files.
- Rank by severity.
- Include exact files/sections where possible.
- Propose a phased roadmap.
```

Best for:

- Accessibility review
- Mobile/responsive review
- Code maintainability review
- Performance review
- Theme consistency review

### 4. Bug-Fix Swarm

Use this when something is broken or behaving inconsistently.

```text
@orchestrator fix [bug description].

Observed:
<what happens>

Expected:
<what should happen>
Steps to reproduce:
1. ...
2. ...
3. ...

Constraints:
- Minimal fix.
- Preserve current design.
- Add or describe regression test.
- Avoid unrelated refactors.

Use this swarm:
1. @researcher: locate likely source files and related code paths.
2. @tester: reproduce the bug and define expected behavior.
3. @coder: implement the smallest safe fix.
4. @fe-engineer: verify browser-side behavior and event flow.
5. @tester: retest the bug and nearby interactions.
6. @reviewer: check for regressions.
```

Sample:
```
@orchestrator Fix bug: Mobile menu logo switches incorrectly after theme toggle

Observed:
On mobile, after toggling dark/light theme, logo sometimes shows wrong version.

Expected:
Logo should always match current theme.

Steps to reproduce:
1. Open site on mobile width.
2. Toggle theme.
3. Open/close menu.
4. Resize browser.

Constraints:
- Minimal JS fix.
- Preserve existing menu animation.
- Do not redesign header.
```

Best for:

- Menu not opening/closing
- Theme toggle issues
- Mobile layout bugs
- Broken links
- Scroll/progress bugs
- Accessibility/focus bugs

## Practical Command Templates

### Build A Feature

```text
@orchestrator build a responsive search/filter feature for the family tree page. Use the full frontend pipeline: researcher, uiux-senior, fe-designer, fe-engineer, tester, reviewer. Keep changes minimal and preserve existing visual language.
```

### Refactor Safely

```text
@orchestrator refactor the repeated header/theme/menu markup across HTML pages. Preserve current behavior and appearance. First map duplication, then make the smallest safe shared-code change, then verify all pages still load.
```

### Audit Project

```text
@orchestrator audit this static web project for accessibility, mobile layout, performance, duplicated code, and maintainability. Return findings ordered by severity with file references and recommended fix order.
```

### Fix A Bug

```text
@orchestrator fix the bug where [describe issue]. Reproduce first, identify root cause, implement the smallest fix, then retest affected pages and ask reviewer to check regressions.
```

## When Not To Swarm

Do not use a swarm for tiny changes, such as:

- Changing one text label
- Updating one link
- Tweaking one color
- Adding one small comment
- Fixing one obvious typo

Use direct implementation for small one-file changes. Use `@orchestrator` when the work touches multiple files, requires investigation, or has UX/testing/review complexity.

## Best Default Strategy For This Project

Use this default sequence for most non-trivial work:

```text
researcher + uiux-senior + fe-designer in parallel
then fe-engineer or coder implements
then tester verifies
then reviewer reviews
```

##
# Recommended agent roles for your project

Use this as your core swarm team:
```
@orchestrator
Use for all complex work. It should coordinate the whole task and decide which agents run in parallel or sequence.

Best for:
@orchestrator audit this project and propose improvements
@orchestrator implement feature X
@orchestrator refactor shared header/menu/theme system
@orchestrator fix bug Y
```
---
@researcher
Use first for investigation.
Best for:
- locating relevant files
- understanding current structure
- finding duplicate code
- checking existing patterns
- looking up docs through Context7 if needed

Example:
```
@researcher inspect all HTML/CSS/JS files and map shared layout, duplicate code, and page-specific behavior. Return file list, responsibilities, risks, and recommended refactor order.
```
---
@uiux-senior
Use for product/design quality.

Best for:
- accessibility review
- mobile UX
- navigation flow
- content hierarchy
- user journey
- visual consistency recommendations

Example:
```
@uiux-senior audit the website UX, mobile navigation, accessibility, reading flow, and Indonesian language labels. Return prioritized UX issues and recommended fixes.
```
---
@fe-designer
Use for visual system work.

Best for:
- CSS variables
- typography scale
- spacing system
- responsive layout
- theme consistency
- component visual spec

Example:
```
@fe-designer review menu.css and inline styles across pages. Propose a shared design token system and identify duplicated CSS that should move into shared files.
```
---
@fe-engineer
Use for JS/component behavior.

Best for:
- menu behavior
- theme behavior
- event listeners
- DOM interactions
- performance improvements
- extracting reusable frontend modules

Example:
```
@fe-engineer inspect menu.js and page inline scripts. Propose a safer shared frontend architecture for menu, theme, progress indicator, and page-specific scripts.
```
---
@coder
Use for actual implementation.

Best for:
- editing files
- applying refactors
- implementing features
- cleaning duplicated code

Example:
```
@coder implement the agreed refactor plan. Keep behavior identical, extract shared code carefully, and avoid breaking existing pages.
```
---
@tester
Use before and after implementation.

Best for:
- smoke testing pages
- creating test checklist
- checking responsive behavior
- verifying JS errors
- validating links/forms
- browser compatibility checks

Example:
```
@tester create and run a manual/automated smoke test checklist for all HTML pages, menu behavior, theme toggle, search, navigation links, and responsive layout.
```
---
@reviewer
Use last.

Best for:
- code quality review
- regression risk
- accessibility review
- security/privacy issues
- performance review

Example:
```
@reviewer review the final diff for regressions, accessibility issues, duplicated logic, broken links, performance risks, and maintainability problems.
```

### Addition:

@accessibility-auditor
<br>Why:
Your project already has accessibility work like skip links, focus trap, aria labels, and contrast comments. A dedicated a11y agent would be useful.

@performance-auditor
<br>Why:
Static sites benefit from performance checks, especially with large inline HTML/CSS and external fonts/images.

@content-editor
<br>Why:
Your app appears Indonesian-language and family/genealogy focused. Copy consistency matters.