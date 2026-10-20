import { getAllArticles, articlePath } from "@/lib/articles";
import { getAuthor } from "@/lib/authors";
import { SITE } from "@/lib/site";

export const revalidate = 600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// RSS feed: used by Google News Publisher Center, feed readers and social auto-posting tools.
export function GET() {
  const items = getAllArticles()
    .slice(0, 50)
    .map((a) => {
      const url = `${SITE.url}${articlePath(a)}`;
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <dc:creator>${esc(getAuthor(a.author).name)}</dc:creator>
      <category>${esc(a.country)}</category>
      <description>${esc(a.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE.name)} – Job News</title>
    <link>${SITE.url}</link>
    <description>${esc(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
