/**
 * @module pages/HomePage
 *
 * Composes the 7 home sections in canonical Phase 3 D-17 order:
 *   Hero → BrandEssence → PortfolioOverview → ConstructionTeaser
 *        → MethodologyTeaser → TrustBlock → ContactForm.
 *
 * Closes HOME-01..07 + VIS-03 + VIS-04 + ANI-01 by virtue of the
 * sections it composes. Each section is self-contained and reads
 * its own data from src/data/ + src/content/ — no cross-section state.
 *
 * Phase 5 will wrap each section with <RevealOnScroll> for ANI-02; this
 * file leaves the sections wrapper-free per Phase 3 deferred scope.
 */

import { Hero } from '../components/sections/home/Hero';
import { BrandEssence } from '../components/sections/home/BrandEssence';
import { PortfolioOverview } from '../components/sections/home/PortfolioOverview';
import { ConstructionTeaser } from '../components/sections/home/ConstructionTeaser';
import { MethodologyTeaser } from '../components/sections/home/MethodologyTeaser';
import { TrustBlock } from '../components/sections/home/TrustBlock';
import { ContactForm } from '../components/sections/home/ContactForm';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandEssence />
      <PortfolioOverview />
      <ConstructionTeaser />
      <MethodologyTeaser />
      <TrustBlock />
      <ContactForm />
    </>
  );
}
