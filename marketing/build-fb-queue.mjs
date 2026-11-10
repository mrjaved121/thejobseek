// Builds marketing/fb-queue.json: one Facebook post per article, oldest first.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = "content/articles";
const out = "marketing/fb-queue.json";
const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : [];
const posted = new Map(prev.filter((p) => p.posted).map((p) => [p.slug, p.postedAt]));

const flag = { "saudi-arabia": "🇸🇦", uae: "🇦🇪", qatar: "🇶🇦", kuwait: "🇰🇼", oman: "🇴🇲", bahrain: "🇧🇭", canada: "🇨🇦", usa: "🇺🇸", uk: "🇬🇧", australia: "🇦🇺", italy: "🇮🇹", romania: "🇷🇴", pakistan: "🇵🇰", europe: "🇪🇺" };
const tag = (s) => "#" + s.replace(/[^a-z0-9]/gi, "");
const countryTag = { uae: "#UAE", usa: "#USA", uk: "#UK", "saudi-arabia": "#SaudiArabia" };

const items = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
  const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
  const slug = f.replace(/\.md$/, "");
  const url = `https://thejobseek.com/${data.country}/${slug}`;
  const points = (data.keyPoints || []).slice(0, 3).map((k) => `✅ ${k}`).join("\n");
  const tags = [countryTag[data.country] || tag(String(data.country).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())), "#Jobs", "#WorkAbroad", "#TheJobSeek"].join(" ");
  const caption = `${flag[data.country] || "🌍"} ${data.title}\n\n${data.description}\n\n${points ? points + "\n\n" : ""}👉 Read the full guide: ${url}\n\n${tags}`;
  return { slug, date: new Date(data.date).toISOString(), url, caption, posted: posted.has(slug), postedAt: posted.get(slug) };
}).sort((a, b) => a.date.localeCompare(b.date));

fs.writeFileSync(out, JSON.stringify(items, null, 2));
console.log(`${items.length} posts, ${items.filter((i) => !i.posted).length} not yet posted`);
