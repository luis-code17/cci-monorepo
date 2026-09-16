import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";

type VerseCardProps = {
  verse: string;
  reference: string;
  nextSectionId?: string;
};

export function VerseCard({ verse, reference, nextSectionId }: VerseCardProps) {
  return (
    <Section
      id="verse-of-the-day"
      eyebrow="Versículo del día"
      title="Un mensaje para ti"
      background={{ light: "/versiculo_del_dia.jpeg", mobile: "/versiculo_del_dia_mobile.jpeg" }}
      arrow={nextSectionId ? { href: nextSectionId, label: "Desplazarse a predicaciones" } : undefined}
      priority
      className="shadow-[0_25px_80px_-35px_rgba(15,23,42,0.75)]"
      contentClassName="items-center justify-center pb-20 md:items-start md:justify-start"
      headerClassName="mb-4 max-w-6xl text-white"
      overlayClassName="bg-gradient-to-r from-black/85 via-black/60 to-black/35"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center text-center text-white">
        <blockquote className="mx-auto max-w-4xl break-words font-sans text-[clamp(1.75rem,4vw,3.5rem)] font-normal leading-[1.15] tracking-normal text-white/90">
          {verse}
        </blockquote>
        <div className="mt-5 flex items-center justify-center gap-2 font-sans text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/80 sm:text-xs">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          <span>{reference}</span>
        </div>
      </div>
    </Section>
  );
}
