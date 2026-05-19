"use client";

import { useState } from 'react';
import { AmountSelector } from './AmountSelector';

type Status = 'idle' | 'creating' | 'redirecting' | 'error';

export function DonationForm() {
  const [amount, setAmount] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleDonate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!amount || amount <= 0) return setError('Selecciona un importe válido');

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
      if (!payload.ok) throw new Error(payload.error || 'Error creando el pago');

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

  return (
    <form onSubmit={handleDonate} className="space-y-4">
      <AmountSelector
        onAmountChange={(a) => setAmount(a)}
        ctaDisabled={status === 'creating' || status === 'redirecting' || !amount}
        ctaLoading={status === 'creating'}
      />

      {error && <div className="text-sm text-error">{error}</div>}

      {status === 'redirecting' && (
        <div className="text-center text-xs text-base-content/55">Redirigiendo a Redsys…</div>
      )}
    </form>
  );
}
