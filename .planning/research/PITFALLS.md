# Pitfalls Research

**Domain:** Brand-constrained developer-built corporate SPA (React + Vite + Motion) for a Ukrainian real-estate developer, desktop-first, deployed to GitHub Pages, inherited concept doc with 8 open client questions.

**Researched:** 2026-04-24
**Confidence:** MEDIUM-HIGH

**Source hierarchy used:**
- HIGH: `brand-system.md` §3 (contrast table is measured, not estimated), §4 (typography spec), `КОНЦЕПЦІЯ-САЙТУ.md` §10 (hard rules), §11 (8 open items), `PROJECT.md` Out-of-Scope and Constraints.
- MEDIUM: Training-data knowledge of React Router + GitHub Pages routing failure modes, Motion (framer-motion) animation perf traps, Vite `base` + `basename` coupling, WebP/AVIF baseline support.
- LOW (flagged inline): Empirically-unverified claims about Cyrillic line-height tuning and specific Montserrat rendering quirks in Ukrainian glyph sets.

**What I could not verify (WebSearch was not available this session):**
- Exact current Motion API names for scroll-linked animations (`useScroll` / `useInView` / `whileInView`) — all existed in my training data but API stability should be confirmed against Motion docs at implementation time.
- Current recommended "SPA fallback" pattern for GitHub Pages (I describe two known approaches below; both need verification on the actual repo at deploy time).
- Browser AVIF baseline (Safari 16+ was adding AVIF per training data; this should be re-checked before committing to AVIF-only).

Where I say "verify at phase X" below, assume that's genuine — I'm not trying to sound careful for show.

---

## Critical Pitfalls

### Pitfall 1: Silent palette drift ("just one more color")

**What goes wrong:**
The developer needs a disabled button state, a success toast, an error border, a hover fill, a 3rd card tier — and the closed 6-color palette doesn't literally define any of these. Solution-by-reflex: reach for Tailwind's default `gray-700`, `red-500`, `emerald-400`. Within 2 days the site has 14 colors and the brand system is broken. `brand-system.md` §7 explicitly notes state colors (success/warning/error) are **not in the brandbook** — this is an invitation for drift.

**Why it happens:**
Closed palettes require *derivation discipline* (tints/shades/alphas of the 6), not *addition discipline*. Developers default to addition because every UI framework ships with extended palettes.

**How to avoid:**
1. In Phase 1 (tokens/setup), explicitly delete/override Tailwind's default palette in `tailwind.config` / CSS `@theme` block. Replace with ONLY the 6 named tokens (`--color-bg`, `--color-bg-surface`, `--color-bg-black`, `--color-accent`, `--color-text`, `--color-text-muted`) — no `slate`, `gray`, `zinc`, `neutral`.
2. Define state derivations in tokens up front: disabled = `text-muted` at 50% opacity; success = `accent`; error = `#F5F7FA` with a stroke border (no red). Document as "state patterns" in `brand-system.md` addendum.
3. ESLint rule or simple repo script (`grep -R "bg-red\|bg-blue\|bg-gray\|text-red"`) in CI to fail on non-token class names.

**Warning signs:**
- A PR introduces `bg-gray-800` "just for this card hover."
- Design review finds a 7th hex code in computed styles.
- `grep -rE '#[0-9A-Fa-f]{6}'` in `src/` returns values outside the 6 canonical.

**Phase to address:** Phase 1 (tokens/setup). Verification repeats every PR via lint rule.

---

### Pitfall 2: GitHub Pages SPA 404 on hard-refresh / deep-link

**What goes wrong:**
User opens `https://…github.io/vugoda-website/projects`, sees the hub page, copies the URL, pastes it into a new tab. GitHub Pages looks for a file at `/vugoda-website/projects` → 404. The client tries to share `/zhk/etno-dim` with a colleague, gets GitHub's 404 page, concludes "site is broken." This is the single most embarrassing failure mode for a **demo-URL-as-deliverable** project (PROJECT.md Core Value).

**Why it happens:**
GitHub Pages is a static server — it has no SPA fallback. React Router's `BrowserRouter` assumes the server routes all unknown paths to `index.html`. Vercel/Netlify do this automatically; GitHub Pages does not.

**How to avoid:**
Pick ONE of two patterns explicitly, in writing, before Phase 5 (deploy):

1. **`HashRouter`** (simplest, ugly URLs): `/#/projects`, `/#/zhk/etno-dim`. Works out-of-the-box on Pages. Cost: URLs look dated; social-preview scraping of specific routes is weaker.
2. **`BrowserRouter` + `404.html` redirect trick** (spa-github-pages pattern by rafgraph): ship a `public/404.html` that JS-redirects to `index.html?/path=…`, plus a short script in `index.html` that rewrites the query back to the real path. Clean URLs, ~30 extra lines of boilerplate, well-known pattern.

Whichever you pick: **both** must also configure:
- `vite.config.ts` → `base: '/vugoda-website/'` (already noted in PROJECT.md DEP-03).
- `<BrowserRouter basename="/vugoda-website">` OR matching `HashRouter` config.
- A `public/.nojekyll` file (prevents GitHub from running Jekyll and eating `_`-prefixed folders, which will matter the moment you have `_anything` in assets).

**Warning signs:**
- First deploy works from the `/` landing but every deep link 404s on hard refresh.
- `curl -I` on a deep route returns 404 from `pages.github.com`.
- Opening the site in an incognito tab directly to `/projects` fails.

**Phase to address:** Phase 5 (deploy). Smoke-test script (Phase 6 / post-deploy) must hit every route directly — not by clicking through from `/`.

---

### Pitfall 3: Animation jank from easing/duration mismatch across the site

**What goes wrong:**
Hero uses `ease: [0.4, 0, 0.2, 1]` over 800ms. Card hover uses `ease: "easeInOut"` over 200ms. Route transition uses a spring with `stiffness: 100`. Scroll-reveal uses default Motion `ease`. In isolation, each is fine; together the site feels like it was built by four different designers. Brand system says "ease-out, no bounce" (CONCEPT §9, brand-system §7) — easy to violate by accident.

**Why it happens:**
Motion's per-component API is easy to use (`transition={{…}}`), so each component gets its own curve inline. No central motion system → no consistency.

**How to avoid:**
1. In Phase 1, create `src/motion/tokens.ts` with a small finite set: `durations = { fast: 200, base: 400, slow: 800 }`, `eases = { out: [0.4, 0, 0.2, 1], subtle: [0.25, 0.1, 0.25, 1] }`. Forbid inline `transition` objects — wrap them in helpers.
2. Explicitly outlaw springs with `stiffness`/`bounce` and keyword eases like `"easeInOut"` (the default has overshoot-feel on longer durations). Single-word eases hide the actual curve; bezier arrays make the curve an inspectable decision.
3. All stagger values come from one constant (`stagger.card = 60ms`, `stagger.list = 40ms`).

**Warning signs:**
- Multiple different `transition` objects across the repo (grep for `transition={{`).
- QA reviewer says "something feels off but I can't tell what" — usually easing inconsistency.
- A cubic-bezier visualizer on your curves shows mixed over/undershoot.

**Phase to address:** Phase 4 (animations). Enforce via code review + grep audit.

---

### Pitfall 4: Scroll-trigger / `AnimatePresence` conflicts on route change

**What goes wrong:**
User clicks from `/` to `/projects`. The home page is still scroll-revealing sections while `AnimatePresence` tries to animate it out. Result: flash of pre-animation state, janky exit, Motion warnings in the console about stale `viewport` observers. Worse: on the return to `/`, IntersectionObservers that watched-once stay watched-once — reveal animations don't replay, and the page feels dead.

**Why it happens:**
Scroll triggers (`whileInView` / `useInView`) and `AnimatePresence` are two independent animation systems. Motion doesn't synchronize them. `viewport={{ once: true }}` is cached at component-mount, not at route-level.

**How to avoid:**
1. For cross-route fades: use `AnimatePresence mode="wait"` — old page completes exit before new page starts. Halves the class of conflicts.
2. For scroll reveals: pick ONE of
   - `viewport={{ once: true, amount: 0.3 }}` on everything and accept that return-visits don't re-animate (usually correct for a corp site), OR
   - `once: false` + mount-on-route so state resets per navigation.
3. Phase 4 smoke test: navigate Home → Projects → back to Home. All 6 home sections must reveal correctly on return. If not, the `once` strategy is wrong.

**Warning signs:**
- Returning to `/` shows sections already-revealed with no animation.
- Console warns about detached `IntersectionObserver`.
- Exit animations are cut short or skipped entirely.

**Phase to address:** Phase 4 (animations), verified in Phase 6 (post-deploy QA).

---

### Pitfall 5: Dark-mode focus states invisible (a11y fail that Lighthouse misses)

**What goes wrong:**
Default browser focus ring is `Highlight` (blue-ish) which disappears on `#2F3640`. Developer removes it globally with `*:focus { outline: none }` because "it looked ugly." Keyboard users cannot tell which element is focused. Lighthouse may still show 100 (Lighthouse checks some but not all focus-visibility heuristics). Failure mode: invisible to automated testing, breaks the site for a real user class.

**Why it happens:**
Dark-theme sites + developer reflex to kill outline. QA is usually done with mouse, not Tab key.

**How to avoid:**
1. Define a `:focus-visible` style using `#C1F33D` (accent, AAA on `#2F3640` at 8.85:1 per brand-system §3) — a 2px outline + 2px offset works. Never `outline: none` without replacement.
2. Phase 1 CSS base: `*:focus { outline: none }` paired with `*:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }`. `:focus-visible` doesn't trigger on mouse clicks, so the pretty-design concern goes away.
3. Phase 6 QA: Tab through every interactive element on every page. If you can't see where focus is for >100ms, it's a bug.

**Warning signs:**
- `outline: none` in CSS with no `:focus-visible` rule within 20 lines.
- Tabbing through the page and losing track of where you are.
- axe-core / Lighthouse "focus visible" audit flag (they catch some cases).

**Phase to address:** Phase 1 (setup / base CSS reset), verified Phase 6 (post-deploy QA).

---

### Pitfall 6: `#A7AFBC` muted text used for body copy → WCAG fail

**What goes wrong:**
Muted gray `#A7AFBC` on `#2F3640` = 5.3:1. That's AA **only for ≥14pt/18px+ text** (brand-system §3). The developer uses it for body paragraphs at 14px, for form field placeholders (typically 13–14px), and for footnote/legal text. All three fail WCAG AA. This is the single most likely a11y regression because the brand literally names `text-muted` as "secondary, descriptors, placeholders" — tempting to apply broadly.

**Why it happens:**
Naming suggests "body-adjacent" usage. Font-size at 14px is Tailwind's default `text-sm`, widely used.

**How to avoid:**
1. Lint/convention: `text-muted` class may ONLY be applied together with `text-lg` or larger (≥18px), or to `font-medium`/`font-bold` text ≥14px. Document in `brand-system.md` addendum with examples.
2. Footer reqisits (EDRPOU, license date) — typically 12–13px — must use `var(--color-text)` at reduced opacity (e.g., `opacity: 0.8`) instead of `text-muted`, because opacity on primary text stays AA-compliant at small sizes.
3. Form placeholders: use `text-muted` only if placeholder is ≥16px and non-critical (because placeholder is itself an a11y anti-pattern for required info).

**Warning signs:**
- axe-core flags "insufficient color contrast" on `.text-muted` elements.
- Greppable violation: `text-muted` used alongside `text-xs`, `text-sm`, or caption classes.
- Manual QA: squint-test on footer — can you read EDRPOU digits?

**Phase to address:** Phase 1 (tokens: codify the usage rule), Phase 3 (pages: enforce during build), Phase 6 (post-deploy axe run).

---

### Pitfall 7: Hardcoded inherited content → rewrite cost when CMS comes

**What goes wrong:**
MVP hardcodes all copy from CONCEPT §7, §8 as JSX literals directly in components (`<h2>Системний девелопмент…</h2>`). When v2 adds Sanity, every page needs a rewrite: split strings out, wire portable-text, reshape data. Worst: translation-ready content (RU/EN later, §11.13) needs the same rewrite *again*. Triple migration cost.

**Why it happens:**
"MVP is throwaway, we'll fix it later." Except the MVP is the thing the client approves, which means it becomes the spec, which means its structure becomes load-bearing.

**How to avoid:**
1. Even in MVP, keep all user-facing strings in `src/content/` — one TS module per page, exports an object. Components import and consume. Sanity migration later = swap the import source; structure is preserved.
2. For richer content (§8 seven-block methodology with inline emphasis), use a TS `Block[]` type from day 1, not raw JSX. Sanity's portable-text maps cleanly.
3. Project data (`src/data/projects.ts`, already in PROJECT.md CON-02) — extend the pattern to content. Anything a marketer would edit goes in `/content` or `/data`.

**Warning signs:**
- A 60-line paragraph of Ukrainian text appears as a raw JSX literal in a component file.
- Same string appears in two places (duplication = missing abstraction).
- Client asks "change word X" → you grep across 5 component files.

**Phase to address:** Phase 2 (data layer), before any page component is built.

---

### Pitfall 8: Hero image LCP regression

**What goes wrong:**
The hero section (home page + each ЖК page) is the Largest Contentful Paint in 95% of page loads. Dev drops a 2.4MB aerial render into `/public`, hides it behind `opacity-0 → 1` Motion reveal (which doesn't help — image still loads eagerly). Lighthouse Performance drops to 62. PROJECT.md QA-02 requires Lighthouse ≥90 across all four categories; this one image can block the whole budget (200KB gzip JS budget + hero ≤200KB per CON/CONSTRAINTS is specifically about this).

**Why it happens:**
Desktop-first 1920×1080 → developer assumes "large screen, use high-res image." Animation masking the image makes the dev *feel* the image is lazy when it isn't.

**How to avoid:**
1. Hero image: WebP (or AVIF, see pitfall 9) at 1920px wide, compressed to ≤200KB (PROJECT.md already states this budget).
2. `<link rel="preload" as="image" href="/hero-ukey.webp" fetchpriority="high">` in `index.html` for the home hero specifically. For per-page heroes (Etno Dim, construction log), use the route component's head.
3. First viewport image must NOT be lazy-loaded; `loading="lazy"` ONLY below-the-fold. Common dev mistake: lazy-load everything including hero.
4. Motion reveal pattern: animate `opacity` only, never animate `display`/mount. The image must be in the DOM from t=0 so the browser can prioritize it.

**Warning signs:**
- Lighthouse LCP > 2.5s on desktop.
- Network waterfall shows hero image starting >500ms into load.
- `loading="lazy"` on the hero `<img>`.

**Phase to address:** Phase 3 (pages) during hero construction, verified Phase 6 with Lighthouse.

---

### Pitfall 9: AVIF/WebP fallback assumption trap

**What goes wrong:**
Developer uses AVIF for best compression (CONCEPT §9, PROJECT.md constraints mention AVIF). AVIF has no transparent fallback; if a browser doesn't support it, the image is broken (not degraded to JPG, just broken). One client previews the site on corporate Safari 14 (or an older in-house browser), sees blank images, tells the boss "the new site is broken."

**Why it happens:**
AVIF support is newer than WebP. Training data cutoff: AVIF baseline was inconsistent across Safari versions; I cannot verify current state without web access.

**How to avoid:**
1. Use `<picture>` with explicit fallback:
   ```html
   <picture>
     <source srcset="/hero.avif" type="image/avif" />
     <source srcset="/hero.webp" type="image/webp" />
     <img src="/hero.jpg" alt="…" />
   </picture>
   ```
2. Generate all three formats in build step (e.g., `vite-imagetools` or a one-off script). JPG fallback is always safe.
3. If tooling budget is tight: use **WebP + JPG fallback only** (drop AVIF). WebP has universal baseline support and the size difference vs AVIF (~15-20%) doesn't matter on a 5-page site. Training-data confidence: HIGH for WebP baseline; MEDIUM for AVIF being safe-without-fallback in 2026.
4. Client demo on at least one Safari instance before handoff.

**Warning signs:**
- `<img src="/hero.avif">` with no `<picture>` wrapper.
- QA on a non-Chrome browser shows blank image areas.
- `Network` panel shows the image loaded with status 200 but `Content-Length: 0` equivalent — means format rejection.

**Phase to address:** Phase 3 (pages), verified Phase 6 on ≥2 browsers.

---

### Pitfall 10: "Silent displacement" leak via blog-style copy

**What goes wrong:**
CONCEPT §10.2 and memory state: Pictorial/Rubikon silent-displacement rule applies ONLY to Lakeview. Developer or content writer, in an innocent blog post or page heading, writes "ЖК Lakeview (колишній Pictorial Residence)." The whole point of *silent* displacement is to not trigger recall of the old brand. One sentence breaks the multi-year strategy.

**Why it happens:**
Developers skim concept docs. "Silent displacement" reads as jargon; the behavioral rule (never name the old brand) is buried in §10.2 among many hard rules.

**How to avoid:**
1. Hard-code a repo-level denylist lint: grep for `Pictorial`, `Rubikon`, `Пикторіал`, `Рубікон` in `src/` and `src/content/` → fail build if found.
2. Put the forbidden-terms list in a visible `CONTRIBUTING.md` / `brand-system.md` addendum with rationale so future contributors understand *why* these words are banned.
3. At content phase (Phase 2/3), explicit checklist item: "no pre-brand references." Include it in PR template.

**Warning signs:**
- Any mention of Pictorial, Rubikon, or "formerly known as" anywhere in the repo.
- Page content explicitly contrasts "new brand vs old" — that framing is itself a violation.
- Client asks "should we mention the old brand for trust?" — answer is always no, redirect to CONCEPT §10.2.

**Phase to address:** Phase 2 (data/content), enforced by lint rule in CI through all phases.

---

### Pitfall 11: ЖК-card template breaks at the 6th object

**What goes wrong:**
PROJECT.md ZHK-02 and CONCEPT §10 hard-rule 6 state: template must scale to N. In practice, the MVP has 4 ЖК (Lakeview + 3 pipeline with renders + 1 unnamed). Developer designs the grid for "3 in a row" and assumes `flex-wrap` handles growth. At #6, the grid has one orphan card below; at #10 there's a 3+3+3+1 shape. Stage-badge color assignments are hard-coded to the 4 current stages; a new stage ("введено в експлуатацію") has no styling and renders as white-on-white. "Масштабується до N" fails quietly.

**Why it happens:**
"Scales to N" is stated as a rule but not tested. Developer tests with current 4 + 5 data and never seeds a 10-item fixture.

**How to avoid:**
1. In Phase 2 (data layer), create `src/data/projects.fixtures.ts` with 10 synthetic ЖК spanning all 4 Model-Б buckets + an invented 5th bucket. Run the hub page in a Storybook/dev mode with fixtures. If it breaks at N=10, fix before shipping N=4.
2. Stage-to-badge mapping must be a lookup object with a default fallback — never a switch/ladder. Every new `stage` string gets a sensible default badge (neutral muted gray + stage label) even without styling updates.
3. Orphan-card handling: grid must look intentional at 1, 2, 3, 4, 5, 6, 7, 8 items. Use `grid-template-columns: repeat(auto-fill, minmax(…))` or commit to a rule like "if count % 3 !== 0, add `<EmptyCubeCard />` filler using the base cube SVG."

**Warning signs:**
- Project grid with N=6 has a visually orphaned card.
- Adding a 5th stage string causes a runtime error or invisible stage label.
- Hub page only ever tested with the canonical 4+1.

**Phase to address:** Phase 2 (data layer: fixtures), Phase 3 (pages: grid construction with fixtures).

---

### Pitfall 12: Placeholder data becomes permanent ("`{{phone}}`" ships to client)

**What goes wrong:**
CONCEPT §11 lists 8 open client items. PROJECT.md normalizes "`{{placeholder}}`" syntax for phone/address/slugs/etc. Some of these inevitably don't get answered before handoff. Developer ships with `href="#"` on social links (fine), but also with the string "`{{телефон}}`" visible on the footer contact block (not fine — client sees raw template token and questions code quality). Or: a slug decision (`maietok` vs `maetok`) gets silently chosen by the dev and later contradicted by client, breaking URLs already shared.

**Why it happens:**
"Placeholder" visible-in-text and "placeholder" as route-decision collapse into the same concept. Different failure modes.

**How to avoid:**
1. Two distinct classes of placeholder:
   - **Visible text placeholders** (phone, address): render as `—` or as "*(буде опубліковано)*", never as raw `{{token}}`. Contained in one `src/content/placeholders.ts` module so the client can audit what's missing.
   - **Decision placeholders** (slug transliteration, stage model, NTEREST naming): never a placeholder. Pick a default with a visible TODO comment, document the choice in `PROJECT.md` Key Decisions. If client later disagrees, the cost is a redirect rule — cheaper than a wrong choice frozen in URLs after share.
2. Phase 6 (post-deploy QA): grep for `{{`, `TODO`, `FIXME` in built output. Any occurrence in HTML = reject.
3. Build an explicit `/admin-preview` or README section listing every unresolved item with its current placeholder, so client can answer them in one pass rather than discovering them on public pages.

**Warning signs:**
- Raw `{{`, `}}`, `TODO` strings in shipped HTML.
- Client asks about something and dev realizes they silently decided it.
- Two shared URLs collide because slug changed mid-flight.

**Phase to address:** Phase 2 (data: placeholder layer), Phase 5 (deploy: grep-reject build), Phase 6 (QA).

---

### Pitfall 13: Cinematic intro on re-visit = friction

**What goes wrong:**
Home hero has a 3-second parallax reveal + staggered word-by-word title animation. First visit: "wow." Second visit (same session, client reloads to show colleague): 3 seconds of watching an animation they already saw. By the fifth visit in a pitch demo, the client is visibly annoyed. PROJECT.md Core Value is "клієнт отримує URL" — the client will refresh that URL 50 times in the first week.

**Why it happens:**
Cinematic animations optimize for first impression; no one tests the third and tenth visit.

**How to avoid:**
1. Animation gating:
   - Respect `prefers-reduced-motion: reduce` — skip entrance animations entirely. This is also an a11y requirement.
   - Optional: `sessionStorage.getItem('hero-seen')` → on second+ visit in a session, fade in at 2x speed (or skip the parallax and do a 200ms fade).
2. Make the hero parallax idle-state *also* look good. If the animation is the only thing giving the hero presence, the static frame will look dead. Brand-system §5 cube-patterns-as-overlay stays visible regardless of animation.
3. Scroll-jacked sections (pin-and-reveal narratives): **do not use** for this project. Brand is "стримано, предметно"; scroll-jack fights that. Limit scroll-driven motion to subtle parallax + fade-in reveals.

**Warning signs:**
- Any animation that forcibly pauses the user for >500ms of content.
- Scroll feels "sticky" — user scrolls, page doesn't respond as expected.
- `prefers-reduced-motion` is not tested; animations fire regardless.

**Phase to address:** Phase 4 (animations), verified Phase 6 (QA with reduced-motion on).

---

### Pitfall 14: Mobile/tablet "out of scope" = broken in practice

**What goes wrong:**
PROJECT.md explicitly makes mobile v2, QA-01 says "mobile/tablet явно out-of-scope." Reality: client's boss opens the demo URL on an iPhone. Sees layout explosion. Their reaction: "this doesn't even look like a real website." Desktop-first doesn't mean "mobile can look terrible" — it means "mobile can be stripped-down but must not be broken."

**Why it happens:**
"Out of scope" reads as "ignore entirely." In practice even desktop-first projects need a mobile failure mode that isn't embarrassing.

**How to avoid:**
1. Define a literal mobile fallback page: at `<1024px`, show a single-page layout with hero + logo + "Сайт оптимізовано для екранів ≥1280px. Перегляньте на десктопі або напишіть нам: vygoda.sales@gmail.com" + the 4 key CTA links stacked. This is 1 CSS file. It turns "broken site" into "intentional restriction."
2. Alternative: use `clamp()` and `min()` for all major sizing so layout doesn't explode — it just shrinks badly but stays grid-shaped.
3. PROJECT.md QA-01 says "graceful fallback ≥1280px" — honor this. Graceful means "nothing overlaps, nothing overflows, links still work." Test at 1280, 1366, 1440, 1920.

**Warning signs:**
- Opening the demo on an iPhone shows horizontal scroll or text larger than viewport.
- Nav bar wraps badly at 1280.
- Images break out of their containers at intermediate widths.

**Phase to address:** Phase 3 (pages: set width constraints), Phase 5 (deploy: add mobile-fallback page), Phase 6 (QA at 4 widths).

---

### Pitfall 15: Ukrainian typography — uppercase kerning and word-breaking

**What goes wrong:**
Brand system §4 allows uppercase + letter-spacing for captions. Ukrainian has letter combinations (`ЖК`, `ЦК`, `ВИГОДА`) where Montserrat's default uppercase kerning causes visual gaps or cramps. More critically: `ЖК Маєток Винниківський` is a long string that the browser will break at arbitrary points. Default `word-wrap` can leave "ЖК" orphaned on one line and "Маєток Винниківський" on the next — brand reads poorly. `ВИГОДА` wordmark in hero, if set with default letter-spacing, looks too tight at display sizes.

**Confidence:** LOW-MEDIUM (general typography advice, not verified against Montserrat's specific Cyrillic glyph metrics).

**Why it happens:**
Typography scale in brand-system.md §4 doesn't specify letter-spacing (brandbook gap); developer uses Tailwind defaults. Cyrillic combinations behave differently than Latin in the same font.

**How to avoid:**
1. Hero wordmark "ВИГОДА": apply `letter-spacing: 0.04em` at H1 sizes (≥56px), `0.02em` at ≥40px. Test visually against the logo wordmark — they should feel the same density.
2. Uppercase captions (descriptor role, brand-system §4): `letter-spacing: 0.08em` — Ukrainian uppercase needs more tracking than Latin to read cleanly.
3. `ЖК` orphan prevention: use a non-breaking space — `ЖК Маєток…`. Apply at the content layer (store strings with `&nbsp;` / ` `), not per component.
4. For line-height: Ukrainian descenders (`ц`, `щ`, `ї`) and accented ascenders (`ґ`) need slightly more line-height than Latin. Brand-system §4 suggests `line-height: 1.55` for body — verify visually; may need 1.6 if tight.

**Warning signs:**
- "ЖК" appears on one line, project name on the next.
- Uppercase `ВИГОДА` reads as four characters mashed together at large sizes.
- Diacritics on `ґ`/`ї`/`є` clip against the line above.

**Phase to address:** Phase 1 (tokens: add `--tracking-*` and `--leading-*` vars), Phase 3 (pages: apply to components), Phase 6 (visual QA against brandbook wordmark).

---

### Pitfall 16: `will-change: transform` layer explosion

**What goes wrong:**
Developer adds `will-change: transform` to every animating element "for performance." At 30+ elements (scroll-reveal cards, parallax cube, hover states, hero sections), the GPU creates a composite layer for each. Memory balloons, frame rate drops on lower-spec laptops, and scroll feels heavy — the exact opposite of the intended optimization. Chromium has warned about this publicly; MDN's `will-change` docs explicitly say "use sparingly."

**Why it happens:**
`will-change` is advertised as "performance hint." Cargo-culted onto every animated element. Motion components sometimes apply it automatically; adding it manually on top creates double-up.

**How to avoid:**
1. Don't add `will-change: transform` manually to Motion elements — Motion already manages compositor hints.
2. For the parallax cube overlay (the one long-running animation in the hero), use `transform: translate3d(…)` + `backface-visibility: hidden` — enough to promote to a layer without `will-change`.
3. If GPU memory is a concern (and it will be on the "showcase" 4K client monitor), audit with Chrome DevTools → Rendering → "Layer borders." Target: <10 composite layers on any page. Currently typical: 3–5 on a well-built page.

**Warning signs:**
- `will-change: transform` appears >3 times in the repo.
- DevTools Layers panel shows 20+ composite layers.
- Scroll is janky specifically on pages with many reveal animations.

**Phase to address:** Phase 4 (animations), verified Phase 6 (Performance tab profiling).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded copy as JSX literals | Ship faster, no data-layer ceremony | Every i18n or CMS migration = touch every component file | Never — use `src/content/` from day 1 (cost: ~1 hour setup) |
| `HashRouter` over `BrowserRouter` | Zero 404 config | Ugly URLs forever; social-preview weaker | Acceptable for pure internal demos; for client-facing URL, use BrowserRouter + 404.html trick |
| Single monolithic `App.tsx` | Start animating immediately | Every new page = mega-diff; route lazy-loading impossible | Only if shipping in ≤3 days total; otherwise split routes from Phase 1 |
| Inline `transition={{…}}` on Motion components | No abstraction cost | Easing drift across site (pitfall 3) | Never in this project — brand demands animation consistency |
| AVIF without JPG fallback | Save 20-30% bytes | Broken images on older browsers | Acceptable only if client explicitly confirms target browsers exclude Safari ≤14 |
| `any`-typed project data instead of discriminated-union stages | No type system wrestling | Adding a 5th stage silently allows bugs | Never — stages are the product's central concept, type them properly |
| Deploy from local `npm run build` → gh-pages branch manually | Ship in minutes | "Works on my machine" drift, no audit trail | Acceptable for first preview; move to GitHub Actions before client handoff |
| Render `/renders/ЖК Етно Дім/*` paths with Cyrillic + spaces in prod | Works in Vite dev | URL-encoding surprises, CDN edge issues, ugly in DevTools | Never ship — rename to transliterated folders in `public/renders/etno-dim/` during Phase 2 |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Pages + React Router | BrowserRouter with no 404 fallback → hard-refresh 404 | Either HashRouter, or BrowserRouter + `public/404.html` SPA-redirect pattern + `public/.nojekyll` |
| Vite `base` + Router `basename` | Forgetting one or the other → broken asset paths OR broken route links | Both must match: `vite.config.ts base: '/vugoda-website/'` AND `<BrowserRouter basename="/vugoda-website">` |
| `@fontsource/montserrat` | Importing all 18 weights "just in case" → 1MB of fonts | Import only Regular, Medium, Bold per brand-system §4 (`import '@fontsource/montserrat/400.css'` etc). Use `unicode-range` subset for Cyrillic if size matters. |
| Motion + React 19 StrictMode | Double-mount in dev makes `useInView` fire twice, easily mistaken for a bug | Understand it's a StrictMode artifact; production is fine; don't add "fix" code |
| `mailto:vygoda.sales@gmail.com` forms | Building a "real" form with React state that just opens a mailto URL — users don't get feedback | For MVP: a simple `<a href="mailto:…?subject=…&body=…">` styled as a button. No form state at all until there's a real endpoint. |
| GitHub Actions deploy | Using `peaceiris/actions-gh-pages` on main branch without `permissions:` block → 403 | Include `permissions: { contents: write, pages: write, id-token: write }` and use `actions/deploy-pages` (official) over third-party |
| Image imports in Vite | `import hero from '/public/hero.jpg'` (wrong path prefix) | Either put in `public/` and reference as `/hero.jpg`, OR in `src/assets/` and `import`. Don't mix. Prefer `public/` for large renders so Vite doesn't hash-process them. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Hero image not preloaded | LCP 3–5s | `<link rel="preload" as="image" fetchpriority="high">` + non-lazy img | Every page load, measurable in Lighthouse |
| 50 construction photos loaded eagerly on `/construction-log` | Page weight 20MB+, slow scroll | `loading="lazy"` + smaller thumbnail + click-to-open full-size OR virtualized grid | From the first visit — 50 photos at full res is guaranteed overload |
| WebP converts done at runtime / from originals in `/construction/*.jpg` | Server-less can't convert; ships 8MB JPGs | Pre-convert at build time (vite-plugin-imagemin or one-off sharp script) | Every page load of /construction-log |
| `motion.div` on every card with `whileInView` | 30+ IntersectionObservers, jank on slower laptops | Use one parent `motion.section` with `variants` + `staggerChildren` — single observer | At ~20+ simultaneously-animating elements |
| Re-running entrance animations on route re-enter | Feels repetitive, but also re-creates layers | `viewport={{ once: true }}` OR session-scoped skip | Second visit within a session |
| Route-code-splitting forgotten | All 5 pages in one bundle, 200KB budget blown | `React.lazy(() => import('./pages/Projects'))` per route | When total bundle exceeds budget (CONSTRAINTS: 200KB gzip JS) |
| Cube SVG pattern inline on every page | 20KB SVG repeated across 5 routes, dupe parse cost | Extract to `public/patterns/cube.svg` + reference with `<use href>` or `<img>` | When pattern is on 3+ routes |

## Security Mistakes

This is a static marketing site with no forms (`mailto:` only) and no auth. Most OWASP concerns don't apply. Domain-specific ones:

| Mistake | Risk | Prevention |
|---------|------|------------|
| `dangerouslySetInnerHTML` for Ukrainian content with quotes | If content later comes from Sanity/CMS, injected HTML is an XSS vector | Never use dangerouslySetInnerHTML for MVP; when CMS arrives, parse portable-text, don't raw-HTML |
| Email on page as plain text (`vygoda.sales@gmail.com`) | Scraper spam | Low risk for a demo; accept it. Don't use JS obfuscation (a11y-breaking, minor benefit). `mailto:` is the de-facto standard. |
| EDRPOU/license number leaked in build but wrong | Publishing wrong legal identifiers = brand credibility hit | Triple-check EDRPOU 42016395 and license date 27.12.2019 against client documents before deploy |
| Forms that claim to submit but go to `mailto:` | User thinks data was sent, nothing happened (if they have no mail client) | Make it visibly a mailto — button says "Написати на email" with address visible, not a fake "Submit" form |
| GitHub Pages URL exposed publicly with client-confidential data | Anything in `src/` (internal notes, pricing drafts) is publicly readable via `view-source` or GitHub repo | Don't commit draft pricing, client meeting notes, internal speculations to the repo. Keep `.planning/` in the same repo is fine (it's process), but review before first deploy. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| CTA "Переглянути проекти" on hero but hub is only 3-scroll-sections below | User clicks CTA expecting navigation; gets scroll-to-section; disoriented | Either make hero CTA a real route link (`/projects`), or make its behavior obvious (subtle down-arrow + "Прокрутіть нижче") |
| Pipeline cards all say "в роботі" → visually identical | Hub page reads as "nothing's happening here" | Явно-марковані стадії (CONCEPT §6.2 requires) — different stage labels with distinct visual weight |
| Construction-log photos with caption "Січень 2026 — фундамент, секція 1" but no zoom/lightbox | User wants to see detail, can't | Add lightbox behavior (one library: `yet-another-react-lightbox` or native `<dialog>`) — photos are the trust-layer, must be inspectable |
| Lakeview card CTA says "Детальніше" (looks like internal nav) but redirects off-site | User doesn't expect to leave; bounces or back-buttons | CTA text: "Перейти на сайт проекту ↗" — external-arrow glyph + explicit wording |
| "Підписатись на оновлення" on ЖК pages → form that just opens mail client | User expects to enter email, not write one | Phase 1: explicit text "Напишіть нам, щоб підписатися на оновлення" + mailto with pre-filled subject. Phase later: real form. |
| 4 pipeline objects + 1 unnamed = 5 "in progress," user can't distinguish | "Почему все 'в роботі'?" → confusion | Agregatovaniy ryadok (CONCEPT §6.2 Level 3) — put the unnamed explicitly apart with a 1-cube marker |
| Hover states only, no touch/click feedback | On touch screens (even hybrid laptops), cards feel dead | Either `:focus-visible` equivalent for active state, or accept that desktop-first = mouse-first |

## "Looks Done But Isn't" Checklist

- [ ] **Hero:** Parallax plays on first load — verify it still renders correctly with `prefers-reduced-motion: reduce`.
- [ ] **Hero:** WebP loads — verify JPG fallback actually exists at the URL it's supposed to.
- [ ] **Nav:** Highlights current page — verify on all 5 routes (HOME, HUB, ZHK, LOG, CTC), not just first two.
- [ ] **Routing:** All 5 pages link correctly — verify hard-refresh on `/projects`, `/zhk/etno-dim`, `/construction-log`, `/contact` (not just clicking from home).
- [ ] **Hub page:** Filter works — verify all 4 Model-Б buckets filter correctly, including the empty "Здано (0)" case which must still render visibly.
- [ ] **ЖК template:** Scales — verify with a 10-project fixture dataset, not just the canonical 4.
- [ ] **Construction log:** 50 photos load — verify page weight <2MB total, photos lazy-load below fold.
- [ ] **Forms:** Contact CTA opens mail client — verify `mailto:` actually opens something, not a 404.
- [ ] **Placeholders:** No `{{` or `TODO` in shipped HTML — grep the `dist/` folder output.
- [ ] **Silent displacement:** No mention of Pictorial/Rubikon — grep `src/`, `dist/`, and `public/` for all variants including Cyrillic transliteration.
- [ ] **Brand colors:** Only 6 hex values used — grep output of `dist/**/*.css` and `dist/**/*.html` for hex patterns; list unique values; verify ⊆ {6 canonicals}.
- [ ] **Focus states:** Every interactive element has visible focus on Tab — manual QA with keyboard only.
- [ ] **Reduced motion:** Site is usable with `prefers-reduced-motion: reduce` — all essential info reachable without animation.
- [ ] **Lighthouse:** All 4 categories ≥90 — desktop profile specifically; mobile intentionally not tested (PROJECT.md QA-01).
- [ ] **Cyrillic:** Project name `ЖК Маєток Винниківський` doesn't line-break in awkward places — view at 1280, 1440, 1920.
- [ ] **Small text contrast:** Footer EDRPOU/license reads as `text` color at ≥80% opacity, not `text-muted` (pitfall 6).
- [ ] **Deep links:** `https://.../vugoda-website/zhk/etno-dim` loads directly from a cold tab — test on incognito.
- [ ] **Mobile fallback:** Opening on iPhone shows the "desktop-optimized" notice, not a broken layout (pitfall 14).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Palette drift caught post-deploy | LOW | Grep for non-token hex values; replace with token; re-deploy. 1–2 hours if caught within first PR, days if drift is widespread. |
| 404 on deep links in production | LOW | Add `public/404.html` with SPA-redirect trick; redeploy. <1 hour. |
| Animation easing inconsistency | MEDIUM | Extract `motion/tokens.ts`; find-and-replace inline `transition` objects; visually QA. 4–8 hours depending on spread. |
| Muted-text a11y fail across site | MEDIUM | Add lint rule; fix flagged lines; may require minor design adjustments where legibility drops. 1 day. |
| Slug decision contradicted by client post-share | HIGH | New slug = new URL. Add 301-equivalent (Pages doesn't support redirects natively, so SPA-level JS redirect on old slug → new). Shared links broken in email archives forever. Best prevention is committing to slug early. |
| Silent-displacement leak caught post-launch | HIGH | Content fix is easy (rewrite + deploy). Brand damage if client/public saw it is permanent. Deploy lint rule retroactively + audit git history for any past mentions. |
| Lighthouse <90 at handoff | MEDIUM | Most fixes are hero-image + code-splitting. 1 day of perf work typically moves 60→90. |
| ЖК template breaks with real-world content (e.g., very long project name) | LOW-MEDIUM | CSS `text-wrap: balance` / `overflow-wrap`; flex constraints. 2–4 hours. Preventable via fixtures (pitfall 11). |
| Renders not displaying (Cyrillic path encoding issue) | LOW | Rename folders in `public/renders/` to transliterated paths; update data object; redeploy. <2 hours. **Do this preemptively in Phase 2**, don't ship with Cyrillic paths. |
| Placeholder `{{token}}` visible on live site | LOW | Fix content string, redeploy. But first impression with client is damaged. |

## Pitfall-to-Phase Mapping

**Suggested phase vocabulary** (matches `milestone_context`): tokens/setup · layout shell · data layer · pages · animations · deploy · post-deploy.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Silent palette drift | tokens/setup | CI grep for non-token hex values; every PR |
| 2. GitHub Pages SPA 404 | deploy | Hard-refresh smoke test on all 5 routes post-deploy |
| 3. Animation easing mismatch | animations | Grep `transition={{` count; motion-tokens module enforces |
| 4. Scroll-trigger / AnimatePresence conflict | animations | Navigation matrix test Home↔all routes, all reveals |
| 5. Invisible focus states | tokens/setup (base CSS) | Keyboard-only walkthrough in post-deploy QA |
| 6. `#A7AFBC` on small text | tokens/setup (usage rule) + pages (enforcement) | axe-core run; manual legibility check on footer |
| 7. Hardcoded content | data layer | No JSX literal paragraphs; `src/content/` exists and is used |
| 8. Hero LCP regression | pages (hero build) | Lighthouse Performance ≥90 per page |
| 9. AVIF without fallback | pages (image pipeline) | Test on Safari; `<picture>` element audit |
| 10. Silent displacement leak | data layer (content module) | CI grep denylist: Pictorial, Rubikon (+ Cyrillic variants) |
| 11. ЖК grid breaks at N | data layer (fixtures) + pages | Storybook/dev view with 10-project fixture |
| 12. Placeholder shipped | data layer (placeholder module) + deploy | Build-output grep for `{{`, `TODO`, `FIXME` |
| 13. Cinematic intro on re-visit | animations | `prefers-reduced-motion` QA + session-based skip |
| 14. Mobile broken, not graceful | pages (width constraints) + deploy (fallback page) | Manual check at 360, 768, 1024, 1280 widths |
| 15. Ukrainian typography | tokens/setup (tracking/leading vars) + pages | Visual QA against brandbook wordmark |
| 16. `will-change` layer explosion | animations | DevTools Rendering → Layer borders; <10 composite layers |

**Phase ordering implication:** tokens/setup must come first (pitfalls 1, 5, 6, 15 all root here). Data layer before pages (pitfalls 7, 10, 11, 12). Animations after pages (so content structure is stable before motion is layered on). Deploy late but not last — post-deploy QA is where most of these get verified; budget real time for it (suggest 1 full phase, not a trailing task).

**Open client questions (CONCEPT §11) that map to pitfalls:**
- §11.6 slug transliteration → pitfall 12 (decision placeholder). Decide in Phase 2.
- §11.4 Model А/Б/В → pitfall 11 (template scaling). Decide in Phase 2.
- §11.1/§11.2 phone/address → pitfall 12 (visible placeholder). Render as "—" until answered.
- §11.5 methodology verification → pitfall 13-adjacent: ships with ⚠ markers per PROJECT.md CON-01; don't silently drop the marks (skeptic-pass rule).

## Sources

- `brand-system.md` §3 (contrast math, measured with WCAG calculator per author's note) — **HIGH** authority for pitfalls 5, 6.
- `brand-system.md` §4 (typography spec with explicit brandbook gaps) — **HIGH** authority for pitfalls 1, 15.
- `brand-system.md` §7 (gaps: no state colors, no layout grid, no motion spec) — **HIGH**, drives pitfalls 1, 3.
- `КОНЦЕПЦІЯ-САЙТУ.md` §10 (hard rules incl. silent displacement, closed palette, scale-to-N) — **HIGH** authority for pitfalls 1, 10, 11.
- `КОНЦЕПЦІЯ-САЙТУ.md` §11 (8 open items) — **HIGH**, drives pitfall 12 and informs phase ordering.
- `PROJECT.md` Constraints (`base: '/vugoda-website/'`, Lighthouse ≥90, hero ≤200KB, WCAG-AA floor) — **HIGH**, drives pitfalls 2, 6, 8.
- `PROJECT.md` Out-of-Scope (Next.js, Three.js, mobile-responsive, team photos) — **HIGH**, bounds pitfalls 14, 16.
- Training-data knowledge of React Router / GitHub Pages / Vite interactions — **MEDIUM**, pitfalls 2, 4, and Integration Gotchas table. Recommend re-verifying at Phase 5 against current Vite and react-router-dom docs.
- Training-data knowledge of Motion (framer-motion) API — **MEDIUM**, pitfalls 3, 4, 13, 16. API names current as of training cutoff; verify on Motion docs at Phase 4.
- WebSearch was not available this session — could not verify current AVIF browser baseline, current spa-github-pages pattern maintenance status, or Motion 12.x-specific API changes. Flagged inline where relevant.

---
*Pitfalls research for: brand-constrained developer-built corporate React SPA, Ukrainian real-estate, GitHub Pages deploy*
*Researched: 2026-04-24*
