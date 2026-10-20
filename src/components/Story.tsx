import Link from "next/link";
import { type Article, articlePath, formatDate, formatDateTime, isClosingSoon, sourceDomain } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

type Variant = "lead" | "side" | "river" | "compact";

function Kicker({ a }: { a: Article }) {
  return (
    <div className="kicker-row">
      <Link href={`/${a.country}/`} className="kicker">
        <span aria-hidden>{COUNTRIES[a.country].flag}</span> {COUNTRIES[a.country].name}
      </Link>
      <span className="kicker-sep" aria-hidden>/</span>
      <Link href={`/category/${a.category}/`} className="kicker kicker-muted">
        {CATEGORIES[a.category].name}
      </Link>
    </div>
  );
}

function Meta({ a, withTime = false }: { a: Article; withTime?: boolean }) {
  const domain = sourceDomain(a);
  const closing = isClosingSoon(a);
  return (
    <div className="story-meta">
      <time dateTime={a.date}>{withTime ? formatDateTime(a.date) : formatDate(a.date)}</time>
      {domain && (
        <span className="stamp" title={`Based on the official notice at ${domain}`}>
          ✓ {domain}
        </span>
      )}
      {a.lastDate && (
        <span className={closing ? "deadline-pill hot" : "deadline-pill"}>
          {closing ? "Closing soon" : "Last date"} · {formatDate(a.lastDate)}
        </span>
      )}
    </div>
  );
}

export default function Story({ a, variant = "river", excerptText }: { a: Article; variant?: Variant; excerptText?: string }) {
  if (variant === "compact") {
    return (
      <article className="story story-compact">
        <h3 className="story-title">
          <Link href={articlePath(a)}>{a.title}</Link>
        </h3>
        <div className="story-meta">
          <time dateTime={a.date}>{formatDate(a.date)}</time>
        </div>
      </article>
    );
  }
  const H = variant === "lead" ? "h2" : "h3";
  return (
    <article className={`story story-${variant}`}>
      <Kicker a={a} />
      <H className="story-title">
        <Link href={articlePath(a)}>{a.title}</Link>
      </H>
      {(variant === "lead" || variant === "river") && (
        <p className="story-deck">{variant === "river" && excerptText ? excerptText : a.description}</p>
      )}
      <Meta a={a} withTime={variant === "river"} />
    </article>
  );
}
