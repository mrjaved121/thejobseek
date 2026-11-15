#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Quality gate for new articles (owner's instruction, 16 Nov 2026).
//
// Google crawled most of our short news rewrites and chose not to index them
// ("Crawled – currently not indexed"). From 16 Nov 2026 every published article must add
// something the big news sites don't: requirements, a step-by-step apply guide, a deadline,
// a table (salary / roles / dates) and tips for applicants from Pakistan and India.
// It also caps publishing at MAX_PER_DAY articles per Dubai calendar day.
//
// Usage: npm run check:quality          (checks articles dated on/after the cutoff)
//        npm run check:quality -- --all (report on every article, never fails)
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DIR = path.join(process.cwd(), 'content', 'articles');
const CUTOFF = new Date('2026-11-16T00:00:00+04:00');
const MAX_PER_DAY = 5;
const MIN_WORDS = { guides: 1100, default: 700 };
const reportAll = process.argv.includes('--all');

const dubaiDay = (d) => new Date(d.getTime() + 4 * 3600e3).toISOString().slice(0, 10);
const words = (s) => (s.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`|\-\[\]()]/g, ' ').match(/\b[\w'’]+\b/g) || []).length;

function checkArticle(file, data, body) {
  const problems = [];
  const headings = body.split('\n').filter((l) => /^#{2,4}\s/.test(l)).join('\n');
  const min = MIN_WORDS[data.category] || MIN_WORDS.default;
  const count = words(body);
  if (count < min) problems.push(`only ${count} words (minimum ${min} for ${data.category || 'news'})`);
  if (!/^\|.*\|\s*$/m.test(body) || !/^\|\s*:?-{3,}/m.test(body)) problems.push('no table (salary, roles, locations, requirements or dates)');
  if (!/requirement|who can apply|eligib|qualif/i.test(headings)) problems.push('no "Requirements / Who can apply" section');
  if (!/apply|step[- ]by[- ]step/i.test(headings) || !/^\s*\d+\.\s/m.test(body)) problems.push('no numbered step-by-step "How to apply" section');
  if (!/pakistan/i.test(headings) || !/india/i.test(headings)) problems.push('no section with tips for applicants from Pakistan and India');
  if (!data.lastDate && !/closing date|deadline|last date|no (official )?closing date|rolling basis|open until/i.test(body)) problems.push('no deadline: set lastDate or say when applications close / that no closing date is published');
  const links = new Set([...(body.match(/https?:\/\/[^\s)"']+/g) || []), data.sourceUrl, data.applyUrl].filter(Boolean).map((u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } }));
  if (links.size < 2) problems.push('fewer than 2 independent sources (employer/government page + one more)');
  return problems;
}

const perDay = {};
let failed = 0;
let checked = 0;
for (const name of fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort()) {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, name), 'utf8'));
  if (data.draft || data.noindex || !data.date) continue;
  const date = new Date(data.date);
  const isNew = date >= CUTOFF;
  if (!isNew && !reportAll) continue;
  if (isNew) (perDay[dubaiDay(date)] ||= []).push(name);
  checked += 1;
  const problems = checkArticle(name, data, content);
  if (problems.length) {
    if (isNew) failed += 1;
    console.log(`${isNew ? '✗' : '·'} ${name}\n    - ${problems.join('\n    - ')}`);
  }
}
for (const [day, files] of Object.entries(perDay)) {
  if (files.length > MAX_PER_DAY) {
    failed += 1;
    console.log(`✗ ${day}: ${files.length} articles published (maximum ${MAX_PER_DAY} a day). Hold the weakest ones as draft: true.`);
  }
}
console.log(`\nQuality check: ${checked} article(s) checked, ${failed} problem(s) in articles dated from ${dubaiDay(CUTOFF)}.`);
if (failed && !reportAll) process.exit(1);
