#!/usr/bin/env node
// Usage: npm run new -- "PPSC Announces 500 Lecturer Posts" pakistan govt-jobs
import fs from "fs";
import path from "path";

const [title, country = "uae", category = "govt-jobs"] = process.argv.slice(2);
if (!title) {
  console.error('Usage: npm run new -- "Article title" <uae|pakistan> <category>');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-")
  .slice(0, 80);

// Current time in Dubai (UTC+4) in ISO format
const now = new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 19) + "+04:00";

const file = path.join(process.cwd(), "content", "articles", `${slug}.md`);
if (fs.existsSync(file)) {
  console.error("Already exists:", file);
  process.exit(1);
}

fs.writeFileSync(
  file,
  `---
title: "${title.replace(/"/g, '\\"')}"
description: "One or two sentences (140-160 characters) summarising the news with the main keyword."
country: ${country}
category: ${category}
author: mr-jay
date: ${now}
organization: ""
lastDate: ""
sourceUrl: ""
sourceName: ""
tags: []
draft: true
---

First paragraph: who is hiring, how many posts, where, and the last date.

## Vacancies

| Post | Seats | Qualification |
|---|---|---|
|  |  |  |

## Eligibility

## How to apply

## Important dates
`
);
console.log("Created", file, "\nRemove `draft: true` when it is ready to publish.");
