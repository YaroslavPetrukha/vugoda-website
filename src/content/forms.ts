/**
 * @module content/forms
 * @rule IMPORT BOUNDARY: Editorial content module. May only be imported from
 *   src/components/forms/ and src/components/sections/. Must NEVER import
 *   React, motion, components, hooks, or pages.
 *
 *   Source of truth: AUDIT-SALES P1-S4 (real form replaces mailto) +
 *   AUDIT-COPY tone discipline. All labels, errors, and success messages
 *   pass through scripts/check-brand.ts forbidden-lexicon gate.
 *
 *   Tone: predметно, без маркетингових суперлативів. CTA — інструктивний,
 *   error — діагностичний, success — стриманий і без вигуку.
 */

/** Form headings — different per surface. Inline reuses content/home.ts.
 *  W8 audit-copy round 2: «Запит на консультацію» dropped — site's worst
 *  cliché (consulting-template register). New heading is direct, plain,
 *  human imperative. Subheading rewritten to differentiate from the inline
 *  form's contactBody (was a verbatim duplicate previously). */
export const popupHeading = 'Напишіть нам по проєкту';

/** Sub-heading — short context line below H2 in popup. */
export const popupSubheading = 'Залиште контакти — звʼяжемось протягом 24 годин у робочі дні.';

/** Field labels — visible above inputs. Form is i18n-ready by extracting here. */
export const labelName = 'Імʼя';
export const labelEmail = 'Email';
export const labelPhone = 'Телефон (необовʼязково)';
export const labelMessage = 'Що цікавить?';

/** Field placeholders — concrete examples instead of generic prompts. */
export const placeholderName = 'Олександр';
export const placeholderEmail = 'name@example.com';
export const placeholderPhone = '+38 0__ ___ __ __';
export const placeholderMessage = 'ЖК Lakeview, 2-кімнатна, до 100 м². Цікавлять терміни і ціна.';

/** Submit button states — three discrete labels for three states. */
export const submitIdle = 'Надіслати запит';
export const submitSending = 'Надсилаємо…';
export const submitSent = 'Надіслано';

/** Success state — appears after form submission resolves. Promise of action,
 *  not gratitude theatre. 24h is honest service-level. */
export const successHeading = 'Запит отримано.';
export const successBody = 'Звʼяжемось протягом 24 годин у робочі дні. Якщо терміново — пишіть на email нижче.';
export const successResetCta = 'Надіслати ще';

/** Error state — diagnostic, not apologetic. Offers fallback action. */
export const errorHeading = 'Не вдалось надіслати.';
export const errorBody = 'Спробуйте ще раз або напишіть напряму:';
export const errorRetryCta = 'Спробувати ще раз';

/** Validation messages — short, actionable. */
export const validateNameRequired = 'Введіть імʼя';
export const validateEmailRequired = 'Введіть email';
export const validateEmailInvalid = 'Email виглядає некоректним';
export const validateMessageRequired = 'Розкажіть про задачу';
export const validateMessageTooShort = 'Хоча б 10 символів — щоб ми зрозуміли запит';

/** Privacy line — one sentence under submit button. Honest about destination. */
export const privacyNote = 'Дані використовуємо лише для відповіді на запит. Без розсилки.';

/** Popup-trigger ARIA labels — depend on context. Used by buttons that open
 *  the popup with prefilled subject. */
export const triggerLabelGeneric = 'Відкрити форму запиту';
export const triggerLabelLakeview = 'Запитати про ЖК Lakeview';
export const triggerLabelEtnoDim = 'Запитати про ЖК Етно Дім';
export const triggerLabelMaietok = 'Запитати про ЖК Маєток Винниківський';
export const triggerLabelNterest = 'Запитати про Дохідний дім NTEREST';

/** Popup close button label. */
export const popupCloseLabel = 'Закрити форму';
