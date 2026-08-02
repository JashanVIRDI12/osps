import { NextResponse } from 'next/server';
import { quoteSchema } from '@/lib/schema';

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

  /*
   * TODO: forward to the real destination before launch — transactional email
   * (Resend / SES), a CRM webhook, or a database write. Validation is already
   * done server-side, so only the delivery step is missing.
   */
  console.info('[quote] new enquiry', {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    message: 'Thanks. Your enquiry is with our team.',
  });
}
