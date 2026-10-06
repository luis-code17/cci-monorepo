"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownWideNarrow, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ListVideo, Play, PlayCircle, Search, Video, X } from "lucide-react";
import { YouTubeVideoCard } from "@/components/youtube-video-card";
import type { YouTubePlaylist, YouTubeVideo } from "@/lib/youtube";

type PredicacionesLibraryProps = {
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  apiEnabled: boolean;
};

const PAGE_SIZE = 12;
const ALL_VIDEOS = "__all__";

function getPageItems(currentPage: number, totalPages: number): (number | "…")[] {
  const pages = Array.from(new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]))
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  return pages.flatMap((page, index) => index > 0 && page - pages[index - 1] > 1 ? ["…", page] : [page]);
}

function formatDateEs(value: string) {
  if (!value) return "Vídeo reciente";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Vídeo reciente";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function getEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
}

function ShortsViewer({ videos, onClose }: { videos: YouTubeVideo[]; onClose: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(videos[0]?.id);
  const activeIndex = Math.max(0, videos.findIndex((video) => video.id === activeId));

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = visible?.target.getAttribute("data-short-id");
      if (id) setActiveId(id);
    }, { root, threshold: [0.6, 0.85] });
    root.querySelectorAll("[data-short-id]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [videos]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div data-testid="shorts-viewer" className="fixed inset-0 z-[100] bg-black text-white" role="dialog" aria-modal="true" aria-label="Shorts de predicaciones">
      <button type="button" onClick={onClose} aria-label="Salir de Shorts" style={{ top: "max(env(safe-area-inset-top), 1rem)" }} className="fixed right-4 z-[130] inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white px-3 text-xs font-semibold text-black shadow-xl transition hover:bg-white/90 sm:right-6 sm:min-h-12 sm:gap-2 sm:px-4 sm:text-sm">
        <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        <span>Salir</span>
      </button>
      <div ref={scroller} className="h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-contain">
        {videos.map((video) => (
          <article key={video.id} data-short-id={video.id} className="relative flex h-[100dvh] snap-start snap-always items-center justify-center bg-black">
            <div className="relative h-full max-h-[100dvh] w-full overflow-hidden sm:aspect-[9/16] sm:h-[min(92dvh,820px)] sm:w-auto sm:rounded-2xl sm:border sm:border-white/10">
              {activeId === video.id ? (
                <iframe data-testid="shorts-video-frame" src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&playsinline=1&controls=1&rel=0`} title={video.title} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" className="h-full w-full border-0" />
              ) : (
                <Image src={video.thumbnail} alt="" fill sizes="(min-width: 640px) 460px, 100vw" className="object-contain" />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-8 pt-24 sm:px-6">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-lg font-semibold drop-shadow sm:text-xl">{video.title}</p>
                  <p className="mt-2 text-xs text-white/75">Desliza hacia arriba para ver el siguiente</p>
                </div>
                <Link href={video.url} target="_blank" rel="noreferrer" className="mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-black/40 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                  YouTube <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

          </article>
        ))}
      </div>
      <div data-testid="shorts-progress" aria-live="polite" className="pointer-events-none fixed left-4 z-[110] rounded-full border border-white/15 bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur-md sm:left-6" style={{ top: "max(env(safe-area-inset-top), 1.25rem)" }}>Shorts · {activeIndex + 1} de {videos.length}</div>
    </div>
  );
}

export function PredicacionesLibrary({ videos, playlists, apiEnabled }: PredicacionesLibraryProps) {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState("");
  const [sort, setSort] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [shortsOpen, setShortsOpen] = useState(false);

  const orderedPlaylists = useMemo(
    () => [...playlists].sort((a, b) => b.videoCount - a.videoCount || a.title.localeCompare(b.title, "es")),
    [playlists],
  );
  const selectedPlaylist = playlists.find((item) => item.id === selection);
  const shorts = useMemo(() => videos.filter((video) => video.isShort), [videos]);
  const allSelected = selection === ALL_VIDEOS;
  const hasSelection = allSelected || Boolean(selectedPlaylist);

  useEffect(() => {
    if (!sortOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !sortMenuRef.current?.contains(event.target)) setSortOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [sortOpen]);

  useEffect(() => {
    if (!selection || !window.matchMedia("(max-width: 639px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selection]);

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return videos.filter((video) => {
      const matchesPlaylist = allSelected || video.playlistIds?.includes(selection);
      const videoLists = (video.playlistIds ?? []).map((id) => playlists.find((item) => item.id === id)?.title ?? "").join(" ");
      const searchableText = `${video.title} ${video.tags.join(" ")} ${video.searchText ?? ""} ${videoLists}`.toLocaleLowerCase("es");
      return matchesPlaylist && (!normalizedQuery || searchableText.includes(normalizedQuery));
    }).sort((a, b) => {
      if (sort === "oldest") return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      if (sort === "title") return a.title.localeCompare(b.title, "es");
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [allSelected, playlists, query, selection, sort, videos]);

  const totalPages = Math.ceil(filteredVideos.length / PAGE_SIZE);
  const page = Math.min(currentPage, Math.max(totalPages, 1));
  const visibleVideos = filteredVideos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const firstVisibleVideo = filteredVideos.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastVisibleVideo = Math.min(page * PAGE_SIZE, filteredVideos.length);
  const chooseSelection = (value: string) => {
    setSelection(value);
    setQuery("");
    setCurrentPage(1);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };
  const closeShorts = () => setShortsOpen(false);

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12" data-testid="predicaciones-panels">
      <section data-testid="predicaciones-collections" className="rounded-[1.75rem] border border-base-content/10 bg-base-100/55 px-5 py-6 shadow-lg shadow-base-content/5 backdrop-blur-xl sm:px-8 sm:py-8">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Colecciones</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Encuentra una predicación</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/65">Selecciona una lista para abrir sus mensajes. También puedes entrar a todos los vídeos del canal.</p>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-full border border-base-content/10 bg-base-100/70 px-3 py-2 text-xs text-base-content/60"><Video className="h-4 w-4 text-primary" aria-hidden="true" />{videos.length} mensajes</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Listas de predicaciones">
          {orderedPlaylists.map((item) => (
            <button key={item.id} type="button" onClick={() => chooseSelection(item.id)} aria-pressed={selection === item.id} className={`group flex min-h-28 items-center gap-4 rounded-2xl border p-3 text-left transition sm:p-4 ${selection === item.id ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-base-content/10 bg-base-100/45 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-base-100/90"}`}>
              <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-base-200 sm:h-20 sm:w-32">
                {item.thumbnail ? <Image src={item.thumbnail} alt="" fill sizes="128px" className="object-cover transition duration-500 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center text-primary"><ListVideo className="h-7 w-7" aria-hidden="true" /></span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block line-clamp-2 text-sm font-semibold leading-snug sm:text-base">{item.title}</span>
                <span className="mt-2 block text-xs text-base-content/55">{item.videoCount} {item.videoCount === 1 ? "mensaje" : "mensajes"}</span>
              </span>
              <Play className="mr-1 h-4 w-4 shrink-0 text-primary opacity-70 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={() => chooseSelection(ALL_VIDEOS)} aria-pressed={allSelected} className={`group flex min-h-28 items-center gap-4 rounded-2xl border p-3 text-left transition sm:p-4 ${allSelected ? "border-primary bg-primary/10 ring-1 ring-primary/30" : "border-base-content/10 bg-base-100/45 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-base-100/90"}`}>
            <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/15 text-primary sm:h-20 sm:w-32"><ListVideo className="h-8 w-8" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold sm:text-base">Todos los mensajes</span><span className="mt-2 block text-xs text-base-content/55">Todo el canal · {videos.length} vídeos</span></span>
            <Play className="mr-1 h-4 w-4 shrink-0 text-primary opacity-70 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
        {!apiEnabled ? <p className="mt-4 rounded-xl bg-base-content/5 px-4 py-3 text-sm text-base-content/65">No se pudo cargar el catálogo de YouTube. Comprueba la clave de API y vuelve a intentarlo.</p> : null}
      </section>

      <section data-testid="predicaciones-shorts" className="overflow-hidden rounded-[1.75rem] border border-base-content/10 bg-gradient-to-br from-primary/10 via-base-100/65 to-secondary/10 shadow-lg shadow-base-content/5 backdrop-blur-xl">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20"><Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Para ver en vertical</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">Shorts de predicaciones</h2><p className="mt-1 text-sm text-base-content/65">Un vídeo cada vez. Desliza hacia arriba para continuar.</p></div>
          </div>
          <button type="button" onClick={() => setShortsOpen(true)} disabled={shorts.length === 0} className="btn btn-primary min-h-12 rounded-full px-6 disabled:opacity-45"><PlayCircle className="h-5 w-5" aria-hidden="true" />Ver Shorts <span className="rounded-full bg-primary-content/15 px-2 py-0.5 text-xs">{shorts.length}</span></button>
        </div>
      </section>

      <section data-testid="predicaciones-library" className="rounded-[1.75rem] border border-base-content/10 bg-base-100/45 p-5 shadow-lg shadow-base-content/5 backdrop-blur-xl sm:p-8">
        {!hasSelection ? (
          <div className="py-7 text-center sm:py-10"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ListVideo className="h-6 w-6" aria-hidden="true" /></div><h2 className="mt-4 text-xl font-semibold">Todos los mensajes, a tu ritmo</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-base-content/60">Elige una colección arriba o abre “Todos los mensajes” para mostrar aquí el catálogo completo.</p></div>
        ) : (
          <>
            <div className="mb-5 flex flex-col gap-4 border-b border-base-content/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Biblioteca</p><h2 className="mt-1 truncate text-xl font-semibold sm:text-2xl">{selectedPlaylist?.title ?? "Todos los mensajes"}</h2><p className="mt-1 text-sm text-base-content/55">{filteredVideos.length} {filteredVideos.length === 1 ? "resultado" : "resultados"}{query.trim() ? ` para “${query.trim()}”` : ""}</p></div>
              <label className="input input-bordered flex h-12 w-full items-center gap-3 rounded-xl border-base-content/15 bg-base-100/70 lg:max-w-md">
                <Search className="h-4 w-4 shrink-0 text-base-content/45" aria-hidden="true" /><span className="sr-only">Buscar en {selectedPlaylist?.title ?? "todos los mensajes"}</span>
                <input ref={searchInputRef} type="search" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder={selectedPlaylist ? `Buscar en ${selectedPlaylist.title}` : "Buscar en todos los mensajes"} className="min-w-0 grow text-sm" />
                {query ? <button type="button" onClick={() => changeQuery("")} className="btn btn-ghost btn-xs btn-circle" aria-label="Limpiar búsqueda"><X className="h-4 w-4" aria-hidden="true" /></button> : null}
              </label>
            </div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">Orden:</span>
                <div ref={sortMenuRef} className="relative">
                  <button type="button" aria-label="Ordenar mensajes" aria-haspopup="listbox" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)} className="inline-flex min-h-9 min-w-40 items-center justify-between gap-3 rounded-xl border border-base-content/15 bg-base-100 px-3 py-1.5 text-left font-medium text-base-content shadow-sm hover:bg-base-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                    {sort === "recent" ? "Más recientes" : sort === "oldest" ? "Más antiguos" : "Título A–Z"}
                    <ChevronDown className={`h-4 w-4 text-base-content/55 transition-transform ${sortOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {sortOpen ? (
                    <div data-testid="sort-menu-surface" role="listbox" aria-label="Ordenar mensajes" className="absolute left-0 top-full z-40 mt-2 min-w-full overflow-hidden rounded-xl border border-base-content/15 bg-base-100 p-1.5 text-base-content shadow-2xl ring-1 ring-base-content/10">
                      {[["recent", "Más recientes"], ["oldest", "Más antiguos"], ["title", "Título A–Z"]].map(([value, label]) => (
                        <button key={value} type="button" role="option" aria-selected={sort === value} onClick={() => { setSort(value); setCurrentPage(1); setSortOpen(false); }} className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors ${sort === value ? "bg-primary text-primary-content" : "bg-transparent text-base-content hover:bg-base-200"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              <button type="button" onClick={() => chooseSelection("")} className="text-xs font-semibold text-primary hover:underline">Cerrar colección</button>
            </div>
            {visibleVideos.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">{visibleVideos.map((video) => <YouTubeVideoCard key={video.id} video={video} onPlay={setActiveVideo} />)}</div>
                {totalPages > 1 ? (
                  <nav aria-label="Paginación de mensajes" className="mt-8 flex flex-col items-center gap-3 border-t border-base-content/10 pt-5 sm:flex-row sm:justify-between">
                    <p className="text-xs text-base-content/55">Mostrando {firstVisibleVideo}–{lastVisibleVideo} de {filteredVideos.length}</p>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} disabled={page === 1} aria-label="Página anterior" className="btn btn-sm btn-ghost rounded-full border border-base-content/10 px-3 disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">Anterior</span></button>
                      <span className="text-xs font-medium text-base-content/60 sm:hidden">{page} / {totalPages}</span>
                      <div className="hidden items-center gap-1 sm:flex">
                        {getPageItems(page, totalPages).map((item, index) => item === "…" ? <span key={`ellipsis-${index}`} className="px-1 text-base-content/45" aria-hidden="true">…</span> : <button key={item} type="button" onClick={() => setCurrentPage(item)} aria-label={`Ir a la página ${item}`} aria-current={page === item ? "page" : undefined} className={`btn btn-sm min-w-9 rounded-full px-2 ${page === item ? "btn-primary" : "btn-ghost"}`}>{item}</button>)}
                      </div>
                      <button type="button" onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages} aria-label="Página siguiente" className="btn btn-sm btn-ghost rounded-full border border-base-content/10 px-3 disabled:opacity-40"><span className="hidden sm:inline">Siguiente</span><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                    </div>
                  </nav>
                ) : null}
              </>
            ) : <div className="rounded-2xl border border-dashed border-base-content/20 px-6 py-12 text-center"><Search className="mx-auto h-7 w-7 text-base-content/35" aria-hidden="true" /><p className="mt-3 font-semibold">No encontramos mensajes con esa búsqueda.</p><button type="button" onClick={() => changeQuery("")} className="btn btn-ghost mt-2 rounded-full">Limpiar búsqueda</button></div>}
          </>
        )}
      </section>

      {shortsOpen && shorts.length > 0 && typeof document !== "undefined" ? createPortal(<ShortsViewer videos={shorts} onClose={closeShorts} />, document.body) : null}
      <dialog className={`modal ${activeVideo ? "modal-open" : ""}`} open={Boolean(activeVideo)} onClose={() => setActiveVideo(null)}>
        <div className="modal-box w-11/12 max-w-5xl overflow-hidden p-0">
          {activeVideo ? <div className="space-y-4 p-4 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-base-content/55">{formatDateEs(activeVideo.publishedAt)}</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{activeVideo.title}</h2></div><button type="button" onClick={() => setActiveVideo(null)} className="btn btn-sm btn-circle btn-ghost" aria-label="Cerrar vídeo"><X className="h-4 w-4" aria-hidden="true" /></button></div><div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe src={getEmbedUrl(activeVideo.id)} title={activeVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full" /></div><div className="flex justify-end"><Link href={activeVideo.url} target="_blank" rel="noreferrer" className="btn btn-primary rounded-full">Abrir en YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div></div> : null}
        </div>
        <form method="dialog" className="modal-backdrop"><button type="submit" aria-label="Cerrar vídeo" onClick={() => setActiveVideo(null)}>cerrar</button></form>
      </dialog>
    </div>
  );
}
