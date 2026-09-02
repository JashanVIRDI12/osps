import type { QuoteInput } from '@/lib/schema';

/**
 * EmailJS delivery for the quote form.
 *
 * All three identifiers are public by design — the EmailJS browser SDK ships
 * them in the client bundle, the same way a Maps browser key travels. They sit
 * in env vars for swapping accounts between environments, not for secrecy, so
 * lock the account down in the EmailJS dashboard instead: restrict the public
 * key to the production domain under Account → Security.
 */
export const emailjsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
};

export function isEmailjsConfigured() {
  return Boolean(
    emailjsConfig.serviceId &&
      emailjsConfig.templateId &&
      emailjsConfig.publicKey
  );
}

/**
 * The shape the EmailJS template reads. Every key here has a matching
 * `{{placeholder}}` in emailjs/quote-template.html — rename one and you must
 * rename the other, because EmailJS silently renders an unknown variable as
 * empty rather than failing.
 */
export type QuoteTemplateParams = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  submitted_at: string;
  /** Drives the template's Reply-To, so a reply reaches the enquirer. */
  reply_to: string;
};

export function toTemplateParams(values: QuoteInput): QuoteTemplateParams {
  return {
    name: values.name,
    organization: values.organization,
    email: values.email,
    phone: values.phone,
    interest: values.interest,
    message: values.message,
    submitted_at: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }),
    reply_to: values.email,
  };
}
