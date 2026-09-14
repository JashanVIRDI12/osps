import { z } from 'zod';

/** Mirrors the product families in `content.ts`. */
export const PRODUCT_INTERESTS = [
  'Wound Care & Dressings',
  'Crepe / Elastic / Cohesive Bandages',
  'Gauze & Cotton Products',
  'Syringes & IV Products',
  'Hospital Disposables',
  'Surgical Essentials',
  'Medical Equipment',
  'Multiple categories',
  'Something else',
] as const;

export const BUYER_TYPES = [
  'Distributor / Dealer',
  'Retailer / Pharmacy',
  'Hospital / Clinic',
  'Healthcare Institution',
  'Corporate / Government Buyer',
  'Other',
] as const;

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is too long.'),
  company: z
    .string()
    .trim()
    .min(2, 'Please enter your company or organisation.')
    .max(120, 'That company name is too long.'),
  cityState: z
    .string()
    .trim()
    .min(3, 'Please enter your city and state.')
    .max(120, 'That location is too long.'),
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
  buyerType: z.enum(BUYER_TYPES, {
    errorMap: () => ({ message: 'Please select a buyer type.' }),
  }),
  product: z.enum(PRODUCT_INTERESTS, {
    errorMap: () => ({ message: 'Please select a product.' }),
  }),
  quantity: z
    .string()
    .trim()
    .min(1, 'Please enter the required quantity.')
    .max(80, 'Please keep the quantity under 80 characters.'),
  requirement: z
    .string()
    .trim()
    .min(10, 'Please tell us a little about your requirement.')
    .max(1500, 'Please keep the requirement under 1500 characters.'),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
