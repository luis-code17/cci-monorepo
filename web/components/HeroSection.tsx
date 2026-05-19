import Image from "next/image";
import { BrandMark } from "@/components/brand-mark";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  /** Image for light theme (visible when not dark) */
  imageUrl?: string | null;
  /** Optional image specifically for dark theme (visible when dark) */
  // imageUrlDark was removed: keep hero image unchanged across themes.
  ctaHref: string;
  ctaLabel: string;
};

export function HeroSection({ title, subtitle, imageUrl, ctaHref, ctaLabel }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-base-200/80 bg-base-100 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.24)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_36%)] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-tr from-base-100/90 via-base-100/70 to-transparent" />

      <div className="relative mx-auto grid w-full gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-12">
        <div className="flex flex-col justify-center space-y-6 sm:space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="badge badge-secondary badge-sm sm:badge-md">Comunidad de fe</div>
            <div className="badge badge-ghost badge-sm sm:badge-md">Sabadell</div>
          </div>

          <BrandMark size="lg" className="max-w-[14rem] sm:max-w-xs" />

          <div className="space-y-4 sm:space-y-5">
            <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="max-w-xl text-pretty text-base leading-8 text-base-content/72 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={ctaHref} className="btn btn-primary min-w-[13rem] rounded-full sm:btn-lg">
              {ctaLabel}
            </a>
            <div className="text-sm leading-6 text-base-content/60">
              Enseñanza bíblica, adoración y comunidad en Sabadell.
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full bg-secondary/10 blur-3xl lg:block" />
          <div className="absolute -bottom-6 right-4 hidden h-44 w-44 rounded-full bg-primary/10 blur-3xl lg:block" />

          <div className="surface-card overflow-hidden">
            <figure className="relative min-h-[22rem] sm:min-h-[30rem]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full min-h-[22rem] w-full items-center justify-center bg-base-200 sm:min-h-[30rem]">
                  <span className="max-w-xs text-center font-serif text-2xl text-base-content/60 sm:text-3xl">
                    CCI Sabadell
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/35 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <div className="rounded-2xl border border-base-100/30 bg-base-100/20 px-4 py-3 text-sm text-base-content backdrop-blur-md">
                  <span className="font-medium">“{subtitle}”</span>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
