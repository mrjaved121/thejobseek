import { getAllArticles, articlePath, excerpt } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

export const dynamic = "force-static";

// Small static index used by the /search/ page (built with the site, no server needed).
export function GET() {
  const items = getAllArticles().map((a) => ({
    t: a.title,
    d: a.description,
    x: excerpt(a, 40),
    u: articlePath(a),
    c: COUNTRIES[a.country].name,
    k: CATEGORIES[a.category].name,
    g: a.tags.join(" "),
    o: a.organization || "",
    dt: a.date,
  }));
  return new Response(JSON.stringify(items), { headers: { "Content-Type": "application/json" } });
}
