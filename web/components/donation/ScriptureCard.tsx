type ScriptureCardProps = {
  title: string;
  verse: string;
  reference?: string;
};

export function ScriptureCard({ title, verse, reference }: ScriptureCardProps) {
  return (
    <article className="surface-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
      <div className="flex h-full flex-col justify-center space-y-6 px-6 py-12 text-center sm:px-8 sm:py-14 lg:px-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Inspiración</p>
          <h2 className="text-3xl font-serif font-semibold text-base-content sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          <blockquote className="text-base leading-7 text-base-content/80 italic sm:text-lg sm:leading-8">
            "{verse}"
          </blockquote>
          
          {reference && (
            <p className="text-sm font-medium text-base-content/60 tracking-[0.05em]">
              — {reference}
            </p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-3 pt-2">
          <div className="h-1 w-8 bg-gradient-to-r from-transparent to-primary rounded-full" />
          <div className="h-1 w-1 rounded-full bg-primary" />
          <div className="h-1 w-8 bg-gradient-to-l from-transparent to-primary rounded-full" />
        </div>
      </div>
    </article>
  );
}
