import { z } from 'zod';

export const CreateDonationSchema = z.object({
  amount: z.number().int().min(1), // euros cents or cents? We'll expect cents
  currency: z.string().default('978'),
  email: z.string().email().optional(),
  returnUrl: z.string().url(),
  description: z.string().max(255).optional(),
});

export type CreateDonationInput = z.infer<typeof CreateDonationSchema>;

export const RedsysNotificationSchema = z.object({
  Ds_MerchantParameters: z.string(),
  Ds_Signature: z.string(),
  Ds_SignatureVersion: z.string().optional(),
  // Keep unknowns allowed — we'll parse merchant params separately
}).passthrough();

export type RedsysNotification = z.infer<typeof RedsysNotificationSchema>;
