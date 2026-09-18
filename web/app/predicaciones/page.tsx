import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLatestVideos } from "@/lib/youtube";
import { PredicacionesLibrary } from "@/components/predicaciones-library";

export const metadata = {
  title: "Predicaciones",
  description: "Predicaciones y videos de CCI Sabadell.",
};

export const revalidate = 3600;

const youtubeChannelUrl = "https://www.youtube.com/@CentroCristianoInternacionalSa";

export default async function PredicacionesPage() {
  const latestVideos = await getLatestVideos(15);
  const hasVideos = latestVideos.length > 0;

  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <section className="max-w-3xl section-stack">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Predicaciones</p>
        <h1 className="text-balance text-4xl font-semibold text-base-content sm:text-5xl md:text-6xl">
          Mensajes y Predicaciones
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
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
      </section>

      <section className="mt-12 section-stack">
        {!hasVideos && (
          <div className="alert alert-info border border-info/20 bg-info/10 text-info-content/90 shadow-sm">
            <span>Los vídeos no están disponibles en este momento.</span>
          </div>
        )}

        {hasVideos && <PredicacionesLibrary videos={latestVideos} />}
      </section>
    </div>
  );
}
