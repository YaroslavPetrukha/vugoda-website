---
phase: 01-foundation-shell
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - .nvmrc
  - tsconfig.json
  - tsconfig.node.json
  - vite.config.ts
  - index.html
  - public/.nojekyll
  - public/favicon.svg
  - src/vite-env.d.ts
  - src/types/svg.d.ts
autonomous: true
requirements:
  - DEP-03
objective: "Repo scaffold — pinned stack (Vite 6.3 / React 19.2 / TS 5.8 / Tailwind 4.2 / Motion 12.38 / react-router-dom 7.14 / @fontsource/montserrat 5.2.8 / lucide-react 1.11 / vite-plugin-svgr), anti-list purged (@google/genai, express, dotenv, autoprefixer, lucide-react@0.546, #2a3038 hex), Vite config with base path, SVGR plugin, .nojekyll and favicon committed. Everything downstream plans need to compile."

must_haves:
  truths:
    - "`npm install` completes with zero errors from clean state; lockfile committed"
    - "`npm run build` exits 0 after plans 02/03/04 land (tsconfig parses, Vite config parses)"
    - "HashRouter base-path plumbing exists — `vite.config.ts` sets `base: '/vugoda-website/'`, `public/.nojekyll` present"
    - "Anti-list dependencies absent from package.json (no @google/genai, express, dotenv, autoprefixer)"
  artifacts:
    - path: "package.json"
      provides: "pinned dependency surface for Phase 1"
      contains: '"react": "^19.2.0"'
    - path: "vite.config.ts"
      provides: "Vite base-path, plugins (react, tailwindcss, svgr)"
      contains: "base: '/vugoda-website/'"
    - path: "public/.nojekyll"
      provides: "GH Pages _-prefix folder safety"
    - path: "public/favicon.svg"
      provides: "favicon asset copied from brand-assets/favicon/favicon-32.svg"
    - path: "index.html"
      provides: "entry HTML with lang=uk, title, theme-color, favicon link, root div"
      contains: '<html lang="uk">'
    - path: "src/types/svg.d.ts"
      provides: "type declarations for vite-plugin-svgr `?react` imports"
  key_links:
    - from: "vite.config.ts"
      to: "@vitejs/plugin-react + @tailwindcss/vite + vite-plugin-svgr"
      via: "plugins array"
      pattern: "plugins:\\s*\\["
    - from: "index.html"
      to: "src/main.tsx"
      via: "<script type=\"module\" src>"
      pattern: "src=\"/src/main.tsx\""
---

<objective>
Establish repo scaffold: pinned dependencies, TypeScript + Vite config, base HTML entry, GH Pages enablers (`.nojekyll`, `base: '/vugoda-website/'`), favicon asset, and SVG-import type shims. No application code yet — just the foundation every other Phase 1 plan compiles against.

Purpose: Prevents anti-list (AI-backend leftovers) from carrying over from prototype, pins stack versions verified 2026-04-24, enables SVGR import pattern required by brand primitives plan, solves GH Pages DEP-03 at build-config layer.

Output: Installable and type-checkable project skeleton — `npm install` + `tsc --noEmit` succeed on an empty `src/main.tsx`; actual UI code ships in later plans.
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
@.planning/research/STACK.md
@.planning/research/ARCHITECTURE.md

<interfaces>
<!-- Pinned dependency targets, verified 2026-04-24 per STACK.md §Recommended Stack -->
Runtime:
  react@^19.2.0
  react-dom@^19.2.0
  react-router-dom@^7.14.0
  motion@^12.38.0
  lucide-react@^1.11.0
  @fontsource/montserrat@^5.2.8

Dev:
  vite@^6.3.6
  @vitejs/plugin-react@^5.2.0
  tailwindcss@^4.2.4
  @tailwindcss/vite@^4.2.4
  vite-plugin-svgr@^4.3.0
  typescript@~5.8.3
  @types/react@^19.2.0
  @types/react-dom@^19.2.0
  @types/node@^22.14.0

Anti-list (MUST NOT appear in package.json):
  @google/genai, express, dotenv, autoprefixer, gh-pages, framer-motion
  lucide-react@0.546 (old major — must be ^1.11.0)

Brand asset source paths (already exist in repo, do NOT modify):
  brand-assets/favicon/favicon-32.svg  → copy to public/favicon.svg
</interfaces>
</context>

<tasks>

<task type="auto" tdd="false">
  <name>Task 1: Initialize package.json, lockfile, tsconfig, .nvmrc</name>

  <read_first>
    - `.planning/research/STACK.md` (§Recommended Stack, §Installation, §Version Compatibility, §What NOT to Use) — for pinned versions, anti-list rationale
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` (§Anti-list — DO NOT copy from prototype) — confirms forbidden packages
    - `вигода-—-системний-девелопмент/package.json` — prototype package.json (READ ONLY for reference; do NOT lift verbatim — the anti-list packages live here)
    - `./CLAUDE.md` §Technology Stack — confirms versioning rationale
  </read_first>

  <files>
    package.json
    package-lock.json
    .nvmrc
    tsconfig.json
    tsconfig.node.json
  </files>

  <action>
    Create `package.json` at repo root with this EXACT content (pinned versions verified 2026-04-24 against npm registry; do NOT change version ranges):

    ```json
    {
      "name": "vugoda-website",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc --noEmit && vite build",
        "preview": "vite preview",
        "lint": "tsc --noEmit"
      },
      "dependencies": {
        "@fontsource/montserrat": "^5.2.8",
        "lucide-react": "^1.11.0",
        "motion": "^12.38.0",
        "react": "^19.2.0",
        "react-dom": "^19.2.0",
        "react-router-dom": "^7.14.0"
      },
      "devDependencies": {
        "@tailwindcss/vite": "^4.2.4",
        "@types/node": "^22.14.0",
        "@types/react": "^19.2.0",
        "@types/react-dom": "^19.2.0",
        "@vitejs/plugin-react": "^5.2.0",
        "tailwindcss": "^4.2.4",
        "typescript": "~5.8.3",
        "vite": "^6.3.6",
        "vite-plugin-svgr": "^4.3.0"
      }
    }
    ```

    Note on `lucide-react@^1.11.0` pin: `lucide-react@^1.11.0` is pinned in Plan 01-01 even though no Plan-01-01 task uses it directly — Plan 01-03's Footer imports `{ Send, Instagram, Facebook }` from it. Do NOT defer the pin. It must land in `package.json` now so that when Plans 02/03/04 execute (potentially in parallel waves), `npm install` has already resolved the lucide-react version lock and Footer's import compiles on the first pass.

    MUST NOT include: `@google/genai`, `express`, `dotenv`, `autoprefixer`, `gh-pages` (npm package), `framer-motion`, or `lucide-react@0.546` (old major). These are the prototype's AI-backend / legacy leftovers per anti-list.

    Then:
    1. Run `npm install` to produce `package-lock.json` and populate `node_modules/`. Commit the lockfile.
    2. Create `.nvmrc` containing exactly one line: `20.19.0`
    3. Create `tsconfig.json` for React 19 + Vite 6, `target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `jsx: react-jsx`, `strict: true`, `noEmit: true`, `skipLibCheck: true`, `allowImportingTsExtensions: false`, `isolatedModules: true`, `resolveJsonModule: true`, `esModuleInterop: true`, `lib: ["ES2022", "DOM", "DOM.Iterable"]`, `types: ["vite/client"]`, and include `src`. Reference `tsconfig.node.json` via `references`.
    4. Create `tsconfig.node.json` for the Vite config file itself (`target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `allowSyntheticDefaultImports: true`, `noEmit: true`, `composite: true`, `include: ["vite.config.ts"]`).

    Anti-list cleanup self-check (MUST be true):
    - `grep -E '"(@google/genai|express|dotenv|autoprefixer|gh-pages|framer-motion)"' package.json` returns zero matches.
    - `grep -E '"lucide-react":\s*"\^0\.' package.json` returns zero matches (confirms bump from 0.546).
    - `grep -E '#2a3038|#1e2329' package.json` returns zero matches.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && npm install --silent && test -f package-lock.json && test -f .nvmrc && test -f tsconfig.json && test -f tsconfig.node.json && grep -q '"react": "\^19.2.0"' package.json && grep -q '"vite": "\^6.3.6"' package.json && grep -q '"react-router-dom": "\^7.14.0"' package.json && grep -q '"motion": "\^12.38.0"' package.json && grep -q '"@fontsource/montserrat": "\^5.2.8"' package.json && grep -q '"vite-plugin-svgr": "\^4' package.json && ! grep -qE '"(@google/genai|express|dotenv|autoprefixer|gh-pages|framer-motion)"' package.json && ! grep -qE '"lucide-react":\s*"\^0\.' package.json && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f package.json && test -f package-lock.json && test -f .nvmrc && test -f tsconfig.json && test -f tsconfig.node.json` all succeed
    - `grep -c '"react": "\^19.2.0"' package.json` ≥ 1
    - `grep -c '"vite": "\^6.3.6"' package.json` ≥ 1
    - `grep -c '"react-router-dom": "\^7.14.0"' package.json` ≥ 1
    - `grep -c '"motion": "\^12.38.0"' package.json` ≥ 1
    - `grep -c '"@fontsource/montserrat": "\^5.2.8"' package.json` ≥ 1
    - `grep -c '"lucide-react": "\^1\.' package.json` ≥ 1 (NOT ^0.)
    - `grep -c '"vite-plugin-svgr": "\^4' package.json` ≥ 1
    - `grep -c '"tailwindcss": "\^4.2.4"' package.json` ≥ 1
    - `grep -c '"@tailwindcss/vite": "\^4.2.4"' package.json` ≥ 1
    - `grep -c '"typescript": "~5.8.3"' package.json` ≥ 1
    - `grep -E '"(@google/genai|express|dotenv|autoprefixer|gh-pages|framer-motion)"' package.json` → zero matches (exit non-zero on grep)
    - `cat .nvmrc` → `20.19.0` exactly
    - `grep -c '"jsx": "react-jsx"' tsconfig.json` ≥ 1
    - `grep -c '"moduleResolution": "Bundler"' tsconfig.json` ≥ 1
    - `grep -c '"strict": true' tsconfig.json` ≥ 1
    - `node_modules/react/package.json` exists and contains `"version": "19.` (confirms install worked)
  </acceptance_criteria>

  <done>
    Pinned package.json exists with no anti-list deps, lockfile generated, TypeScript strict-mode config present, Node version pinned. Project can `npm install` cleanly from any machine running Node 20.19+.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Vite config with base path, plugins, and public scaffold</name>

  <read_first>
    - `.planning/research/STACK.md` (§Stack Patterns by Variant → Router subsection, §Recommended Stack vite-plugin-svgr mention)
    - `.planning/research/ARCHITECTURE.md` §2 (Recommended Project Structure — confirms `vite.config.ts` location, `public/` structure)
    - `.planning/research/PITFALLS.md` §Pitfall 2 (`.nojekyll` rationale), §Anti-Pattern 4 (SVGR for brand SVGs)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Router & Build Config (D-22, D-23, D-24)
    - `brand-assets/favicon/favicon-32.svg` — source file to copy into `public/favicon.svg`
    - `package.json` (just created in Task 1)
  </read_first>

  <files>
    vite.config.ts
    public/.nojekyll
    public/favicon.svg
    src/vite-env.d.ts
    src/types/svg.d.ts
  </files>

  <action>
    1. Create `vite.config.ts` at repo root with EXACTLY this content (three plugins, base path for GH Pages, dist output):

    ```ts
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite';
    import svgr from 'vite-plugin-svgr';

    // https://vite.dev/config/
    export default defineConfig({
      base: '/vugoda-website/',
      plugins: [
        react(),
        tailwindcss(),
        svgr({
          svgrOptions: {
            exportType: 'default',
            ref: true,
            svgo: false,
            titleProp: true,
          },
          include: '**/*.svg?react',
        }),
      ],
      build: {
        outDir: 'dist',
        sourcemap: false,
      },
      server: {
        port: 5173,
      },
    });
    ```

    Rationale for each decision:
    - `base: '/vugoda-website/'` — required by DEP-03; resolves asset URLs to `/vugoda-website/...` on GH Pages.
    - `svgr include: '**/*.svg?react'` — only transforms imports with the `?react` query suffix; default imports (`import Url from './x.svg'`) still return URL strings. This lets us mix raster-SVG URLs and React-component SVGs.
    - `svgo: false` — brand-assets SVGs are hand-authored by the brand team; do not re-optimize and risk geometry drift.
    - `sourcemap: false` — tiny perf win for MVP; enable later if debugging prod.

    2. Create `public/.nojekyll` as an empty file. This prevents GitHub Pages from running Jekyll (which strips `_`-prefixed folders). Command to create: `touch public/.nojekyll` (zero bytes is correct).

    3. Copy `brand-assets/favicon/favicon-32.svg` to `public/favicon.svg`. Use `cp brand-assets/favicon/favicon-32.svg public/favicon.svg`. Do NOT modify its contents; it's a 32×32 viewBox cube glyph in brand palette (`#c1f33d`, `#020a0a`).

    4. Create `src/vite-env.d.ts` with exactly:

    ```ts
    /// <reference types="vite/client" />
    ```

    5. Create `src/types/svg.d.ts` with exactly:

    ```ts
    // Type declarations for vite-plugin-svgr `?react` imports.
    // Enables: `import Logo from '@/path/to/logo.svg?react'`
    declare module '*.svg?react' {
      import * as React from 'react';
      const SVGComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
      >;
      export default SVGComponent;
    }

    declare module '*.svg' {
      const src: string;
      export default src;
    }
    ```

    This tells TypeScript that `*.svg?react` imports are React components and plain `*.svg` imports are URL strings (the two modes vite-plugin-svgr supports).
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f vite.config.ts && test -f public/.nojekyll && test -f public/favicon.svg && test -f src/vite-env.d.ts && test -f src/types/svg.d.ts && grep -qE "base:\s*'/vugoda-website/'" vite.config.ts && grep -qE "import\s+svgr\s+from\s+'vite-plugin-svgr'" vite.config.ts && grep -qE "import\s+tailwindcss\s+from\s+'@tailwindcss/vite'" vite.config.ts && grep -qE "import\s+react\s+from\s+'@vitejs/plugin-react'" vite.config.ts && [ ! -s public/.nojekyll ] && grep -q '\*.svg?react' src/types/svg.d.ts && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f vite.config.ts` succeeds
    - `grep -cE "base:\s*['\"]/vugoda-website/['\"]" vite.config.ts` ≥ 1
    - `grep -cE "import\s+react\s+from\s+'@vitejs/plugin-react'" vite.config.ts` ≥ 1
    - `grep -cE "import\s+tailwindcss\s+from\s+'@tailwindcss/vite'" vite.config.ts` ≥ 1
    - `grep -cE "import\s+svgr\s+from\s+'vite-plugin-svgr'" vite.config.ts` ≥ 1
    - `grep -c "outDir: 'dist'" vite.config.ts` ≥ 1
    - `test -f public/.nojekyll` succeeds AND `wc -c < public/.nojekyll` returns `0` (empty file)
    - `test -f public/favicon.svg` succeeds AND `grep -q "viewBox=\"0 0 32 32\"" public/favicon.svg` (confirms it's the 32×32 brand favicon)
    - `test -f src/vite-env.d.ts` AND `grep -q "vite/client" src/vite-env.d.ts`
    - `test -f src/types/svg.d.ts` AND `grep -q "\\*.svg?react" src/types/svg.d.ts` AND `grep -q "FunctionComponent" src/types/svg.d.ts`
  </acceptance_criteria>

  <done>
    Vite config parses, SVGR + Tailwind + React plugins wired, `base` set to `/vugoda-website/`, `.nojekyll` committed, favicon copied from brand-assets (not re-authored), TypeScript knows about `?react` and plain SVG imports.
  </done>
</task>

<task type="auto" tdd="false">
  <name>Task 3: Create index.html entry</name>

  <read_first>
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Router & Build Config D-24 (confirms `<html lang="uk">`, title «ВИГОДА — Системний девелопмент», theme-color `#2F3640`; OG/Twitter tags explicitly Phase 6)
    - `.planning/phases/01-foundation-shell/01-CONTEXT.md` §Deferred — "Page-level `<title>` updates" (Phase 6 owns route-level titles; Phase 1 ships one global title only)
    - `.planning/research/PITFALLS.md` §Pitfall 8 (hero image preload is Phase 3/6 — NOT here)
    - `public/favicon.svg` (just created in Task 2)
    - `vite.config.ts` (to confirm script src path convention)
  </read_first>

  <files>
    index.html
  </files>

  <action>
    Create `index.html` at repo root with EXACTLY this content (minimal Vite + React entry, brand-correct meta, favicon linked, no OG/Twitter tags — those are Phase 6 per D-18):

    ```html
    <!doctype html>
    <html lang="uk">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#2F3640" />
        <link rel="icon" type="image/svg+xml" href="/vugoda-website/favicon.svg" />
        <title>ВИГОДА — Системний девелопмент</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
    ```

    Explicit choices:
    - `lang="uk"` — per D-24. Drives screen-reader language and HTML-validation behavior.
    - `theme-color="#2F3640"` — exactly the brand bg hex from D-19; no `#2a3038` (prototype drift).
    - `<link rel="icon" href="/vugoda-website/favicon.svg">` — absolute path including Vite base; when GH Pages serves from `/vugoda-website/`, this resolves correctly. During local `npm run dev`, Vite rewrites base to `/` internally, and the favicon still loads from `public/favicon.svg`.
    - Single-line title — per D-24 and per "Deferred" block (no per-page `document.title` updates in Phase 1 — that's QA-03/Phase 6).
    - NO `<meta name="description">`, NO `<meta property="og:*">`, NO `<meta name="twitter:*">`, NO canonical link. Those are Phase 6 QA-03 scope. Adding them here = scope leak.
    - NO `<link rel="preload" as="font">`. Fontsource `font-display: swap` default is good enough for Phase 1; hero font preload is Phase 6 perf.
    - `#root` div ID matches React convention; `src/main.tsx` (to be created in Plan 02) will mount here.
  </action>

  <verify>
    <automated>cd /Users/admin/Documents/Проєкти/vugoda-website && test -f index.html && grep -q '<html lang="uk">' index.html && grep -q '<meta name="theme-color" content="#2F3640"' index.html && grep -q 'ВИГОДА — Системний девелопмент' index.html && grep -q '<div id="root">' index.html && grep -q 'src="/src/main.tsx"' index.html && grep -q 'href="/vugoda-website/favicon.svg"' index.html && ! grep -qE 'og:|twitter:|rel="canonical"' index.html && echo "PASS"</automated>
  </verify>

  <acceptance_criteria>
    - `test -f index.html` succeeds
    - `grep -c '<html lang="uk">' index.html` ≥ 1
    - `grep -c '<meta name="theme-color" content="#2F3640"' index.html` ≥ 1
    - `grep -c 'ВИГОДА — Системний девелопмент' index.html` ≥ 1 (exact title from D-24)
    - `grep -c 'href="/vugoda-website/favicon.svg"' index.html` ≥ 1 (base-path-aware favicon ref)
    - `grep -c '<div id="root">' index.html` ≥ 1
    - `grep -c 'src="/src/main.tsx"' index.html` ≥ 1
    - `grep -cE 'og:|twitter:|rel="canonical"' index.html` = 0 (scope leak prevention — Phase 6 owns these)
    - `grep -cE 'rel="preload"' index.html` = 0 (Phase 6 perf scope)
    - `grep -cE '#2a3038|#1e2329' index.html` = 0 (prototype drift prevention)
  </acceptance_criteria>

  <done>
    `index.html` exists with brand-correct meta (lang uk, theme-color #2F3640, title), favicon linked at base-path-aware absolute URL, React mount point ready. No Phase 6 scope (OG tags, preload) has leaked in.
  </done>
</task>

</tasks>

<verification>
Run end-to-end:
1. `npm install` exits 0 (Task 1 outcome)
2. `grep -rE '#[0-9A-Fa-f]{6}' package.json vite.config.ts index.html` returns ONLY `#2F3640` (index.html theme-color) — no stray hex anywhere in config files
3. `grep -rE '(@google/genai|express|dotenv|autoprefixer|gh-pages":|framer-motion)' package.json` → zero matches
4. `test -f public/.nojekyll && test -f public/favicon.svg && test -f vite.config.ts && test -f index.html && test -f tsconfig.json && test -f src/types/svg.d.ts && test -f src/vite-env.d.ts` all succeed
5. After Plan 02 creates `src/main.tsx`, `npm run build` will complete — verified at Phase 1 end, not here
</verification>

<success_criteria>
Plan complete when:
- All 3 tasks pass their acceptance_criteria
- Runnable from clean checkout: `nvm use && npm install` succeeds
- No anti-list packages present in `package.json`
- DEP-03 plumbing (Vite base + `.nojekyll`) in place and visible to grep
- Phase 1 downstream plans (02 tokens, 03 router, 04 brand+nav, 05 deploy) can all add their files without needing to touch this scaffold
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation-shell/01-01-SUMMARY.md` describing:
- Final `package.json` dep list (not the entire file — just runtime + dev groups with versions)
- Any peer-dep warnings from `npm install` that surface (report, don't necessarily fix)
- Confirmation that anti-list is absent
- Confirmation that `public/.nojekyll` is zero-byte and committed
- List of files created with their roles
</output>
