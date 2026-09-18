"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Section } from "@/components/Section";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import type { YouTubeVideo } from "@/lib/youtube";

type PredicacionesVideosProps = {
  videos: YouTubeVideo[];
  nextSectionId?: string;
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

export function PredicacionesVideos({ videos, nextSectionId }: PredicacionesVideosProps) {
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
      <Section
        id="predicaciones-section"
        eyebrow="Predicaciones"
        title="Predicaciones y mensajes"
        background={{
          light: "/predicaciones_light.jpeg",
          dark: "/predicaciones_dark.jpeg",
          mobile: "/predicaciones_mobile.jpeg",
          mobileDark: "/predicaciones_dark.jpeg",
        }}
        arrow={nextSectionId ? { href: nextSectionId, label: "Desplazarse al siguiente contenido" } : undefined}
        priority
        className="shadow-[0_25px_80px_-35px_rgba(15,23,42,0.75)]"
        overlayClassName="bg-gradient-to-r from-black/85 via-black/70 to-black/55 bg-linear-to-t from-black/40 via-transparent to-black/15"
      >
          <div className="relative mx-auto flex w-full flex-1 flex-col justify-center">
            <div className="mx-auto hidden w-full max-w-5xl items-stretch gap-3 md:grid md:grid-cols-3">
            {featuredVideos.map((video) => (
              <YouTubeVideoCard
                key={video.id}
                video={video}
                onPlay={(selectedVideo) => setActiveVideoId(selectedVideo.id)}
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 28vw, 100vw"
              />
            ))}
            </div>

            <div className="mt-6 block pb-16 md:hidden">
              {featuredVideos.slice(0, 1).map((video) => (
                <YouTubeVideoCard
                  key={video.id}
                  video={video}
                  onPlay={(selectedVideo) => setActiveVideoId(selectedVideo.id)}
                  sizes="100vw"
                />
              ))}
              <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-white/70">Última predicación</p>
            </div>
          <div className="flex justify-center pb-12 pt-6">
            <Link href="/predicaciones" className="btn btn-primary btn-sm rounded-full sm:btn-md">
              Ver todas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </Section>

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
