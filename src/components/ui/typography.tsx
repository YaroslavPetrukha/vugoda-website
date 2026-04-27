/**
 * @module components/ui/typography
 *
 * Brand typography primitives — extracted after web-design-guidelines audit
 * + simplify skill review.
 *
 * `overlineClasses` is the canonical class string for the brand overline
 * pattern (text-[13px] uppercase tracking-[0.18em] medium-weight). Used
 * 14+ times across W1-W5 design patterns — was previously inlined per
 * site. Color tone (muted vs accent) is composed by consumers since dt
 * elements + structural span variants resist a single component wrapper.
 *
 * <SectionOverline> wraps overlineClasses in a <p> with tone variant +
 * optional className extension — convenience for the most common case
 * (paragraph-like overline above a section heading). Inside dl/dt or
 * inline span contexts, consumers should use overlineClasses directly
 * to preserve correct semantics.
 *
 * Brand contract: 13px font-size + 0.18em letter-spacing matches the
 * --text-overline + tracking-[0.18em] declared in src/index.css @theme
 * (D10 type tokens). Consumers must NOT change the size/tracking — that
 * would create a 7th typography moment off the brand-system §3 scale.
 */

const TONE_CLASS = {
  muted: 'text-text-muted',
  accent: 'text-accent',
} as const;

export type OverlineTone = keyof typeof TONE_CLASS;

/** Canonical overline classes — color-agnostic. Compose with a tone class
 *  (text-text-muted | text-accent) at the consumer site. */
export const overlineClasses =
  'text-[13px] font-medium uppercase tracking-[0.18em]';

interface SectionOverlineProps {
  /** Color tone. Defaults to 'muted' (the most common usage). */
  tone?: OverlineTone;
  /** Extra classes appended after the canonical + tone classes — useful
   *  for spacing utilities (mb-*, mt-*) that vary per consumer. */
  className?: string;
  children: React.ReactNode;
}

/** Paragraph-element overline — the most common usage above a section
 *  heading. For dt/span contexts inside dl or flex rows, use the
 *  `overlineClasses` constant directly instead. */
export function SectionOverline({
  tone = 'muted',
  className,
  children,
}: SectionOverlineProps) {
  return (
    <p
      className={`${overlineClasses} ${TONE_CLASS[tone]}${className ? ` ${className}` : ''}`}
    >
      {children}
    </p>
  );
}
