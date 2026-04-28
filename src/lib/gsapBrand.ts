/**
 * @module lib/gsapBrand
 *
 * Shared GSAP-ініціалізатор для brand-coupled animations. Реєструє
 * CustomEase plugin + brand easing curve один раз на app-load (idempotent —
 * множинні імпорти через `gsap.parseEase()` guard не дублюють реєстрацію).
 *
 * D-23 lockstep — easeBrand тут є ТРЕТІМ representation тієї самої кривої:
 *   - JS variant (motionVariants.ts):   [0.22, 1, 0.36, 1] (4-tuple)
 *   - CSS variant   (src/index.css):    cubic-bezier(0.22, 1, 0.36, 1)
 *   - GSAP variant  (this module):      CustomEase 'easeBrand'
 *
 * Якщо одна змінюється — синхронно три. Drift означає, що page-transitions
 * (Motion-driven), Tailwind hover-utilities (CSS-driven), і loader/grid-sweep
 * (GSAP-driven) анімувалися б на різних кривих — invisible regression.
 *
 * @rule lib/-Folder boundary: imports gsap. NO React, NO components.
 *   Pure module-init side-effect — імпортується для side-effect '/' name
 *   ease export.
 */
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

export const EASE_BRAND_NAME = 'easeBrand';

if (!gsap.parseEase(EASE_BRAND_NAME)) {
  CustomEase.create(EASE_BRAND_NAME, '0.22, 1, 0.36, 1');
}

export { gsap };
