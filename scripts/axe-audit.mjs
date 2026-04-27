// scripts/axe-audit.mjs
// One-shot Phase 7 axe-core audit. NOT wired to prebuild/postbuild/deploy.yml (D-17).
// Tags scoped to WCAG 2.1 A + AA per D-15. Fails on critical OR serious (D-16).
// Spawns `vite preview --port 4173`, polls TCP port, iterates 5 hash-routes,
// shells `npx axe` per route, writes JSONs + axe-summary.md, tears down,
// exits non-zero on critical or serious violations.

import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const ROUTES = [
  { slug: 'home',             hash: '/' },
  { slug: 'projects',         hash: '/projects' },
  { slug: 'zhk-etno-dim',     hash: '/zhk/etno-dim' },
  { slug: 'construction-log', hash: '/construction-log' },
  { slug: 'contact',          hash: '/contact' },
];
const PREVIEW_PORT = 4173;
const OUT_DIR = path.join(REPO_ROOT, '.planning/phases/07-post-deploy-qa-client-handoff/axe');

mkdirSync(OUT_DIR, { recursive: true });

const preview = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT)], {
  cwd: REPO_ROOT,
  stdio: 'pipe',
});
preview.stdout.on('data', () => {});
preview.stderr.on('data', () => {});

let exitCode = 0;
try {
  await waitForPort(PREVIEW_PORT, 30_000);

  const summary = [];
  let failed = false;
  for (const { slug, hash } of ROUTES) {
    const url = `http://localhost:${PREVIEW_PORT}/#${hash === '/' ? '' : hash}`;
    const outFile = path.join(OUT_DIR, `${slug}.json`);
    console.log(`[axe-audit] auditing ${slug} -> ${url}`);
    spawnSync('npx', [
      'axe', url,
      '--tags', 'wcag2a,wcag2aa',
      '--save', outFile,
    ], { cwd: REPO_ROOT, stdio: 'inherit' });
    const counts = countViolations(outFile);
    summary.push({ slug, ...counts });
    if (counts.critical > 0 || counts.serious > 0) failed = true;
  }

  writeFileSync(path.join(OUT_DIR, 'axe-summary.md'), renderSummary(summary, failed));
  exitCode = failed ? 1 : 0;
} finally {
  preview.kill('SIGTERM');
}

process.exit(exitCode);

// Helpers --------------------------------------------------------------------

function waitForPort(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const sock = new net.Socket();
      sock.once('connect', () => { sock.destroy(); resolve(); });
      sock.once('error', () => {
        sock.destroy();
        if (Date.now() > deadline) reject(new Error(`port ${port} not ready in ${timeoutMs}ms`));
        else setTimeout(tryConnect, 200);
      });
      sock.connect(port, '127.0.0.1');
    };
    tryConnect();
  });
}

function countViolations(jsonPath) {
  const out = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  if (!existsSync(jsonPath)) return out;
  let data;
  try { data = JSON.parse(readFileSync(jsonPath, 'utf8')); } catch { return out; }
  const runs = Array.isArray(data) ? data : [data];
  for (const run of runs) {
    const violations = Array.isArray(run?.violations) ? run.violations : [];
    for (const v of violations) {
      const impact = v?.impact ?? 'moderate';
      if (impact in out) out[impact] += 1; else out.moderate += 1;
    }
  }
  return out;
}

function renderSummary(rows, failed) {
  const head = [
    '# Phase 7 — axe-core a11y summary',
    '',
    'Tags: WCAG 2.1 A + AA. Threshold: critical + serious must be 0 (D-16).',
    '',
    '| Route | Critical | Serious | Moderate | Minor |',
    '|-------|----------|---------|----------|-------|',
  ];
  const body = rows.map((r) => `| ${r.slug} | ${r.critical} | ${r.serious} | ${r.moderate} | ${r.minor} |`);
  const tail = ['', `Result: ${failed ? 'FAIL — critical or serious violations found' : 'PASS — zero critical, zero serious'}`, ''];
  return [...head, ...body, ...tail].join('\n');
}
