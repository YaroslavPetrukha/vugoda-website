/**
 * @module components/sections/zhk/ZhkHero
 *
 * ZHK-01 — Full-width hero render at top of /zhk/etno-dim (D-13, D-14).
 * LCP target on this route: loading="eager" + fetchPriority="high" per
 * Pitfall 8 + Phase 3 D-18. The 1920w AVIF preload is NOT in index.html
 * (only home flagship is preloaded there per Phase 3); rely on eager+high
 * for /zhk/etno-dim — RESEARCH §Q3 Option A. Phase 6 measures with
 * Lighthouse and may add dynamic preload via useEffect if LCP regresses.
 *
 * Hero rendered at 100vw with explicit width/height for CLS prevention.
 * The render is presumed 16:9 (architectural CGI); if it is not, override
 * width/height per Pitfall 4.
 */

import type { Project } from '../../../data/types';
import { ResponsivePicture } from '../../ui/ResponsivePicture';

interface Props {
  project: Project;
}

export function ZhkHero({ project }: Props) {
  return (
    <section className="bg-bg">
      <ResponsivePicture
        src={`renders/${project.slug}/${project.renders[0]}`}
        alt={project.title}
        widths={[640, 1280, 1920]}
        sizes="100vw"
        width={1920}
        height={1080}
        loading="eager"
        fetchPriority="high"
        className="w-full h-auto"
      />
    </section>
  );
}
