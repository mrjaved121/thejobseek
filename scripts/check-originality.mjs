#!/usr/bin/env node
// Originality check across all articles (run: npm run check:originality).
// Flags any two articles that share 3+ identical 10-word sequences (ignoring tables and link URLs),
// so the same sentences are never reused across pages. Exits 1 if anything is flagged.
// Checking against the original source is done separately: see automation/ and the daily news task.
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "articles");
const N = 10, LIMIT = 3;
const words = (s) => (s.toLowerCase().replace(/[’']/g, "").match(/[a-z0-9]+/g) || []);
const docs = fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => {
  let body = fs.readFileSync(path.join(DIR, f), "utf8").split("---").slice(2).join("---");
  body = body.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^\|.*$/gm, "");
  const w = words(body);
  const set = new Set();
  for (let i = 0; i + N <= w.length; i++) set.add(w.slice(i, i + N).join(" "));
  return { f, set };
});
let flagged = 0;
for (let i = 0; i < docs.length; i++) for (let j = i + 1; j < docs.length; j++) {
  const shared = [...docs[i].set].filter((g) => docs[j].set.has(g));
  if (shared.length >= LIMIT) {
    flagged++;
    console.log(`REPEATED TEXT: ${docs[i].f} <-> ${docs[j].f} (${shared.length} shared 10-word runs), e.g. "${shared[0]}"`);
  }
}
console.log(flagged ? `${flagged} article pair(s) need rewording.` : `Originality OK: ${docs.length} articles, no repeated passages.`);
process.exit(flagged ? 1 : 0);
