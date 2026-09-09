import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { VerseCard } from "@/components/verse-card";
import { BlogCard } from "@/components/blog-card";
import { getPosts } from "@/lib/blog";
import { getVerseOfTheDay } from "@/lib/verse";
import { getLatestVideos } from "@/lib/youtube";
import { PredicacionesVideos } from "@/components/predicaciones-videos";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "CCI Sabadell - Centro Cristiano Internacional",
  description: "Una comunidad cristiana moderna enfocada en la fe, enseñanza bíblica y vida en comunidad. Bienvenidos a CCI Sabadell.",
};

const videoPreviews = [
  {
    title: "Predicación destacada",
    description: "Un mensaje para escuchar en cualquier momento.",
  },
  {
    title: "Culto principal",
    description: "La reunión principal de la iglesia, disponible para revisar después.",
  },
  {
    title: "Oración y adoración",
    description: "Momentos de búsqueda, alabanza y comunidad.",
  },
  {
    title: "Encuentro de jóvenes",
    description: "Contenido pensado para la vida de los jóvenes de la iglesia.",
  },
];

export default async function HomePage() {
  const posts = await getPosts();
  const latestPosts = posts.slice(0, 4);
  const verse = (await getVerseOfTheDay()) ?? {
    verse: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
    reference: "Salmo 119:105",
  };
  const latestVideos = (await getLatestVideos(3)).slice(0, 3);

  return (
    <>
      <HeroSection
        title="Bienvenidos a CCI Sabadell"
        subtitle="Un lugar de fe, comunidad y esperanza."
        imageUrlLight="/cci_sabadell_light_background.png"
        imageUrlLightMobile="/cci_sabadell_light_background_mb.png"
        imageUrlDark="/cci_sabadell_dark_background.png"
      />

      <div id="home-content" className="section-shell py-6 sm:py-8 lg:py-10">
        <section className="mt-4 sm:mt-6">
          <VerseCard verse={verse.verse} reference={verse.reference} />
        </section>
{/* 
      <section className="mt-14 flex items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Blog reciente</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold text-base-content sm:text-4xl">
            Últimas publicaciones
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
            Aquí publicamos entradas con texto, imágenes y reflexiones de la comunidad.
          </p>
        </div>
        <Link href="/blog" className="btn btn-outline rounded-full hidden sm:inline-flex">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          Ver todos
        </Link>
      </section>

      <section className="mt-8">
        {latestPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="alert mt-6 shadow-sm">
            <span>No hay publicaciones disponibles en este momento</span>
          </div>
        )}
      </section> */}

      <section className="mt-14 flex items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Videos</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold text-base-content sm:text-4xl">
            Últimos videos y mensajes
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-lg leading-8 text-base-content/75">
            Un vistazo rápido a las predicaciones y contenidos en vídeo de la iglesia.
          </p>
        </div>
        <Link href="/predicaciones" className="btn btn-outline rounded-full hidden sm:inline-flex">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          Ver todos
        </Link>
      </section>

      <section className="mt-8">
        {latestVideos && latestVideos.length > 0 ? (
          <PredicacionesVideos videos={latestVideos} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {videoPreviews.map((video) => (
              <article key={video.title} className="surface-card h-full overflow-hidden">
                <div className="flex h-full flex-col justify-between gap-6 p-6">
                  <div className="space-y-3">
                    <div className="badge badge-secondary badge-outline rounded-full">Video</div>
                    <h3 className="text-2xl font-semibold leading-tight">{video.title}</h3>
                    <p className="text-sm leading-7 text-base-content/70">{video.description}</p>
                  </div>
                  <Link href="/predicaciones" className="btn btn-sm btn-outline rounded-full w-fit">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Ver todos
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card overflow-hidden">
          <figure className="relative aspect-4/3">
            <Image
              src="/pastor.jpg"
              alt="Pastor de CCI Sabadell"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </figure>
        </div>

        <div className="surface-card bg-base-200/55">
          <div className="space-y-6 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-base-content/55">Sobre Nosotros</p>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">Conoce la iglesia</h2>
            <p className="text-base leading-7 text-base-content/75 sm:text-lg">
              Somos una comunidad cristiana enfocada en la fe, la enseñanza bíblica y la vida en comunidad. Nuestro propósito es acercar a las personas a Dios, fortalecer la vida espiritual y compartir esperanza a través de Jesucristo.
            </p>
            <div>
              <Link href="/about" className="btn btn-primary rounded-full">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                Ver todos
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
