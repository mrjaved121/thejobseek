#!/usr/bin/env node
// Tests every source and prints how many items it returns. Run: npm run sources:check
import fs from "fs";
import { get, parseFeed, pageLinks, RELEVANT } from "./lib.mjs";

const { sources } = JSON.parse(fs.readFileSync(process.argv[2] || "automation/sources.json", "utf8"));
for (const s of sources) {
  if (s.enabled === false) {
    console.log(`⏸  ${s.id.padEnd(18)} disabled`);
    continue;
  }
  try {
    const { text, url } = await get(s.url);
    const items = s.type === "rss" ? parseFeed(text) : pageLinks(text, url, s);
    const relevant = s.filter === false ? items : items.filter((i) => RELEVANT.test(i.title));
    const mark = relevant.length ? "✅" : items.length ? "🟡" : "❌";
    console.log(`${mark} ${s.id.padEnd(18)} ${items.length} items, ${relevant.length} relevant${relevant[0] ? `  e.g. "${relevant[0].title.slice(0, 70)}"` : ""}`);
  } catch (e) {
    console.log(`❌ ${s.id.padEnd(18)} ${e.message}`);
  }
}
console.log("\n✅ working  🟡 works but nothing relevant right now  ❌ fix URL/include or set enabled:false");
