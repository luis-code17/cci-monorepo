import { cache } from "react";
import { XMLParser } from "fast-xml-parser";

const FALLBACK_VIDEO_ID = "wiSSkNoqwf4";
const FALLBACK_VIDEO_URL = `https://www.youtube.com/watch?v=${FALLBACK_VIDEO_ID}`;
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCjKLSuPn3y7dfQHIQ5uDrkA";
const YOUTUBE_CHANNEL_ID = extractYouTubeChannelIdFromUrl(YOUTUBE_CHANNEL_URL) ?? "UCjKLSuPn3y7dfQHIQ5uDrkA";
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const DEFAULT_REVALIDATE_SECONDS = 60 * 60;

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  tags: string[];
  durationSeconds?: number | null;
  durationLabel?: string | null;
};

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
  const maybe = (entry as Record<string, any>).duration ?? (entry as Record<string, any>)["yt:duration"];

  if (maybe && typeof maybe === "object") {
    const seconds = maybe["@_seconds"] ?? maybe["@_duration"] ?? maybe.seconds ?? maybe.duration;
    const n = Number(seconds);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  // Fallback: scan first-level children for '@_seconds' attribute
  for (const key of Object.keys(entry)) {
    const child = (entry as Record<string, any>)[key];
    if (child && typeof child === "object") {
      const sec = child["@_seconds"] ?? child["@_duration"];
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
  const limit = Math.min(Math.max(maxResults, 1), 12);
  const feed = await fetchYouTubeFeed();
  const videos = feed ? normalizeEntries(feed).slice(0, limit) : [];

  return videos;
});

export function getFallbackVideoItem() {
  return getFallbackVideo();
}
