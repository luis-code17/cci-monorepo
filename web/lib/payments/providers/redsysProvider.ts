import { PaymentProvider, PaymentRequest, PaymentResponse } from '../domain/types';
import { paymentConfig } from '../infrastructure/config';
import { encodeMerchantParameters, signMerchantParameters, verifySignature, redsysApi } from '../infrastructure/redsysClient';
import crypto from 'crypto';

function toMinorUnits(amountCents: number): string {
  // amountCents expected as integer (e.g., 500 == €5.00)
  return String(amountCents);
}

function generateOrderNumber(): string {
  // Redsys expects a 12-character order and the first 4 characters must be numeric.
  const now = new Date();
  const prefix = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(8);
  let out = prefix;
  for (let i = 0; i < 8; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export class RedsysProvider implements PaymentProvider {
  name = 'redsys';

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const { intent } = request;

    const order = generateOrderNumber();

    const merchantParams = {
      Ds_Merchant_Amount: toMinorUnits(intent.amount),
      Ds_Merchant_Order: order,
      Ds_Merchant_MerchantCode: paymentConfig.redsys.merchantCode,
      Ds_Merchant_Currency: paymentConfig.redsys.currency,
      Ds_Merchant_TransactionType: '0',
      Ds_Merchant_Terminal: paymentConfig.redsys.terminal,
      Ds_Merchant_MerchantURL: paymentConfig.redsys.notifyUrl,
      Ds_Merchant_ConsumerLanguage: '001',
      Ds_Merchant_ProductDescription: intent.description ?? 'Ofrenda',
      Ds_Merchant_MerchantName: paymentConfig.redsys.merchantCode,
      Ds_Merchant_UrlOK: paymentConfig.redsys.mode === 'test' ? 'ns' : intent.returnUrl,
      Ds_Merchant_UrlKO: paymentConfig.redsys.mode === 'test' ? 'ns' : intent.returnUrl,
    } as Record<string, unknown>;

    const merchantParameters = encodeMerchantParameters(merchantParams);
    const signature = signMerchantParameters(merchantParameters, order);

    return {
      provider: this.name,
      form: {
        action: redsysApi.getEndpoint(),
        params: {
          Ds_SignatureVersion: 'HMAC_SHA256_V1',
          Ds_MerchantParameters: merchantParameters,
          Ds_Signature: signature,
        },
      },
      raw: { merchantParams: { ...merchantParams, DS_MERCHANT_ORDER: order }, merchantParameters, signature },
    };
  }

  async validateNotification(payload: unknown): Promise<{ valid: boolean; result?: unknown }> {
    if (!payload || typeof payload !== 'object') return { valid: false };
    const body = payload as Record<string, string>;
    const merchantParameters = body['Ds_MerchantParameters'];
    const signature = body['Ds_Signature'];
    if (!merchantParameters || !signature) return { valid: false };

    try {
      const decoded = Buffer.from(merchantParameters, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      const order = typeof parsed?.DS_MERCHANT_ORDER === 'string' ? parsed.DS_MERCHANT_ORDER : '';
      if (!order) return { valid: false };

      const valid = verifySignature(merchantParameters, signature, order);
      if (!valid) return { valid: false };

      return { valid: true, result: parsed };
    } catch (err) {
      return { valid: false };
    }
  }
}
