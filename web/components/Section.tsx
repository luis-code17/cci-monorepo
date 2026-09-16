import Image from "next/image";
import { ArrowDown, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type SectionBackground = {
  light: string;
  dark?: string;
  mobile?: string;
  mobileDark?: string;
  alt?: string;
  position?: string;
  mobilePosition?: string;
};

type SectionArrow = {
  href: string;
  label: string;
  icon?: "down" | "chevron";
};

type SectionProps = {
  id?: string;
  title?: string;
  eyebrow?: string;
  titleAs?: "h1" | "h2" | "h3";
  background: SectionBackground;
  arrow?: SectionArrow;
  children: ReactNode;
  priority?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  overlayClassName?: string;
};

export function Section({
  id,
  title,
  eyebrow,
  titleAs = "h2",
  background,
  arrow,
  children,
  priority = false,
  className = "",
  contentClassName = "",
  headerClassName = "",
  titleClassName = "",
  overlayClassName = "bg-gradient-to-r from-black/85 via-black/60 to-black/35",
}: SectionProps) {
  const lightImage = background.light;
  const darkImage = background.dark ?? lightImage;
  const mobileImage = background.mobile ?? lightImage;
  const mobileDarkImage = background.mobileDark ?? mobileImage;
  const Title = titleAs;
  const ArrowIcon = arrow?.icon === "chevron" ? ChevronDown : ArrowDown;

  return (
    <section id={id} className={`relative isolate min-h-svh w-full overflow-hidden bg-base-200 ${className}`}>
      <Image
        src={lightImage}
        alt={background.alt ?? ""}
        fill
        sizes="100vw"
        priority={priority}
        className="section-theme-light object-cover"
        style={{ objectPosition: background.position }}
      />
      <Image
        src={darkImage}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="section-theme-dark object-cover"
        style={{ objectPosition: background.position }}
      />
      <Image
        src={mobileImage}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="section-theme-mobile object-cover"
        style={{ objectPosition: background.mobilePosition ?? background.position }}
      />
      <Image
        src={mobileDarkImage}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="section-theme-mobile-dark object-cover"
        style={{ objectPosition: background.mobilePosition ?? background.position }}
      />

      <div className={`absolute inset-0 ${overlayClassName}`} />

      <div className={`relative z-10 flex min-h-svh w-full flex-col px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20 ${contentClassName}`}>
        {title ? (
          <header className={`mx-auto w-full max-w-7xl ${headerClassName}`}>
            {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-white/70">{eyebrow}</p> : null}
            <Title className={`${eyebrow ? "mt-2" : ""} text-balance text-4xl font-semibold text-white sm:text-5xl lg:text-6xl ${titleClassName}`}>
              {title}
            </Title>
          </header>
        ) : null}
        {children}
      </div>

      {arrow ? (
        <a
          href={arrow.href}
          aria-label={arrow.label}
          className="absolute bottom-6 right-6 z-10 text-white/85 transition-colors hover:text-white sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
        >
          <ArrowIcon className="h-8 w-8 animate-bounce" strokeWidth={1.5} aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}
