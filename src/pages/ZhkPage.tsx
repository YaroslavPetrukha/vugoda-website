/**
 * @module pages/ZhkPage
 *
 * ZHK-01 — Slug dispatcher. Reads :slug param and dispatches:
 *   - 'etno-dim' → render full template (the only full-internal project in v1)
 *   - 'lakeview' → cross-origin redirect via <ZhkLakeviewRedirect>
 *   - 'maietok-vynnykivskyi' / 'nterest' / 'pipeline-4' → same-origin redirect to /projects
 *   - any other slug → render <NotFoundPage /> inline (the route ALREADY matched
 *     /zhk/:slug, so the App.tsx catch-all does not fire for unknown slugs
 *     under /zhk; we render NotFoundPage explicitly per RESEARCH Pattern 3 / Q6).
 *
 * Section ordering on full template (D-13):
 *   ZhkHero → ZhkFactBlock → ZhkWhatsHappening → ZhkGallery → ZhkCtaPair
 *
 * Default export is preserved (App.tsx import unchanged).
 */

import { useParams, Navigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { findBySlug, projects } from '../data/projects';
import { ZhkHero } from '../components/sections/zhk/ZhkHero';
import { ZhkFactBlock } from '../components/sections/zhk/ZhkFactBlock';
import { ZhkWhatsHappening } from '../components/sections/zhk/ZhkWhatsHappening';
import { ZhkGallery } from '../components/sections/zhk/ZhkGallery';
import { ZhkCtaPair } from '../components/sections/zhk/ZhkCtaPair';
import { ZhkLakeviewRedirect } from '../components/sections/zhk/ZhkLakeviewRedirect';
import NotFoundPage from './NotFoundPage';

/** Slugs that exist in data/projects but are NOT full-internal. They redirect
 *  to /projects rather than render the template. */
const REDIRECT_TO_PROJECTS = new Set(['maietok-vynnykivskyi', 'nterest', 'pipeline-4']);

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

  // Cross-origin flagship redirect (lakeview).
  const flagshipRecord = projects.find(
    (p) => p.slug === slug && p.presentation === 'flagship-external',
  );
  if (flagshipRecord && flagshipRecord.externalUrl) {
    return <ZhkLakeviewRedirect url={flagshipRecord.externalUrl} />;
  }

  // Same-origin redirect for grid-only / aggregate slugs.
  if (REDIRECT_TO_PROJECTS.has(slug)) {
    return <Navigate to="/projects" replace />;
  }

  // Unknown slug — render 404 inline (route /zhk/:slug already matched).
  return <NotFoundPage />;
}
