import Link from "next/link";
import { COUNTRIES, PRIMARY_COUNTRIES, SITE } from "@/lib/site";

import { countryCounts } from "@/lib/articles";
import TodayDate from "./TodayDate";
import NavLinks from "./NavLinks";



const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d}
  </svg>
);

export default function Header() {
  const counts = countryCounts();
  const nav = PRIMARY_COUNTRIES.filter((c) => counts[c] && COUNTRIES[c]?.enabled);
  return (
    <header className="site-header">
      <div className="utility">
        <div className="wrap utility-inner">
          <TodayDate />
          <span className="utility-sep" aria-hidden>|</span>
          <span className="utility-note">Job &amp; work visa news for the Gulf and the world</span>
        </div>
      </div>

      <div className="wrap masthead">
        <div className="tiles tiles-left">
          <Link href="/jobs/" className="tile">
            <Icon d={<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>} />
            <span>Jobs</span>
          </Link>
          <Link href="/category/visa-labour-law/" className="tile">
            <Icon d={<><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M8.5 17h7" /></>} />
            <span>Visa</span>
          </Link>
        </div>

        <Link href="/" className="logo">
          <span className="logo-word">
            <span className="logo-check" aria-hidden>✓</span>The<strong>JobSeek</strong>
          </span>
          <span className="logo-tag">{SITE.tagline}</span>
        </Link>

        <div className="tiles tiles-right">
          <Link href="/category/guides/" className="tile">
            <Icon d={<><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /></>} />
            <span>Guides</span>
          </Link>
          {SITE.social.whatsapp ? (
            <a href={SITE.social.whatsapp} className="tile tile-gold" target="_blank" rel="noopener">
              <Icon d={<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />} />
              <span>Alerts</span>
            </a>
          ) : (
            <Link href="/countries/" className="tile tile-gold">
              <Icon d={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>} />
              <span>World</span>
            </Link>
          )}
        </div>
      </div>

      <nav aria-label="Sections" className="primary-nav">
        <div className="wrap nav-row">
          <Link href="/countries/" className="nav-icon" aria-label="All countries and sections">
            <Icon d={<path d="M4 7h16M4 12h16M4 17h16" />} />
          </Link>
          <div className="nav-inner">
            <NavLinks items={[{ href: "/", label: "Home" }, { href: "/jobs/", label: "Jobs" }, ...nav.map((c) => ({ href: `/${c}/`, label: COUNTRIES[c].name }))]} />
          </div>
          <Link href="/search/" className="nav-icon" aria-label="Search news">
            <Icon d={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
