/**
 * scripts/copy-renders.ts — pre-build: translit + copy /renders /construction into /public
 *
 * Runs as `prebuild` AND `predev` npm hooks via `tsx scripts/copy-renders.ts`.
 * Idempotent (wipes destinations before copy). No npm deps — uses only node:fs
 * and node:path.
 *
 * Translit rationale (ARCHITECTURE §3 Q8):
 *   Browsers auto-URL-encode Cyrillic paths inconsistently; GH Pages tar pipeline
 *   has NFC/NFD normalization edge cases; slug<->asset-path alignment requires
 *   ASCII folder names regardless.
 *
 * Skip rationale:
 *   /construction/_social-covers/ is Lakeview-branded (Cormorant Garamond
 *   typography) — hard-rule brand conflict per CONCEPT §7.9. Never copied.
 *
 * .DS_Store filter rationale (02-RESEARCH §Pitfall B):
 *   cpSync with {recursive: true} copies all files including macOS .DS_Store.
 *   The filter prevents .DS_Store from polluting public/ and downstream dist/.
 */
import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Use fileURLToPath, NOT .pathname — when the repo is checked out at a path
// containing non-ASCII characters (e.g. the Ukrainian "Проєкти" folder), the
// URL .pathname is percent-encoded and fails existsSync. fileURLToPath decodes
// it back to a filesystem-usable path. See 02-RESEARCH §"Translit Script: Edge
// Cases" — edge case 5 ("import.meta.url + Cyrillic path").
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const RENDERS_SRC = join(ROOT, 'renders');
const RENDERS_DST = join(ROOT, 'public/renders');
const CONSTRUCTION_SRC = join(ROOT, 'construction');
const CONSTRUCTION_DST = join(ROOT, 'public/construction');

/** Exclude macOS .DS_Store. Any other files filtered here become an explicit
 *  policy decision — add sparingly. */
const FILTER = (src: string): boolean => !src.endsWith('.DS_Store');

/** Cyrillic folder name → ASCII slug. Slugs mirror src/data/projects.ts slugs. */
const RENDER_MAP: Record<string, string> = {
  'likeview':                 'lakeview',              // fixes misspelling
  'ЖК Етно Дім':              'etno-dim',
  'ЖК Маєток Винниківський':  'maietok-vynnykivskyi',
  'Дохідний дім NTEREST':     'nterest',
};

/** Construction months to copy. Already ASCII, no translit needed.
 *  _social-covers intentionally omitted per CONCEPT §7.9. */
const CONSTRUCTION_MONTHS = ['dec-2025', 'jan-2026', 'feb-2026', 'mar-2026'];

// ---- Renders ----
if (existsSync(RENDERS_DST)) rmSync(RENDERS_DST, { recursive: true });
mkdirSync(RENDERS_DST, { recursive: true });

for (const [src, dst] of Object.entries(RENDER_MAP)) {
  const from = join(RENDERS_SRC, src);
  const to = join(RENDERS_DST, dst);
  if (!existsSync(from)) {
    console.warn(`[copy-renders] missing: ${from}`);
    continue;
  }
  cpSync(from, to, { recursive: true, filter: FILTER });
  console.log(`[copy-renders] ${src} → ${dst}`);
}

// ---- Construction ----
if (existsSync(CONSTRUCTION_DST)) rmSync(CONSTRUCTION_DST, { recursive: true });
mkdirSync(CONSTRUCTION_DST, { recursive: true });

for (const month of CONSTRUCTION_MONTHS) {
  const from = join(CONSTRUCTION_SRC, month);
  if (!existsSync(from)) {
    console.warn(`[copy-renders] missing construction: ${from}`);
    continue;
  }
  cpSync(from, join(CONSTRUCTION_DST, month), { recursive: true, filter: FILTER });
}

console.log('[copy-renders] construction done — _social-covers skipped per CONCEPT §7.9');
