import { ArrowRight, Quote } from "lucide-react";

type VerseCardProps = {
  verse: string;
  reference: string;
};

export function VerseCard({ verse, reference }: VerseCardProps) {
  return (
    <article className="surface-card overflow-hidden bg-base-200/60">
      <div className="h-1 bg-gradient-to-r from-secondary via-primary to-accent" />
      <div className="space-y-6 p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-3">
          <div className="badge badge-secondary badge-outline rounded-full px-4 py-3">
            <Quote className="mr-2 h-4 w-4" aria-hidden="true" />
            Versículo del día
          </div>
          <div className="hidden h-px flex-1 bg-base-content/10 sm:block" />
          <div className="hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-base-content/45 sm:flex">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Hoy
          </div>
        </div>
        <blockquote className="text-balance font-serif text-3xl leading-[1.15] text-base-content md:text-4xl lg:text-[2.75rem]">
          {verse}
        </blockquote>
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-base-content/55">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          <span>{reference}</span>
        </div>
      </div>
    </article>
  );
}
