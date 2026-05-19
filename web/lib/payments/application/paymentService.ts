import { PaymentProvider, PaymentRequest, PaymentResponse } from '../domain/types';
import { RedsysProvider } from '../providers/redsysProvider';

const providers: Record<string, PaymentProvider> = {
  redsys: new RedsysProvider(),
};

export function getProvider(name: string): PaymentProvider {
  const p = providers[name];
  if (!p) throw new Error(`Payment provider not configured: ${name}`);
  return p;
}

export async function createDonationPayment(request: PaymentRequest, providerName = 'redsys'): Promise<PaymentResponse> {
  const provider = getProvider(providerName);
  return provider.createPayment(request);
}

export async function validatePaymentNotification(providerName: string, payload: unknown, headers?: Record<string, string | string[]>) {
  const provider = getProvider(providerName);
  return provider.validateNotification(payload, headers);
}
