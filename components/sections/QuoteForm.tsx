'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  BUYER_TYPES,
  PRODUCT_INTERESTS,
  quoteSchema,
  type QuoteInput,
} from '@/lib/schema';
import {
  emailjsConfig,
  isEmailjsConfigured,
  toTemplateParams,
} from '@/lib/emailjs';

type Status = 'idle' | 'success' | 'error';

const FALLBACK_ERROR =
  'We could not send your enquiry. Please try again, or email us directly.';

export function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      company: '',
      cityState: '',
      email: '',
      phone: '',
      quantity: '',
      requirement: '',
    },
  });

  const onSubmit = async (values: QuoteInput) => {
    setStatus('idle');
    setStatusMessage('');

    if (!isEmailjsConfigured()) {
      // Missing env vars on the host is the one failure the visitor can do
      // nothing about, so say so plainly rather than blaming their input.
      setStatus('error');
      setStatusMessage(
        'The enquiry form is not configured yet. Please email or call us directly in the meantime.'
      );
      return;
    }

    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        toTemplateParams(values),
        { publicKey: emailjsConfig.publicKey }
      );

      reset();
      setStatus('success');
      setStatusMessage(
        'Thanks. Your enquiry is with our team. We usually reply within one working day.'
      );
    } catch (error) {
      // EmailJS rejects with { status, text }; anything else is a network drop.
      const detail =
        typeof error === 'object' && error && 'text' in error
          ? String((error as { text: unknown }).text)
          : '';

      console.error('[quote] EmailJS send failed', error);

      setStatus('error');
      setStatusMessage(detail ? `${FALLBACK_ERROR} (${detail})` : FALLBACK_ERROR);
    }
  };

  const describedBy = (field: keyof QuoteInput) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Full name <span aria-hidden="true">*</span>
          </label>
          {/* `enterKeyHint` labels the phone keyboard's action key, so a
              five-field form reads as a sequence rather than five dead ends. */}
          <input
            id="name"
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder="Dr. Anita Rao"
            className="field-input"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={describedBy('name')}
            {...register('name')}
          />
          {errors.name ? (
            <p id="name-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="company" className="field-label">
            Company <span aria-hidden="true">*</span>
          </label>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder="Company or organisation"
            className="field-input"
            aria-invalid={errors.company ? 'true' : undefined}
            aria-describedby={describedBy('company')}
            {...register('company')}
          />
          {errors.company ? (
            <p id="company-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.company.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cityState" className="field-label">
            City / State <span aria-hidden="true">*</span>
          </label>
          <input
            id="cityState"
            type="text"
            autoComplete="address-level2"
            autoCapitalize="words"
            enterKeyHint="next"
            placeholder="Pune, Maharashtra"
            className="field-input"
            aria-invalid={errors.cityState ? 'true' : undefined}
            aria-describedby={describedBy('cityState')}
            {...register('cityState')}
          />
          {errors.cityState ? (
            <p id="cityState-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.cityState.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="field-label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            placeholder="procurement@hospital.in"
            className="field-input"
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={describedBy('email')}
            {...register('email')}
          />
          {errors.email ? (
            <p id="email-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="field-label">
            Phone / WhatsApp <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder="+91 98765 43210"
            className="field-input"
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={describedBy('phone')}
            {...register('phone')}
          />
          {errors.phone ? (
            <p id="phone-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="buyerType" className="field-label">
            Buyer type <span aria-hidden="true">*</span>
          </label>
          <select
            id="buyerType"
            defaultValue=""
            className="field-input appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
            aria-invalid={errors.buyerType ? 'true' : undefined}
            aria-describedby={describedBy('buyerType')}
            {...register('buyerType')}
          >
            <option value="" disabled className="bg-surface text-ink">
              Select buyer type
            </option>
            {BUYER_TYPES.map((buyerType) => (
              <option key={buyerType} value={buyerType} className="bg-surface text-ink">
                {buyerType}
              </option>
            ))}
          </select>
          {errors.buyerType ? (
            <p id="buyerType-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.buyerType.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="product" className="field-label">
            Product <span aria-hidden="true">*</span>
          </label>
          <select
            id="product"
            defaultValue=""
            className="field-input appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
            aria-invalid={errors.product ? 'true' : undefined}
            aria-describedby={describedBy('product')}
            {...register('product')}
          >
            <option value="" disabled className="bg-surface text-ink">
              Select a product category
            </option>
            {PRODUCT_INTERESTS.map((product) => (
              <option key={product} value={product} className="bg-surface text-ink">
                {product}
              </option>
            ))}
          </select>
          {errors.product ? (
            <p id="product-error" className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {errors.product.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="field-label">
          Quantity <span aria-hidden="true">*</span>
        </label>
        <input
          id="quantity"
          type="text"
          inputMode="text"
          enterKeyHint="next"
          placeholder="e.g. 500 boxes or monthly requirement"
          className="field-input"
          aria-invalid={errors.quantity ? 'true' : undefined}
          aria-describedby={describedBy('quantity')}
          {...register('quantity')}
        />
        {errors.quantity ? (
          <p id="quantity-error" className="field-error">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.quantity.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="requirement" className="field-label">
          Requirement <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="requirement"
          rows={4}
          enterKeyHint="enter"
          placeholder="Share sizes, variants, packing needs and delivery timeline."
          className="field-input resize-y"
          aria-invalid={errors.requirement ? 'true' : undefined}
          aria-describedby={describedBy('requirement')}
          {...register('requirement')}
        />
        {errors.requirement ? (
          <p id="requirement-error" className="field-error">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {errors.requirement.message}
          </p>
        ) : null}
      </div>

      {/* The submit spans the card on a phone: it is the one action the form
          exists for, and a part-width pill under full-width fields reads as
          secondary. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full px-7 py-3.5 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Request a Quote
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-[13px] text-ink-soft">
          <span aria-hidden="true">*</span> Required fields
        </p>
      </div>

      {/* Form-level result, announced to assistive tech. */}
      <div role="status" aria-live="polite">
        {status !== 'idle' && statusMessage ? (
          <p
            className={
              status === 'success'
                ? 'flex items-start gap-2 rounded-input border border-royal-wash bg-royal-tint px-4 py-3 text-body-sm font-medium text-ink'
                : 'flex items-start gap-2 rounded-input border border-accent/40 bg-accent-tint px-4 py-3 text-body-sm font-medium text-ink'
            }
          >
            {status === 'success' ? (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-royal"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
            )}
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
