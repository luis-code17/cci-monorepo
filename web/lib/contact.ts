import 'server-only';

import { z } from 'zod';

const contactEnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1).default('CCI Sabadell <no-reply@example.com>'),
  CONTACT_TO_EMAIL: z.string().email(),
  CONTACT_FROM_NAME: z.string().min(1).default('CCI Sabadell'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsed = contactEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid contact environment variables: ${parsed.error.message}`);
}

export const contactConfig = {
  smtp: {
    host: parsed.data.SMTP_HOST,
    port: parsed.data.SMTP_PORT,
    user: parsed.data.SMTP_USER,
    pass: parsed.data.SMTP_PASS,
    from: parsed.data.SMTP_FROM,
  },
  recipient: parsed.data.CONTACT_TO_EMAIL,
  brandName: parsed.data.CONTACT_FROM_NAME,
  siteUrl: parsed.data.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
};

