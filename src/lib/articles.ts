import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { COUNTRIES, CATEGORIES, type CountryKey } from "./site";

export type Article = {
  slug: string;
  title: string;
  description: string;
  country: CountryKey;
  category: string;
  author: string;
  date: string; // ISO
  updated?: string; // ISO
  organization?: string;
  lastDate?: string; // application deadline, ISO date
  sourceUrl?: string;
  sourceName?: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  html: string;
  markdown: string;
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content", "articles");
let cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(DIR)) return [];
  const now = Date.now();
  const list = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file): Article | null => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      if (data.draft) return null;
      const country = data.country as CountryKey;
      if (!COUNTRIES[country]?.enabled) return null;
      if (!CATEGORIES[data.category]) {
        throw new Error(`Unknown category "${data.category}" in ${file}`);
      }
      const date = new Date(data.date).toISOString();
      if (new Date(date).getTime() > now) return null; // scheduled: hide until its date
      const words = content.split(/\s+/).length;
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title),
        description: String(data.description),
        country,
        category: String(data.category),
        author: String(data.author || "editorial-team"),
        date,
        updated: data.updated ? new Date(data.updated).toISOString() : undefined,
        organization: data.organization,
        lastDate: data.lastDate ? new Date(data.lastDate).toISOString().slice(0, 10) : undefined,
        sourceUrl: data.sourceUrl,
        sourceName: data.sourceName,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        image: data.image ? String(data.image) : undefined,
        imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
        html: marked.parse(content, { async: false }) as string,
        markdown: content.trim(),
        readingMinutes: Math.max(1, Math.round(words / 220)),
      };
    })
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
  cache = list;
  return list;
}

export const getArticle = (country: string, slug: string) =>
  getAllArticles().find((a) => a.country === country && a.slug === slug);

export const getByCountry = (c: string) => getAllArticles().filter((a) => a.country === c);
export const getByCategory = (c: string) => getAllArticles().filter((a) => a.category === c);
export const getByAuthor = (id: string) => getAllArticles().filter((a) => a.author === id);

export function getRelated(article: Article, n = 4) {
  return getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      a,
      score:
        (a.country === article.country ? 2 : 0) +
        (a.category === article.category ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score || y.a.date.localeCompare(x.a.date))
    .slice(0, n)
    .map((x) => x.a);
}

export const sourceDomain = (a: Pick<Article, "sourceUrl">) => {
  try {
    return a.sourceUrl ? new URL(a.sourceUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
};

export const countryCounts = () => {
  const m: Record<string, number> = {};
  for (const a of getAllArticles()) m[a.country] = (m[a.country] || 0) + 1;
  return m;
};

export const articlePath =(a: Pick<Article, "country" | "slug">) => `/${a.country}/${a.slug}/`;

export const isClosingSoon = (a: Article) => {
  if (!a.lastDate) return false;
  const days = (new Date(a.lastDate).getTime() - Date.now()) / 86400000;
  return days >= -1 && days <= 7;
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dubai" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Dubai" });
  return `${date}, ${time} GST`;
}

/** Short plain-text excerpt from the article HTML (for news lists and search). */
export function excerpt(a: Article, words = 28) {
  const text = a.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ");
  return text.slice(0, words).join(" ") + (text.length > words ? "…" : "");
}
