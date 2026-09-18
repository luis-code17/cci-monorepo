"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import type { YouTubeVideo } from "@/lib/youtube";

type PredicacionesLibraryProps = {
  videos: YouTubeVideo[];
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

function getEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
}

export function PredicacionesLibrary({ videos }: PredicacionesLibraryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [sort, setSort] = useState("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const closeSortMenu = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-sort-menu]")) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("click", closeSortMenu);
    return () => document.removeEventListener("click", closeSortMenu);
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();

    videos.forEach((video) => {
      video.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });

    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    const result = videos.filter((video) => {
      const matchesCategory = category === "Todas" || video.tags.includes(category);
      const searchableText = `${video.title} ${video.tags.join(" ")}`.toLocaleLowerCase("es");
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return result.sort((a, b) => {
      if (sort === "oldest") return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      if (sort === "title") return a.title.localeCompare(b.title, "es");
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [category, query, sort, videos]);

  return (
    <>
      <section className="overflow-hidden">
        <div className="border-b border-base-content/15 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="input input-bordered flex w-full items-center gap-3 rounded-xl border-base-content/20 bg-base-content/10 backdrop-blur-xl lg:max-w-xl">
              <Search className="h-4 w-4 text-base-content/45" aria-hidden="true" />
              <span className="sr-only">Buscar mensajes</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por título o categoría"
                className="grow"
              />
            </label>

            <div className="relative w-full lg:w-auto" data-sort-menu>
              <div className="flex w-full items-center gap-2 rounded-xl border border-base-content/20 bg-base-content/10 px-3 shadow-sm backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((open) => !open)}
                  aria-expanded={isSortOpen}
                  aria-haspopup="listbox"
                  className="flex h-11 w-full items-center justify-between gap-6 text-sm font-medium text-base-content focus:outline-none lg:min-w-44"
                >
                  <span>{sort === "recent" ? "Más recientes" : sort === "oldest" ? "Más antiguos" : "Por título"}</span>
                  <ChevronDown className={`h-4 w-4 text-base-content/55 transition-transform ${isSortOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
              </div>
              {isSortOpen ? (
                <div className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-base-content/20 bg-base-100/90 p-1.5 shadow-xl backdrop-blur-2xl lg:min-w-44">
                  {[
                    ["recent", "Más recientes"],
                    ["oldest", "Más antiguos"],
                    ["title", "Por título"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      role="option"
                      aria-selected={sort === value}
                      onClick={() => {
                        setSort(value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${sort === value ? "bg-primary text-primary-content" : "text-base-content hover:bg-base-content/10"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Categorías de mensajes">
              <button
                type="button"
                onClick={() => setCategory("Todas")}
                className={`btn btn-sm rounded-full ${category === "Todas" ? "btn-primary" : "btn-ghost border border-base-300"}`}
              >
                Todas <span className="opacity-65">{videos.length}</span>
              </button>
              {categories.map(([item, count]) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`btn btn-sm rounded-full ${category === item ? "btn-primary" : "btn-ghost border border-base-300"}`}
                >
                  {item} <span className="opacity-65">{count}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid gap-5 border-t border-base-content/15 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {filteredVideos.map((video) => <YouTubeVideoCard key={video.id} video={video} onPlay={setActiveVideo} />)}
          </div>
        ) : (
          <div className="border-t border-base-content/15 px-6 py-16 text-center">
            <p className="text-lg font-semibold">No encontramos mensajes con esos criterios.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("Todas"); }} className="btn btn-ghost mt-3 rounded-full">Limpiar filtros</button>
          </div>
        )}
      </section>

      <dialog className={`modal ${activeVideo ? "modal-open" : ""}`} open={Boolean(activeVideo)} onClose={() => setActiveVideo(null)}>
        <div className="modal-box w-11/12 max-w-5xl overflow-hidden p-0">
          {activeVideo ? (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-base-content/55">{formatDateEs(activeVideo.publishedAt)}</p>
                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{activeVideo.title}</h2>
                </div>
                <button type="button" onClick={() => setActiveVideo(null)} className="btn btn-sm btn-circle btn-ghost" aria-label="Cerrar vídeo"><X className="h-4 w-4" aria-hidden="true" /></button>
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe src={getEmbedUrl(activeVideo.id)} title={activeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" /></div>
              <div className="flex justify-end"><Link href={activeVideo.url} target="_blank" rel="noreferrer" className="btn btn-primary rounded-full">Abrir en YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            </div>
          ) : null}
        </div>
        <form method="dialog" className="modal-backdrop"><button type="submit" aria-label="Cerrar vídeo" onClick={() => setActiveVideo(null)}>cerrar</button></form>
      </dialog>
    </>
  );
}