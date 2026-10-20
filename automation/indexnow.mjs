#!/usr/bin/env node
// Tells Bing, Yandex and other IndexNow search engines that pages changed, so new articles are
// crawled within minutes (Bing results also feed ChatGPT search, Copilot and DuckDuckGo).
// Reads the live sitemap and submits every URL. Run after a deploy: node automation/indexnow.mjs
import fs from "fs";

const SITE = (process.env.SITE_URL || "https://thejobseek.com").replace(/\/$/, "");
const KEY = fs.readFileSync(new URL("./indexnow-key.txt", import.meta.url), "utf8").trim();
const host = new URL(SITE).host;

const keyRes = await fetch(`${SITE}/${KEY}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`Key file ${SITE}/${KEY}.txt is not live yet; skipping.`);
  process.exit(0);
}

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE)).slice(0, 10000);
if (!urlList.length) {
  console.error("No URLs found in sitemap; skipping.");
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status}`);
