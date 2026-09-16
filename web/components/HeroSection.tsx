import { Section } from "@/components/Section";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  imageUrlLight: string;
  imageUrlLightMobile: string;
  imageUrlDark: string;
};

export function HeroSection({ title, subtitle, imageUrlLight, imageUrlLightMobile, imageUrlDark }: HeroSectionProps) {
  return (
    <Section
      background={{ light: imageUrlLight, dark: imageUrlDark, mobile: imageUrlLightMobile, alt: "CCI Sabadell", position: "center center", mobilePosition: "left top" }}
      arrow={{ href: "#verse-of-the-day", label: "Desplazarse al versículo del día", icon: "chevron" }}
      priority
      contentClassName="items-end justify-start px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
      overlayClassName="bg-linear-to-l from-black/65 via-black/20 to-transparent"
    >
      <div className="max-w-xl space-y-6 text-right text-white">
        <div className="space-y-4">
          <h1 className="hero-title text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{title}</h1>
          <p className="hero-subtitle ml-auto max-w-xl text-pretty text-base leading-8 text-white/85 sm:text-lg md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </Section>
  );
}
