/**
 * @module lib/utm
 *
 * Apply UTM parameters to outbound Lakeview links so we can attribute
 * traffic back to the corp-site by placement (P1-S7, AUDIT-SALES).
 *
 * Why a placement param: every Lakeview link on the corp-site has the
 * same destination, but originates from a different surface (flagship
 * card, mobile-fallback CTA, …). utm_content carries that surface label
 * so analytics can split out which surface drives which volume.
 *
 * Pure function: takes baseUrl + content placement, returns full URL
 * with utm_source/medium/campaign/content. URL constructor handles any
 * existing query string cleanly (searchParams.set replaces, never
 * appends-duplicate). No import from data layer — helper stays testable
 * in isolation, callers pass the canonical URL.
 *
 * Campaign is locked to «lakeview-flagship» — the only external
 * destination on v1 is the Lakeview marketing site. If a second
 * external destination appears, generalize the signature.
 */

export type LakeviewPlacement = 'flagship-card' | 'mobile-fallback';

export function withLakeviewUtm(baseUrl: string, content: LakeviewPlacement): string {
  const url = new URL(baseUrl);
  url.searchParams.set('utm_source', 'vugoda-corp');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'lakeview-flagship');
  url.searchParams.set('utm_content', content);
  return url.toString();
}
