import Image from "next/image";
import { ArrowDown, ArrowRight, Quote } from "lucide-react";

type VerseCardProps = {
  verse: string;
  reference: string;
};

export function VerseCard({ verse, reference }: VerseCardProps) {
  return (
    <section id="verse-of-the-day" className="relative isolate w-full overflow-hidden bg-base-200 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.75)]">
      <Image
        src="/versiculo_del_dia.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover md:block"
      />
      <Image
        src="/versiculo_del_dia_mobile.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="block object-cover md:hidden"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 pb-20 pt-10 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-6xl text-white md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm sm:px-5 sm:text-[0.75rem] md:mb-6">
            <Quote className="h-4 w-4" aria-hidden="true" />
            Versículo del día
          </div>

          <blockquote className="max-w-[min(90vw,44rem)] break-words font-serif leading-[0.9] tracking-[-0.04em] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)] text-[clamp(2.1rem,5vw,5.5rem)] md:text-left md:text-[clamp(2.4rem,5vw,6rem)]">
            {verse}
          </blockquote>

          <div className="mt-5 flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-xs">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>{reference}</span>
          </div>
        </div>
      </div>

      <a
        href="#predicaciones-section"
        aria-label="Desplazarse a predicaciones"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/85 transition-colors hover:text-white"
      >
        <ArrowDown className="h-8 w-8 animate-bounce" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </section>
  );
}
