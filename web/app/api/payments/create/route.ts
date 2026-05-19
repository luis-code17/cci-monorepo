import { NextResponse } from 'next/server';
import { CreateDonationSchema } from '../../../../lib/payments/utils/validation';
import { createDonationPayment } from '../../../../lib/payments/application/paymentService';
import { paymentConfig } from '../../../../lib/payments/infrastructure/config';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateDonationSchema.parse(body);

    // Basic server-side safety checks
    if (typeof parsed.amount !== 'number' || parsed.amount <= 0) {
      return NextResponse.json({ ok: false, error: 'Importe inválido. Envía el importe en céntimos (ej. 500 = 5,00€).' }, { status: 400 });
    }

    // Never trust frontend amounts in production — re-validate against business rules
    const siteUrl = paymentConfig.siteUrl ?? 'http://localhost:3000';
    const requestReturnUrl = new URL(parsed.returnUrl);
    const returnUrl = requestReturnUrl.origin === new URL(siteUrl).origin
      ? requestReturnUrl.toString()
      : new URL('/ofrendas', siteUrl).toString();

    const intent = {
      id: uuidv4(),
      amount: parsed.amount,
      currency: parsed.currency,
      description: parsed.description,
      email: parsed.email,
      returnUrl,
    };

    const response = await createDonationPayment({ intent }, 'redsys');
    const responseData = response as {
      raw?: {
        merchantParameters?: string;
      };
      form?: {
        params?: Record<string, string>;
      };
    };

    // Debug logging: decode merchant parameters and log key fields when debug enabled
    const debug = process.env.REDSYS_DEBUG === 'true' || process.env.NODE_ENV !== 'production';
    try {
      if (debug) {
        const mp = responseData.raw?.merchantParameters || responseData.form?.params?.Ds_MerchantParameters;
        if (typeof mp === 'string') {
          const decoded = Buffer.from(mp, 'base64').toString('utf8');
          let decodedParams: Record<string, unknown> | null = null;
          try {
            decodedParams = JSON.parse(decoded) as Record<string, unknown>;
          } catch (e) {
            console.warn('[REDSYS DEBUG] Failed to parse decoded merchantParameters', e);
          }

          console.log('[REDSYS DEBUG] decoded merchantParameters:', decoded);
          if (decodedParams) {
            const amount =
              decodedParams.DS_MERCHANT_AMOUNT ??
              decodedParams.Ds_Merchant_Amount ??
              decodedParams.Ds_Merchant_Amount ??
              decodedParams.DS_MERCHANT_AMOUNT;
            const order =
              decodedParams.DS_MERCHANT_ORDER ??
              decodedParams.Ds_Merchant_Order ??
              decodedParams.DS_MERCHANT_ORDER;
            const terminal =
              decodedParams.DS_MERCHANT_TERMINAL ??
              decodedParams.Ds_Merchant_Terminal ??
              paymentConfig.redsys.terminal;
            const merchantCode =
              decodedParams.DS_MERCHANT_MERCHANTCODE ??
              decodedParams.Ds_Merchant_MerchantCode ??
              paymentConfig.redsys.merchantCode;

            console.log('[REDSYS DEBUG] Amount:', amount);
            console.log('[REDSYS DEBUG] Order:', order);
            console.log('[REDSYS DEBUG] Terminal:', terminal);
            console.log('[REDSYS DEBUG] MerchantCode:', String(merchantCode).slice(0, 4) + '****');
          }
        }
      }
    } catch (e) {
      console.warn('[REDSYS DEBUG] error while logging merchantParameters', e);
    }

    return NextResponse.json({ ok: true, data: response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
