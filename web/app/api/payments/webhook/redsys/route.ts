import { NextResponse } from 'next/server';
import { validatePaymentNotification } from '../../../../../lib/payments/application/paymentService';
import { RedsysNotificationSchema } from '../../../../../lib/payments/utils/validation';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = Object.fromEntries(new URLSearchParams(text).entries());

    RedsysNotificationSchema.parse(params);

    const result = await validatePaymentNotification('redsys', params, {});
    if (!result || !result.valid) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // TODO: persist or process payment result (mapPaymentResult in application layer)

    // Respond 200 to acknowledge to Redsys
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, message: err instanceof Error ? err.message : 'Invalid notification' }, { status: 400 });
  }
}
