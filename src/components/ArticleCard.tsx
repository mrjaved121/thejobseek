import Link from "next/link";
import { type Article, articlePath, formatDate, isClosingSoon, sourceDomain } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

export default function ArticleCard({ a, lead = false }: { a: Article; lead?: boolean }) {
  const HeadingTag = lead ? "h2" : "h3";
  const domain = sourceDomain(a);
  const closing = isClosingSoon(a);
  return (
    <article className={lead ? "card card-lead" : "card"}>
      <div className="card-meta">
        <Link href={`/${a.country}/`} className="kicker">
          <span aria-hidden>{COUNTRIES[a.country].flag}</span> {COUNTRIES[a.country].name}
        </Link>
        <span className="dot" aria-hidden>·</span>
        <Link href={`/category/${a.category}/`} className="kicker kicker-muted">
          {CATEGORIES[a.category].name}
        </Link>
      </div>
      <HeadingTag className="card-title">
        <Link href={articlePath(a)}>{a.title}</Link>
      </HeadingTag>
      {lead && <p className="card-desc">{a.description}</p>}
      <div className="card-foot">
        <time dateTime={a.date}>{formatDate(a.date)}</time>
        {domain && (
          <span className="stamp" title={`Based on the official notice at ${domain}`}>
            ✓ {domain}
          </span>
        )}
      </div>
      {a.lastDate && (
        <div className={closing ? "deadline deadline-hot" : "deadline"}>
          {closing ? "Closing soon · " : "Last date · "}
          <time dateTime={a.lastDate}>{formatDate(a.lastDate)}</time>
        </div>
      )}
    </article>
  );
}
