import Image from "next/image";
import { Camera, Globe, MessageCircle, PlayCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Sobre Nosotros - CCI Sabadell",
  description: "Conoce CCI Sabadell, una comunidad cristiana centrada en la fe, la Biblia y la vida en familia.",
};

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/cci_sabadell/",
    icon: Camera,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/34999999999",
    icon: MessageCircle,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/ccisbdnc/?locale=es_ES",
    icon: Globe,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@CentroCristianoInternacionalSa",
    icon: PlayCircle,
  },
];

const facts = [
  "Cultos, oración y jóvenes",
  "Biblia, familia y comunidad",
  "CCI Sabadell, en el centro de la ciudad",
];

export default function AboutPage() {
  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <section className="surface-card relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="absolute -left-20 top-0 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-base-content/45">Sobre nosotros</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">CCI Sabadell</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg sm:leading-8">
            Una iglesia sencilla, cercana y centrada en Jesucristo. Queremos que cada persona encuentre fe, acompañamiento y un lugar donde crecer.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {facts.map((fact) => (
              <span key={fact} className="rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-xs text-base-content/65">
                {fact}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="grid gap-6">
          <article className="surface-card overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image
                src="/pastor.jpg"
                alt="Pastor de CCI Sabadell"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Fe</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Jesucristo en el centro</h2>
              <p className="max-w-xl text-sm leading-7 text-base-content/70 sm:text-base">
                Culto, enseñanza y comunidad con un estilo claro, cercano y sin complicaciones.
              </p>
            </div>
          </article>
        </div>

        <aside className="flex h-full flex-col gap-6">
          <article className="surface-card p-6 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Información</p>

            <dl className="mt-4 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-base-200/70 pb-4">
                <dt className="text-sm uppercase tracking-[0.18em] text-base-content/45">Dirección</dt>
                <dd className="text-right text-sm leading-6 text-base-content/75">
                  Carrer de Brutau, 100
                  <br />
                  08203 Sabadell, Barcelona
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-base-200/70 pb-4">
                <dt className="text-sm uppercase tracking-[0.18em] text-base-content/45">Horario</dt>
                <dd className="text-right text-sm leading-6 text-base-content/75">
                  Domingo, miércoles y viernes
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-sm uppercase tracking-[0.18em] text-base-content/45">Email</dt>
                <dd className="text-right text-sm leading-6 text-base-content/75">
                  <a href="mailto:sabadellcci@gmail.com" className="link link-hover">
                    sabadellcci@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </article>

          <article className="surface-card mt-auto p-6 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Redes</p>
            <h3 className="mt-3 text-xl font-semibold sm:text-2xl">Síguenos y conéctate</h3>
            <p className="mt-2 max-w-md text-sm leading-7 text-base-content/70">
              Encuentra novedades, recursos y contenido de la iglesia en nuestras redes sociales.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex w-full items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content/75 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:text-base-content hover:shadow-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200 text-base-content/60 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{link.label}</span>
                  </a>
                );
              })}
            </div>
          </article>
        </aside>
      </section>

      {/* <section className="mt-8">
        <div className="grid gap-6 md:grid-cols-[0.94fr_1.06fr] md:items-stretch">
          <article className="surface-card overflow-hidden h-full">
            <div className="relative aspect-[16/10]">
              <Image
                src="/pastora.jpg"
                alt="Pastora de CCI Sabadell"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Comunidad</p>
              <h2 className="text-2xl font-semibold sm:text-3xl">Una casa para familias y jóvenes</h2>
              <p className="max-w-xl text-sm leading-7 text-base-content/70 sm:text-base">
                Un espacio para adorar, aprender y compartir vida juntos.
              </p>
            </div>
          </article>

          <article className="surface-card h-full p-6 sm:p-7 flex flex-col">
            <p className="text-[11px] uppercase tracking-[0.28em] text-base-content/45">Contacto</p>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Escríbenos</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-base-content/70">
              Si quieres visitarnos, pedir información o hablar con el ministerio, déjanos tu mensaje.
            </p>
            <div className="mt-5 flex-1">
              <ContactForm />
            </div>
          </article>
        </div>
      </section> */}

    </div>
  );
}
