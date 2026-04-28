/**
 * @module lib/contactSubmit
 *
 * Submission adapter for the contact form — POST to formsubmit.co AJAX
 * endpoint. Static-only compatible (GitHub Pages, no backend, no API key).
 *
 * Why formsubmit.co (not Web3Forms / Formspree / Netlify Forms):
 *   - Zero signup. POST to /ajax/<email> — first submission triggers a
 *     verification email; once confirmed, all subsequent submissions arrive.
 *   - No API key, no env var, no per-environment config drift.
 *   - JSON in, JSON out — no x-www-form-urlencoded ceremony.
 *   - Free unlimited. Built-in honeypot via `_honey` field.
 *   - Reply-to header set automatically — replies in the inbox go back to
 *     the user, not lost in formsubmit's queue.
 *
 * Honeypot strategy: real users never fill `_honey`. Bots scraping the form
 * fill every field they find. A non-empty `_honey` value short-circuits to
 * a fake-success response (200, no actual email sent), so the bot moves on
 * thinking it succeeded. Better than CAPTCHA because zero UX friction.
 *
 * Error contract: every fetch failure resolves to { ok: false, error }.
 * Network errors, non-200 responses, and JSON parse failures all funnel to
 * the same shape. Caller doesn't need try/catch around `submitContact`.
 *
 * Reply-to: per formsubmit.co docs, `_replyto` header instructs their
 * service to set the email's Reply-To: header to the form-submitter's
 * address. Hitting Reply in the inbox routes back to the lead, not to
 * formsubmit's noreply.
 *
 * Subject prefix: every submission includes _subject so the inbox sorts
 * cleanly. Project-aware popups pass a context-specific subject; the
 * inline form uses a generic one.
 */

import { email as destinationEmail } from '../content/company';

const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${destinationEmail}`;

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Hidden honeypot — must be empty for human submitters. */
  _honey?: string;
  /** Subject line shown in inbox. Context-aware per surface. */
  subject?: string;
}

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Submit the contact form to formsubmit.co. Resolves to a discriminated
 * union — caller pattern-matches on `ok`. Never throws.
 *
 * Honeypot: if `_honey` is non-empty, we short-circuit to ok=true without
 * an actual fetch — the bot sees success and never retries. No real email
 * sent.
 */
export async function submitContact(
  payload: ContactFormPayload,
): Promise<ContactSubmitResult> {
  // Honeypot triggered — fake success, no network call.
  if (payload._honey && payload._honey.trim().length > 0) {
    return { ok: true };
  }

  const body = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    message: payload.message,
    _subject: payload.subject || 'Новий запит з vugoda-website',
    _replyto: payload.email,
    _captcha: 'false',
    _template: 'table',
  };

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const data = await res.json().catch(() => null);
    if (data && typeof data === 'object' && 'success' in data && data.success === 'true') {
      return { ok: true };
    }
    if (data && typeof data === 'object' && 'success' in data && data.success === true) {
      return { ok: true };
    }
    return { ok: false, error: 'unexpected_response' };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'network_error' };
  }
}
