import Link from "next/link";
import { getAllArticles, articlePath, isClosingSoon, formatDate, countryCounts } from "@/lib/articles";
import { COUNTRIES, PRIMARY_COUNTRIES, enabledCountries, SITE } from "@/lib/site";
import AdSlot from "./AdSlot";

export default function Sidebar() {
  const all = getAllArticles();
  const counts = countryCounts();
  const closing = all
    .filter(isClosingSoon)
    .sort((a, b) => (a.lastDate || "").localeCompare(b.lastDate || ""))
    .slice(0, 6);
  const order = [...PRIMARY_COUNTRIES, ...enabledCountries.filter((c) => !PRIMARY_COUNTRIES.includes(c))];
  const withNews = order.filter((c) => counts[c]);

  return (
    <aside className="sidebar" aria-label="More from TheJobSeek">
      {closing.length > 0 && (
        <section className="side-box side-deadlines">
          <h2 className="side-title">Closing this week</h2>
          <ul className="deadline-list">
            {closing.map((a) => (
              <li key={a.slug}>
                <span className="deadline-date">{formatDate(a.lastDate!)}</span>
                <Link href={articlePath(a)}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} format="rectangle" minHeight={250} />

      {withNews.length > 0 && (
        <section className="side-box">
          <h2 className="side-title">News by country</h2>
          <ul className="country-list">
            {withNews.map((c) => (
              <li key={c}>
                <Link href={`/${c}/`}>
                  <span aria-hidden>{COUNTRIES[c].flag}</span> {COUNTRIES[c].name}
                </Link>
                <span className="count">{counts[c]}</span>
              </li>
            ))}
          </ul>
          <Link href="/countries/" className="side-more">All countries →</Link>
        </section>
      )}

      <section className="side-box side-trust">
        <h2 className="side-title">How we report</h2>
        <p>
          Every story is written from an official notice and links to it with a{" "}
          <span className="stamp">✓ source</span> stamp, so you can check it and apply directly.
        </p>
        <p className="small">
          We never charge for jobs or visas. <Link href="/editorial-policy/">Editorial policy</Link>
        </p>
      </section>

      {SITE.social.whatsapp && (
        <section className="side-box side-alert">
          <h2 className="side-title">Free job alerts</h2>
          <p className="small">New UAE, Gulf and Pakistan updates on WhatsApp.</p>
          <a className="btn btn-wa" href={SITE.social.whatsapp} target="_blank" rel="noopener">
            Join the WhatsApp channel
          </a>
        </section>
      )}
    </aside>
  );
}
