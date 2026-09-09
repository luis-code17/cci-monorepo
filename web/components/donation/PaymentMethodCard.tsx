"use client";

import { Landmark, Smartphone } from "lucide-react";
import { useState } from "react";

type PaymentMethodCardProps = {
  title: string;
  description: string;
  icon: "smartphone" | "landmark";
  status?: "available" | "soon" | "coming";
  bankDetails?: {
    titular: string;
    iban: string;
    concepto: string;
  };
};

export function PaymentMethodCard({ title, description, icon, status = "soon", bankDetails }: PaymentMethodCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isSoon = status !== "available";
  const Icon = icon === "smartphone" ? Smartphone : Landmark;
  
  return (
    <article className={`surface-card overflow-hidden transition-all duration-300 hover:shadow-md ${isSoon ? "opacity-75" : ""}`}>
      <div className="space-y-4 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="text-2xl font-semibold text-base-content font-serif">{title}</h3>
            <p className="text-sm leading-6 text-base-content/70">{description}</p>
          </div>
          <div className={`p-3 rounded-xl flex-shrink-0 ${isSoon ? "bg-base-200" : "bg-primary/10"}`}>
            <Icon className={`h-6 w-6 ${isSoon ? "text-base-content/40" : "text-primary"}`} />
          </div>
        </div>

        {isSoon && !bankDetails && (
          <div className="flex items-center gap-2 pt-2">
            <div className="h-2 w-2 rounded-full bg-base-content/40" />
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-base-content/50">Próximamente disponible</span>
          </div>
        )}

        {bankDetails && (
          <>
            <button
              type="button"
              aria-expanded={isDetailsOpen}
              onClick={() => setIsDetailsOpen((open) => !open)}
              className="w-full rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary transition-colors duration-200 hover:bg-primary/20"
            >
              {isDetailsOpen ? "Ocultar datos bancarios" : "Ver datos bancarios"}
            </button>

            {isDetailsOpen && (
              <div className="space-y-3 rounded-lg border border-base-200 bg-base-200/40 p-4 text-sm">
                <p><span className="font-semibold">Titular:</span> {bankDetails.titular}</p>
                <p className="break-all"><span className="font-semibold">IBAN:</span> {bankDetails.iban}</p>
                <p><span className="font-semibold">Concepto:</span> {bankDetails.concepto}</p>
              </div>
            )}
          </>
        )}

        {!isSoon && (
          <button
            type="button"
            className="w-full rounded-lg bg-primary/10 px-4 py-2 font-medium text-primary hover:bg-primary/20 transition-colors duration-200"
          >
            Seleccionar método
          </button>
        )}
      </div>

      {/* Decorative placeholder QR for Bizum */}
      {title === "Bizum" && (
        <div className="border-t border-base-200/50 bg-base-50/30 px-6 py-5 flex justify-center">
          <div className="w-24 h-24 bg-base-200 rounded-lg flex items-center justify-center border-2 border-dashed border-base-300">
            <svg className="w-12 h-12 text-base-content/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm0 8h8v-8H3v8zm8-16h8V3h-8v8zm8 8h8v-8h-8v8zm0 8h8v-8h-8v8zM3 21h8v-8H3v8z" />
            </svg>
          </div>
        </div>
      )}
    </article>
  );
}
