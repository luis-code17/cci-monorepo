import { NextResponse } from 'next/server';
import { validatePaymentNotification } from '../../../../../lib/payments/application/paymentService';
import { RedsysNotificationSchema } from '../../../../../lib/payments/utils/validation';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = Object.fromEntries(new URLSearchParams(text).entries());

    const parsed = RedsysNotificationSchema.parse(params);

    const { Ds_MerchantParameters } = parsed as Record<string, string>;

    const result = await validatePaymentNotification('redsys', params, {});
    if (!result || !result.valid) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // TODO: persist or process payment result (mapPaymentResult in application layer)

    // Respond 200 to acknowledge to Redsys
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 400 });
  }
}
