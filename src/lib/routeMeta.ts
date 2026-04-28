/**
 * @module lib/routeMeta
 *
 * Pathname → ratio-numeral мапа для RouteRatioBadge (W7 ratio-numerals
 * мова бренду, з BrandEssence W3 commit). 5 публічних маршрутів = 5/5.
 *
 * Порядок узгоджений з Nav.tsx + App.tsx:
 *   /                  → 01/05  (Головна)
 *   /projects          → 02/05  (Проєкти-індекс)
 *   /zhk/:slug         → 03/05  (Деталь ЖК — Lakeview або pipeline)
 *   /construction-log  → 04/05  (Хід будівництва)
 *   /contact           → 05/05  (Контакт)
 *
 * /dev/* і 404 повертають null — badge ховається на цих surfaces.
 */
export interface RouteMeta {
  index: number;
  total: number;
}

const TOTAL = 5;

export function getRouteMeta(pathname: string): RouteMeta | null {
  if (pathname === '/' || pathname === '') return { index: 1, total: TOTAL };
  if (pathname.startsWith('/projects')) return { index: 2, total: TOTAL };
  if (pathname.startsWith('/zhk/')) return { index: 3, total: TOTAL };
  if (pathname.startsWith('/construction-log')) return { index: 4, total: TOTAL };
  if (pathname.startsWith('/contact')) return { index: 5, total: TOTAL };
  return null;
}

export function formatRatio({ index, total }: RouteMeta): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(index)} / ${pad(total)}`;
}
