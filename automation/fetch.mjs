#!/usr/bin/env node
/**
 * Fetches new items from official sources, asks the AI to draft original articles,
 * and writes them to content/articles/. Run by GitHub Actions; drafts arrive as a pull
 * request for human review. Nothing is published until the PR is merged.
 *
 *   node automation/fetch.mjs [--sources file] [--seen file] [--max 12] [--dry]
 */
import fs from "fs";
import path from "path";
import {
  get, parseFeed, pageLinks, extractText, robotsAllowed, slugify, sleep, hash,
  longestCopiedRun, dubaiNowIso, RELEVANT,
} from "./lib.mjs";
import { draftArticle, rewriteArticle, provider } from "./ai.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, [])
);

const ROOT = process.cwd();
const SOURCES = path.resolve(args.sources || "automation/sources.json");
const SEEN = path.resolve(args.seen || "automation/seen.json");
const OUT_DIR = path.resolve(args.out || "content/articles");
const REPORT = path.resolve(args.report || "automation/last-run.md");
const MAX_DRAFTS = Number(args.max || process.env.MAX_DRAFTS || 12);
const PER_SOURCE = Number(process.env.PER_SOURCE || 3);
const MAX_AGE_DAYS = Number(process.env.MAX_AGE_DAYS || 7);
const DELAY = Number(process.env.REQUEST_DELAY_MS || 1500);
const DRY = !!args.dry;

const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, "content/taxonomy.json"), "utf8"));
const COUNTRY_KEYS = Object.keys(taxonomy.countries).filter((k) => taxonomy.countries[k].enabled);
const CATEGORY_KEYS = Object.keys(taxonomy.categories);

const { sources } = JSON.parse(fs.readFileSync(SOURCES, "utf8"));
const seen = fs.existsSync(SEEN) ? JSON.parse(fs.readFileSync(SEEN, "utf8")) : {};
fs.mkdirSync(OUT_DIR, { recursive: true });

const report = { drafts: [], skipped: [], failed: [], baseline: [], errors: [] };
const today = dubaiNowIso().slice(0, 10);
let drafted = 0;

if (provider() === "none" && !DRY) {
  console.error("No AI key set (ANTHROPIC_API_KEY or OPENAI_API_KEY). Use --dry to only list new items.");
  process.exit(1);
}

for (const source of sources.filter((s) => s.enabled !== false)) {
  if (drafted >= MAX_DRAFTS) break;
  let items;
  try {
    const { text, url } = await get(source.url, { accept: source.type === "rss" ? "application/atom+xml,application/rss+xml,text/xml,*/*" : "text/html,*/*" });
    items = source.type === "rss" ? parseFeed(text) : pageLinks(text, url, source);
  } catch (e) {
    report.failed.push(`${source.name}: ${e.message}`);
    continue;
  }
  if (!items.length) {
    report.failed.push(`${source.name}: no items found (page may need JavaScript or a different URL/include pattern)`);
    continue;
  }

  if (source.filter !== false) items = items.filter((i) => RELEVANT.test(`${i.title} ${i.summary}`));
  if (source.type === "rss") {
    const cutoff = Date.now() - MAX_AGE_DAYS * 86400000;
    items = items
      .filter((i) => !i.date || new Date(i.date).getTime() >= cutoff)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  const firstRun = !seen[source.id];
  const known = new Set(seen[source.id] || []);
  const fresh = items.filter((i) => i.url && !known.has(hash(i.url)));
  const remember = (url) => {
    const list = (seen[source.id] = seen[source.id] || []);
    list.push(hash(url));
    if (list.length > 600) list.splice(0, list.length - 600);
  };

  // Pages have no dates: on the first run only remember what exists today, so old notices aren't drafted.
  if (firstRun && source.type === "page") {
    fresh.forEach((i) => remember(i.url));
    if (!fresh.length) seen[source.id] = [];
    report.baseline.push(`${source.name}: ${fresh.length} existing links recorded (new ones will be drafted from the next run)`);
    continue;
  }
  if (!seen[source.id]) seen[source.id] = [];

  for (const item of fresh.slice(0, PER_SOURCE)) {
    if (drafted >= MAX_DRAFTS) break;
    if (DRY) {
      report.drafts.push({ title: item.title, url: item.url, source: source.name, file: "(dry run)", flags: [] });
      continue;
    }
    try {
      if (!(await robotsAllowed(item.url))) {
        report.skipped.push(`robots.txt disallows: ${item.url}`);
        remember(item.url);
        continue;
      }
      await sleep(DELAY);
      let text = "";
      try {
        const page = await get(item.url, { accept: "text/html,*/*" });
        if (/pdf/i.test(page.type)) throw new Error("PDF");
        text = extractText(page.text, source.contentSelector).text;
      } catch {
        text = item.summary || "";
      }
      if (text.split(/\s+/).length < 60) {
        report.skipped.push(`Too little text to write safely: ${item.title}`);
        remember(item.url);
        continue;
      }

      let d = await draftArticle({ source, item, text, today, countries: COUNTRY_KEYS, categories: CATEGORY_KEYS });
      remember(item.url);
      if (!d.publish) {
        report.skipped.push(`${item.title} — ${d.reason || "not relevant"}`);
        continue;
      }

      // Originality: no 10-word run may match the source. One automatic rewrite, then discard.
      let copied = longestCopiedRun(`${d.title} ${d.description} ${d.body}`, text, 10);
      if (copied.length) {
        d = { ...d, ...(await rewriteArticle({ draft: d, phrases: copied, text })) };
        copied = longestCopiedRun(`${d.title} ${d.description} ${d.body}`, text, 10);
        if (copied.length) {
          report.skipped.push(`${item.title} — discarded: still too close to the source wording after rewrite`);
          continue;
        }
      }

      const flags = [];
      const country = COUNTRY_KEYS.includes(d.country) ? d.country : source.country;
      const category = CATEGORY_KEYS.includes(d.category) ? d.category : "visa-labour-law";
      let lastDate = /^\d{4}-\d{2}-\d{2}$/.test(d.lastDate || "") ? d.lastDate : "";
      if (lastDate && !text.includes(lastDate.slice(0, 4))) {
        flags.push(`Removed deadline ${lastDate}: year not found in source`);
        lastDate = "";
      }
      if (lastDate) flags.push(`Check last date ${lastDate} against the source`);
      const near = longestCopiedRun(d.body || "", text, 8);
      if (near.length) flags.push(`Shares ${near.length} short 8-word phrase(s) with the source, e.g. "${near[0]}" — check it reads as our own wording`);
      const wordCount = (d.body || "").split(/\s+/).length;
      if (wordCount < 200) flags.push(`Short article (${wordCount} words)`);

      let slug = slugify(d.title || item.title) || hash(item.url);
      let file = path.join(OUT_DIR, `${slug}.md`);
      for (let n = 2; fs.existsSync(file); n++) file = path.join(OUT_DIR, `${slug}-${n}.md`);

      const fm = {
        title: d.title,
        description: d.description,
        country,
        category,
        author: "mr-jay",
        date: dubaiNowIso(),
        organization: d.organization || source.name,
        lastDate,
        sourceUrl: item.url,
        sourceName: source.name,
        tags: Array.isArray(d.tags) ? d.tags.slice(0, 6) : [],
      };
      const yaml = Object.entries(fm)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? JSON.stringify(v) : JSON.stringify(String(v ?? ""))}`)
        .join("\n");
      fs.writeFileSync(file, `---\n${yaml}\n---\n\n${d.body.trim()}\n`);
      drafted++;
      report.drafts.push({ title: d.title, url: item.url, source: source.name, file: path.relative(ROOT, file), flags });
      console.log("Drafted:", d.title);
    } catch (e) {
      report.errors.push(`${item.title}: ${e.message}`);
    }
  }
}

if (!DRY) fs.writeFileSync(SEEN, JSON.stringify(seen, null, 1));

const lines = [
  `## 📰 ${report.drafts.length} new article draft(s) – ${today}`,
  "",
  "**How to review:** open each file in *Files changed*, compare with the official link, edit if needed. Delete any file you don't want. Then **Merge** to publish.",
  "",
  ...report.drafts.map(
    (d) =>
      `- [ ] **${d.title}**  \n  Source: [${d.source}](${d.url}) · \`${d.file}\`` +
      (d.flags.length ? "\n" + d.flags.map((f) => `  - ⚠️ ${f}`).join("\n") : "")
  ),
  "",
  report.errors.length ? `### Errors\n${report.errors.map((e) => `- ${e}`).join("\n")}\n` : "",
  report.failed.length ? `<details><summary>Sources not working this run (${report.failed.length})</summary>\n\n${report.failed.map((e) => `- ${e}`).join("\n")}\n</details>\n` : "",
  report.baseline.length ? `<details><summary>New sources baselined (${report.baseline.length})</summary>\n\n${report.baseline.map((e) => `- ${e}`).join("\n")}\n</details>\n` : "",
  report.skipped.length ? `<details><summary>Skipped by AI or rules (${report.skipped.length})</summary>\n\n${report.skipped.map((e) => `- ${e}`).join("\n")}\n</details>\n` : "",
];
fs.writeFileSync(REPORT, lines.filter((l) => l !== undefined).join("\n"));
console.log(`Done: ${report.drafts.length} drafts, ${report.skipped.length} skipped, ${report.failed.length} sources failed.`);
