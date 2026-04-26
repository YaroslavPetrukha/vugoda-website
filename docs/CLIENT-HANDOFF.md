# Client Handoff — Pre-deploy checklist

> **Status:** Phase 6 — items the user must confirm with the client BEFORE merging Phase 6 to `main`.
> Phase 7 will EXTEND this document with the remaining 8 open §11 client items.

## Item 1: GitHub-account confirmation (Phase 6 D-26 + D-38)

Phase 6 ships with hardcoded production URLs pointing to `https://yaroslavpetrukha.github.io/vugoda-website/` (Phase 6 CONTEXT.md §D-21, §D-23, §D-31). If the user's GitHub account name is **NOT** `yaroslavpetrukha`, the following hardcoded occurrences MUST be edited in a single PR before deploying.

**Replacement value:** if the actual account is `<account>`, replace `yaroslavpetrukha` with `<account>` in:

| File | Line shape | Count |
|------|------------|-------|
| `index.html` | `<meta property="og:url" content="https://yaroslavpetrukha.github.io/vugoda-website/" />`<br/>`<meta property="og:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<meta name="twitter:image" content="https://yaroslavpetrukha.github.io/vugoda-website/og-image.png" />`<br/>`<link rel="canonical" href="https://yaroslavpetrukha.github.io/vugoda-website/" />` | 4 occurrences |
| `.lighthouserc.cjs` | The `ci.collect.url` array — 5 URLs, all under `https://yaroslavpetrukha.github.io/vugoda-website/...` | 5 occurrences |
| (no other source files affected) | `src/content/mobile-fallback.ts` and `src/data/projects.ts` reference `yaroslavpetrukha.github.io/Lakeview/` (the EXTERNAL Lakeview site, NOT the vugoda-website demo) — these do **NOT** change with this account swap. | 0 (do not edit) |

**Total edits:** 9 line changes across 2 files (index.html + .lighthouserc.cjs).

**One-line `sed` to apply:**

```bash
sed -i.bak "s/yaroslavpetrukha\\.github\\.io\\/vugoda-website/<account>.github.io\\/vugoda-website/g" index.html .lighthouserc.cjs
```

Replace `<account>` with the actual GitHub account name. The `.bak` files are backups in case of typo; delete them after a successful build (`rm index.html.bak .lighthouserc.cjs.bak`).

**Verification after edit:**

1. `npm run build` exits 0 with `[check-brand] 7/7 checks passed`
2. `grep -r "yaroslavpetrukha.github.io/vugoda-website" index.html .lighthouserc.cjs` returns NO MATCHES (replacement complete)
3. `grep -r "<account>.github.io/vugoda-website" index.html .lighthouserc.cjs` returns the expected 9 occurrences
4. The `og:url`, `og:image`, `twitter:image`, and `canonical` URLs all resolve to the new account's GH Pages
5. The Lakeview external link in `src/content/mobile-fallback.ts` and `src/data/projects.ts` STILL points to `https://yaroslavpetrukha.github.io/Lakeview/` (this is the Lakeview product site owned by Yaroslav, separate from the corporate site)

### Why this is hardcoded in v1 (and not env-driven)

Per Phase 6 CONTEXT.md §D-26: env-driven URLs (e.g., reading from `OG_URL` env var, with `vite.config.ts` `transformIndexHtml` hook to substitute at build time) are deferred to v2. Trade-offs:

| Hardcoded (v1, current) | Env-driven (v2, deferred) |
|-------------------------|---------------------------|
| Simple — visible in source, auditable, no Vite plugin gymnastics | More flexible — one-PR account/domain swap, but adds a build-time templating layer |
| One-time edit if account differs (this checklist) | Zero edits per environment but need to set `OG_URL=...` in CI + local dev |
| Sufficient for a 5-URL demo handoff | Useful when adding custom domain (v2 INFR2-02) |

The recommended migration trigger is the v2 custom domain switch — at that point `og:url` etc. will move from `*.github.io` to `vugoda.com.ua` (or similar) and an env var is the natural way to manage the change.

## Phase 7 will extend this document

Phase 7 (post-deploy QA & client handoff) ships the 8 open KOНЦЕПЦІЯ-САЙТУ.md §11 items in this same file:

- Phone (em-dash placeholder)
- Юр. адреса (em-dash placeholder)
- Pipeline-4 фінальна назва (currently «Без назви»)
- Model-Б stage-bucket confirmation
- Methodology §8 blocks 2/5/6 verification (currently flagged with warning marker)
- Slug transliteration: `maietok` vs `maetok` for Маєток Винниківський
- «NTEREST» without «I» — confirm or reject
- Етно Дім вул. Судова — confirm or correct address

These are NOT Phase 6 scope — Phase 6 ships the GitHub-account confirmation only.
