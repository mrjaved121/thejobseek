import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import Story from "@/components/Story";
import ShareBar from "@/components/ShareBar";
import FollowFacebook from "@/components/FollowFacebook";
import Thumb from "@/components/Thumb";
import JsonLd from "@/components/JsonLd";
import SectionLabel from "@/components/SectionLabel";
import { getAllArticles, getArticle, getRelated, articlePath, formatDate, formatDateTime, sourceDomain } from "@/lib/articles";
import { getAuthor } from "@/lib/authors";
import { metaDescription } from "@/lib/seo";
import { isClosed } from "@/lib/jobs";
import AuthorAvatar from "@/components/AuthorAvatar";
import { articleSchema, faqSchema } from "@/lib/schema";
import { COUNTRIES, CATEGORIES, SITE, ESSENTIAL_GUIDES } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ country: a.country, slug: a.slug }));
}

type Props = { params: Promise<{ country: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, slug } = await params;
  const a = getArticle(country, slug);
  if (!a) return {};
  const author = getAuthor(a.author);
  return {
    // Keep the brand suffix only when it still fits in ~60 characters (avoids truncated titles in Google).
    title: (() => {
      const t = a.seoTitle || a.title;
      return t.length + ` | ${SITE.name}`.length <= 60 ? t : { absolute: t };
    })(),
    description: metaDescription(a.description),
    keywords: a.tags,
    authors: [{ name: author.name, url: `${SITE.url}/author/${author.id}/` }],
    alternates: { canonical: articlePath(a) },
    // Frontmatter `noindex: true` (thin near-duplicates of another article): stays readable, kept out of search results.
    ...(a.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "article",
      title: a.title,
      description: metaDescription(a.description, 200),
      url: articlePath(a),
      publishedTime: a.date,
      modifiedTime: a.updated || a.date,
      section: COUNTRIES[a.country].name,
      tags: a.tags,
      siteName: SITE.name,
      locale: "en_AE",
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { country, slug } = await params;
  const a = getArticle(country, slug);
  if (!a) notFound();
  const author = getAuthor(a.author);
  const c = COUNTRIES[a.country];
  const related = getRelated(a);

  // Split body roughly in half to place an in-article ad between paragraphs.
  const paras = a.html.split("</p>");
  const mid = Math.floor(paras.length / 2);
  const firstHalf = paras.slice(0, mid).join("</p>") + (mid > 0 ? "</p>" : "");
  const secondHalf = paras.slice(mid).join("</p>");

  const hasKeyInfo = a.organization || a.lastDate || a.sourceUrl;
  const shareUrl = `${SITE.url}${articlePath(a)}`;

  return (
    <div className="grid">
      <article className="article">
        <Breadcrumbs
          items={[
            { name: `${c.name} Job News`, path: `/${a.country}/` },
            { name: a.title, path: articlePath(a) },
          ]}
        />
        <header className="article-head">
          <div className="kicker-row">
            <Link href={`/${a.country}/`} className="kicker">
              {c.name}
            </Link>
            <span className="kicker-sep" aria-hidden>/</span>
            <Link href={`/category/${a.category}/`} className="kicker kicker-muted">
              {CATEGORIES[a.category].name}
            </Link>
          </div>
          <h1>{a.title}</h1>
          <p className="article-deck">{a.description}</p>
          <div className="byline">
            <AuthorAvatar author={author} size={40} className="byline-avatar" />
            <div className="byline-text">
              <span>
                By <Link href={`/author/${author.id}/`} rel="author">{author.name}</Link>
                <span className="muted"> · {author.role}</span>
              </span>
              <span className="byline-dates">
                <time dateTime={a.date}>{formatDateTime(a.date)}</time>
                {a.updated && (
                  <>
                    {" · "}Updated <time dateTime={a.updated}>{formatDateTime(a.updated)}</time>
                  </>
                )}
                {" · "}
                {a.readingMinutes} min read
              </span>
            </div>
          </div>
          <ShareBar url={shareUrl} title={a.title} />
        </header>

        <figure className="article-figure">
          <Thumb a={a} size="lg" priority />
          {a.image && a.imageAlt && <figcaption>{a.imageAlt}</figcaption>}
        </figure>

        {a.keyPoints.length > 0 && (
          <section className="inbrief" aria-labelledby="inbrief-h">
            <h2 id="inbrief-h" className="inbrief-h">In brief</h2>
            <ul>
              {a.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </section>
        )}

        {hasKeyInfo && (
          <section className="keybox" aria-label="Key information">
            <table>
              <tbody>
                <tr><th>Country</th><td>{c.name}</td></tr>
                {a.organization && <tr><th>Organization</th><td>{a.organization}</td></tr>}
                {a.lastDate && <tr><th>Last date to apply</th><td><strong>{formatDate(a.lastDate)}</strong></td></tr>}
                {a.sourceUrl && (
                  <tr>
                    {/* "Official" only for the employer's or a government's own site; press reports are plain "Source". */}
                    <th>{a.sourceOfficial ? "Official source" : "Source"}</th>
                    <td>
                      <a href={a.sourceUrl} target="_blank" rel="noopener nofollow">
                        {a.sourceName || (a.sourceOfficial ? "Official notice" : sourceDomain(a))}
                      </a>{" "}
                      {a.sourceOfficial ? (
                        <span className="stamp">✓ {sourceDomain(a)}</span>
                      ) : (
                        <span className="stamp stamp-plain">{sourceDomain(a)}</span>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        <div className="prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_INARTICLE} format="fluid" />
        <div className="prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />

        {a.faq.length > 0 && (
          <section className="faq" aria-labelledby="faq-h">
            <h2 id="faq-h">Frequently asked questions</h2>
            {a.faq.map((f) => (
              <div className="faq-item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>
        )}

        {ESSENTIAL_GUIDES.some((g) => g.country === a.country && g.slug !== a.slug) && (
          <nav className="essential" aria-label={`Essential ${c.name} guides`}>
            <p className="essential-h">Essential {c.name} guides</p>
            <ul>
              {ESSENTIAL_GUIDES.filter((g) => g.country === a.country && g.slug !== a.slug).map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.country}/${g.slug}/`}>{g.label} →</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {isClosed(a) && (a.applyUrl || a.applyEmail) ? (
          <div className="source-box">
            <p>
              <strong>Applications closed on {formatDate(a.lastDate!)}.</strong>
              <br />
              <span className="small">This vacancy is no longer open. See the latest openings instead.</span>
            </p>
            <Link className="btn" href={`/jobs/${a.country}/`}>
              Open {COUNTRIES[a.country].name} jobs →
            </Link>
          </div>
        ) : a.applyEmail ? (
          <div className="source-box">
            <p>
              <strong>Apply by email: {a.applyEmail}</strong>
              <br />
              <span className="small">Attach your CV and documents. Applying is free – never pay anyone for this job.</span>
            </p>
            <a className="btn" href={`mailto:${a.applyEmail}?subject=${encodeURIComponent(`Job application - ${a.organization || a.title}`)}`}>
              Send your CV ✉
            </a>
          </div>
        ) : a.applyUrl ? (
          <div className="source-box">
            <p>
              <strong>Apply only on the official site.</strong>
              <br />
              <span className="small">Never pay anyone for a job, interview or visa.</span>
            </p>
            <a className="btn" href={a.applyUrl} target="_blank" rel="noopener external">
              Apply on official site ↗
            </a>
          </div>
        ) : a.sourceUrl && a.sourceOfficial ? (
          <div className="source-box">
            <p><strong>Apply only through the official source.</strong></p>
            <a className="btn" href={a.sourceUrl} target="_blank" rel="noopener nofollow">
              Open official notice →
            </a>
          </div>
        ) : a.sourceUrl ? (
          <div className="source-box">
            <p>
              <strong>This article is based on a news report.</strong>
              <br />
              <span className="small">Confirm the details with the employer or authority before you act on them.</span>
            </p>
            <a className="btn" href={a.sourceUrl} target="_blank" rel="noopener nofollow">
              Read the source report →
            </a>
          </div>
        ) : null}
        {(a.applyUrl || a.applyEmail) && (a.category === "private-jobs" || a.category === "govt-jobs") && (
          <p className="small">
            More openings: <Link href={`/jobs/${a.country}/`}>all {COUNTRIES[a.country].name} jobs</Link> ·{" "}
            <Link href="/jobs/">jobs in every country</Link>
          </p>
        )}

        <ShareBar url={shareUrl} title={a.title} label="Share this update" />
        <FollowFacebook compact />

        {/* One short scam warning per article. The search keywords (frontmatter `tags`) stay in the page metadata only. */}
        <p className="notice">
          TheJobSeek is not a recruitment agency and never charges for jobs. Anyone asking you to pay for a job or visa is running a scam.
        </p>

        <div className="author-box">
          <AuthorAvatar author={author} size={48} className="avatar" />
          <div>
            <strong><Link href={`/author/${author.id}/`} rel="author">{author.name}</Link></strong>
            <div className="small muted">{author.role} · {author.location}</div>
            <p className="small">{author.bio}</p>
            <p className="small">
              <Link href={`/author/${author.id}/#how-i-verify`}>How stories are sourced and checked</Link>
              {author.linkedin && (
                <>
                  {" · "}
                  <a href={author.linkedin} target="_blank" rel="noopener me">LinkedIn</a>
                </>
              )}
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <SectionLabel first="Related" second="News" />
            <div className="related-grid">
              {related.map((r) => (
                <Story key={r.slug} a={r} variant="card" />
              ))}
            </div>
          </section>
        )}
        <JsonLd data={articleSchema(a)} />
        {faqSchema(a) && <JsonLd data={faqSchema(a)!} />}
      </article>
      <Sidebar exclude={a.slug} />
    </div>
  );
}
