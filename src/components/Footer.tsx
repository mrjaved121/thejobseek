import Link from "next/link";
import { COUNTRIES, CATEGORIES, enabledCountries, SITE } from "@/lib/site";
import { countryCounts } from "@/lib/articles";

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(SITE.social).filter(([, v]) => v);
  const counts = countryCounts();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-logo">
            The<strong>JobSeek</strong>
          </p>
          <p>{SITE.description}</p>
          <p className="muted small">
            TheJobSeek is an independent news site. We are not a recruitment agency and never
            charge job seekers for jobs. Always apply through the official source linked in
            each article.
          </p>
        </div>
        <div>
          <h3>Sections</h3>
          <ul>
            {enabledCountries.filter((c) => counts[c]).map((c) => (
              <li key={c}>
                <Link href={`/${c}/`}>{COUNTRIES[c].name} Job News</Link>
              </li>
            ))}
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <li key={k}>
                <Link href={`/category/${k}/`}>{v.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>About</h3>
          <ul>
            <li><Link href="/countries/">All countries</Link></li>
            <li><Link href="/about/">About Us</Link></li>
            <li><Link href="/contact/">Contact</Link></li>
            <li><Link href="/editorial-policy/">Editorial Policy</Link></li>
            <li><Link href="/privacy-policy/">Privacy Policy</Link></li>
            <li><Link href="/terms/">Terms of Use</Link></li>
            <li><Link href="/disclaimer/">Disclaimer</Link></li>
            <li><a href="/feed.xml">RSS Feed</a></li>
          </ul>
          {socials.length > 0 && (
            <>
              <h3>Follow</h3>
              <ul className="inline-list">
                {socials.map(([k, v]) => (
                  <li key={k}>
                    <a href={v} rel="noopener me" target="_blank">
                      {k[0].toUpperCase() + k.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="wrap copyright">© {year} {SITE.name}. All rights reserved.</div>
    </footer>
  );
}
