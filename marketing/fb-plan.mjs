// Gives every unposted, unscheduled article a Facebook schedule slot (stored as `slot`).
// 16 slots a day, on the hour from 08:00 to 23:00 Pakistan time (+05:00), the laptop and browser time zone. New slots continue after the last one used.
// Usage: node marketing/fb-plan.mjs [days=20]
import fs from "node:fs";
const f = "marketing/fb-queue.json";
const q = JSON.parse(fs.readFileSync(f, "utf8"));
const days = Number(process.argv[2] || 20);
const HOURS = Array.from({ length: 16 }, (_, i) => 8 + i);
const pad = (n) => String(n).padStart(2, "0");

// First free slot: after the latest existing slot, never earlier than 2 hours from now.
const used = q.filter((x) => x.slot).map((x) => Date.parse(x.slot));
let t = Date.now() + 2 * 3600e3;
const end = Date.now() + days * 864e5;

function nextSlot(after) {
  let d = new Date(Math.ceil(after / 3600e3) * 3600e3);
  for (;;) {
    if (HOURS.includes((d.getUTCHours() + 5) % 24)) return d;
    d = new Date(d.getTime() + 3600e3);
  }
}
const toLocal = (d) => {
  const u = new Date(d.getTime() + 5 * 3600e3);
  return `${u.getUTCFullYear()}-${pad(u.getUTCMonth() + 1)}-${pad(u.getUTCDate())}T${pad(u.getUTCHours())}:00:00+05:00`;
};

// Newest articles first, so recent news isn't stale by the time it posts.
// Deadline in the slug ("apply-by-november-16", "apply-by-1-december-2026"): don't post after it.
const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
function deadline(slug) {
  let m = slug.match(/apply-by-(\d{1,2})-([a-z]+)(?:-(\d{4}))?/) || null;
  let day, mon, year;
  if (m && MONTHS.includes(m[2])) { day = +m[1]; mon = MONTHS.indexOf(m[2]); year = m[3] ? +m[3] : null; }
  else {
    m = slug.match(/apply-by-([a-z]+)-(\d{1,2})/);
    if (!m || !MONTHS.includes(m[1])) return null;
    mon = MONTHS.indexOf(m[1]); day = +m[2]; year = null;
  }
  const y = year || new Date().getUTCFullYear();
  return Date.UTC(y, mon, day, 18, 59); // end of that day, Pakistan time
}

// Re-plan everything not yet scheduled, starting after the last scheduled slot.
for (const x of q) if (!x.scheduled) delete x.slot;
const lastScheduled = q.filter((x) => x.scheduled && x.slot).map((x) => Date.parse(x.slot));
if (lastScheduled.length) t = Math.max(t, Math.max(...lastScheduled) + 1);

const todo = q.filter((x) => !x.posted && !x.scheduled && !x.slot && !x.skipped).sort((a, b) => b.date.localeCompare(a.date));
let n = 0;
for (const it of todo) {
  const s = nextSlot(t);
  if (s.getTime() > end) break;
  const dl = deadline(it.slug);
  if (dl && dl < s.getTime()) { it.skipped = "deadline passed before slot"; continue; }
  it.slot = toLocal(s);
  t = s.getTime() + 1;
  n++;
}
fs.writeFileSync(f, JSON.stringify(q, null, 2));
const left = q.filter((x) => !x.posted && !x.slot).length;
console.log(`Planned ${n} new slots. Last slot: ${q.filter((x) => x.slot).map((x) => x.slot).sort().pop()}. Unplanned: ${left}`);
