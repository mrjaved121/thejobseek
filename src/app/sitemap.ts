import type { MetadataRoute } from "next";
import { getAllArticles, getByCategory, articlePath } from "@/lib/articles";
import { SITE, CATEGORIES, enabledCountries } from "@/lib/site";
import { AUTHORS } from "@/lib/authors";

export const revalidate = 600;

export default function sitemap(): MetadataRoute.Sitemap {
  const all = getAllArticles();
  const latest = all[0]?.updated || all[0]?.date || new Date().toISOString();
  const u = (p: string) => `${SITE.url}${p}`;

  return [
    { url: u("/"), lastModified: latest, changeFrequency: "hourly", priority: 1 },
    { url: u("/countries"), lastModified: latest, changeFrequency: "daily", priority: 0.6 },
    ...enabledCountries.filter((c) => all.some((a) => a.country === c)).map((c) => ({
      url: u(`/${c}`),
      lastModified: latest,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    ...Object.keys(CATEGORIES)
      .filter((c) => getByCategory(c).length > 0)
      .map((c) => ({ url: u(`/category/${c}`), lastModified: latest, changeFrequency: "daily" as const, priority: 0.7 })),
    ...all.map((a) => ({
      url: u(articlePath(a)),
      lastModified: a.updated || a.date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...Object.keys(AUTHORS).map((id) => ({ url: u(`/author/${id}`), priority: 0.3 })),
    ...["/about", "/contact", "/editorial-policy", "/privacy-policy", "/terms", "/disclaimer"].map((p) => ({
      url: u(p),
      priority: 0.2,
    })),
  ];
}
