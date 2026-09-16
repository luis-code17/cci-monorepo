import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/Section";
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
  description: "Un Lugar de Nuevos Comienzos, donde Somos Uno en la fe, la enseñanza bíblica y la vida en comunidad.",
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
        subtitle="Un Lugar de Nuevos Comienzos"
        imageUrlLight="/cci_sabadell_light_background.png"
        imageUrlLightMobile="/cci_sabadell_light_background_mb.png"
        imageUrlDark="/cci_sabadell_dark_background.png"
      />

      <div className="w-full py-0">
        <VerseCard verse={verse.verse} reference={verse.reference} nextSectionId={latestVideos.length > 0 ? "#predicaciones-section" : undefined} />
      </div>

      {latestVideos && latestVideos.length > 0 ? (
        <PredicacionesVideos videos={latestVideos} nextSectionId="#home-content" />
      ) : null}

      <div id="home-content" className="section-shell pt-0">
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

      {!latestVideos || latestVideos.length === 0 ? (
        <section className="mt-14">
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
        </section>
      ) : null}
      </div>

      <Section
        eyebrow="Sobre Nosotros"
        title="Conoce la iglesia"
        background={{ light: "/conocenos.jpeg", mobile: "/conocenos_mobile_crop.jpg", alt: "Comunidad de CCI Sabadell" }}
        contentClassName="text-white"
        overlayClassName="bg-gradient-to-r from-black/85 via-black/60 to-black/35"
      >
        <div className="mx-auto mt-4 flex w-full max-w-2xl flex-1 -translate-y-8 flex-col justify-center space-y-6 text-center">
          <p className="font-sans text-[clamp(1.2rem,2vw,1.5rem)] leading-8 text-white/90 sm:leading-9">
            Somos Uno: una comunidad cristiana y un lugar de nuevos comienzos, centrado en la fe, la enseñanza bíblica y la vida compartida. Nuestro propósito es acercar a las personas a Dios, fortalecer la vida espiritual y compartir esperanza a través de Jesucristo.
          </p>
          <Link href="/about" className="btn btn-primary rounded-full">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            Conócenos
          </Link>
        </div>
      </Section>
    </>
  );
}
