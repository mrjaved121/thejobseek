# TheJobSeek.com – Job & Work Visa News

Next.js 15 static news site + automatic news drafting from official sources.
Built for Google Search, Google News / Top Stories, Discover and AdSense.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill values when you have them
npm run dev                  # http://localhost:3000
npm run build && npm start   # production check
```

---

## How the automatic news works

```
Every 6 hours (GitHub Actions)
  → checks ~24 official sources in automation/sources.json
    (GOV.UK, IRCC, USCIS, US DOL, Home Affairs, EU, MOHRE, WAM, ICP, SPA, HRSD,
     QNA, KUNA, ONA, BNA, FPSC, PPSC, BE&OE, NTS, UPSC)
  → keeps only job / recruitment / visa / labour / exam items
  → AI writes an ORIGINAL draft using only facts from the official notice
  → automatic safety checks (copied wording, unverified deadlines, short drafts)
  → opens ONE pull request "📰 New job news drafts" with a checklist
You (on phone or PC): open the PR → check each draft against its official link
  → edit or delete any file → tap "Merge" → site redeploys → published.
```

Nothing is ever published without your merge. That human review is what keeps the
site inside Google's spam policies (scaled content abuse) and AdSense's "valuable
inventory" policy.

### One-time setup (15 minutes)

1. **Push this folder to a GitHub repo** (private is fine).
2. **Add your AI key:** GitHub repo → Settings → Secrets and variables → Actions →
   *New repository secret* → `ANTHROPIC_API_KEY` (from console.anthropic.com).
   Using OpenAI instead: add `OPENAI_API_KEY` and a variable `AI_MODEL`.
   Optional variables: `MAX_DRAFTS` (default 12 per run), `AI_MODEL`.
3. **Allow the bot to open PRs:** Settings → Actions → General → Workflow permissions →
   *Read and write* + tick **Allow GitHub Actions to create and approve pull requests**.
4. **Connect the repo to DigitalOcean App Platform** (see *Hosting* below) so merges deploy automatically.
5. Run it once by hand: Actions → *Fetch job news drafts* → **Run workflow**.
   The first run only "baselines" page-type sources (records what already exists), so
   real drafts start from the second run. RSS sources draft immediately (last 7 days).
6. Install the **GitHub mobile app** and turn on notifications to review on your phone.

### Daily review (5–10 minutes)

- Open the PR → *Files changed*. For each article:
  - open the ✓ source link and confirm names, numbers and the last date;
  - ⚠️ flags in the PR description tell you what to check first;
  - edit text right in GitHub (pencil icon) or delete the file (… → Delete file).
- Merge. If you close a PR without merging, those items will be drafted again next time.

### Managing sources

```bash
npm run sources:check   # ✅/🟡/❌ status of every source (run on your PC)
npm run news:dry        # list what would be drafted, no AI calls
```

Edit `automation/sources.json`:
- `type: "rss"` for feeds, `type: "page"` for a news/notices page (links are scanned);
- `include`: regex the article URL must match (removes menu/other links);
- `filter: false` for pages that only contain job notices;
- `enabled: false` to pause a source.

Government sites change often. Some (e.g. sites built fully in JavaScript, or that block
bots) will show ❌ — fix the URL/include pattern or disable them. Notices that are only
PDFs or images (common in Pakistan newspaper ads) are skipped; add those manually with
`npm run new`.

The fetcher identifies itself as `TheJobSeekBot`, respects robots.txt, waits between
requests, and only reads public pages.

### Cost

About 1–3 US cents per draft with Claude Sonnet ⇒ roughly $5–15/month at 12 drafts × 4 runs/day.

---

## Images (WebP thumbnails)

`npm run build` first runs `scripts/build-thumbs.mjs`, which writes two WebP sizes per article to
`public/thumbs/` (`<slug>-640.webp` ≈ 8–10 KB for cards, `<slug>-1200.webp` ≈ 20 KB for lead stories).

- **No image set:** a branded illustration is drawn (country landmark + skyline + topic badge).
- **Your own photo:** put it in `public/images/` and add `image: /images/photo.jpg` (and `imageAlt:`)
  to the article. It is cropped to 16:9 and converted to WebP automatically.
- Only use photos you took yourself or that have a free commercial licence (e.g. Unsplash, Pexels).

`public/thumbs/` is generated, so it is not committed to Git.

## Manual articles

```bash
npm run new -- "PPSC Announces 300 Lecturer Posts 2026" pakistan govt-jobs
```

Creates `content/articles/<slug>.md` with `draft: true`. Fill it in, remove `draft: true`, push.

**Frontmatter**

| Field | Required | Notes |
|---|---|---|
| title | yes | 55–75 chars, main keyword first |
| description | yes | 140–160 chars |
| country | yes | key from `content/taxonomy.json` (uae, saudi-arabia, qatar, kuwait, oman, bahrain, pakistan, india, uk, usa, canada, australia, europe) |
| category | yes | govt-jobs, private-jobs, exams-results, visa-labour-law, guides |
| author | yes | id from `src/lib/authors.ts` |
| date | yes | ISO with timezone. Future dates stay hidden until then |
| updated | no | set when you correct an article |
| organization, lastDate, sourceUrl, sourceName | no | fill for every recruitment news |
| tags | no | 3–6 keywords |
| draft | no | `true` hides the article |

Countries and categories are defined once in `content/taxonomy.json` (used by both the site
and the automation). Country pages with no articles are `noindex` and hidden from menus
until they have content.

## SEO built in

- Static HTML, canonical URLs, www → non-www redirect, system fonts (fast LCP)
- `NewsArticle`, `NewsMediaOrganization`, `WebSite`, `BreadcrumbList`, `ProfilePage` JSON-LD
- `/sitemap.xml`, Google News `/news-sitemap.xml` (last 48h), `/feed.xml`, `/robots.txt`
- Auto 1200px share image per article; `max-image-preview:large`
- Visible official-source stamp + "Apply only through the official source" box on every article
- AI-use disclosure on the Editorial Policy page (Google recommends being transparent)

## Hosting (DigitalOcean App Platform – Static Site)

The site is a pure static export (`output: "export"`): `npm run build` writes everything to `out/`.
No server or database needed. A postbuild step gives generated images a `.png` extension.

1. DigitalOcean → **Apps → Create App → GitHub → `mrjaved121/thejobseek`**, branch `main`, *Autodeploy* on.
2. Resource type: **Static Site**. Build command: `npm run build`. Output directory: `out`.
3. Environment variables: add the `NEXT_PUBLIC_*` and `GOOGLE_SITE_VERIFICATION` values from
   `.env.example` with scope **Build time** (they are baked into the HTML at build).
4. Settings → *Custom pages*: set **Error document** to `404.html`.
5. Settings → **Domains**: add `thejobseek.com` (primary) and `www.thejobseek.com`;
   redirect www → thejobseek.com. Point GoDaddy DNS as DigitalOcean shows (or move nameservers to DigitalOcean).
6. All URLs end with `/` (e.g. `/uae/article-name/`); canonicals, sitemap and internal links already match.

Why not Vercel: the free Hobby plan does not allow ads (AdSense counts as commercial use).

## AdSense

Required pages exist: About, Contact, Privacy (with Google ad-cookie text), Terms,
Disclaimer, Editorial Policy.

1. Publish 25–30 good articles over 2–3 weeks (include your own guides, not only short news).
2. Apply with `thejobseek.com`.
3. Set `NEXT_PUBLIC_ADSENSE_CLIENT` (ca-pub-…) → loads AdSense + creates `/ads.txt`.
4. After approval: Auto ads, or set `NEXT_PUBLIC_AD_SLOT_TOP / _INARTICLE / _SIDEBAR`.

## Launch checklist

1. Deploy on DigitalOcean (see *Hosting*), add domain, point GoDaddy DNS to DigitalOcean.
2. Search Console: verify (`GOOGLE_SITE_VERIFICATION`), submit both sitemaps.
3. Google News Publisher Center: add publication with `/feed.xml`.
4. GA4: `NEXT_PUBLIC_GA_ID`. Social + WhatsApp links in env vars.
5. Edit author bios in `src/lib/authors.ts` (real people = trust).
