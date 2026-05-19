import Link from "next/link";
import { Camera, Mail, MapPin, MessageCircle, PlayCircle } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const serviceTimes = [
  "Domingo: culto principal",
  "Miércoles: oración y adoración",
  "Viernes: encuentro de jóvenes",
];

const footerLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/predicaciones", label: "Predicaciones" },
  { href: "/about", label: "Sobre Nosotros" },
  { href: "/ofrendas", label: "Ofrendas y Diezmos" },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-base-200/80 bg-base-100">
      <div className="section-shell py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <section className="space-y-5">
            <div className="flex items-center gap-4">
              <BrandMark size="md" className="h-14 w-auto" />
              <div>
                <p className="text-2xl font-semibold">CCI Sabadell</p>
                <p className="text-xs uppercase tracking-[0.3em] text-base-content/60">
                  Centro Cristiano Internacional
                </p>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-base-content/70">
              Somos una comunidad cristiana moderna enfocada en la fe, la enseñanza bíblica y la vida en comunidad. Un lugar para crecer espiritualmente y compartir esperanza.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.facebook.com/ccisbdnc/?locale=es_ES"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-ghost rounded-full"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/cci_sabadell/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-ghost rounded-full"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/34999999999"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-ghost rounded-full"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="https://www.youtube.com/@CentroCristianoInternacionalSa"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-ghost rounded-full"
              >
                YouTube
              </a>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-base-content">Horario de servicio</h2>
            <ul className="space-y-3 text-sm leading-7 text-base-content/70">
              {serviceTimes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 text-sm text-base-content/70">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Carrer de Brutau, 100 · Sabadell, Barcelona</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-base-content/70">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a href="mailto:sabadellcci@gmail.com" className="link link-hover">
                sabadellcci@gmail.com
              </a>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-base-content">Enlaces</h2>
            <nav className="flex flex-col gap-3 text-sm text-base-content/70">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="link link-hover w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 text-sm text-base-content/70">
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              <span>Predicaciones y contenido semanal</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-base-content/70">
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>Comunidad activa en redes sociales</span>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-base-200/80 pt-6 text-sm text-base-content/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CCI Sabadell. Todos los derechos reservados.</p>
          <p>Fe, comunidad y esperanza.</p>
        </div>
      </div>
    </footer>
  );
}
