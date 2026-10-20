import { getAllArticles, articlePath } from "@/lib/articles";
import { SITE } from "@/lib/site";


export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Google News sitemap: only articles from the last 48 hours, max 1000.
export function GET() {
  const cutoff = Date.now() - 48 * 3600 * 1000;
  const recent = getAllArticles()
    .filter((a) => new Date(a.date).getTime() >= cutoff)
    .slice(0, 1000);

  const body = recent
    .map(
      (a) => `  <url>
    <loc>${SITE.url}${articlePath(a)}</loc>
    <news:news>
      <news:publication><news:name>${esc(SITE.name)}</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${a.date}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${body}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
