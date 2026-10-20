import Link from "next/link";
import { COUNTRIES, CATEGORIES, PRIMARY_COUNTRIES, SITE } from "@/lib/site";
import { countryCounts, getAllArticles, articlePath } from "@/lib/articles";
import TodayDate from "./TodayDate";

export default function Header() {
  const counts = countryCounts();
  const nav = PRIMARY_COUNTRIES.filter((c) => counts[c] && COUNTRIES[c]?.enabled).slice(0, 8);
  const latest = getAllArticles().slice(0, 3);
  return (
    <header className="site-header">
      <div className="utility">
        <div className="wrap utility-inner">
          <TodayDate />
          <span className="utility-note">Official sources only · Never pay for a job</span>
          {SITE.social.whatsapp && (
            <a href={SITE.social.whatsapp} rel="noopener" target="_blank" className="utility-link">
              WhatsApp alerts
            </a>
          )}
        </div>
      </div>

      <div className="wrap masthead">
        <Link href="/" className="logo" aria-label={`${SITE.name} home`}>
          <span className="logo-mark" aria-hidden>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="logo-word">
            The<strong>JobSeek</strong>
          </span>
        </Link>
        <p className="masthead-tag">Job &amp; work visa news, verified against the official notice</p>
        <Link href="/search/" className="search-btn" aria-label="Search news">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span>Search</span>
        </Link>
      </div>

      <nav aria-label="Sections" className="primary-nav">
        <div className="wrap nav-inner">
          <Link href="/">Home</Link>
          {nav.map((c) => (
            <Link key={c} href={`/${c}/`}>
              <span aria-hidden>{COUNTRIES[c].flag}</span> {COUNTRIES[c].name}
            </Link>
          ))}
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <Link key={k} href={`/category/${k}/`} className="nav-topic">
              {v.name}
            </Link>
          ))}
          <Link href="/countries/">All countries</Link>
        </div>
      </nav>

      {latest.length > 0 && (
        <div className="latest-strip" aria-label="Latest headlines">
          <div className="wrap latest-inner">
            <span className="latest-label">Latest</span>
            <ul>
              {latest.map((a) => (
                <li key={a.slug}>
                  <Link href={articlePath(a)}>{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
