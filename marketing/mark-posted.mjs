// Usage: node marketing/mark-posted.mjs <slug> [slug...]  — marks queue items as posted.
import fs from "node:fs";
const f = "marketing/fb-queue.json";
const q = JSON.parse(fs.readFileSync(f, "utf8"));
for (const s of process.argv.slice(2)) {
  const it = q.find((x) => x.slug === s);
  if (!it) { console.error("not found: " + s); continue; }
  it.posted = true; it.postedAt = new Date().toISOString();
}
fs.writeFileSync(f, JSON.stringify(q, null, 2));
const next = q.find((x) => !x.posted);
console.log(`${q.filter((x) => x.posted).length}/${q.length} posted. Next: ${next ? next.slug : "none"}`);
if (process.argv.includes("--next") || true) console.log(JSON.stringify(next?.caption ?? ""));
