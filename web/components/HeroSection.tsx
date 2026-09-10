import Image from "next/image";
import { ChevronDown } from "lucide-react";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  imageUrlLight: string;
  imageUrlLightMobile: string;
  imageUrlDark: string;
};

export function HeroSection({ title, subtitle, imageUrlLight, imageUrlLightMobile, imageUrlDark }: HeroSectionProps) {
  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-base-200">
      <Image
        src={imageUrlLight}
        alt="CCI Sabadell"
        fill
        sizes="100vw"
        className="hero-theme-light object-cover"
        priority
      />
      <Image
        src={imageUrlLightMobile}
        alt="CCI Sabadell"
        fill
        sizes="100vw"
        className="hero-theme-light-mobile object-cover"
        priority
      />
      <Image
        src={imageUrlDark}
        alt="CCI Sabadell"
        fill
        sizes="100vw"
        className="hero-theme-dark object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-l from-black/65 via-black/20 to-transparent" />

      <div className="relative mx-auto flex min-h-svh w-full justify-end px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="max-w-xl space-y-6 text-right text-white">
          <div className="space-y-4">
            <h1 className="hero-title text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="hero-subtitle ml-auto max-w-xl text-pretty text-base leading-8 text-white/85 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          </div>

        </div>
      </div>

      <a
        href="#verse-of-the-day"
        aria-label="Desplazarse al versículo del día"
        className="absolute bottom-7 right-6 z-10 text-white/85 transition-colors hover:text-white sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
      >
        <ChevronDown className="h-9 w-9 animate-bounce" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </section>
  );
}
