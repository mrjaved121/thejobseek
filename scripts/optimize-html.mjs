#!/usr/bin/env node
// Runs after `next build` (postbuild). Makes the static pages light and fast:
// 1. Removes the Next.js/React runtime and its inline RSC data from every page except /search/
//    (news pages are plain HTML; the few interactive bits are handled by public/site.js).
// 2. Inlines the site CSS (about 21 KB, ~5 KB gzipped) so there is no render-blocking stylesheet request.
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "out");
const KEEP_RUNTIME = new Set([path.join(OUT, "search", "index.html")]);

function walk(dir, list = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "_next") walk(p, list); }
    else if (e.name.endsWith(".html")) list.push(p);
  }
  return list;
}

const cssCache = new Map();
const readCss = (href) => {
  if (!cssCache.has(href)) {
    const file = path.join(OUT, href.split("?")[0]);
    cssCache.set(href, fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/<\/style/gi, "<\\/style") : null);
  }
  return cssCache.get(href);
};

let stripped = 0, before = 0, after = 0;
for (const file of walk(OUT)) {
  let html = fs.readFileSync(file, "utf8");
  before += html.length;

  // Inline stylesheets
  html = html.replace(/<link rel="stylesheet" href="([^"]+\.css)"[^>]*\/?>/g, (m, href) => {
    const css = readCss(href);
    return css === null ? m : `<style>${css}</style>`;
  });

  if (!KEEP_RUNTIME.has(file)) {
    // Script preloads for framework chunks
    html = html.replace(/<link rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/g, "");
    html = html.replace(/<link rel="preload"[^>]*href="\/_next\/static\/chunks\/[^"]*"[^>]*\/?>/g, "");
    // Framework script files
    html = html.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*><\/script>/g, "");
    // Inline RSC payload / bootstrap scripts
    html = html.replace(/<script>(?:(?!<\/script>)[\s\S])*?(?:self\.__next_f|__next_s|requestAnimationFrame\(function\(\)\{\$RT)(?:(?!<\/script>)[\s\S])*<\/script>/g, "");
    stripped++;
    // Show email addresses as plain text: tell Cloudflare (DigitalOcean CDN) not to obfuscate them
    html = html.replace(/<a [^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>/g, (m) => `<!--email_off-->${m}<!--email_on-->`);
  }
  after += html.length;
  fs.writeFileSync(file, html);
}
console.log(`optimize-html: ${stripped} pages without framework JS, HTML ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
