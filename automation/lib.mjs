import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import crypto from "crypto";

export const UA = "TheJobSeekBot/1.0 (+https://thejobseek.com/about)";

export const RELEVANT =
  /\b(jobs?|recruit\w*|vacanc\w*|hiring|hire|posts?|employ\w*|labou?r|workers?|work(ing)? (permit|visa|rights)|visas?|immigra\w*|emirati[sz]ation|saudi[sz]ation|qatari[sz]ation|kuwaiti[sz]ation|omani[sz]ation|nationali[sz]ation|skilled|sponsor\w*|residen\w*|careers?|salar\w*|wages?|exam\w*|tests?|results?|interviews?|admit card|merit list|css|ppsc|fpsc|nts|ielts|green card|h-?1b|citizenship|migration|talent)\b/i;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);

export async function get(url, { timeout = 25000, accept = "*/*" } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "en" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text(), url: res.url, type: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(t);
  }
}

// ---------- robots.txt (simple, conservative) ----------
const robotsCache = new Map();
export async function robotsAllowed(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    let rules = [];
    try {
      const { text } = await get(`${u.origin}/robots.txt`, { timeout: 10000 });
      let applies = false;
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.replace(/#.*/, "").trim();
        const [k, ...rest] = line.split(":");
        const v = rest.join(":").trim();
        if (/^user-agent$/i.test(k)) applies = v === "*" || /thejobseek/i.test(v);
        else if (applies && /^disallow$/i.test(k) && v) rules.push(v);
      }
    } catch {
      rules = []; // no robots.txt = allowed
    }
    robotsCache.set(u.origin, rules);
  }
  const path = u.pathname + u.search;
  return !robotsCache.get(u.origin).some((r) => {
    const rx = new RegExp("^" + r.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
    return rx.test(path);
  });
}

// ---------- RSS / Atom ----------
const textOf = (v) => (v == null ? "" : typeof v === "object" ? String(v["#text"] ?? "") : String(v)).trim();

export function parseFeed(xml) {
  const p = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = p.parse(xml);
  const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  if (doc.rss) {
    return arr(doc.rss.channel?.item).map((i) => ({
      title: textOf(i.title),
      url: textOf(i.link),
      date: i.pubDate ? new Date(textOf(i.pubDate)).toISOString() : null,
      summary: stripHtml(textOf(i.description)),
    }));
  }
  if (doc.feed) {
    return arr(doc.feed.entry).map((e) => {
      const links = arr(e.link);
      const link = links.find((l) => !l["@_rel"] || l["@_rel"] === "alternate") || links[0] || {};
      const d = textOf(e.published) || textOf(e.updated);
      return {
        title: textOf(e.title),
        url: link["@_href"] || textOf(link),
        date: d ? new Date(d).toISOString() : null,
        summary: stripHtml(textOf(e.summary) || textOf(e.content)),
      };
    });
  }
  throw new Error("Not an RSS or Atom feed");
}

export const stripHtml = (h) => cheerio.load(`<div>${h}</div>`)("div").text().replace(/\s+/g, " ").trim();

// ---------- News page link scanning ----------
const SKIP_EXT = /\.(pdf|jpe?g|png|gif|zip|docx?|xlsx?|pptx?|mp4)(\?|$)/i;

export function pageLinks(html, baseUrl, source) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);
  const include = source.include ? new RegExp(source.include, "i") : null;
  const seen = new Set();
  const out = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || /^(mailto|tel|javascript):/i.test(href)) return;
    let url;
    try {
      url = new URL(href, base);
    } catch {
      return;
    }
    url.hash = "";
    if (url.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) return;
    if (SKIP_EXT.test(url.pathname)) return;
    if (url.href.replace(/\/$/, "") === base.href.replace(/\/$/, "")) return;
    if (include && !include.test(url.href)) return;
    const title = ($(el).attr("title") || $(el).text()).replace(/\s+/g, " ").trim();
    if (title.length < 25 || title.split(" ").length < 4) return; // skip menu links
    if (seen.has(url.href)) return;
    seen.add(url.href);
    out.push({ title, url: url.href, date: null, summary: "" });
  });
  return out;
}

// ---------- Article text extraction ----------
export function extractText(html, selector) {
  const $ = cheerio.load(html);
  $("script,style,noscript,nav,header,footer,form,aside,iframe,svg,button,.breadcrumb,.share,.social").remove();
  const candidates = [selector, "article", "main", "[role=main]", "#content", ".content", "body"].filter(Boolean);
  let root = null;
  for (const s of candidates) {
    const el = $(s).first();
    if (el.length && el.text().trim().length > 300) {
      root = el;
      break;
    }
  }
  root = root || $("body");
  const blocks = [];
  root.find("h1,h2,h3,h4,p,li,td,th").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t.length > 2) blocks.push(t);
  });
  let text = [...new Set(blocks)].join("\n");
  if (text.length < 300) text = root.text().replace(/\s+/g, " ").trim();
  const title = $("meta[property='og:title']").attr("content") || $("title").text().trim();
  return { title, text: text.slice(0, 15000) };
}

export function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

/** Longest run of identical words between draft and source (copy detector). */
export function longestCopiedRun(draft, source, n = 12) {
  const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const src = words(source);
  const set = new Set();
  for (let i = 0; i + n <= src.length; i++) set.add(src.slice(i, i + n).join(" "));
  const d = words(draft);
  const hits = [];
  for (let i = 0; i + n <= d.length; i++) {
    const g = d.slice(i, i + n).join(" ");
    if (set.has(g)) hits.push(g);
  }
  return hits;
}

export function dubaiNowIso() {
  return new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 19) + "+04:00";
}
