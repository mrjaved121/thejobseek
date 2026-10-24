import Link from "next/link";
import { type Article, articlePath, formatDate, isClosingSoon } from "@/lib/articles";
import { applyDomain } from "@/lib/jobs";
import { COUNTRIES } from "@/lib/site";
import Thumb from "./Thumb";

/** One hiring story in the Jobs hub: who is hiring, where, deadline, and the official apply link. */
export default function JobCard({ a, showCountry = true }: { a: Article; showCountry?: boolean }) {
  const href = articlePath(a);
  const domain = applyDomain(a);
  const closing = isClosingSoon(a);
  return (
    <article className="job-card">
      <Link href={href} tabIndex={-1} aria-hidden className="job-media">
        <Thumb a={a} size="sm" />
      </Link>
      <div className="job-body">
        <div className="job-tags">
          <span className={a.category === "govt-jobs" ? "job-type gov" : "job-type"}>
            {a.category === "govt-jobs" ? "Government" : "Private sector"}
          </span>
          {showCountry && <span className="job-country">{COUNTRIES[a.country].name}</span>}
        </div>
        <h3 className="job-title">
          <Link href={href}>{a.title}</Link>
        </h3>
        <dl className="job-facts">
          {a.organization && (
            <div>
              <dt>Employer</dt>
              <dd>{a.organization}</dd>
            </div>
          )}
          <div>
            <dt>Posted</dt>
            <dd><time dateTime={a.date}>{formatDate(a.date)}</time></dd>
          </div>
          {a.lastDate && (
            <div>
              <dt>Closes</dt>
              <dd className={closing ? "hot" : undefined}>{formatDate(a.lastDate)}</dd>
            </div>
          )}
        </dl>
        <div className="job-actions">
          <Link href={href} className="btn btn-ghost">Read details</Link>
          {a.applyUrl ? (
            <a href={a.applyUrl} className="btn" target="_blank" rel="noopener external">
              Apply on official site ↗
            </a>
          ) : (
            <span className="job-note">How to apply is explained in the article</span>
          )}
        </div>
        {domain && <p className="job-domain">Official site: {domain}</p>}
      </div>
    </article>
  );
}
