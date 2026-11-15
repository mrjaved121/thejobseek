import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { COUNTRIES, CATEGORIES, OFFICIAL_HOSTS, type CountryKey } from "./site";

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
  seoTitle?: string; // short title (≤60 chars) for the <title> tag; the full headline stays as the H1
  applyUrl?: string; // official careers page / application link (employer or government only)
  applyEmail?: string; // employer job posts: where candidates send CVs
  jobPost?: boolean; // a job ad submitted directly by the hiring employer
  sourceUrl?: string;
  sourceName?: string;
  sourceOfficial: boolean; // true only when the source is the employer's or a government's own site (see isOfficialSource)
  noindex: boolean; // frontmatter `noindex: true`: page stays online but is kept out of search engines and the sitemaps
  tags: string[];
  image?: string;
  imageAlt?: string;
  keyPoints: string[]; // short "in brief" bullets shown at the top (answer-first, for readers, Google and AI assistants)
  faq: { q: string; a: string }[]; // questions and answers shown at the end + FAQPage schema
  html: string;
  markdown: string;
  readingMinutes: number;
};

const host = (url?: string) => {
  try {
    return url ? new URL(url).hostname.toLowerCase().replace(/^www\./, "") : "";
  } catch {
    return "";
  }
};

/** "example.co.uk" from "careers.example.co.uk" (good enough to compare two links to the same organisation). */
const baseDomain = (h: string) => {
  const p = h.split(".");
  const n = p.length > 2 && p[p.length - 1].length === 2 && p[p.length - 2].length <= 3 ? 3 : 2;
  return p.slice(-n).join(".");
};

/**
 * Is the article's source the employer's or a government's own website (rather than a press report)?
 * 1. frontmatter `sourceType: official` or `sourceType: press` decides, when present;
 * 2. a government host (.gov, .gov.xx, .gob.xx, .gouv.xx, .go.xx, .mil, or one listed in OFFICIAL_HOSTS in site.ts);
 * 3. the source is on the same domain as `applyUrl` (the employer's own careers site).
 * Everything else is shown neutrally as "Source".
 */
export function isOfficialSource(d: { sourceUrl?: unknown; applyUrl?: unknown; sourceType?: unknown }): boolean {
  const h = host(typeof d.sourceUrl === "string" ? d.sourceUrl : undefined);
  if (!h) return false;
  if (d.sourceType === "official") return true;
  if (d.sourceType === "press") return false;
  if (/(^|\.)(gov|mil)$/.test(h) || /(^|\.)(gov|gob|gouv|go|mil)\.[a-z]{2,3}$/.test(h)) return true;
  if (OFFICIAL_HOSTS.some((o) => h === o || h.endsWith(`.${o}`))) return true;
  const apply = host(typeof d.applyUrl === "string" ? d.applyUrl : undefined);
  return Boolean(apply) && baseDomain(apply) === baseDomain(h);
}

/** Headline clean-up: trims, and drops a closing quote mark left at the end when it has no opening partner. */
export function cleanTitle(raw: unknown): string {
  let t = String(raw ?? "").replace(/\s+/g, " ").trim();
  const count = (re: RegExp) => (t.match(re) || []).length;
  if (/”$/.test(t) && count(/”/g) > count(/“/g)) t = t.slice(0, -1).trim();
  else if (/"$/.test(t) && count(/"/g) % 2 === 1) t = t.slice(0, -1).trim();
  return t;
}

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
        title: cleanTitle(data.title),
        seoTitle: data.seoTitle ? cleanTitle(data.seoTitle) : undefined,
        description: String(data.description),
        country,
        category: String(data.category),
        author: "mr-jay", // one named author on every article (E-E-A-T)
        date,
        updated: data.updated ? new Date(data.updated).toISOString() : undefined,
        organization: data.organization,
        lastDate: data.lastDate ? new Date(data.lastDate).toISOString().slice(0, 10) : undefined,
        applyUrl: typeof data.applyUrl === "string" && /^https:\/\//.test(data.applyUrl) ? data.applyUrl : undefined,
        applyEmail: typeof data.applyEmail === "string" && /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(data.applyEmail) ? data.applyEmail : undefined,
        jobPost: data.jobPost === true,
        sourceUrl: data.sourceUrl,
        sourceName: data.sourceName,
        sourceOfficial: isOfficialSource(data),
        noindex: data.noindex === true,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        image: data.image ? String(data.image) : undefined,
        imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
        keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints.map(String) : [],
        faq: Array.isArray(data.faq)
          ? data.faq.filter((f: { q?: unknown; a?: unknown }) => f && f.q && f.a).map((f: { q: unknown; a: unknown }) => ({ q: String(f.q), a: String(f.a) }))
          : [],
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

/** Articles that search engines may index (everything except frontmatter `noindex: true`). Used by the sitemaps. */
export const getIndexable = () => getAllArticles().filter((a) => !a.noindex);

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
