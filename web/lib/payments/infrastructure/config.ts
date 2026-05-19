import { z } from 'zod';

const envSchema = z.object({
  REDSYS_MERCHANT_CODE: z.string().nonempty(),
  REDSYS_SECRET_KEY: z.string().nonempty(),
  REDSYS_TERMINAL: z.string().optional(),
  REDSYS_MODE: z.enum(['production', 'test']).optional().default('production'),
  REDSYS_CURRENCY: z.string().optional().default('978'),
  REDSYS_NOTIFY_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Only throw on server start in production — keep errors explicit.
  // For local dev, missing envs should be fixed by developer.
  throw new Error(`Invalid payment environment variables: ${parsed.error.message}`);
}

export const paymentConfig = {
  redsys: {
    merchantCode: parsed.data.REDSYS_MERCHANT_CODE,
    secretKey: parsed.data.REDSYS_SECRET_KEY,
    // Terminal formatting: use provided value if set, otherwise default to '001' in test and '1' in production
    terminal: parsed.data.REDSYS_TERMINAL ?? (parsed.data.REDSYS_MODE === 'test' ? '001' : '1'),
    mode: parsed.data.REDSYS_MODE,
    currency: parsed.data.REDSYS_CURRENCY,
    notifyUrl: parsed.data.REDSYS_NOTIFY_URL,
  },
  siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL,
};
