const { app } = require("@azure/functions");

const BACKEND = "https://dpmu-backend-d2gbcvg8deh2egat.southeastasia-01.azurewebsites.net";
const SITE = "https://dpmunuja.id";
const SITE_HTML = "https://yellow-mud-01becfa00.4.azurestaticapps.net";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

app.http("og", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "og",
  handler: async (request) => {
    const original = request.headers.get("x-ms-original-url") || "";
    let path = "";
    try {
      path = original ? new URL(original).pathname : "";
    } catch (e) {}
    const slug = decodeURIComponent(path.split("/").filter(Boolean).pop() || "");

    // index.html React asli
    const htmlRes = await fetch(`${SITE_HTML}/index.html`);
    let html = await htmlRes.text();

    try {
      const r = await fetch(`${BACKEND}/api/beritadpms/${encodeURIComponent(slug)}`);
      const json = await r.json();
      const b = json?.data ?? json;

      if (b && b.judul) {
        const desc = String(b.isi_berita || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160);
        const img = b.foto_berita
          ? `${BACKEND}/storage/fotoBerita/${b.foto_berita}`
          : `${SITE}/assets/logo-DPM-Unuja-AtyMC0db.png`;
        const url = `${SITE}/informasi/${b.slug || b.id}`;

        const tags = `
<meta property="og:type" content="article">
<meta property="og:site_name" content="DPM UNUJA">
<meta property="og:title" content="${esc(b.judul)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(b.judul)}">
<meta name="twitter:image" content="${esc(img)}">`;

        html = html
          .replace(/<title>.*?<\/title>/i, `<title>${esc(b.judul)} | DPM UNUJA</title>`)
          .replace("</head>", `${tags}\n</head>`);
      }
    } catch (e) {
      // kalau gagal, tetap kirim index.html biasa
    }

    // BARIS DEBUG (hapus setelah berhasil)
    html = `<!-- DEBUG original=${original} slug=${slug} -->\n` + html;

    return {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
      body: html,
    };
  },
});