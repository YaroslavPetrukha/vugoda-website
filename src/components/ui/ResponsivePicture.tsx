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
 */

import { assetUrl } from '../../lib/assetUrl';

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

  return (
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
      />
    </picture>
  );
}
