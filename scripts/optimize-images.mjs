/**
 * scripts/optimize-images.mjs
 *
 * Build-time image optimizer per Phase 3 D-19/D-20.
 *
 * Reads source JPG/PNG/WebP from public/renders/**\/* and public/construction/**\/*
 * (after copy-renders.ts has populated public/) and emits sharp-encoded
 * AVIF/WebP/JPG triples at 3 widths into public/{renders,construction}/{slug,month}/_opt/.
 *
 * Idempotent: skips files where output mtime >= source mtime. First run on a fresh
 * checkout is ~30–60s for ~70 sources. Subsequent runs are <500ms (mtime stat only).
 *
 * Runs as `prebuild`/`predev` step AFTER copy-renders.ts:
 *   "prebuild": "tsx scripts/copy-renders.ts && node scripts/optimize-images.mjs"
 *
 * Why .mjs (not .ts): avoids @types/sharp surface in tsconfig.scripts.json.
 * Plain ESM JS runs natively under Node ≥20.
 *
 * Path construction uses fileURLToPath(new URL('..', import.meta.url)) per
 * Plan 02-03's pattern — repo checkout path may contain non-ASCII characters
 * (e.g. "Проєкти") which percent-encode if you use .pathname directly.
 */

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PUBLIC = join(ROOT, 'public');

const isImage = (f) => /\.(jpg|jpeg|png|webp)$/i.test(f);
const stripFormatSuffix = (f) => f.replace(/\.(jpg|jpeg|png|webp)$/i, '');

const FORMATS = [
  { ext: 'avif', encoder: (s) => s.avif({ quality: 50, effort: 4 }) },
  { ext: 'webp', encoder: (s) => s.webp({ quality: 75 }) },
  { ext: 'jpg',  encoder: (s) => s.jpeg({ quality: 80, mozjpeg: true }) },
];

async function optimizeFile(srcPath, destDir, widths) {
  const filename = basename(srcPath);
  const base = stripFormatSuffix(filename);
  const srcMtime = statSync(srcPath).mtimeMs;

  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  for (const w of widths) {
    for (const { ext, encoder } of FORMATS) {
      const outPath = join(destDir, `${base}-${w}.${ext}`);
      // Idempotency: skip if existing output is newer than source.
      if (existsSync(outPath) && statSync(outPath).mtimeMs >= srcMtime) continue;
      const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
      await encoder(pipeline).toFile(outPath);
    }
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '_opt') continue;       // never recurse into output dir
    if (entry.name.startsWith('.')) continue;  // skip dotfiles (.DS_Store etc.)
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && isImage(entry.name)) yield full;
  }
}

async function processTree(treeDir, widths) {
  if (!existsSync(treeDir)) {
    console.warn(`[optimize-images] missing tree: ${treeDir}`);
    return;
  }
  const files = [...walk(treeDir)];
  console.log(`[optimize-images] ${relative(ROOT, treeDir)}: ${files.length} sources`);
  for (const src of files) {
    const destDir = join(src, '..', '_opt');
    await optimizeFile(src, destDir, widths);
  }
  console.log(`[optimize-images] ${relative(ROOT, treeDir)}: done`);
}

await processTree(join(PUBLIC, 'renders'), [640, 1280, 1920]);
await processTree(join(PUBLIC, 'construction'), [640, 960]);
console.log('[optimize-images] complete');
