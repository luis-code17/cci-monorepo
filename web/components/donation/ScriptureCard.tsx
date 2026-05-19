type ScriptureCardProps = {
  title: string;
  verse: string;
  reference?: string;
};

export function ScriptureCard({ title, verse, reference }: ScriptureCardProps) {
  return (
    <article className="surface-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
      <div className="px-6 sm:px-8 lg:px-12 py-12 sm:py-14 lg:py-16 space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Inspiración</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-base-content">
            {title}
          </h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          <blockquote className="text-lg sm:text-xl leading-8 sm:leading-9 text-base-content/80 italic">
            "{verse}"
          </blockquote>
          
          {reference && (
            <p className="text-sm font-medium text-base-content/60 tracking-[0.05em]">
              — {reference}
            </p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 pt-4">
          <div className="h-1 w-8 bg-gradient-to-r from-transparent to-primary rounded-full" />
          <div className="h-1 w-1 rounded-full bg-primary" />
          <div className="h-1 w-8 bg-gradient-to-l from-transparent to-primary rounded-full" />
        </div>
      </div>
    </article>
  );
}
