import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import ArticleCard from "@/components/ArticleCard";
import JsonLd from "@/components/JsonLd";
import { getAllArticles, getArticle, getRelated, articlePath, formatDate, sourceDomain } from "@/lib/articles";
import { getAuthor } from "@/lib/authors";
import { articleSchema } from "@/lib/schema";
import { COUNTRIES, CATEGORIES, SITE } from "@/lib/site";

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
    title: a.title,
    description: a.description,
    keywords: a.tags,
    authors: [{ name: author.name, url: `${SITE.url}/author/${author.id}` }],
    alternates: { canonical: articlePath(a) },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      url: articlePath(a),
      publishedTime: a.date,
      modifiedTime: a.updated || a.date,
      section: COUNTRIES[a.country].name,
      tags: a.tags,
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

  return (
    <div className="grid">
      <article>
        <Breadcrumbs
          items={[
            { name: `${c.name} Job News`, path: `/${a.country}/` },
            { name: a.title, path: articlePath(a) },
          ]}
        />
        <header className="article-head">
          <Link href={`/category/${a.category}/`} className="tag tag-cat">
            {CATEGORIES[a.category].name}
          </Link>
          <h1>{a.title}</h1>
          <p className="lede">{a.description}</p>
          <div className="byline">
            <span>
              By <Link href={`/author/${author.id}/`} rel="author">{author.name}</Link>
            </span>
            <span>·</span>
            <time dateTime={a.date}>Published {formatDate(a.date)}</time>
            {a.updated && (
              <>
                <span>·</span>
                <time dateTime={a.updated}>Updated {formatDate(a.updated)}</time>
              </>
            )}
            <span>·</span>
            <span>{a.readingMinutes} min read</span>
          </div>
        </header>

        {hasKeyInfo && (
          <section className="keybox" aria-label="Key information">
            <table>
              <tbody>
                <tr><th>Country</th><td>{c.flag} {c.name}</td></tr>
                {a.organization && <tr><th>Organization</th><td>{a.organization}</td></tr>}
                {a.lastDate && <tr><th>Last date to apply</th><td><strong>{formatDate(a.lastDate)}</strong></td></tr>}
                {a.sourceUrl && (
                  <tr>
                    <th>Official source</th>
                    <td>
                      <a href={a.sourceUrl} target="_blank" rel="noopener nofollow">
                        {a.sourceName || "Official notice"}
                      </a>{" "}
                      <span className="stamp">✓ {sourceDomain(a)}</span>
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

        {a.sourceUrl && (
          <div className="source-box">
            <p><strong>Apply only through the official source.</strong></p>
            <a className="btn" href={a.sourceUrl} target="_blank" rel="noopener nofollow">
              Open official notice →
            </a>
          </div>
        )}

        <p className="notice">
          TheJobSeek never charges for jobs and is not a recruitment agency. If anyone asks you
          to pay for a job offer or visa in the name of this article, it is a scam.
        </p>

        {a.tags.length > 0 && (
          <div className="tags-row">
            {a.tags.map((t) => (
              <span key={t} className="tag tag-cat">{t}</span>
            ))}
          </div>
        )}

        <div className="author-box">
          <div className="avatar" aria-hidden>{author.name[0]}</div>
          <div>
            <strong><Link href={`/author/${author.id}/`}>{author.name}</Link></strong>
            <div className="small muted">{author.role}</div>
            <p className="small">{author.bio}</p>
          </div>
        </div>

        {related.length > 0 && (
          <section>
            <h2 className="section-title">Related job news</h2>
            <div className="cards">
              {related.map((r) => (
                <ArticleCard key={r.slug} a={r} />
              ))}
            </div>
          </section>
        )}
        <JsonLd data={articleSchema(a)} />
      </article>
      <Sidebar />
    </div>
  );
}
