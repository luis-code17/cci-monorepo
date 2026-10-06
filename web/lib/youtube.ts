import { cache } from "react";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCjKLSuPn3y7dfQHIQ5uDrkA";
const YOUTUBE_CHANNEL_ID = extractYouTubeChannelIdFromUrl(YOUTUBE_CHANNEL_URL) ?? "UCjKLSuPn3y7dfQHIQ5uDrkA";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60;
const YOUTUBE_API_BASE = process.env.YOUTUBE_API_BASE ?? "https://www.googleapis.com/youtube/v3";

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  tags: string[];
  durationSeconds?: number | null;
  durationLabel?: string | null;
  playlistIds?: string[];
  searchText?: string;
  isShort?: boolean;
};

export type YouTubePlaylist = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
};

export type YouTubeCatalog = {
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  apiEnabled: boolean;
};

type ApiPlaylist = {
  id: string;
  snippet?: { title?: string; description?: string; thumbnails?: Record<string, { url?: string }> };
  contentDetails?: { itemCount?: number };
};
type ApiPlaylistItem = {
  snippet?: {
    title?: string;
    publishedAt?: string;
    thumbnails?: Record<string, { url?: string }>;
    resourceId?: { videoId?: string };
  };
};
type ApiVideoDetails = {
  id: string;
  snippet?: { title?: string; description?: string; tags?: string[]; publishedAt?: string };
  contentDetails?: { duration?: string };
};
type ApiPage<T> = { items?: T[]; nextPageToken?: string };

async function fetchYouTubeApi<T>(path: string, params: Record<string, string>) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`);
  Object.entries({ ...params, key }).forEach(([name, value]) => url.searchParams.set(name, value));
  const response = await fetch(url, { next: { revalidate: DEFAULT_REVALIDATE_SECONDS } });
  if (!response.ok) return null;
  return await response.json() as T;
}

function bestThumbnail(thumbnails?: Record<string, { url?: string }>) {
  return thumbnails?.maxres?.url ?? thumbnails?.standard?.url ?? thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url ?? "";
}

function cleanTitle(title: string) {
  return title
    .replace(/\s*\|\s*Centro Cristiano Internacional.*$/i, "")
    .replace(/\s*\|\s*CCI Sabadell.*$/i, "")
    .replace(/\s*[-–—]\s*CCI Sabadell.*$/i, "")
    .replace(/\s*[-–—]\s*Centro Cristiano Internacional.*$/i, "")
    .replace(/\s+/g, " ")
    .trim() || "Predicación destacada";
}

function durationSeconds(value?: string) {
  if (!value) return null;
  const match = value.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  return Number(match[1] ?? 0) * 86400 + Number(match[2] ?? 0) * 3600 + Number(match[3] ?? 0) * 60 + Number(match[4] ?? 0);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes ? `${minutes}:${String(remainingSeconds).padStart(2, "0")}` : `0:${String(remainingSeconds).padStart(2, "0")}`;
}

async function getVideoDetails(videoIds: string[]) {
  const uniqueIds = Array.from(new Set(videoIds));
  const pages = await Promise.all(Array.from({ length: Math.ceil(uniqueIds.length / 50) }, (_, index) => {
    const ids = uniqueIds.slice(index * 50, index * 50 + 50);
    return fetchYouTubeApi<{ items?: ApiVideoDetails[] }>("videos", { part: "snippet,contentDetails", id: ids.join(",") });
  }));
  if (pages.some((page) => !page)) return null;
  return new Map(pages.flatMap((page) => page?.items ?? []).map((video) => [video.id, video]));
}

function addVideoDetails(video: YouTubeVideo, details?: ApiVideoDetails): YouTubeVideo {
  const seconds = durationSeconds(details?.contentDetails?.duration);
  const publishedAt = details?.snippet?.publishedAt ?? video.publishedAt;
  const shortCutoff = new Date("2024-10-15T00:00:00Z");
  const shortLimit = publishedAt && new Date(publishedAt) >= shortCutoff ? 180 : 60;
  const title = cleanTitle(details?.snippet?.title ?? video.title);
  const tags = details?.snippet?.tags ?? [];
  return {
    ...video,
    title,
    publishedAt,
    tags,
    searchText: `${details?.snippet?.description ?? ""} ${tags.join(" ")}`,
    durationSeconds: seconds,
    durationLabel: seconds === null ? null : formatDuration(seconds),
    isShort: seconds !== null && seconds > 0 && seconds <= shortLimit,
  };
}

async function getUploadsPlaylistId() {
  const channel = await fetchYouTubeApi<{ items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[] }>("channels", {
    part: "contentDetails", id: YOUTUBE_CHANNEL_ID,
  });
  return channel?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function getAllPages<T>(path: string, params: Record<string, string>, maxPages = 1000) {
  const items: T[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < maxPages; page += 1) {
    const result = await fetchYouTubeApi<ApiPage<T>>(path, { ...params, ...(pageToken ? { pageToken } : {}) });
    if (!result) return null;
    items.push(...(result.items ?? []));
    if (!result.nextPageToken) break;
    pageToken = result.nextPageToken;
  }
  return items;
}

function toVideo(item: ApiPlaylistItem, playlistIds: string[] = []): YouTubeVideo | null {
  const snippet = item.snippet;
  const id = snippet?.resourceId?.videoId;
  if (!id || snippet?.title === "Deleted video" || snippet?.title === "Private video") return null;
  const thumbnail = bestThumbnail(snippet.thumbnails);
  return {
    id,
    title: cleanTitle(snippet.title ?? "Predicación"),
    url: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: thumbnail || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    publishedAt: snippet.publishedAt ?? "",
    tags: [],
    playlistIds,
  };
}

export const getYouTubeCatalog = cache(async function getYouTubeCatalog(): Promise<YouTubeCatalog> {
  if (!process.env.YOUTUBE_API_KEY) return { videos: [], playlists: [], apiEnabled: false };
  try {
    const uploadsId = await getUploadsPlaylistId();
    if (!uploadsId) return { videos: [], playlists: [], apiEnabled: false };

    const [playlistRows, uploadItems] = await Promise.all([
      getAllPages<ApiPlaylist>("playlists", { part: "snippet,contentDetails", channelId: YOUTUBE_CHANNEL_ID, maxResults: "50" }),
      getAllPages<ApiPlaylistItem>("playlistItems", { part: "snippet,contentDetails", playlistId: uploadsId, maxResults: "50" }),
    ]);
    if (!playlistRows || !uploadItems) return { videos: [], playlists: [], apiEnabled: false };

    const playlists: YouTubePlaylist[] = playlistRows.map((playlist) => ({
      id: playlist.id,
      title: playlist.snippet?.title ?? "Lista de reproducción",
      description: playlist.snippet?.description ?? "",
      thumbnail: bestThumbnail(playlist.snippet?.thumbnails),
      videoCount: playlist.contentDetails?.itemCount ?? 0,
    }));
    const membership = new Map<string, Set<string>>();
    await Promise.all(playlists.map(async (playlist) => {
      const items = await getAllPages<ApiPlaylistItem>("playlistItems", { part: "snippet,contentDetails", playlistId: playlist.id, maxResults: "50" });
      for (const item of items ?? []) {
        const id = item.snippet?.resourceId?.videoId;
        if (id) {
          const lists = membership.get(id) ?? new Set<string>();
          lists.add(playlist.id);
          membership.set(id, lists);
        }
      }
    }));

    const videos = uploadItems.flatMap((item) => {
      const video = toVideo(item, Array.from(membership.get(item.snippet?.resourceId?.videoId ?? "") ?? []));
      return video ? [video] : [];
    });
    const details = await getVideoDetails(videos.map((video) => video.id));
    return { videos: videos.map((video) => addVideoDetails(video, details?.get(video.id))), playlists, apiEnabled: true };
  } catch {
    return { videos: [], playlists: [], apiEnabled: false };
  }
});

export function extractYouTubeChannelIdFromUrl(input: string) {
  if (!input) return null;
  try {
    const parsed = new URL(input);
    const channelIdFromQuery = parsed.searchParams.get("channel_id");
    if (channelIdFromQuery) return channelIdFromQuery;
    const channelMatch = parsed.pathname.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
    if (channelMatch?.[1]) return channelMatch[1];
  } catch {
    // Ignore invalid URLs and fall through to a direct pattern match.
  }
  const directMatch = input.match(/(UC[a-zA-Z0-9_-]{22})/);
  return directMatch?.[1] ?? null;
}

export const getLatestVideos = cache(async function getLatestVideos(maxResults = 6) {
  const limit = Math.min(Math.max(maxResults, 1), 50);
  try {
    const uploadsId = await getUploadsPlaylistId();
    if (!uploadsId) return [];
    const result = await fetchYouTubeApi<ApiPage<ApiPlaylistItem>>("playlistItems", {
      part: "snippet,contentDetails", playlistId: uploadsId, maxResults: String(limit),
    });
    const videos = (result?.items ?? []).flatMap((item) => {
      const video = toVideo(item);
      return video ? [video] : [];
    });
    const details = await getVideoDetails(videos.map((video) => video.id));
    return videos.map((video) => addVideoDetails(video, details?.get(video.id)));
  } catch {
    return [];
  }
});
