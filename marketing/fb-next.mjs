// Prints today's Facebook batch as JSON lines: fresh articles (last 3 days) first, then oldest backlog.
// Usage: node marketing/fb-next.mjs [count=8]
import fs from "node:fs";
const n = Number(process.argv[2] || 8);
const q = JSON.parse(fs.readFileSync("marketing/fb-queue.json", "utf8")).filter((x) => !x.posted);
const cutoff = Date.now() - 3 * 864e5;
const fresh = q.filter((x) => Date.parse(x.date) >= cutoff).sort((a, b) => b.date.localeCompare(a.date));
const backlog = q.filter((x) => !fresh.includes(x));
for (const x of [...fresh, ...backlog].slice(0, n)) {
  // TITLE = text used to verify the right post is on the settings screen before clicking Post
  const title = x.caption.split("\n")[0].replace(/^\S+\s/, "").slice(0, 35);
  console.log(JSON.stringify({ slug: x.slug, TITLE: title, caption: x.caption }));
}
console.error(`${q.length} unposted in total`);
