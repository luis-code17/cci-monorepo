"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

type AmountSelectorProps = {
  onAmountChange?: (amount: number | null) => void;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
};

const suggestedAmounts = [
  { value: 10, label: "10€" },
  { value: 25, label: "25€" },
  { value: 50, label: "50€" },
  { value: 100, label: "100€" },
];

export function AmountSelector({ onAmountChange, ctaDisabled = false, ctaLoading = false }: AmountSelectorProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toFixed(2));
    onAmountChange?.(amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);

    if (value && !Number.isNaN(Number.parseFloat(value))) {
      setSelectedAmount(null);
      onAmountChange?.(Number.parseFloat(value));
    } else {
      onAmountChange?.(null);
    }
  };

  const formattedSelection = selectedAmount ?? (customAmount ? Number.parseFloat(customAmount) : null);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Selecciona un importe</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {suggestedAmounts.map((amount) => {
          const isSelected = selectedAmount === amount.value;

          return (
            <button
              key={amount.value}
              type="button"
              onClick={() => handleSelectAmount(amount.value)}
            className={`relative rounded-xl border px-4 py-3 text-left transition-colors duration-200 ${
              isSelected
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 bg-base-100"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className={`text-lg font-semibold font-serif ${isSelected ? "text-primary-content" : "text-base-content"}`}>
                    {amount.label}
                  </div>
                </div>

                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected ? "border-primary-content/25 bg-primary-content/10" : "border-base-300 bg-base-100"
                  }`}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-md pt-1">
        <label htmlFor="customAmount" className="mb-2 block text-xs uppercase tracking-[0.22em] text-base-content/45">
          O ingresa otro importe
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-2.5 focus-within:border-primary/35">
          <span className="text-sm text-base-content/45">€</span>
          <input
            type="number"
            id="customAmount"
            placeholder="Cantidad"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="w-full bg-transparent text-base outline-none placeholder:text-base-content/25"
            min="1"
            step="0.01"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-content transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={ctaDisabled || !formattedSelection}
          >
            {ctaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>{ctaLoading ? '...' : 'Donar'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
