import Image from "next/image";

type DonationHeroProps = {
  title: string;
  subtitle: string;
  imageUrl?: string;
};

export function DonationHero({ title, subtitle, imageUrl }: DonationHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-base-200/50 bg-base-100">
      {/* Background image with overlay */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            className="object-cover opacity-8"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-base-100/20 via-base-100/50 to-base-100" />
        </div>
      )}

      {/* Decorative gradient elements */}
      <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 space-y-6">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">Ofrendas y Donaciones</p>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-base-content leading-tight">
            {title}
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl leading-8 text-base-content/75 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="h-1 w-12 bg-primary/60 rounded-full" />
          <div className="h-1 w-2 bg-primary rounded-full" />
          <div className="h-1 w-12 bg-primary/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
