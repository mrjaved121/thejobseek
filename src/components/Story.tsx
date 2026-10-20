import Link from "next/link";
import { type Article, articlePath, formatDate, isClosingSoon, sourceDomain } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";
import Thumb from "./Thumb";

type Variant = "lead" | "card" | "list" | "river" | "text";

function Meta({ a }: { a: Article }) {
  const domain = sourceDomain(a);
  const closing = isClosingSoon(a);
  return (
    <div className="story-meta">
      <time dateTime={a.date}>{formatDate(a.date)}</time>
      {domain && (
        <span className="stamp" title={`Source: ${domain}`}>
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

function Kicker({ a }: { a: Article }) {
  return (
    <div className="kicker-row">
      <Link href={`/${a.country}/`} className="kicker">
        {COUNTRIES[a.country].name}
      </Link>
      <span className="kicker-sep" aria-hidden>|</span>
      <Link href={`/category/${a.category}/`} className="kicker kicker-muted">
        {CATEGORIES[a.category].name}
      </Link>
    </div>
  );
}

/** One story in one of the front-page shapes. The whole block is clickable via the title link. */
export default function Story({ a, variant = "card", priority = false }: { a: Article; variant?: Variant; priority?: boolean }) {
  const href = articlePath(a);

  if (variant === "text") {
    return (
      <article className="story story-text">
        <h3 className="story-title"><Link href={href}>{a.title}</Link></h3>
        <Meta a={a} />
      </article>
    );
  }

  if (variant === "list") {
    return (
      <article className="story story-list">
        <Link href={href} tabIndex={-1} aria-hidden className="story-media"><Thumb a={a} size="sm" /></Link>
        <div className="story-body">
          <h3 className="story-title"><Link href={href}>{a.title}</Link></h3>
          <div className="story-meta"><time dateTime={a.date}>{formatDate(a.date)}</time></div>
        </div>
      </article>
    );
  }

  if (variant === "river") {
    return (
      <article className="story story-river">
        <Link href={href} tabIndex={-1} aria-hidden className="story-media"><Thumb a={a} size="md" /></Link>
        <div className="story-body">
          <Kicker a={a} />
          <h3 className="story-title"><Link href={href}>{a.title}</Link></h3>
          <p className="story-deck">{a.description}</p>
          <Meta a={a} />
        </div>
      </article>
    );
  }

  const H = variant === "lead" ? "h2" : "h3";
  return (
    <article className={`story story-${variant}`}>
      <Link href={href} tabIndex={-1} aria-hidden className="story-media">
        <Thumb a={a} size={variant === "lead" ? "lg" : "md"} priority={priority} />
      </Link>
      <div className="story-body">
        {variant === "lead" && <Kicker a={a} />}
        <H className="story-title"><Link href={href}>{a.title}</Link></H>
        {variant === "lead" && <p className="story-deck">{a.description}</p>}
        <Meta a={a} />
      </div>
    </article>
  );
}
