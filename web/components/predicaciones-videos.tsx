"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, PlayCircle, X } from "lucide-react";
import type { YouTubeVideo } from "@/lib/youtube";

type PredicacionesVideosProps = {
  videos: YouTubeVideo[];
};

function formatDateEs(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
}

export function PredicacionesVideos({ videos }: PredicacionesVideosProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const activeVideo = useMemo(
    () => videos.find((video) => video.id === activeVideoId) ?? null,
    [activeVideoId, videos],
  );

  useEffect(() => {
    if (!activeVideoId) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideoId(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeVideoId]);

  const featuredVideos = videos.slice(0, 3);

  return (
    <>
      <section id="predicaciones-section" className="relative w-full overflow-x-hidden shadow-[0_25px_80px_-35px_rgba(15,23,42,0.75)]">
        <Image
          src="/predicaciones.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="predicaciones-theme-light hidden object-cover md:block"
        />
        <Image
          src="/predicaciones_mobile.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="predicaciones-theme-mobile block object-cover md:hidden"
        />
        <Image
          src="/predicaciones_dark.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="predicaciones-theme-dark hidden object-cover md:block"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/55" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/15" />

        <div className="relative z-10 flex min-h-[100svh] flex-col justify-start px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto mt-4 w-full max-w-7xl flex flex-col gap-4 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Predicaciones</p>
              <h2 className="mt-2 text-balance text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                Predicaciones y mensajes
              </h2>
            </div>

            <Link href="/predicaciones" className="btn btn-primary btn-sm rounded-full w-fit sm:btn-md">
              Ver todas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mx-auto mt-28 hidden w-full max-w-5xl items-stretch gap-3 md:grid md:grid-cols-3">
            {featuredVideos.map((video) => {
              const hasTags = video.tags.length > 0;
              const dateText = formatDateEs(video.publishedAt) || "Vídeo reciente";

              return (
                <article
                  key={video.id}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/20 backdrop-blur-sm shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className="relative block w-full text-left"
                    aria-label={`Reproducir ${video.title}`}
                  >
                    <figure className="relative aspect-video overflow-hidden bg-base-200">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 28vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                      {video.durationLabel ? (
                        <div className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-medium text-base-content shadow-sm backdrop-blur">
                          {video.durationLabel}
                        </div>
                      ) : null}
                    </figure>
                  </button>

                  <div className="flex flex-1 flex-col space-y-3 p-4 text-white">
                    <div className="space-y-1.5">
                      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-white/60">{dateText}</p>
                      <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white sm:text-lg">
                        {video.title}
                      </h3>
                    </div>

                    {hasTags && (
                      <div className="flex flex-wrap gap-2">
                        {video.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[0.65rem] font-medium text-white/80">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      <button type="button" onClick={() => setActiveVideoId(video.id)} className="btn btn-xs btn-primary rounded-full sm:btn-sm">
                        Ver video
                        <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>

                      <Link href={video.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-white/80 hover:text-white sm:text-sm">
                        YouTube
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 block md:hidden">
            {featuredVideos.slice(0, 1).map((video) => {
              const dateText = formatDateEs(video.publishedAt) || "Vídeo reciente";

              return (
                <article key={video.id} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20 shadow-lg backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className="relative block w-full text-left"
                    aria-label={`Reproducir ${video.title}`}
                  >
                    <figure className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-[0.65rem] font-medium text-base-content shadow-sm">
                        {video.durationLabel || "Vídeo"}
                      </div>
                    </figure>
                  </button>

                  <div className="space-y-3 p-4 text-white">
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/60">{dateText}</p>
                    <h3 className="text-xl font-semibold leading-tight text-white">{video.title}</h3>
                    <button type="button" onClick={() => setActiveVideoId(video.id)} className="btn btn-primary btn-sm rounded-full w-full">
                      Ver video
                      <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <a
          href="#home-content"
          aria-label="Desplazarse al siguiente contenido"
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
        >
          <ArrowDown className="h-8 w-8 animate-bounce" strokeWidth={1.5} aria-hidden="true" />
        </a>
      </section>

      <dialog className={`modal ${activeVideo ? "modal-open" : ""}`} open={Boolean(activeVideo)} onClose={() => setActiveVideoId(null)}>
        <div className="modal-box w-11/12 max-w-5xl overflow-hidden p-0 shadow-2xl">
          {activeVideo && (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-base-content/55 font-medium">
                    {formatDateEs(activeVideo.publishedAt) || "Vídeo reciente"}
                  </p>
                  <h3 className="text-balance text-2xl font-semibold leading-tight text-base-content sm:text-3xl font-serif">
                    {activeVideo.title}
                  </h3>
                </div>
                <form method="dialog">
                  <button type="submit" className="btn btn-sm btn-circle btn-ghost" aria-label="Cerrar">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              </div>

              {activeVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeVideo.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="overflow-hidden rounded-3xl border border-base-300 bg-black shadow-sm">
                <div className="aspect-video w-full">
                  <iframe
                    src={getEmbedUrl(activeVideo.id)}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-base-content/60">
                  Reproducción embebida para ver el mensaje sin salir de la página.
                </p>
                <Link
                  href={activeVideo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary rounded-full"
                >
                  Abrir en YouTube
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit" aria-label="Cerrar modal" onClick={() => setActiveVideoId(null)}>
            cerrar
          </button>
        </form>
      </dialog>
    </>
  );
}
