import { z } from 'zod';

/** Mirrors the four product families in `content.ts`. */
export const PRODUCT_INTERESTS = [
  'Injection & Infusion',
  'Drainage & Collection',
  'Dressings & Bandages',
  'Theatre & Protection',
  'Multiple categories',
  'Something else',
] as const;

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is too long.'),
  organization: z
    .string()
    .trim()
    .min(2, 'Please enter your organisation.')
    .max(120, 'That organisation name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a contact number.')
    .max(20, 'That number is too long.')
    .regex(/^[+()\d\s-]+$/, 'Use digits, spaces, +, - or ( ) only.'),
  interest: z.enum(PRODUCT_INTERESTS, {
    errorMap: () => ({ message: 'Please select a product interest.' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Please tell us a little about your requirement.')
    .max(1500, 'Please keep the message under 1500 characters.'),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
