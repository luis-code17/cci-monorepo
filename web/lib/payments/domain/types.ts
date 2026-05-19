export enum PaymentStatus {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Cancelled = 'CANCELLED',
}

export type Currency = string;

export interface DonationIntent {
  id: string; // internal id
  amount: number; // minor units (cents)
  currency: Currency;
  description?: string;
  email?: string;
  returnUrl: string;
}

export interface PaymentRequest {
  intent: DonationIntent;
  providerSpecific?: Record<string, unknown>;
}

export interface PaymentResponse {
  provider: string;
  redirectUrl?: string; // where client should redirect
  form?: {
    action: string;
    params: Record<string, string>;
  };
  raw?: unknown;
}

export interface PaymentNotification {
  provider: string;
  rawBody: unknown;
}

export interface PaymentProvider {
  name: string;
  createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  validateNotification(payload: unknown, headers?: Record<string, string | string[]>): Promise<{ valid: boolean; result?: unknown }>;
}
