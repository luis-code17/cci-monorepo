import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getYouTubeCatalog } from "@/lib/youtube";
import { PredicacionesLibrary } from "@/components/predicaciones-library";

export const metadata = {
  title: "Predicaciones",
  description: "Predicaciones y videos de CCI Sabadell.",
};

export const revalidate = 3600;

const youtubeChannelUrl = "https://www.youtube.com/@CentroCristianoInternacionalSa";

export default async function PredicacionesPage() {
  const catalog = await getYouTubeCatalog();

  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <section className="glass-panel w-full section-stack rounded-3xl border border-base-content/20 p-6 shadow-lg shadow-base-content/5 sm:p-8">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/80">Predicaciones</p>
          <h1 className="text-balance text-4xl font-semibold text-base-content sm:text-5xl md:text-6xl">
            Mensajes y Predicaciones
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-base-content/80">
            Explora los mensajes de CCI Sabadell, encuentra un tema concreto y reproduce cada predicación aquí o directamente en nuestro{" "}
            <Link
              href={youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary/80 hover:decoration-primary"
            >
              canal de YouTube
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mt-12 section-stack">
        <PredicacionesLibrary videos={catalog.videos} playlists={catalog.playlists} apiEnabled={catalog.apiEnabled} />
      </section>
    </div>
  );
}
