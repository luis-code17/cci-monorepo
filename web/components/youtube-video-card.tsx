"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, PlayCircle } from "lucide-react";
import type { YouTubeVideo } from "@/lib/youtube";

type YouTubeVideoCardProps = {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
  sizes?: string;
};

function formatDateEs(value: string) {
  if (!value) return "Vídeo reciente";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Vídeo reciente";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function YouTubeVideoCard({ video, onPlay, sizes = "(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" }: YouTubeVideoCardProps) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-base-content/20 bg-base-content/10 shadow-sm backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-base-content/15 hover:shadow-lg"
      onClick={() => onPlay(video)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPlay(video);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Abrir ${video.title}`}
    >
      <div className="relative block aspect-video w-full overflow-hidden text-left">
        <Image src={video.thumbnail} alt={video.title} fill sizes={sizes} className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
          <PlayCircle className="h-4 w-4" aria-hidden="true" /> Ver mensaje
        </span>
        {video.durationLabel ? <span className="absolute bottom-3 right-3 rounded-md border border-white/20 bg-black/35 px-2 py-1 text-xs text-white backdrop-blur-xl">{video.durationLabel}</span> : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-xs text-base-content/55">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatDateEs(video.publishedAt)}</span>
        </div>
        <h2 className="line-clamp-2 text-xl font-semibold leading-tight">{video.title}</h2>
        {video.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {video.tags.map((tag) => <span key={tag} className="badge badge-ghost">{tag}</span>)}
          </div>
        ) : null}
        <Link href={video.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Ver en YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
