/**
 * scripts/build-og-image.mjs — Phase 6 D-28, D-29.
 *
 * Build-time SVG → PNG export for QA-03 social-unfurl artifacts:
 *   - public/og-image.png         (1200×630, source: brand-assets/og/og.svg)
 *   - public/apple-touch-icon.png (180×180,  source: brand-assets/favicon/favicon-32.svg)
 *   - public/favicon-32.png       (32×32,    source: brand-assets/favicon/favicon-32.svg)
 *
 * Pipeline: sharp(svgBuffer, {density: 300}).resize(w, h, {fit:'contain',
 * background:'#2F3640'}).png({quality:85, compressionLevel:9}).toFile(out).
 *
 * Wired into `prebuild` and `predev` script chains AFTER copy-renders.ts +
 * optimize-images.mjs (Phase 6 plan 06-06 package.json edit). Vite then
 * copies public/ → dist/ verbatim, so the 3 PNGs land at the correct
 * served paths.
 *
 * Idempotent: skips files where output mtime >= source mtime (same pattern
 * as optimize-images.mjs). Fast on repeat builds (<200ms). First run on
 * a fresh checkout regenerates all 3 PNGs.
 *
 * Generated outputs are gitignored (Phase 6 plan 06-03 added 3 entries to
 * .gitignore — public/og-image.png, public/apple-touch-icon.png,
 * public/favicon-32.png). SVG sources in brand-assets/ are the source of
 * truth.
 *
 * Path construction uses fileURLToPath(new URL('..', import.meta.url))
 * per Plan 02-03 — repo checkout path may contain non-ASCII characters
 * (e.g. "Проєкти") which percent-encode if you use .pathname directly.
 *
 * Font handling note: brand-assets/og/og.svg has the Cyrillic «ВИГОДА»
 * wordmark PRE-PATHED (Phase 6 D-30 + RESEARCH §Pitfall 3 — Linux GH
 * runner has no Cyrillic Montserrat available; pre-pathing eliminates
 * the font dependency). The sub-line «Системний девелопмент» falls back
 * to DejaVu Sans on Linux runner per D-30 carve-out (acceptable at 32px).
 * favicon-32.svg has no text — purely glyph paths — so no font issue.
 *
 * Why .mjs not .ts: avoids @types/sharp surface in tsconfig.scripts.json.
 * Plain ESM JS runs natively under Node ≥20.
 */
import sharp from 'sharp';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

const TARGETS = [
  { src: 'brand-assets/og/og.svg',              out: 'public/og-image.png',         w: 1200, h: 630 },
  { src: 'brand-assets/favicon/favicon-32.svg', out: 'public/apple-touch-icon.png', w: 180,  h: 180 },
  { src: 'brand-assets/favicon/favicon-32.svg', out: 'public/favicon-32.png',       w: 32,   h: 32  },
];

for (const { src, out, w, h } of TARGETS) {
  const srcPath = join(ROOT, src);
  const outPath = join(ROOT, out);

  if (!existsSync(srcPath)) {
    console.error(`[build-og-image] FAIL — source missing: ${src}`);
    process.exit(1);
  }

  // Idempotent skip — same pattern as optimize-images.mjs
  if (existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
    console.log(`[build-og-image] skip ${out} (up-to-date)`);
    continue;
  }

  const svgBuf = readFileSync(srcPath);
  await sharp(svgBuf, { density: 300 })
    .resize(w, h, { fit: 'contain', background: '#2F3640' })
    .png({ quality: 85, compressionLevel: 9 })
    .toFile(outPath);

  console.log(`[build-og-image] wrote ${out} (${w}×${h})`);
}

console.log('[build-og-image] complete');
