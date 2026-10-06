import Link from "next/link";
import { Check, Clock3, CreditCard, Landmark, Smartphone } from "lucide-react";

type PaymentMethodCardProps = {
  title: string;
  description: string;
  icon: "smartphone" | "landmark" | "card";
  status?: "available" | "soon";
};

export function PaymentMethodCard({ title, description, icon, status = "soon" }: PaymentMethodCardProps) {
  const available = status === "available";
  const Icon = icon === "smartphone" ? Smartphone : icon === "landmark" ? Landmark : CreditCard;

  return (
    <article className={`glass-panel flex h-full flex-col rounded-2xl border p-5 shadow-sm transition duration-200 sm:p-6 ${available ? "border-primary/30 shadow-primary/5" : "border-base-content/15"}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${available ? "bg-primary text-primary-content" : "bg-base-content/10 text-base-content/80"}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-xl font-semibold text-base-content sm:text-2xl">{title}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${available ? "bg-success/20 text-status-success" : "bg-base-content/10 text-base-content/80"}`}>
              {available ? <Check className="h-3 w-3" aria-hidden="true" /> : <Clock3 className="h-3 w-3" aria-hidden="true" />}
              {available ? "Disponible" : "Próximamente"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-base-content/80">{description}</p>
        </div>
      </div>
      {available ? (
        <Link href="#donacion" className="btn btn-outline mt-5 min-h-11 w-full rounded-xl border-primary/30 text-primary hover:border-primary hover:bg-primary hover:text-primary-content">
          Ir al formulario de donación
        </Link>
      ) : null}
    </article>
  );
}
