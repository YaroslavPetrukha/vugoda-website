/**
 * @module components/ui/ResponsivePicture
 *
 * Emits <picture><source type="image/avif"><source type="image/webp"><img></picture>
 * where each <source> has srcset pointing at sharp-generated _opt/ siblings
 * (per scripts/optimize-images.mjs).
 *
 * IMPORT BOUNDARY: Uses `assetUrl` from src/lib/assetUrl — NEVER hardcode
 * raw render-tree or construction-tree path prefixes as string literals. The
 * forbidden substrings are the quoted, slash-delimited segment-pair patterns
 * that scripts/check-brand.ts importBoundaries() greps for in src/components/
 * (Phase 2 D-30 + D-33). Always pass the path as a `src` prop and let the
 * component compose URLs via assetUrl().
 *
 * Usage:
 *   - Hero/PortfolioOverview flagship (LCP target): pass loading="eager" +
 *     fetchPriority="high". Default lazy is wrong for the LCP image
 *     (Pitfall 11).
 *   - Pipeline grid cards: lazy + sizes="(min-width: 1280px) 400px, 100vw"
 *   - ConstructionTeaser: widths={[640, 960]} + sizes="320px"
 *
 * Source-format awareness: optimizer emits AVIF/WebP/JPG for ALL inputs
 * (jpg, png, webp). Component's regex strips the trailing format suffix —
 * 'aerial.jpg' → base 'aerial'; '43615.jpg.webp' → base '43615.jpg'.
 *
 * P0-7 / AUDIT-BRAND P0-2: lazy-loaded images previously rendered as flat
 * bg-bg-surface rectangles until lazy-load fired, which read as «нічого
 * не завантажилось» and broke the first-impression. The component now
 * shows a brand-faithful skeleton (single isometric cube on bg-bg-surface)
 * until the underlying <img> reports load. Eager-loaded images skip the
 * skeleton entirely (no visible flicker for LCP). Skeleton is
 * pointer-events-none + aria-hidden so it never interferes with hit-testing
 * or screen readers. Set `skeleton={false}` to opt out (e.g. when the
 * consumer already renders its own placeholder).
 */

import { useState } from 'react';
import { assetUrl } from '../../lib/assetUrl';
import { IsometricCube } from '../brand/IsometricCube';

export interface ResponsivePictureProps {
  /** Path under public/, e.g. 'renders/lakeview/aerial.jpg' or
   *  'construction/mar-2026/mar-01.jpg'. NOT a URL — assetUrl() prepends BASE_URL. */
  src: string;
  alt: string;
  widths?: number[];
  sizes?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  /** Optional explicit width/height for CLS prevention. Defaults to
   *  largest width × 9/16 (architectural CGI ~16:9). */
  width?: number;
  height?: number;
  /** Show brand skeleton while the image loads. Default true. Set false
   *  to opt out when the consumer renders its own placeholder. Eager
   *  images skip the skeleton automatically (initial state == loaded). */
  skeleton?: boolean;
}

export function ResponsivePicture({
  src,
  alt,
  widths = [640, 1280, 1920],
  sizes = '100vw',
  loading = 'lazy',
  fetchPriority,
  className,
  width,
  height,
  skeleton = true,
}: ResponsivePictureProps) {
  const lastSlash = src.lastIndexOf('/');
  const dir = src.substring(0, lastSlash);
  const filename = src.substring(lastSlash + 1);
  const base = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  const buildSrcset = (fmt: 'avif' | 'webp' | 'jpg') =>
    widths
      .map((w) => `${assetUrl(`${dir}/_opt/${base}-${w}.${fmt}`)} ${w}w`)
      .join(', ');

  const largestWidth = widths[widths.length - 1];
  const fallbackSrc = assetUrl(`${dir}/_opt/${base}-${largestWidth}.jpg`);

  const finalWidth = width ?? largestWidth;
  const finalHeight = height ?? Math.round(largestWidth * 9 / 16);

  // Eager images skip the skeleton — they're LCP / above-fold and any
  // overlay is a waste of frame. Lazy images show the skeleton until
  // <img> onLoad fires.
  const showSkeleton = skeleton && loading !== 'eager';
  const [loaded, setLoaded] = useState(!showSkeleton);

  // Wrap <picture> in a relative <div> so the absolute skeleton overlay
  // sits in valid HTML (picture cannot legally contain <div>/<span> beyond
  // <source>/<img>). The wrapper inherits the consumer's sizing through
  // 100% width/height + display:block.
  return (
    <div
      style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}
    >
      <picture>
        <source type="image/avif" srcSet={buildSrcset('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={buildSrcset('webp')} sizes={sizes} />
        <img
          src={fallbackSrc}
          srcSet={buildSrcset('jpg')}
          sizes={sizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          width={finalWidth}
          height={finalHeight}
          className={className}
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </picture>
      {showSkeleton && !loaded && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg-surface"
        >
          <IsometricCube
            variant="single"
            stroke="#A7AFBC"
            opacity={0.2}
            className="h-12 w-12"
          />
        </div>
      )}
    </div>
  );
}
