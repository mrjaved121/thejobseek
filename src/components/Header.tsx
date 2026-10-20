import Link from "next/link";
import { COUNTRIES, CATEGORIES, PRIMARY_COUNTRIES, SITE } from "@/lib/site";
import { countryCounts } from "@/lib/articles";

export default function Header() {
  const counts = countryCounts();
  const nav = PRIMARY_COUNTRIES.filter((c) => counts[c] && COUNTRIES[c]?.enabled).slice(0, 7);
  return (
    <header className="site-header">
      <div className="wrap brand-row">
        <Link href="/" className="logo" aria-label={`${SITE.name} home`}>
          <span className="logo-mark" aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="logo-word">
            The<strong>JobSeek</strong>
          </span>
        </Link>
        <p className="brand-note">{SITE.tagline}</p>
        {SITE.social.whatsapp && (
          <a className="btn btn-small" href={SITE.social.whatsapp} rel="noopener" target="_blank">
            Get alerts on WhatsApp
          </a>
        )}
      </div>
      <nav aria-label="Countries" className="country-nav">
        <div className="wrap nav-inner">
          <Link href="/">Latest</Link>
          {nav.map((c) => (
            <Link key={c} href={`/${c}/`}>
              <span aria-hidden>{COUNTRIES[c].flag}</span> {COUNTRIES[c].name}
            </Link>
          ))}
          <Link href="/countries/">All countries →</Link>
        </div>
      </nav>
      <nav aria-label="Topics" className="cat-nav">
        <div className="wrap nav-inner">
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <Link key={k} href={`/category/${k}/`}>
              {v.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
