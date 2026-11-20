// Usage: node marketing/mark-scheduled.mjs <slug> [slug...] — records that an article is scheduled in Facebook at its `slot`.
import fs from "node:fs";
const f = "marketing/fb-queue.json";
const q = JSON.parse(fs.readFileSync(f, "utf8"));
for (const s of process.argv.slice(2)) {
  const it = q.find((x) => x.slug === s);
  if (!it || !it.slot) { console.error("not found or no slot: " + s); continue; }
  it.scheduled = true;
}
fs.writeFileSync(f, JSON.stringify(q, null, 2));
console.log(`${q.filter((x) => x.scheduled).length} scheduled, last: ${q.filter((x) => x.scheduled).map((x) => x.slot).sort().pop()}`);
