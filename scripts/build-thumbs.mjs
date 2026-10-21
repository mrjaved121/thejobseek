#!/usr/bin/env node
// Runs before every build (prebuild). Creates small WebP thumbnails for every article in public/thumbs/:
//   <slug>-640.webp  (cards, ~10–25 KB)   and   <slug>-1200.webp  (lead stories)
// - If the article has `image: /images/your-photo.jpg` (a file in /public), that photo is cropped and converted.
// - Otherwise the country photo (public/images/countries/<country>.webp) is used, with the topic badge.
// - If there is no country photo, a branded illustration is drawn: sky gradient, country landmark silhouette, skyline, topic badge.
// No text is drawn into images (so no font issues on the build server); labels are added in HTML.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content", "articles");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "thumbs");
fs.mkdirSync(OUT, { recursive: true });

const W = 1200, H = 675, GROUND = 600;
// Two small thumbnails per article (16:9), always <= 8 KB:
//   <slug>.webp    384x216  for large cards / mobile
//   <slug>-s.webp  256x144  for small cards (browser picks via srcset)
//   <slug>-xs.webp 160x90   for the tiny list thumbnails
const TW = 384, TH = 216, SW = 256, SH = 144, XW = 160, XH = 90, MAX_BYTES = 8 * 1024;
const VERSION = "v6"; // bump to regenerate everything after design changes

// --- deterministic random from slug ---
function rng(seedStr) {
  let h = crypto.createHash("md5").update(seedStr).digest().readUInt32LE(0);
  return () => {
    h |= 0; h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- palettes ---
const TINT = {
  uae: "#1f6b5a", "saudi-arabia": "#16683d", qatar: "#6e1d3a", kuwait: "#1d5c7a", oman: "#8d2229",
  bahrain: "#9a2338", uk: "#24407a", usa: "#2c3f8f", canada: "#9b2230", australia: "#1f5f8b",
  europe: "#203f9a", pakistan: "#14553a", india: "#a0521a",
};
const CAT_TOP = {
  "govt-jobs": "#0d1a48", "private-jobs": "#0b2a40", "exams-results": "#2a1647",
  "visa-labour-law": "#0a1438", guides: "#3a2604", "job-market": "#0f2c3f",
};

// --- topic icons (24x24, stroked) ---
const ICON = {
  "govt-jobs": '<path d="M12 3 3 8v2h18V8l-9-5Zm-7 9v6m4.5-6v6m5-6v6M19 12v6M3 20h18"/>',
  "private-jobs": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  "exams-results": '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M8.5 12.5l2.2 2.2 4.8-4.8"/>',
  "visa-labour-law": '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M8.5 17h7"/>',
  "job-market": '<path d="M3 20h18"/><path d="M6 16v-5M11 16V8M16 16v-7M20 16V5"/><path d="M5 9l5-4 5 3 5-5"/>',
  guides: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
};

// --- landmark silhouettes (generic, stylised), drawn at x = cx, standing on GROUND ---
function landmark(country, cx, fill) {
  const g = GROUND;
  const p = (d) => `<path d="${d}" fill="${fill}"/>`;
  switch (country) {
    case "uae": // stepped super-tall tower
      return p(`M${cx - 46} ${g} L${cx - 40} ${g - 140} L${cx - 30} ${g - 140} L${cx - 26} ${g - 260} L${cx - 16} ${g - 260} L${cx - 12} ${g - 370} L${cx - 5} ${g - 370} L${cx - 2} ${g - 520} L${cx + 2} ${g - 520} L${cx + 5} ${g - 370} L${cx + 12} ${g - 370} L${cx + 16} ${g - 260} L${cx + 26} ${g - 260} L${cx + 30} ${g - 140} L${cx + 40} ${g - 140} L${cx + 46} ${g} Z`);
    case "saudi-arabia": // tapered tower with open top
      return p(`M${cx - 70} ${g} L${cx - 20} ${g - 430} L${cx - 6} ${g - 430} L${cx - 10} ${g - 330} L${cx + 10} ${g - 330} L${cx + 6} ${g - 430} L${cx + 20} ${g - 430} L${cx + 70} ${g} Z`);
    case "qatar": // bullet tower
      return p(`M${cx - 48} ${g} L${cx - 48} ${g - 300} Q${cx - 48} ${g - 400} ${cx} ${g - 410} Q${cx + 48} ${g - 400} ${cx + 48} ${g - 300} L${cx + 48} ${g} Z`);
    case "kuwait": // needle with spheres
      return p(`M${cx - 5} ${g} L${cx - 5} ${g - 420} L${cx + 5} ${g - 420} L${cx + 5} ${g} Z`) +
        `<circle cx="${cx}" cy="${g - 300}" r="44" fill="${fill}"/><circle cx="${cx}" cy="${g - 380}" r="22" fill="${fill}"/>` +
        p(`M${cx + 70} ${g} L${cx + 73} ${g - 260} L${cx + 77} ${g - 260} L${cx + 80} ${g} Z`) + `<circle cx="${cx + 75}" cy="${g - 190}" r="26" fill="${fill}"/>`;
    case "oman": case "pakistan": case "india": // dome and minarets
      return p(`M${cx - 110} ${g} L${cx - 110} ${g - 150} L${cx + 110} ${g - 150} L${cx + 110} ${g} Z`) +
        p(`M${cx - 80} ${g - 150} Q${cx - 80} ${g - 300} ${cx} ${g - 320} Q${cx + 80} ${g - 300} ${cx + 80} ${g - 150} Z`) +
        p(`M${cx - 2} ${g - 320} L${cx} ${g - 350} L${cx + 2} ${g - 320} Z`) +
        p(`M${cx - 165} ${g} L${cx - 165} ${g - 330} L${cx - 158} ${g - 370} L${cx - 151} ${g - 330} L${cx - 151} ${g} Z`) +
        p(`M${cx + 151} ${g} L${cx + 151} ${g - 330} L${cx + 158} ${g - 370} L${cx + 165} ${g - 330} L${cx + 165} ${g} Z`);
    case "bahrain": // twin sail towers
      return p(`M${cx - 120} ${g} Q${cx - 120} ${g - 260} ${cx - 30} ${g - 380} L${cx - 30} ${g} Z`) +
        p(`M${cx + 120} ${g} Q${cx + 120} ${g - 260} ${cx + 30} ${g - 380} L${cx + 30} ${g} Z`) +
        p(`M${cx - 30} ${g - 250} L${cx + 30} ${g - 250} L${cx + 30} ${g - 238} L${cx - 30} ${g - 238} Z`);
    case "uk": // clock tower
      return p(`M${cx - 36} ${g} L${cx - 36} ${g - 330} L${cx - 44} ${g - 340} L${cx - 44} ${g - 400} L${cx} ${g - 480} L${cx + 44} ${g - 400} L${cx + 44} ${g - 340} L${cx + 36} ${g - 330} L${cx + 36} ${g} Z`) +
        `<circle cx="${cx}" cy="${g - 372}" r="22" fill="#f4b41a" opacity="0.9"/>`;
    case "usa": // stepped skyscraper with spire
      return p(`M${cx - 70} ${g} L${cx - 70} ${g - 260} L${cx - 50} ${g - 260} L${cx - 50} ${g - 340} L${cx - 30} ${g - 340} L${cx - 30} ${g - 400} L${cx - 8} ${g - 400} L${cx - 3} ${g - 490} L${cx + 3} ${g - 490} L${cx + 8} ${g - 400} L${cx + 30} ${g - 400} L${cx + 30} ${g - 340} L${cx + 50} ${g - 340} L${cx + 50} ${g - 260} L${cx + 70} ${g - 260} L${cx + 70} ${g} Z`);
    case "canada": // needle tower with pod
      return p(`M${cx - 30} ${g} L${cx - 8} ${g - 330} L${cx - 3} ${g - 520} L${cx + 3} ${g - 520} L${cx + 8} ${g - 330} L${cx + 30} ${g} Z`) +
        `<ellipse cx="${cx}" cy="${g - 330}" rx="40" ry="18" fill="${fill}"/>`;
    case "australia": // sail roofs
      return p(`M${cx - 200} ${g} Q${cx - 170} ${g - 150} ${cx - 90} ${g - 190} Q${cx - 110} ${g - 90} ${cx - 60} ${g} Z`) +
        p(`M${cx - 80} ${g} Q${cx - 40} ${g - 190} ${cx + 50} ${g - 240} Q${cx + 20} ${g - 110} ${cx + 70} ${g} Z`) +
        p(`M${cx + 50} ${g} Q${cx + 90} ${g - 140} ${cx + 170} ${g - 170} Q${cx + 140} ${g - 70} ${cx + 190} ${g} Z`);
    default:
      return "";
  }
}

function euStars(cx, cy, r) {
  let s = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    s += `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.6)" d="M0-9 2.6-2.8 9.3-2.8 3.9 1.1 6 7.6 0 3.7-6 7.6-3.9 1.1-9.3-2.8-2.6-2.8Z" fill="#f4b41a"/>`;
  }
  return s;
}

function skyline(r, color, minH, maxH, windows) {
  let x = -20, s = "", w = "";
  while (x < W + 20) {
    const bw = 40 + r() * 80;
    const bh = minH + r() * (maxH - minH);
    s += `<rect x="${x.toFixed(0)}" y="${(GROUND - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${(bh + 80).toFixed(0)}" fill="${color}"/>`;
    if (windows) {
      for (let wy = GROUND - bh + 14; wy < GROUND - 10; wy += 22) {
        for (let wx = x + 8; wx < x + bw - 10; wx += 16) {
          if (r() < 0.16) w += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="9" fill="#f4b41a" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
        }
      }
    }
    x += bw + 2 + r() * 10;
  }
  return s + w;
}

function svgFor(a) {
  const r = rng(a.slug);
  const tint = TINT[a.country] || "#24407a";
  const top = CAT_TOP[a.category] || "#0a1438";
  const sunX = 140 + r() * 260, sunY = 120 + r() * 80;
  const lmX = 560 + r() * 260;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${tint}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#f4b41a" stop-opacity="0.55"/><stop offset="1" stop-color="#f4b41a" stop-opacity="0"/></radialGradient>
    <pattern id="hatch" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="16" fill="#ffffff" opacity="0.04"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#hatch)"/>
  <circle cx="${sunX}" cy="${sunY}" r="220" fill="url(#glow)"/>
  <circle cx="${sunX}" cy="${sunY}" r="62" fill="#f4b41a" opacity="0.92"/>
  ${a.country === "europe" ? euStars(sunX, sunY, 120) : ""}
  <g opacity="0.45">${skyline(r, "#0a1435", 140, 330, false)}</g>
  ${landmark(a.country, lmX, "#08112e")}
  ${skyline(r, "#060d26", 50, 200, true)}
  <rect y="${GROUND}" width="${W}" height="${H - GROUND}" fill="#050a1e"/>
  <rect y="${GROUND}" width="${W}" height="3" fill="#f4b41a" opacity="0.8"/>
  <g transform="translate(1050 92)">
    <circle r="62" fill="#f4b41a"/>
    <g transform="translate(-36 -36) scale(3)" fill="none" stroke="#0c1740" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[a.category] || ICON["visa-labour-law"]}</g>
  </g>
</svg>`;
}

// Country photo (public/images/countries/<country>.webp) with a soft bottom shade and the topic badge.
async function countryPhotoFor(a, photoPath) {
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0.55" stop-color="#0b1640" stop-opacity="0"/><stop offset="1" stop-color="#0b1640" stop-opacity="0.55"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <g transform="translate(1094 92)">
    <circle r="52" fill="#f4b41a" stroke="#ffffff" stroke-opacity="0.85" stroke-width="4"/>
    <g transform="translate(-30 -30) scale(2.5)" fill="none" stroke="#0c1740" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[a.category] || ICON["visa-labour-law"]}</g>
  </g>
</svg>`;
  // Light smoothing (blur 0.6) removes fine detail so the photo fits in 8 KB; the badge is added after, so it stays sharp.
  const base = await sharp(photoPath).resize(TW, TH, { fit: "cover", position: "attention" }).blur(0.6).png().toBuffer();
  return sharp(base).composite([{ input: Buffer.from(overlay) }]).png().toBuffer();
}

// Encode as WebP, lowering quality step by step until the file is <= 8 KB.
async function smallWebp(input, w = TW, h = TH, blur = 0) {
  let img = sharp(input).resize(w, h, { fit: "cover", position: "attention" });
  if (blur) img = img.blur(blur);
  const raw = await img.png().toBuffer();
  let out;
  for (const q of [60, 55, 50, 45, 40, 35, 30, 25, 20]) {
    out = await sharp(raw).webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer();
    if (out.length <= MAX_BYTES) return out;
  }
  return out;
}

async function writeThumb(input, slug, blur = 0) {
  fs.writeFileSync(path.join(OUT, `${slug}.webp`), await smallWebp(input, TW, TH, blur));
  fs.writeFileSync(path.join(OUT, `${slug}-s.webp`), await smallWebp(input, SW, SH, blur));
  fs.writeFileSync(path.join(OUT, `${slug}-xs.webp`), await smallWebp(input, XW, XH, blur));
}

// JPEG copies of the country photos for social share images (WhatsApp/Facebook) and the article OG images.
const CDIR = path.join(PUB, "images", "countries");
if (fs.existsSync(CDIR)) {
  for (const f of fs.readdirSync(CDIR).filter((x) => x.endsWith(".webp"))) {
    const jpg = path.join(CDIR, f.replace(/\.webp$/, ".jpg"));
    if (!fs.existsSync(jpg) || fs.statSync(jpg).mtimeMs < fs.statSync(path.join(CDIR, f)).mtimeMs) {
      await sharp(path.join(CDIR, f)).resize(1200, 675, { fit: "cover" }).jpeg({ quality: 72, mozjpeg: true }).toFile(jpg);
    }
  }
}

const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".md")) : [];
const stampFile = path.join(OUT, ".stamps.json");
const stamps = fs.existsSync(stampFile) ? JSON.parse(fs.readFileSync(stampFile, "utf8")) : {};
let made = 0;
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const { data } = matter(fs.readFileSync(path.join(SRC, f), "utf8"));
  const a = { slug, country: String(data.country), category: String(data.category) };
  const img = data.image ? String(data.image) : "";
  const local = img.startsWith("/") && fs.existsSync(path.join(PUB, img)) ? path.join(PUB, img) : "";
  const countryPhoto = path.join(PUB, "images", "countries", `${a.country}.webp`);
  const hasCountryPhoto = !local && fs.existsSync(countryPhoto);
  const key = `${VERSION}|${a.country}|${a.category}|${img}|${local ? fs.statSync(local).mtimeMs : ""}|${hasCountryPhoto ? fs.statSync(countryPhoto).size : ""}`;
  const done = fs.existsSync(path.join(OUT, `${slug}.webp`)) && fs.existsSync(path.join(OUT, `${slug}-s.webp`)) && fs.existsSync(path.join(OUT, `${slug}-xs.webp`));
  if (done && stamps[slug] === key) continue;
  if (local) await writeThumb(local, slug, 0.6);
  else if (hasCountryPhoto) await writeThumb(await countryPhotoFor(a, countryPhoto), slug);
  else await writeThumb(Buffer.from(svgFor(a)), slug);
  stamps[slug] = key;
  made++;
}
fs.writeFileSync(stampFile, JSON.stringify(stamps));

// Country page banners: public/thumbs/country-<key>.webp, wide crop, <= 8 KB (shown under a dark overlay).
if (fs.existsSync(CDIR)) {
  for (const f of fs.readdirSync(CDIR).filter((x) => x.endsWith(".webp"))) {
    const out = path.join(OUT, `country-${f}`);
    if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(path.join(CDIR, f)).mtimeMs) {
      fs.writeFileSync(out, await smallWebp(path.join(CDIR, f), 640, 200, 1.2));
    }
  }
}
// Remove old large thumbnails from earlier versions.
for (const f of fs.readdirSync(OUT).filter((x) => /-(640|1200)\.webp$/.test(x))) fs.unlinkSync(path.join(OUT, f));
console.log(`thumbs: ${made} generated, ${files.length - made} up to date`);
