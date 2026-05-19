import crypto from 'crypto';
import { paymentConfig } from './config';

export function encodeMerchantParameters(params: Record<string, unknown>): string {
  const json = JSON.stringify(params);
  return Buffer.from(json).toString('base64');
}

export function decodeRedsysSecretKey(): Buffer {
  // Redsys provides the SHA-256 commerce key as a Base64 string.
  return Buffer.from(paymentConfig.redsys.secretKey, 'base64');
}

export function deriveRedsysTransactionKey(order: string): Buffer {
  const secret = decodeRedsysSecretKey();
  const iv = Buffer.alloc(8, 0);
  const cipher = crypto.createCipheriv('des-ede3-cbc', secret, iv);
  cipher.setAutoPadding(false);

  const orderBuffer = Buffer.from(order, 'utf8');
  const paddedLength = Math.ceil(orderBuffer.length / 8) * 8;
  const paddedOrder = Buffer.alloc(paddedLength);
  orderBuffer.copy(paddedOrder);

  return Buffer.concat([cipher.update(paddedOrder), cipher.final()]);
}

export function signMerchantParameters(merchantParameters: string, order: string): string {
  const transactionKey = deriveRedsysTransactionKey(order);
  return crypto.createHmac('sha256', transactionKey).update(merchantParameters).digest('base64');
}

export function verifySignature(merchantParameters: string, signature: string, order: string): boolean {
  const expected = signMerchantParameters(merchantParameters, order);
  // Use timing-safe compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function getRedsysEndpoint() {
  // Use test endpoint for 'test' mode, production otherwise
  if (paymentConfig.redsys.mode === 'test') {
    return 'https://sis-t.redsys.es:25443/sis/realizarPago';
  }
  return 'https://sis.redsys.es/sis/realizarPago';
}

export const redsysApi = {
  encodeMerchantParameters,
  signMerchantParameters,
  verifySignature,
  getEndpoint: getRedsysEndpoint,
};
