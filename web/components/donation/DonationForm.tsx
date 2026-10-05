"use client";

import { useState } from 'react';
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import { AmountSelector } from './AmountSelector';

type Status = 'idle' | 'creating' | 'redirecting' | 'error';

export function DonationForm() {
  const [amount, setAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleDonate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!amount || !Number.isFinite(amount) || amount < 1) return setError('El importe mínimo es 1 €');

    setStatus('creating');
    setError(null);

    try {
      const cents = Math.round(amount * 100);
      const returnUrl = window.location.href;

      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents, returnUrl }),
      });

      const payload = await res.json();
      if (!payload.ok) throw new Error('No se pudo iniciar el pago. Inténtalo de nuevo o escríbenos a sabadellcci@gmail.com.');

      const data = payload.data;
      if (data?.form) {
        setStatus('redirecting');
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.form.action;
        form.style.display = 'none';

        Object.entries(data.form.params).forEach(([k, v]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      throw new Error('Respuesta de pago inesperada');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
      setStatus('error');
    }
  }

  const busy = status === 'creating' || status === 'redirecting';
  const formattedAmount = amount == null ? null : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <form onSubmit={handleDonate} className="space-y-5">
      <AmountSelector onAmountChange={setAmount} />
      {error && <div role="alert" className="alert alert-error py-3 text-sm">{error}</div>}
      <div className="space-y-3 border-t border-base-content/10 pt-5">
        {formattedAmount ? <p className="text-center text-sm text-base-content/70">Aportación seleccionada: <strong className="text-base-content">{formattedAmount}</strong></p> : null}
        <button type="submit" disabled={busy || !amount || amount < 1} className="btn btn-primary h-13 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/15 disabled:shadow-none">
          {status === 'creating' ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <CreditCard className="h-5 w-5" aria-hidden="true" />}
          {status === 'creating' ? 'Preparando pago…' : status === 'redirecting' ? 'Redirigiendo…' : 'Donar con tarjeta'}
          {status === 'idle' || status === 'error' ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
        </button>
        <p className="text-center text-xs leading-5 text-base-content/60">Pago seguro procesado por Redsys. El importe se cargará una sola vez.</p>
        {status === 'redirecting' ? <p role="status" className="text-center text-sm text-base-content/65">Redirigiendo a la pasarela de pago…</p> : null}
      </div>
    </form>
  );
}
