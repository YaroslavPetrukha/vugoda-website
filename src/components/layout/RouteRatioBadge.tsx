/**
 * @module components/layout/RouteRatioBadge
 *
 * Persistent bottom-right ratio-numeral, що counter-rolls на route change.
 *
 * Розвиток ratio-numerals як brand-language з W3 commit (BrandEssence
 * «01/04..04/04») — той самий typographic patern, тепер у глобальному
 * scope як route-tag. Читається як «page X of 5» технічно-blueprint
 * стилем — supports overall «системний девелопмент» tone.
 *
 * Mount: Layout.tsx, ПОЗА AnimatePresence (інакше badge зник би разом з
 * page-curtain exit-у). Sibling до <main>, fixed-positioned.
 *
 * Animation: AnimatePresence mode="wait" + key=formattedLabel — стара
 * цифра slide-up out + opacity 0, нова slide-up in + opacity 1. Couples з
 * easeBrand 4-tuple (D-23 lockstep with --ease-brand CSS var).
 *
 * Прихований на:
 *   - /dev/* QA surfaces (getRouteMeta повертає null)
 *   - 404 / NotFoundPage (getRouteMeta null для unmatched)
 *   - mobile (md:block — Layout.tsx вже short-circuits на mobile, але
 *     додатковий floor захищає у разі майбутньої зміни)
 *
 * RM threading: useReducedMotion hook — під RM прибираємо y-translate,
 * лишаємо opacity-only crossfade. Cycle тримається 350ms — навіть під RM
 * це коротко й безпечно для motion-sensitive користувачів.
 *
 * @rule layout/-Folder boundary: imports lib/, motion, react-router. NO
 *   page imports, NO data/ imports.
 */
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { easeBrand } from '../../lib/motionVariants';
import { getRouteMeta, formatRatio } from '../../lib/routeMeta';

export function RouteRatioBadge() {
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const meta = getRouteMeta(pathname);

  if (!meta) return null;
  const label = formatRatio(meta);

  return (
    <div
      className="pointer-events-none fixed bottom-8 right-10 z-30 hidden md:block"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={label}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { y: 12, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1 }}
          exit={
            prefersReducedMotion ? { opacity: 0 } : { y: -12, opacity: 0 }
          }
          transition={{ duration: 0.35, ease: easeBrand }}
          className="block text-[13px] font-medium uppercase tabular-nums text-text-muted"
          style={{ letterSpacing: '0.18em' }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
