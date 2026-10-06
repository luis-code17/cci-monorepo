"use client";

import { Check } from "lucide-react";
import { useState } from "react";

type AmountSelectorProps = {
  onAmountChange?: (amount: number | null) => void;
};

const suggestedAmounts = [10, 25, 50, 100];

export function AmountSelector({ onAmountChange }: AmountSelectorProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  function selectAmount(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
    onAmountChange?.(amount);
  }

  function changeCustomAmount(value: string) {
    setCustomAmount(value);
    setSelectedAmount(null);
    const normalized = value.trim().replace(",", ".");
    const amount = normalized ? Number(normalized) : NaN;
    onAmountChange?.(Number.isFinite(amount) && amount > 0 ? amount : null);
  }

  return (
    <section aria-labelledby="amount-title" className="space-y-5">
      <div>
        <h3 id="amount-title" className="text-sm font-semibold text-base-content">Elige tu aportación</h3>
        <p className="mt-1 text-sm text-base-content/80">Selecciona una cantidad o introduce otra.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {suggestedAmounts.map((amount) => {
          const active = selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={active}
              onClick={() => selectAmount(amount)}
              className={`flex min-h-14 items-center justify-between rounded-xl border px-4 text-left text-lg font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${active ? "border-primary bg-primary text-primary-content shadow-md shadow-primary/15" : "border-base-content/20 bg-base-100/95 text-base-content hover:border-primary/50 hover:bg-primary/5"}`}
            >
              <span>{amount} €</span>
              {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="customAmount" className="mb-2 block text-sm font-medium text-base-content/80">Otra cantidad</label>
        <div className="flex h-12 items-center rounded-xl border border-base-content/30 bg-base-100/95 px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          <input
            type="text"
            inputMode="decimal"
            id="customAmount"
            autoComplete="off"
            placeholder="Por ejemplo, 30"
            value={customAmount}
            onChange={(event) => changeCustomAmount(event.target.value)}
            aria-describedby="amount-hint"
            className="w-full bg-transparent text-base text-base-content outline-none placeholder:text-base-content/80"
          />
          <span className="pl-3 font-semibold text-base-content/80">€</span>
        </div>
        <p id="amount-hint" className="mt-2 text-xs text-base-content/80">El importe mínimo es 1 €.</p>
      </div>
    </section>
  );
}
