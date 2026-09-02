import { NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/schema';

/**
 * Server-side intake for the quote form.
 *
 * The form itself no longer posts here — delivery moved to EmailJS, which the
 * browser calls directly (see lib/emailjs.ts). This route is kept as the
 * validated entry point for a future server-side integration (a CRM webhook,
 * a database write, or transactional email with a private key), and is safe to
 * delete if none of those arrive.
 */
export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const parsed = quoteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Please check the highlighted fields and try again.',
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  console.info('[quote] new enquiry', {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    message: 'Thanks. Your enquiry is with our team.',
  });
}
