/**
 * @module pages/ZhkPage
 *
 * ZHK-01 — Slug dispatcher. Reads :slug param and dispatches:
 *   - 'etno-dim' → render full template (the only full-internal project in v1)
 *   - 'lakeview' / 'maietok-vynnykivskyi' / 'nterest' / 'pipeline-4'
 *     → same-origin <Navigate to="/projects" replace /> redirect
 *   - any other slug → render <NotFoundPage /> inline (the route ALREADY matched
 *     /zhk/:slug, so the App.tsx catch-all does not fire for unknown slugs
 *     under /zhk; we render NotFoundPage explicitly per RESEARCH Pattern 3 / Q6).
 *
 * Section ordering on full template (D-13):
 *   ZhkHero → ZhkFactBlock → ZhkWhatsHappening → ZhkGallery → ZhkCtaPair
 *
 * Phase 7 / P0-6 (AUDIT-UX 1.3.A / Bug 7.2): the cross-origin
 * window.location.assign() flow for /zhk/lakeview previously caused an
 * infinite Back-button loop — pressing Back returned to /zhk/lakeview,
 * which re-fired the redirect. Lakeview is now reached only via the
 * Flagship card on /projects (target="_blank" + rel="noopener noreferrer"),
 * which is the correct cross-origin entry point. /zhk/lakeview itself
 * redirects same-origin to /projects so a stale bookmark or shared link
 * still lands on the catalog rather than looping.
 *
 * Default export is preserved (App.tsx import unchanged).
 */

import { useParams, Navigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { findBySlug } from '../data/projects';
import { ZhkHero } from '../components/sections/zhk/ZhkHero';
import { ZhkFactBlock } from '../components/sections/zhk/ZhkFactBlock';
import { ZhkWhatsHappening } from '../components/sections/zhk/ZhkWhatsHappening';
import { ZhkGallery } from '../components/sections/zhk/ZhkGallery';
import { ZhkCtaPair } from '../components/sections/zhk/ZhkCtaPair';
import NotFoundPage from './NotFoundPage';

/** Slugs that exist in data/projects but are NOT full-internal. They redirect
 *  same-origin to /projects rather than render the template.
 *  P0-6: lakeview is included here — flagship-external means «own marketing
 *  site reached from /projects flagship card», not «redirect dance from /zhk». */
const REDIRECT_TO_PROJECTS = new Set([
  'lakeview',
  'maietok-vynnykivskyi',
  'nterest',
  'pipeline-4',
]);

export default function ZhkPage() {
  const { slug = '' } = useParams<{ slug: string }>();

  // Full-internal template (etno-dim only in v1).
  const project = findBySlug(slug);

  // Phase 6 D-18: «{project.title} — ВИГОДА» — interpolated from project.title
  // so v2 ЖК pages (FEAT2-05) inherit the correct title without code change.
  // Fallback covers the brief redirect-intermediate frame where project is
  // undefined; <Navigate> fires before paint so the fallback is rarely seen.
  // Em-dash is U+2014.
  usePageTitle(project ? `${project.title} — ВИГОДА` : 'ЖК — ВИГОДА');

  if (project) {
    return (
      <>
        <ZhkHero project={project} />
        <ZhkFactBlock project={project} />
        <ZhkWhatsHappening project={project} />
        <ZhkGallery project={project} />
        <ZhkCtaPair />
      </>
    );
  }

  // Same-origin redirect for known non-full-internal slugs (incl. lakeview
  // per P0-6 — fixes the cross-origin Back-loop).
  if (REDIRECT_TO_PROJECTS.has(slug)) {
    return <Navigate to="/projects" replace />;
  }

  // Unknown slug — render 404 inline (route /zhk/:slug already matched).
  return <NotFoundPage />;
}
