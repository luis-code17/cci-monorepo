import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { contactConfig } from '@/lib/contact';

export const runtime = 'nodejs';

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
});

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.parse(body);

    const transporter = nodemailer.createTransport({
      host: contactConfig.smtp.host,
      port: contactConfig.smtp.port,
      secure: contactConfig.smtp.port === 465,
      auth: {
        user: contactConfig.smtp.user,
        pass: contactConfig.smtp.pass,
      },
    });

    const subject = `[Contacto] ${parsed.subject}`;
    const text = [
      `Nombre: ${parsed.name}`,
      `Email: ${parsed.email}`,
      '',
      parsed.message,
    ].join('\n');
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
        <h2 style="margin:0 0 12px">${escapeHtml(contactConfig.brandName)} - Contacto web</h2>
        <p style="margin:0 0 8px"><strong>Nombre:</strong> ${escapeHtml(parsed.name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(parsed.email)}</p>
        <p style="margin:0 0 8px"><strong>Asunto:</strong> ${escapeHtml(parsed.subject)}</p>
        <div style="margin-top:16px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;white-space:pre-wrap">${escapeHtml(parsed.message)}</div>
      </div>
    `;

    await transporter.sendMail({
      from: contactConfig.smtp.from,
      to: contactConfig.recipient,
      replyTo: parsed.email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'No se pudo enviar el mensaje';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

