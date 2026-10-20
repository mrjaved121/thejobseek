import { getAllArticles, articlePath } from "@/lib/articles";
import { getAuthor } from "@/lib/authors";
import { SITE, COUNTRIES, CATEGORIES } from "@/lib/site";

export const dynamic = "force-static";

// llms-full.txt: full Markdown text of recent articles, so AI assistants can read and cite accurately.
export function GET() {
  const items = getAllArticles().slice(0, 150);
  const parts = [
    `# ${SITE.name} – full text of recent articles`,
    "",
    `> ${SITE.description} Always confirm details on the official source linked in each article.`,
    "",
  ];
  for (const a of items) {
    // Make relative links absolute
    const body = a.markdown.replace(/\]\(\//g, `](${SITE.url}/`);
    parts.push(
      "---",
      "",
      `## ${a.title}`,
      "",
      `- URL: ${SITE.url}${articlePath(a)}`,
      `- Country: ${COUNTRIES[a.country].name}`,
      `- Topic: ${CATEGORIES[a.category].name}`,
      `- Published: ${a.date}${a.updated ? ` (updated ${a.updated})` : ""}`,
      `- Author: ${getAuthor(a.author).name}`,
      ...(a.organization ? [`- Organization: ${a.organization}`] : []),
      ...(a.lastDate ? [`- Last date to apply: ${a.lastDate}`] : []),
      ...(a.sourceUrl ? [`- Source: ${a.sourceName || "Official notice"} – ${a.sourceUrl}`] : []),
      "",
      `> ${a.description}`,
      "",
      ...(a.keyPoints.length ? ["**In brief:**", ...a.keyPoints.map((k) => `- ${k}`), ""] : []),
      body,
      "",
      ...(a.faq.length ? ["### Frequently asked questions", "", ...a.faq.flatMap((f) => [`**Q: ${f.q}**`, `A: ${f.a}`, ""])] : [])
    );
  }
  return new Response(parts.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
