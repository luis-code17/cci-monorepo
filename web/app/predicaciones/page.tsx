import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { getLatestVideos } from "@/lib/youtube";
import { PredicacionesVideos } from "@/components/predicaciones-videos";

export const metadata = {
  title: "Predicaciones",
  description: "Predicaciones y videos de CCI Sabadell.",
};

export const revalidate = 3600;

const highlights = [
  {
    title: "Mensajes Inspiradores",
    description: "Descubre predicaciones sobre fe, crecimiento espiritual y vida cristiana que fortalecen tu camino.",
  },
  {
    title: "Contenido Accesible",
    description: "Mira en cualquier momento los mensajes principales para seguir creciendo en tu fe.",
  },
  {
    title: "Comunidad en Línea",
    description: "Conéctate con nuestra iglesia a través de los videos desde donde estés.",
  },
];

export default async function PredicacionesPage() {
  const latestVideos = await getLatestVideos(6);
  const hasVideos = latestVideos.length > 0;

  return (
    <div className="section-shell py-10 sm:py-12 lg:py-16">
      <section className="max-w-3xl section-stack">
        <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Predicaciones</p>
        <h1 className="text-balance text-4xl font-semibold text-base-content sm:text-5xl md:text-6xl">
          Mensajes y Predicaciones
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
          Accede a los mensajes de fe, enseñanza bíblica e inspiración de CCI Sabadell. Encontrarás predicaciones que te ayudarán a crecer espiritualmente y fortalecer tu vida de fe.
        </p>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="surface-card h-full">
            <div className="space-y-3 p-6">
              <h2 className="text-2xl font-semibold leading-tight text-base-content">{item.title}</h2>
              <p className="text-sm leading-7 text-base-content/72 sm:text-[0.97rem]">{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 section-stack">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-base-content/55 font-medium">YouTube</p>
            <h2 className="mt-2 text-balance text-3xl font-semibold text-base-content sm:text-4xl font-serif">
              Últimas predicaciones
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
              Mensajes recientes de nuestro canal de YouTube.
            </p>
          </div>
          <Link
            href="https://www.youtube.com/@CentroCristianoInternacionalSa"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline rounded-full hidden sm:inline-flex"
          >
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Ir a YouTube
          </Link>
        </div>

        {!hasVideos && (
          <div className="alert alert-info border border-info/20 bg-info/10 text-info-content/90 shadow-sm">
            <span>Los vídeos no están disponibles en este momento.</span>
          </div>
        )}

        {hasVideos && <PredicacionesVideos videos={latestVideos} />}

        <div className="flex justify-center pt-2 sm:hidden">
          <Link
            href="https://www.youtube.com/@CentroCristianoInternacionalSa"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline rounded-full"
          >
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Ir a YouTube
          </Link>
        </div>
      </section>
    </div>
  );
}
