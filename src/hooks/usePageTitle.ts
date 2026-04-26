/**
 * @module hooks/usePageTitle
 *
 * Per-route document.title setter for QA-03 / SEO / browser-tab
 * discrimination during demo. Phase 6 D-17 (locked): 5-line useEffect,
 * no react-helmet (RESEARCH §"Don't Hand-Roll" — direct DOM API ships
 * zero kB of library code).
 *
 * Title format per D-18: «{Page} — ВИГОДА» (em-dash U+2014, brand last).
 * Root `/` keeps the verbatim wordmark «ВИГОДА — Системний девелопмент»
 * (no «{Page} —» prefix).
 *
 * Per-page title constants live with each page's content module
 * (D-19): src/content/projects.ts, src/content/zhk-etno-dim.ts,
 * src/content/construction.ts, src/content/contact.ts, src/content/home.ts.
 * Dev surfaces (DevBrand, DevGrid) and 404 use inline strings.
 *
 * Phase 5 page-fade transition takes ~350-400ms exit + ~400ms enter.
 * usePageTitle fires on mount — title updates immediately on route
 * change for tab readability (D-17 deferred concern: title is correct
 * for the in-flight new route while the old route is still painting
 * during exit; acceptable per <deferred> «not noticeable in static-
 * content site»).
 *
 * Pure utility — only imports useEffect from react. NO Motion, NO
 * components, NO data, NO content. Sibling-of-useSessionFlag pattern.
 *
 * SSR-safe by `typeof document` guard (project has no SSR; cheap
 * insurance for v2 migration consistency).
 */
import { useEffect } from 'react';

export function usePageTitle(title: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title;
  }, [title]);
}
