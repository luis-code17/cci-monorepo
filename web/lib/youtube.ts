import { cache } from "react";
import { XMLParser } from "fast-xml-parser";

const FALLBACK_VIDEO_ID = "wiSSkNoqwf4";
const FALLBACK_VIDEO_URL = `https://www.youtube.com/watch?v=${FALLBACK_VIDEO_ID}`;
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCjKLSuPn3y7dfQHIQ5uDrkA";
const YOUTUBE_CHANNEL_ID = extractYouTubeChannelIdFromUrl(YOUTUBE_CHANNEL_URL) ?? "UCjKLSuPn3y7dfQHIQ5uDrkA";
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const DEFAULT_REVALIDATE_SECONDS = 60 * 60;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

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

type ApiPlaylist = { id: string; snippet?: { title?: string; description?: string; thumbnails?: Record<string, { url?: string }> }; contentDetails?: { itemCount?: number } };
type ApiPlaylistItem = { snippet?: { title?: string; publishedAt?: string; thumbnails?: Record<string, { url?: string }>; resourceId?: { videoId?: string } } };
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

export const getYouTubeCatalog = cache(async function getYouTubeCatalog(): Promise<YouTubeCatalog> {
  if (!process.env.YOUTUBE_API_KEY) {
    return { videos: await getLatestVideos(15), playlists: [], apiEnabled: false };
  }

  const channel = await fetchYouTubeApi<{ items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[] }>("channels", {
    part: "contentDetails", id: YOUTUBE_CHANNEL_ID,
  });
  const uploadsId = channel?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  const [playlistRows, uploadItems] = await Promise.all([
    getAllPages<ApiPlaylist>("playlists", { part: "snippet,contentDetails", channelId: YOUTUBE_CHANNEL_ID, maxResults: "50" }),
    uploadsId ? getAllPages<ApiPlaylistItem>("playlistItems", { part: "snippet,contentDetails", playlistId: uploadsId, maxResults: "50" }) : Promise.resolve(null),
  ]);
  if (!playlistRows || !uploadItems) return { videos: await getLatestVideos(15), playlists: [], apiEnabled: false };

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

  const videos: YouTubeVideo[] = uploadItems.flatMap((item) => {
    const snippet = item.snippet;
    const id = snippet?.resourceId?.videoId;
    if (!id || snippet?.title === "Deleted video" || snippet?.title === "Private video") return [];
    const thumb = bestThumbnail(snippet.thumbnails);
    return [{
      id, title: cleanTitle(snippet.title ?? "Predicación"),
      url: `https://www.youtube.com/watch?v=${id}`, thumbnail: thumb || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      publishedAt: snippet.publishedAt ?? "", tags: [], playlistIds: Array.from(membership.get(id) ?? []),
    }];
  });
  return { videos, playlists, apiEnabled: true };
});

type YoutubeFeedXml = {
  feed?: {
    entry?: Array<Record<string, unknown>> | Record<string, unknown>;
  };
};

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  trimValues: true,
});

function getTextValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "#text" in value) {
    return String((value as { "#text"?: unknown })["#text"] ?? "");
  }

  return "";
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

function extractVideoId(entry: Record<string, unknown>) {
  const directVideoId = getTextValue(entry.videoId);

  if (directVideoId) {
    return directVideoId;
  }

  const entryId = getTextValue(entry.id);
  const match = entryId.match(/yt:video:([a-zA-Z0-9_-]{11})/);

  return match?.[1] ?? null;
}

function getDurationSeconds(entry: Record<string, unknown>) {
  if (!entry || typeof entry !== "object") return null;

  // Common YouTube RSS shape: { duration: { '@_seconds': '123' } }
  const maybe = entry.duration ?? entry["yt:duration"];

  if (maybe && typeof maybe === "object") {
    const duration = maybe as Record<string, unknown>;
    const seconds = duration["@_seconds"] ?? duration["@_duration"] ?? duration.seconds ?? duration.duration;
    const n = Number(seconds);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  // Fallback: scan first-level children for '@_seconds' attribute
  for (const key of Object.keys(entry)) {
    const child = entry[key];
    if (child && typeof child === "object") {
      const childRecord = child as Record<string, unknown>;
      const sec = childRecord["@_seconds"] ?? childRecord["@_duration"];
      const n = Number(sec);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }

  return null;
}

function formatDurationLabel(seconds: number | null) {
  if (!seconds || seconds <= 0) return null;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

function getTags(entry: Record<string, unknown>) {
  const values = new Set<string>();
  const categoryValues = entry.category;
  const categories = Array.isArray(categoryValues) ? categoryValues : categoryValues ? [categoryValues] : [];

  categories.forEach((category) => {
    if (!category || typeof category !== "object") {
      return;
    }

    const term = getTextValue((category as Record<string, unknown>)["@_term"] ?? (category as Record<string, unknown>).term);
    const label = term.trim();

    if (!label) {
      return;
    }

    if (/^youtube$/i.test(label) || /^yt:/i.test(label)) {
      return;
    }

    values.add(label);
  });

  return Array.from(values).slice(0, 3);
}

function normalizeEntries(payload: YoutubeFeedXml): YouTubeVideo[] {
  const entries = payload.feed?.entry;
  const normalizedEntries = Array.isArray(entries) ? entries : entries ? [entries] : [];

  return normalizedEntries
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const videoId = extractVideoId(entry as Record<string, unknown>);

      if (!videoId) {
        return null;
      }

      const title = cleanTitle(getTextValue((entry as Record<string, unknown>).title));
      const publishedAt = getTextValue((entry as Record<string, unknown>).published);
      const tags = getTags(entry as Record<string, unknown>);
        const durationSeconds = getDurationSeconds(entry as Record<string, unknown>);
        const durationLabel = formatDurationLabel(durationSeconds ?? null);

      return {
        id: videoId,
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        publishedAt,
        tags,
          durationSeconds,
          durationLabel,
      } satisfies YouTubeVideo;
    })
    .filter(Boolean) as unknown as YouTubeVideo[];
}

function getFallbackVideo(): YouTubeVideo {
  return {
    id: FALLBACK_VIDEO_ID,
    title: "Predicación destacada",
    url: FALLBACK_VIDEO_URL,
    thumbnail: `https://img.youtube.com/vi/${FALLBACK_VIDEO_ID}/maxresdefault.jpg`,
    publishedAt: "",
    tags: [],
      durationSeconds: null,
      durationLabel: null,
  };
}

async function fetchYouTubeFeed() {
  const response = await fetch(YOUTUBE_RSS_URL, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
    },
    next: {
      revalidate: DEFAULT_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const xml = await response.text();
  return xmlParser.parse(xml) as YoutubeFeedXml;
}

export function extractYouTubeChannelIdFromUrl(input: string) {
  if (!input) {
    return null;
  }

  try {
    const parsed = new URL(input);

    const channelIdFromQuery = parsed.searchParams.get("channel_id");
    if (channelIdFromQuery) {
      return channelIdFromQuery;
    }

    const channelMatch = parsed.pathname.match(/\/channel\/(UC[a-zA-Z0-9_-]{22})/);
    if (channelMatch?.[1]) {
      return channelMatch[1];
    }
  } catch {
    // Ignore invalid URLs and fall through to a direct pattern match.
  }

  const directMatch = input.match(/(UC[a-zA-Z0-9_-]{22})/);
  return directMatch?.[1] ?? null;
}

export const getLatestVideos = cache(async function getLatestVideos(maxResults = 6) {
  const limit = Math.min(Math.max(maxResults, 1), 15);
  try {
    const feed = await fetchYouTubeFeed();
    return feed ? normalizeEntries(feed).slice(0, limit) : [];
  } catch {
    return [];
  }
});

export function getFallbackVideoItem() {
  return getFallbackVideo();
}
