import { FALLBACK_DONATION_CONTENT } from "@/lib/fallbacks";

type DonationCardProps = {
  title: string;
  description: string;
  buttonLabel?: string;
};

const amounts = ["10€", "25€", "50€", "Otro"];

export function DonationCard({
  title,
  description,
  buttonLabel = FALLBACK_DONATION_CONTENT.textoBoton,
}: DonationCardProps) {
  return (
    <article className="surface-card overflow-hidden">
      <div className="border-b border-base-200/80 bg-base-200/40 px-6 py-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Donación central</p>
      </div>

      <div className="space-y-8 p-6 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="text-balance text-3xl font-semibold sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="text-pretty text-base leading-8 text-base-content/75 sm:text-lg">{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {amounts.map((amount) => (
            <button key={amount} type="button" className="btn btn-outline rounded-full">
              {amount}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button type="button" className="btn btn-primary rounded-full px-8 sm:btn-lg">
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
