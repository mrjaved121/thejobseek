// Prints the next N planned-but-not-scheduled posts with the exact values to type into Facebook.
// Usage: node marketing/fb-to-schedule.mjs [count=5]
import fs from "node:fs";
const n = Number(process.argv[2] || 5);
const q = JSON.parse(fs.readFileSync("marketing/fb-queue.json", "utf8"));
const M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const todo = q.filter((x) => x.slot && !x.scheduled && !x.posted).sort((a, b) => a.slot.localeCompare(b.slot)).slice(0, n);
for (const x of todo) {
  const [d, t] = x.slot.split("T");
  const [y, m, day] = d.split("-").map(Number);
  console.log(JSON.stringify({ slug: x.slug, DATE: `${day} ${M[m - 1]} ${y}`, TIME: t.slice(0, 5), TITLE: x.caption.split("\n")[0].replace(/^\S+\s/, "").slice(0, 35), caption: x.caption }));
}
