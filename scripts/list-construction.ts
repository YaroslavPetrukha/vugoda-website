/**
 * scripts/list-construction.ts — manual helper that prints a TS-literal
 * photos[] array per month for pasting into src/data/construction.ts.
 *
 * Usage: `npm run list:construction`
 *
 * Prints (to stdout) for each month folder in /construction/ (excluding
 * _social-covers): a TS-snippet with photos as `{ file, alt }` entries where
 * alt defaults to «Будівельний майданчик, {month-UA} {year}». The author
 * copy-pastes the snippet into construction.ts and adds captions by hand
 * per CONCEPT §7.9 («без хвастощів»).
 *
 * Manual rather than automatic (per CONTEXT Claude's Discretion + D-21): the
 * semantic caption («фундамент, секція 1») is a thinking task, not a refresh.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Use fileURLToPath — .pathname percent-encodes non-ASCII repo paths
// (the "Проєкти" folder in this machine's checkout) and breaks existsSync.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CSRC = join(ROOT, 'construction');

/** Month-key → Ukrainian label. Keys are the folder names we copy. */
const LABELS: Record<string, string> = {
  'dec-2025': 'грудень 2025',
  'jan-2026': 'січень 2026',
  'feb-2026': 'лютий 2026',
  'mar-2026': 'березень 2026',
};

const months = Object.keys(LABELS);

for (const month of months) {
  const folder = join(CSRC, month);
  if (!existsSync(folder)) {
    console.error(`[list-construction] missing: ${folder}`);
    continue;
  }
  const files = readdirSync(folder)
    .filter((f) => f.endsWith('.jpg') && !f.startsWith('.'))
    .sort();

  const altPrefix = `Будівельний майданчик, ${LABELS[month]}`;

  console.log(`\n// ---- ${month} (${files.length} files) ----`);
  console.log(`photos: [`);
  for (const file of files) {
    console.log(`  { file: '${file}', alt: '${altPrefix}' },`);
  }
  console.log(`],`);
}
