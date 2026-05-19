"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    setStatus('sending');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'No se pudo enviar el mensaje');

      e.currentTarget.reset();
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'No se pudo enviar el mensaje');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => {
        if (status === 'success') setStatus('idle');
      }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.22em] text-base-content/45">Nombre</span>
          <input name="name" required className="input input-bordered w-full rounded-xl bg-base-100" placeholder="Tu nombre" />
        </label>

        <label className="space-y-1">
          <span className="text-xs uppercase tracking-[0.22em] text-base-content/45">Email</span>
          <input name="email" type="email" required className="input input-bordered w-full rounded-xl bg-base-100" placeholder="tu@email.com" />
        </label>
      </div>

      <label className="space-y-1 block">
        <span className="text-xs uppercase tracking-[0.22em] text-base-content/45">Asunto</span>
        <input name="subject" required className="input input-bordered w-full rounded-xl bg-base-100" placeholder="Motivo de tu mensaje" />
      </label>

      <label className="space-y-1 block">
        <span className="text-xs uppercase tracking-[0.22em] text-base-content/45">Mensaje</span>
        <textarea
          name="message"
          required
          rows={5}
          className="textarea textarea-bordered w-full rounded-xl bg-base-100"
          placeholder="Cuéntanos en qué te podemos ayudar"
        />
      </label>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full rounded-xl"
        disabled={status === 'sending'}
      >
        <Send className="h-4 w-4" />
        {status === 'sending' ? 'Enviando...' : status === 'success' ? 'Mensaje enviado' : 'Enviar mensaje'}
      </button>

      {status === 'success' ? (
        <p className="text-center text-sm text-base-content/65">Gracias. Te responderemos lo antes posible.</p>
      ) : null}
    </form>
  );
}
