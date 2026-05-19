"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, PlayCircle, X } from "lucide-react";
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

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const hasTags = video.tags.length > 0;
          const dateText = formatDateEs(video.publishedAt) || "Vídeo reciente";

          return (
            <article
              key={video.id}
              className="surface-card group flex h-full flex-col overflow-hidden border border-base-200/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                    sizes="(min-width: 1536px) 22vw, (min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
                  {video.durationLabel ? (
                    <div className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-medium text-base-content shadow-sm backdrop-blur">
                      {video.durationLabel}
                    </div>
                  ) : null}
                </figure>
              </button>

              <div className="flex flex-1 flex-col space-y-4 p-6 sm:p-8">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-base-content/55 font-medium">{dateText}</p>
                  <h3 className="line-clamp-2 text-2xl font-semibold leading-tight text-base-content sm:text-[1.5rem] font-serif">
                    {video.title}
                  </h3>
                </div>

                {hasTags && (
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(video.id)}
                    className="btn btn-primary rounded-full"
                  >
                    Ver video
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <Link
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost rounded-full"
                  >
                    Ver en YouTube
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

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
