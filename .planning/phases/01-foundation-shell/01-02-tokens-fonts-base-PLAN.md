---
phase: 01-foundation-shell
plan: 02
type: execute
wave: 2
depends_on:
  - 01-01
files_modified:
  - src/index.css
  - src/main.tsx
autonomous: true
requirements:
  - VIS-01
  - VIS-02
objective: "Brand tokens + fonts + global base CSS — Tailwind v4 `@theme` block with EXACTLY the 6 canonical brandbook hexes (no prototype `#2a3038` drift, no Tailwind defaults), Montserrat cyrillic-only subset imports (no Latin overhead), body base styles using tokens, global `:focus-visible` ring in accent `#C1F33D` (success criteria #5). React entrypoint (`src/main.tsx`) mounts the app tree into `#root` with StrictMode."

must_haves:
  truths:
    - "`grep -rE '#[0-9A-Fa-f]{6}' src/` returns ONLY the 6 canonical hexes (`#2F3640`, `#C1F33D`, `#F5F7FA`, `#A7AFBC`, `#3D3B43`, `#020A0A`) — Success Criterion #2"
    - "Montserrat renders cyrillic glyphs at weights 400/500/700 from `@fontsource/montserrat` cyrillic entry points only — Success Criterion #3"
    - "Keyboard Tab shows visible 2px `#C1F33D` outline with 2px offset on interactive elements — Success Criterion #5"
    - "React app mounts at `#root` under StrictMode"
  artifacts:
    - path: "src/index.css"
      provides: "Tailwind v4 @import + @theme (6 hexes) + @layer base (body + focus-visible)"
      contains: "@theme"
      min_lines: 40
    - path: "src/main.tsx"
      provides: "ReactDOM.createRoot → <StrictMode><App/></StrictMode>; imports index.css + 3 Montserrat cyrillic CSS subset files"
      exports: ["(none — entry)"]
      min_lines: 15
  key_links:
    - from: "src/main.tsx"
      to: "@fontsource/montserrat/cyrillic-{400,500,700}.css"
      via: "side-effect CSS imports"
      pattern: "@fontsource/montserrat/cyrillic-(400|500|700)\\.css"
    - from: "src/main.tsx"
      to: "src/index.css"
      via: "side-effect CSS import"
      pattern: "import ['\"]\\./index\\.css['\"]"
    - from: "src/main.tsx"
      to: "src/App.tsx"
      via: "default import (will be created in Plan 03)"
      pattern: "import App from ['\"]\\./App['\"]"
---

<objective>
Install the design system at its single source of truth: 6-hex closed palette in `@theme`, Montserrat cyrillic subset loaded with no Latin overhead, body base using tokens, accent-colored `:focus-visible` ring for keyboard users. Create the React entrypoint that bootstraps everything.

Purpose: VIS-01 (tokens) and VIS-02 (fonts) are fully satisfied here. Every downstream phase inherits correct tokens — no `:root` layer, no JS token module, no duplication. Pitfall 1 (silent palette drift) is preempted at its origin. Pitfall 5 (invisible dark-mode focus) is preempted globally.

Output: `src/index.css` + `src/main.tsx`. After this plan, importing `src/index.css` anywhere gives full brand palette as Tailwind classes (`bg-bg`, `text-accent`, etc.) and as `var(--color-*)` variables. Main entry is ready for Plan 03 to provide `src/App.tsx`.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-shell/01-CONTEXT.md
@.planning/research/ARCHITECTURE.md
@.planning/research/PITFALLS.md
@.planning/research/STACK.md
@brand-system.md

<interfaces>
<!-- Six canonical brand hexes (brand-system.md §3, verified WCAG). THESE ARE THE ONLY ALLOWED HEX VALUES IN src/. -->
--color-bg         = #2F3640  (main dark background; NAV background)
--color-bg-surface = #3D3B43  (cards/panels on dark)
--color-bg-black   = #020A0A  (deep black for high-contrast sections; descriptor on light)
--color-accent     = #C1F33D  (acid lime; ACCENT ONLY — never large-area fill; never on light bg = contrast fail)
--color-text       = #F5F7FA  (primary text on dark — 10.5:1 AAA on #2F3640)
--color-text-muted = #A7AFBC  (muted text — AA only ≥14pt at 5.3:1 on #2F3640)

<!-- Fontsource import paths (VERIFIED by unpacking @fontsource/montserrat@5.2.8 tarball per STACK.md §Core Technologies) -->
@fontsource/montserrat/cyrillic-400.css  (Regular)
@fontsource/montserrat/cyrillic-500.css  (Medium)
@fontsource/montserrat/cyrillic-700.css  (Bold)

<!-- React 19 entry pattern -->
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

<!-- Plan 03 will create App.tsx — main.tsx must import it. If Plan 03 runs later, Plan 02 can't build in isolation; that's fine — Plans 02/03/04 are all wave 2+ and are built as a cohort. -->
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Write src/index.css with @theme tokens and base styles</name>

  <read_first>
    - `brand-system.md` §3 (palette with verified WCAG contrast ratios — 10.5:1 for `#F5F7FA/#2F3640`, 8.85:1 for `#C1F33D/#2F3640`)
    - `brand-system.md` §4 (typography scale: Montserrat, 3 weights; line-height 1.55 body)
    - `.planning/research/ARCHITECTURE.md` §3 Q3 (verbatim `@theme` block target)
    - `.planning/research/PITFALLS.md` §Pitfall 1 (silent palette drift), §Pitfall 5 (invisible focus states — use `#C1F33D` 2px outline, 2px offset)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Tokens/Fonts/Accessibility D-19, D-21
    - `вигода-—-системний-девелопмент/src/index.css` — READ for reference; contains WRONG hex `#2a3038`; DO NOT propagate
  </read_first>

  <files>
    src/index.css
  </files>

  <action>
    Create `src/index.css` with EXACTLY this content (Tailwind v4 CSS-first, no JS token module, no `:root`):

    ```css
    @import "tailwindcss";

    /*
     * Brand tokens — 6-hex closed palette per brand-system.md §3.
     * DO NOT add a 7th color. State variations (disabled, success, error)
     * must derive from these via opacity/border — see PITFALLS.md §Pitfall 1.
     */
    @theme {
      /* Palette — canonical hexes, verified WCAG contrast */
      --color-bg:          #2F3640;  /* main dark background */
      --color-bg-surface:  #3D3B43;  /* cards, panels */
      --color-bg-black:    #020A0A;  /* deep black sections */
      --color-accent:      #C1F33D;  /* acid lime — ACCENT ONLY */
      --color-text:        #F5F7FA;  /* primary text on dark (10.5:1 AAA) */
      --color-text-muted:  #A7AFBC;  /* muted text — only ≥14pt (5.3:1 AA) */

      /* Typography */
      --font-sans: "Montserrat", system-ui, -apple-system, sans-serif;

      /* Spacing rhythm — brand-system.md §7 (brandbook gap; proposed scale) */
      --spacing-rhythm-xs: 4px;
      --spacing-rhythm-sm: 8px;
      --spacing-rhythm-md: 16px;
      --spacing-rhythm-lg: 32px;
      --spacing-rhythm-xl: 64px;
    }

    /*
     * Base layer — body defaults + focus-visible accessibility (Pitfall 5).
     * :focus-visible is the ONLY focus style; plain :focus is suppressed so
     * mouse clicks don't show the outline.
     */
    @layer base {
      html {
        background-color: var(--color-bg);
      }

      body {
        background-color: var(--color-bg);
        color: var(--color-text);
        font-family: var(--font-sans);
        font-weight: 400;
        line-height: 1.55;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      /* Suppress default outline for mouse users — replaced by :focus-visible below */
      :focus {
        outline: none;
      }

      /*
       * Focus ring for keyboard users only (D-21, Success Criterion #5).
       * 2px accent outline, 2px offset — WCAG AAA contrast (8.85:1) on #2F3640.
       * Applies to all natively-focusable interactive elements.
       */
      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      summary:focus-visible,
      [tabindex]:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
        border-radius: 2px;
      }

      /* Text selection uses accent on black — brand-consistent */
      ::selection {
        background-color: var(--color-accent);
        color: var(--color-bg-black);
      }
    }
    ```

    Rationale:
    - `@theme` directive — Tailwind v4's CSS-first design token system. Emits both CSS custom properties AND generates utility classes (`bg-bg`, `text-accent`, `border-bg-surface`, etc.). No separate `:root` needed.
    - EXACTLY 6 hex values, per D-19. No `slate-700`, no `red-500`, no Tailwind defaults.
    - Prototype's `#2a3038` is intentionally absent (it's wrong per VIS-01).
    - `outline: none` on plain `:focus` is paired with `:focus-visible` rule — mouse clicks don't show the outline (design preference), keyboard Tab does (a11y requirement).
    - `line-height: 1.55` per brand-system.md §4 (Ukrainian body text readability).
    - `font-family` uses `--font-sans` token so Tailwind's `font-sans` utility maps to Montserrat via the `@theme` declaration.
    - NO transitions on body/html (Pitfall 3 — Phase 5 owns centralized motion; no inline animations here).
    - NO fallback hex values on second lines. If Montserrat fails to load, `system-ui` renders as cyrillic-capable sans-serif on all supported browsers (last-2 Chrome/Safari/Firefox/Edge per CLAUDE.md).

    Anti-drift self-check (after write):
    - `grep -oE '#[0-9A-Fa-f]{6}' src/index.css` outputs ONLY these 6 (sorted dedupe): `#020A0A`, `#2F3640`, `#3D3B43`, `#A7AFBC`, `#C1F33D`, `#F5F7FA`.
    - `grep -E '#2a3038|#1e2329|#000000|#ffffff' src/index.css` → zero matches (prototype drift + Tailwind defaults absent).

    Tailwind v4 utility-class generation self-check (after write — confirms @theme key naming is correct):
    - Tailwind v4 compiles `--color-bg` → `.bg-bg` / `.text-bg` / `.border-bg` utility classes. If `@theme` keys were named differently (e.g. `--bg-color` instead of `--color-bg`), the utilities would NOT generate and downstream plans' `bg-bg`, `text-text-muted`, `border-accent` classes would silently render as no-op strings. The verify block below compiles the CSS with the Tailwind CLI and greps for emitted utility selectors to prove the mapping works END-TO-END at Plan 02 close, before Plans 03/04 depend on it.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/index.css && grep -q '@import "tailwindcss"' src/index.css && grep -q '@theme' src/index.css && grep -q '#2F3640' src/index.css && grep -q '#C1F33D' src/index.css && grep -q '#F5F7FA' src/index.css && grep -q '#A7AFBC' src/index.css && grep -q '#3D3B43' src/index.css && grep -q '#020A0A' src/index.css && grep -q ':focus-visible' src/index.css && grep -q 'outline: 2px solid var(--color-accent)' src/index.css && grep -q 'outline-offset: 2px' src/index.css && grep -q '--font-sans' src/index.css && ! grep -qE '#2a3038|#1e2329|#000000|#ffffff' src/index.css && UNIQUE_HEX=$(grep -oE '#[0-9A-Fa-f]{6}' src/index.css | tr 'a-f' 'A-F' | sort -u | wc -l | tr -d ' ') && [ "$UNIQUE_HEX" = "6" ] && cd /Users/admin/Documents/Проєкти/vugoda-website && echo '<div class="bg-bg text-text-muted border-accent"></div>' > /tmp/tw-probe.html && npx tailwindcss -i src/index.css -o /tmp/tw-check.css --content /tmp/tw-probe.html --minify 2>&1 | grep -v -i warn || true && grep -q '\.bg-bg' /tmp/tw-check.css && grep -q '\.text-text-muted' /tmp/tw-check.css && grep -q '\.border-accent' /tmp/tw-check.css && echo "PASS ($UNIQUE_HEX unique hexes; bg-bg/text-text-muted/border-accent utilities emitted)"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/index.css` succeeds
    - `grep -c '@import "tailwindcss"' src/index.css` ≥ 1
    - `grep -c '@theme' src/index.css` ≥ 1
    - All 6 canonical hexes present (case-insensitive):
      - `grep -c '#2F3640' src/index.css` ≥ 1
      - `grep -c '#C1F33D' src/index.css` ≥ 1
      - `grep -c '#F5F7FA' src/index.css` ≥ 1
      - `grep -c '#A7AFBC' src/index.css` ≥ 1
      - `grep -c '#3D3B43' src/index.css` ≥ 1
      - `grep -c '#020A0A' src/index.css` ≥ 1
    - Unique hex count in file: `grep -oE '#[0-9A-Fa-f]{6}' src/index.css | tr 'a-f' 'A-F' | sort -u | wc -l` = 6 (exactly)
    - Forbidden hexes absent: `grep -cE '#2a3038|#1e2329|#000000|#ffffff|#111111|#222222' src/index.css` = 0
    - `grep -c ':focus-visible' src/index.css` ≥ 1
    - `grep -c 'outline: 2px solid var(--color-accent)' src/index.css` ≥ 1
    - `grep -c 'outline-offset: 2px' src/index.css` ≥ 1
    - `grep -c -- '--font-sans' src/index.css` ≥ 1
    - `grep -c -- '--color-bg:' src/index.css` ≥ 1 AND `grep -c -- '--color-accent:' src/index.css` ≥ 1 AND `grep -c -- '--color-text:' src/index.css` ≥ 1
    - `wc -l src/index.css` ≥ 40 (indicates complete file, not one-liner stub)
    - Tailwind utility-class generation end-to-end: after running `npx tailwindcss -i src/index.css -o /tmp/tw-check.css --content <probe.html>` with a probe HTML containing `class="bg-bg text-text-muted border-accent"`, the generated CSS contains `.bg-bg`, `.text-text-muted`, `.border-accent` selectors. Confirms `@theme` key naming correctly produces Tailwind utilities that Plans 03/04 depend on.
  </acceptance_criteria>

  <done>
    `src/index.css` ships 6-hex `@theme` block, Tailwind v4 `@import`, body base, `:focus-visible` ring. VIS-01 satisfied by inspection and grep. Tailwind CLI compile confirms `bg-bg` / `text-text-muted` / `border-accent` utilities emit correctly (Plans 03/04 won't silently render unstyled). No prototype `#2a3038` drift.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Write src/main.tsx entrypoint with Fontsource cyrillic imports</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Tokens/Fonts/Accessibility D-20 (Fontsource cyrillic subset entry points ONLY, never package root)
    - `.planning/research/STACK.md` §Stack Patterns → Fonts section (confirms static Fontsource over variable; exact import paths)
    - `.planning/research/ARCHITECTURE.md` §1 System Overview (confirms entry mounts App into #root)
    - `src/index.css` (just created in Task 1 — will be side-effect imported)
    - `index.html` (from Plan 01 — confirms `#root` div + `src="/src/main.tsx"` script tag)
    - `.planning/research/PITFALLS.md` §Pitfall 4 (StrictMode double-mount is expected in dev — don't "fix" it)
  </read_first>

  <files>
    src/main.tsx
  </files>

  <action>
    Create `src/main.tsx` with EXACTLY this content:

    ```tsx
    import { StrictMode } from 'react';
    import { createRoot } from 'react-dom/client';

    // Fontsource Montserrat — cyrillic subsets ONLY (no Latin overhead).
    // Verified paths per @fontsource/montserrat@5.2.8 tarball (STACK.md).
    // Do NOT import '@fontsource/montserrat' (package root) — that loads all
    // Latin + ALL weights = ~300 files. Subset weights give full Ukrainian
    // coverage (ЖК, ВИГОДА, Маєток Винниківський) in ~60-80KB woff2.
    import '@fontsource/montserrat/cyrillic-400.css';
    import '@fontsource/montserrat/cyrillic-500.css';
    import '@fontsource/montserrat/cyrillic-700.css';

    // Tokens + base styles (index.css uses Tailwind v4 @theme directive).
    import './index.css';

    // App tree (created in Plan 03 — router + layout + page stubs).
    import App from './App';

    const rootEl = document.getElementById('root');
    if (!rootEl) {
      throw new Error('Root element #root not found in index.html');
    }

    createRoot(rootEl).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    ```

    Explicit choices:
    - Three Fontsource imports, one per weight. NOT the package root. Per D-20 and VIS-02.
    - Order matters: fonts first, then `index.css` (so `@theme` can reference `Montserrat` after font-face is registered), then App.
    - `StrictMode` per React 19 convention. Dev-mode double-render is expected (PITFALLS §Pitfall 4) — do not "fix" it.
    - Null-check on `document.getElementById('root')` satisfies TypeScript strict mode (`rootEl: HTMLElement | null`).
    - `import App from './App'` — resolves to `src/App.tsx` (no extension), created in Plan 03. Plan 02 in isolation will not tsc-compile until Plan 03 lands; this is expected in parallel-wave work. The build verification at phase end confirms everything compiles together.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f src/main.tsx && grep -c "@fontsource/montserrat/cyrillic-400.css" src/main.tsx | grep -q "^1$" && grep -c "@fontsource/montserrat/cyrillic-500.css" src/main.tsx | grep -q "^1$" && grep -c "@fontsource/montserrat/cyrillic-700.css" src/main.tsx | grep -q "^1$" && ! grep -qE "from ['\"]@fontsource/montserrat['\"]" src/main.tsx && grep -q "import ['\"]\./index.css['\"]" src/main.tsx && grep -q "import App from ['\"]\./App['\"]" src/main.tsx && grep -q "StrictMode" src/main.tsx && grep -q "createRoot" src/main.tsx && grep -q "getElementById('root')" src/main.tsx && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f src/main.tsx` succeeds
    - `grep -c "@fontsource/montserrat/cyrillic-400.css" src/main.tsx` = 1
    - `grep -c "@fontsource/montserrat/cyrillic-500.css" src/main.tsx` = 1
    - `grep -c "@fontsource/montserrat/cyrillic-700.css" src/main.tsx` = 1
    - Package-root Fontsource import absent: `grep -cE "from ['\"]@fontsource/montserrat['\"]" src/main.tsx` = 0 (MUST NOT import root)
    - No 600/800/900 weights or Latin subsets: `grep -cE "cyrillic-(100|200|300|600|800|900)\.css|/latin[^\"']*\.css" src/main.tsx` = 0
    - `grep -cE "import ['\"]\\./index\\.css['\"]" src/main.tsx` ≥ 1
    - `grep -cE "import App from ['\"]\\./App['\"]" src/main.tsx` ≥ 1
    - `grep -c "StrictMode" src/main.tsx` ≥ 2 (import + usage)
    - `grep -c "createRoot" src/main.tsx` ≥ 2 (import + call)
    - `grep -c "getElementById('root')" src/main.tsx` ≥ 1
    - `wc -l src/main.tsx` ≥ 15
  </acceptance_criteria>

  <done>
    `src/main.tsx` imports Montserrat cyrillic 400/500/700 subset CSS (no Latin overhead), imports `index.css` (tokens+base), renders `<App/>` under `<StrictMode>` into `#root` with null-check. VIS-02 satisfied by inspection. Phase 1 build will succeed once Plans 03/04 add `App.tsx`.
  </done>
</task>

</tasks>

<verification>
Phase-level checks that this plan contributes to:
1. `grep -rE '#[0-9A-Fa-f]{6}' src/` returns only the 6 canonical hexes (Success Criterion #2) — this plan is the sole source of hexes in `src/` after it lands; plans 03/04 should introduce zero raw hexes.
2. `grep -rE "@fontsource/montserrat/cyrillic-(400|500|700)" src/main.tsx` returns 3 matches (Success Criterion #3).
3. `grep -E "outline: 2px solid var\(--color-accent\)" src/index.css` matches (Success Criterion #5).
4. `wc -l src/index.css` ≥ 40 (file is not a stub).
5. After Plans 03/04 land, `npm run dev` start must show Nav on #2F3640 bg (not default white). If Nav renders unstyled, the `--color-bg` → `bg-bg` class mapping broke; `@theme` keys need to use `--color-bg` not `--bg-color`. Task 1's Tailwind-CLI probe in `<verify>` is the early gate; this line is the late gate at integration time.
</verification>

<success_criteria>
- VIS-01 tokens visible in `src/index.css` `@theme` block with exactly 6 hexes, zero extras.
- VIS-02 Montserrat imports are cyrillic subsets only (400/500/700), no package-root import.
- Global `:focus-visible` rule applies to all natively-focusable element selectors with accent outline.
- `src/main.tsx` bootstraps React 19 StrictMode tree, ready for Plan 03's `App.tsx`.
- No prototype `#2a3038` hex anywhere in `src/`.
- Tailwind v4 utility generation proven end-to-end: `bg-bg` / `text-text-muted` / `border-accent` selectors emit in compiled CSS (Task 1 `<verify>`).
</success_criteria>

<output>
Create `.planning/phases/01-foundation-shell/01-02-SUMMARY.md`:
- Final unique-hex inventory from `src/index.css` (should be exactly 6)
- Final Fontsource import list from `src/main.tsx` (should be exactly 3)
- Confirmation that `:focus-visible` rule applies to a/button/input/select/textarea/summary/[tabindex]
- Confirmation that Tailwind CLI emits `.bg-bg`, `.text-text-muted`, `.border-accent` utilities from the `@theme` block (paste the relevant grep output from Task 1's verify step)
- Any warnings if Tailwind v4 initial `@theme` parse issues emerge at dev-server start
</output>
