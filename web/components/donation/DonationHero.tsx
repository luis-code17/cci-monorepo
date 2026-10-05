import Image from "next/image";
import Link from "next/link";
import { ArrowDown, HeartHandshake, ShieldCheck } from "lucide-react";

type DonationHeroProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export function DonationHero({ title, subtitle, imageUrl }: DonationHeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-slate-950/15">
      {imageUrl ? <Image src={imageUrl} alt="Comunidad de CCI Sabadell" fill sizes="(min-width: 1280px) 1200px, 100vw" priority className="-z-20 object-cover object-center" /> : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/10" />

      <div className="grid min-h-[26rem] items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[30rem] lg:grid-cols-[1.1fr_.9fr] lg:px-14">
        <div className="max-w-2xl text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" /> Generosidad que construye comunidad
          </p>
          <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.03] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-white/80 sm:text-lg sm:leading-8">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="#donacion" className="btn btn-primary min-h-12 rounded-full px-6 text-base font-semibold">
              Hacer una donación <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-white/75"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> Pago seguro con Redsys</span>
          </div>
        </div>

        <div className="hidden justify-end lg:flex">
          <div className="max-w-sm rounded-3xl border border-white/20 bg-slate-950/35 p-6 text-white shadow-xl backdrop-blur-md">
            <p className="text-sm font-semibold text-white">Una comunidad que crece unida</p>
            <p className="mt-2 text-sm leading-6 text-white/75">Cada aportación ayuda a sostener la vida y las actividades de CCI Sabadell.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
