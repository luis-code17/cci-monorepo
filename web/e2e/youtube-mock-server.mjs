import { createServer } from "node:http";

const port = 3101;
const thumbnailUrl = "https://img.youtube.com/vi/qo0WyjZR7EM/hqdefault.jpg";
const videos = Array.from({ length: 15 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const id = `e2e-video-${number}`;
  const short = index < 2;
  return {
    id,
    title: short ? `Clip breve ${number}` : `Mensaje de enseñanza ${number}`,
    publishedAt: `2025-01-${String((index % 28) + 1).padStart(2, "0")}T12:00:00Z`,
    thumbnailUrl,
    duration: index === 0 ? "PT45S" : index === 1 ? "PT2M30S" : "PT24M12S",
    description: "Predicaciones de prueba para verificar la navegación y el diseño.",
    tags: ["familia", "enseñanza"],
  };
});

function playlistItems(ids) {
  return ids.map((id) => {
    const video = videos.find((item) => item.id === id);
    return {
      snippet: {
        title: video.title,
        publishedAt: video.publishedAt,
        thumbnails: { high: { url: thumbnailUrl } },
        resourceId: { videoId: video.id },
      },
    };
  });
}

const playlists = [
  { id: "e2e-playlist-one", title: "Mensajes de fe", ids: videos.slice(0, 8).map((video) => video.id) },
  { id: "e2e-playlist-two", title: "Enseñanza para la familia", ids: videos.slice(8).map((video) => video.id) },
];

createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (url.pathname === "/health") {
    response.writeHead(200).end(JSON.stringify({ ok: true }));
    return;
  }

  const endpoint = url.pathname.split("/").at(-1);
  if (endpoint === "channels") {
    response.writeHead(200).end(JSON.stringify({ items: [{ contentDetails: { relatedPlaylists: { uploads: "e2e-uploads" } } }] }));
  } else if (endpoint === "playlists") {
    response.writeHead(200).end(JSON.stringify({ items: playlists.map((playlist) => ({
      id: playlist.id,
      snippet: { title: playlist.title, description: "Lista de prueba", thumbnails: { high: { url: thumbnailUrl } } },
      contentDetails: { itemCount: playlist.ids.length },
    })) }));
  } else if (endpoint === "playlistItems") {
    const id = url.searchParams.get("playlistId");
    const ids = id === "e2e-uploads" ? videos.map((video) => video.id) : playlists.find((playlist) => playlist.id === id)?.ids ?? [];
    response.writeHead(200).end(JSON.stringify({ items: playlistItems(ids) }));
  } else if (endpoint === "videos") {
    const ids = (url.searchParams.get("id") ?? "").split(",");
    response.writeHead(200).end(JSON.stringify({ items: videos.filter((video) => ids.includes(video.id)).map((video) => ({
      id: video.id,
      snippet: { title: video.title, description: video.description, tags: video.tags, publishedAt: video.publishedAt },
      contentDetails: { duration: video.duration },
    })) }));
  } else {
    response.writeHead(404).end(JSON.stringify({ error: "Unknown mock endpoint" }));
  }
}).listen(port, "127.0.0.1");
