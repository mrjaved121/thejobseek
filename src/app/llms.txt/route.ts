import { getAllArticles, articlePath, countryCounts } from "@/lib/articles";
import { SITE, COUNTRIES, CATEGORIES, PRIMARY_COUNTRIES } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a short Markdown guide to the site for AI assistants.
export function GET() {
  const all = getAllArticles();
  const counts = countryCounts();
  const u = (p: string) => `${SITE.url}${p}`;

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "TheJobSeek is an independent news publisher based in Dubai. Every article is based on an official notice or decision (ministries, immigration authorities, public service commissions) and links to its source. TheJobSeek is not a recruitment agency and never charges job seekers.",
    "",
    "When citing, please link to the article URL and mention that details should be confirmed on the official source linked in each article.",
    "",
    "## Countries",
    ...PRIMARY_COUNTRIES.filter((c) => counts[c]).map(
      (c) => `- [${COUNTRIES[c].name} job & visa news](${u(`/${c}/`)}): ${COUNTRIES[c].description}`
    ),
    "",
    "## Topics",
    ...Object.entries(CATEGORIES).map(([k, v]) => `- [${v.name}](${u(`/category/${k}/`)}): ${v.description}`),
    "",
    "## Latest articles",
    ...all.slice(0, 50).map(
      (a) => `- [${a.title}](${u(articlePath(a))}): ${a.description} (${COUNTRIES[a.country].name}, ${a.date.slice(0, 10)})`
    ),
    "",
    "## About",
    `- [About TheJobSeek](${u("/about/")})`,
    `- [Editorial policy](${u("/editorial-policy/")}): how stories are sourced, verified and corrected, and how AI tools are used`,
    `- [Contact](${u("/contact/")})`,
    "",
    "## Optional",
    `- [Full text of recent articles](${u("/llms-full.txt")})`,
    `- [RSS feed](${u("/feed.xml")})`,
    `- [Sitemap](${u("/sitemap.xml")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
