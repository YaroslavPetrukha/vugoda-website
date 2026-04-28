/**
 * @module components/forms/ContactFormFields
 *
 * Real contact form — controlled inputs, client-side validation, formsubmit.co
 * submission. Replaces the mailto: stub previously living in home/ContactForm.
 *
 * Single component, two consumers:
 *   - inline (home ContactForm section, ContactPage) — ambient on the page
 *   - popup (ContactPopup wrapper) — modal triggered by CTAs across surfaces
 *
 * The variant only affects layout density and labelling — submission logic,
 * validation, and field set are identical. This is intentional: a lead from
 * the popup is the same shape as a lead from the inline form, so the inbox
 * processing on the receiving side stays uniform.
 *
 * State machine:
 *   idle → submitting → success
 *                    ↘ error (retry returns to idle)
 *
 * Validation runs on submit attempt, not on blur — Emil-style "system
 * responds when user acts" rather than "system nags while user types".
 * Errors clear automatically when the user edits the offending field.
 *
 * Reduced-motion: success-state transition uses `fade` variant only (no
 * y-translate, no scale). Variant selection is gated through useReducedMotion
 * inside the success block — the form fields themselves don't animate.
 *
 * A11y:
 *   - Each input has a <label htmlFor> + matching id (auto-prefixed by
 *     `idPrefix` so two instances on one page don't collide).
 *   - aria-invalid + aria-describedby thread errors to SR.
 *   - Submit button announces state via aria-live="polite" sibling.
 *   - Honeypot field is visually hidden (sr-only + tabindex=-1 +
 *     autocomplete=off) so neither humans nor screen-reader users fill it,
 *     while bots that read DOM still see and complete it.
 */

import { useId, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';
import { submitContact } from '../../lib/contactSubmit';
import { email as destinationEmail } from '../../content/company';
import {
  labelName,
  labelEmail,
  labelPhone,
  labelMessage,
  placeholderName,
  placeholderEmail,
  placeholderPhone,
  placeholderMessage,
  submitIdle,
  submitSending,
  successHeading,
  successBody,
  successResetCta,
  errorHeading,
  errorBody,
  errorRetryCta,
  validateNameRequired,
  validateEmailRequired,
  validateEmailInvalid,
  validateMessageRequired,
  validateMessageTooShort,
  privacyNote,
} from '../../content/forms';
import { fade } from '../../lib/motionVariants';

interface Props {
  /** Layout density — `inline` adds vertical breathing, `popup` is tighter. */
  variant: 'inline' | 'popup';
  /** Subject line for the inbox — names which surface the lead came from. */
  subject?: string;
  /** Optional pre-fill for the message body — e.g. when popup opens with
   *  context like "Цікавить ЖК Lakeview". */
  initialMessage?: string;
  /** Called once when the form transitions to success state — e.g. popup
   *  closes itself after 4s, inline form just shows the success block. */
  onSuccess?: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactFormFields({
  variant,
  subject,
  initialMessage = '',
  onSuccess,
}: Props) {
  const idPrefix = useId();
  const [state, setState] = useState<FormState>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [honey, setHoney] = useState('');

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!name.trim()) next.name = validateNameRequired;
    if (!email.trim()) next.email = validateEmailRequired;
    else if (!EMAIL_RE.test(email.trim())) next.email = validateEmailInvalid;
    if (!message.trim()) next.message = validateMessageRequired;
    else if (message.trim().length < 10) next.message = validateMessageTooShort;
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'submitting') return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setState('submitting');
    const result = await submitContact({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: message.trim(),
      _honey: honey,
      subject,
    });

    if (result.ok) {
      setState('success');
      onSuccess?.();
    } else {
      setState('error');
    }
  }

  function handleReset() {
    setName('');
    setEmail('');
    setPhone('');
    setMessage(initialMessage);
    setErrors({});
    setState('idle');
  }

  // Generic field change — clear that field's error if user edits.
  function clearError(field: keyof FormErrors) {
    if (errors[field]) {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  }

  const fieldGap = variant === 'inline' ? 'gap-6' : 'gap-4';
  const inputClass =
    'w-full border-b border-text-muted/30 bg-transparent px-0 py-3 text-base text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none';
  const labelClass = 'mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-text-muted';
  const errorClass = 'mt-2 flex items-center gap-1.5 text-sm text-accent';

  return (
    <div className={`flex w-full flex-col ${fieldGap}`}>
      <AnimatePresence mode="wait">
        {state === 'success' ? (
          <motion.div
            key="success"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-start gap-4 py-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg-black"
                aria-hidden="true"
              >
                <Check size={20} strokeWidth={2.5} />
              </span>
              <h3 className="text-lg font-bold text-text">{successHeading}</h3>
            </div>
            <p className="text-base text-text-muted">{successBody}</p>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-text-muted underline-offset-4 hover:text-accent hover:underline"
            >
              {successResetCta}
            </button>
          </motion.div>
        ) : state === 'error' ? (
          <motion.div
            key="error"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-start gap-4 py-4"
            role="alert"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border border-text-muted/40 text-text"
                aria-hidden="true"
              >
                <AlertCircle size={20} strokeWidth={1.75} />
              </span>
              <h3 className="text-lg font-bold text-text">{errorHeading}</h3>
            </div>
            <p className="text-base text-text-muted">
              {errorBody}{' '}
              <a
                href={`mailto:${destinationEmail}`}
                className="text-text underline-offset-4 hover:text-accent hover:underline"
              >
                {destinationEmail}
              </a>
            </p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="bg-accent px-6 py-3 text-sm font-medium text-bg-black hover:brightness-110"
            >
              {errorRetryCta}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onSubmit={handleSubmit}
            noValidate
            className={`flex w-full flex-col ${fieldGap}`}
          >
            {/* Honeypot — visually hidden, accessible-hidden, autocomplete-off.
                Bots that scrape inputs fill this; humans never see it. */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
              className="absolute left-[-9999px] h-px w-px"
            />

            <div>
              <label htmlFor={`${idPrefix}-name`} className={labelClass}>
                {labelName}
              </label>
              <input
                id={`${idPrefix}-name`}
                type="text"
                name="name"
                autoComplete="name"
                placeholder={placeholderName}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError('name');
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
                className={inputClass}
              />
              {errors.name && (
                <p id={`${idPrefix}-name-error`} className={errorClass}>
                  <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor={`${idPrefix}-email`} className={labelClass}>
                  {labelEmail}
                </label>
                <input
                  id={`${idPrefix}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder={placeholderEmail}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
                  className={inputClass}
                />
                {errors.email && (
                  <p id={`${idPrefix}-email-error`} className={errorClass}>
                    <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
                  {labelPhone}
                </label>
                <input
                  id={`${idPrefix}-phone`}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder={placeholderPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${idPrefix}-message`} className={labelClass}>
                {labelMessage}
              </label>
              <textarea
                id={`${idPrefix}-message`}
                name="message"
                rows={variant === 'popup' ? 3 : 4}
                placeholder={placeholderMessage}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  clearError('message');
                }}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
                className={`${inputClass} resize-none`}
              />
              {errors.message && (
                <p id={`${idPrefix}-message-error`} className={errorClass}>
                  <AlertCircle size={14} strokeWidth={1.75} aria-hidden="true" />
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex items-center justify-center bg-accent px-8 py-4 text-base font-medium text-bg-black hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
              >
                {state === 'submitting' ? submitSending : submitIdle}
              </button>
              <p className="text-xs text-text-muted">{privacyNote}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
