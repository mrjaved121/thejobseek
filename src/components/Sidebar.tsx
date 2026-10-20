import Link from "next/link";
import { getAllArticles, articlePath, isClosingSoon, formatDate, countryCounts } from "@/lib/articles";
import { COUNTRIES, PRIMARY_COUNTRIES, enabledCountries, SITE } from "@/lib/site";
import AdSlot from "./AdSlot";
import SectionLabel from "./SectionLabel";

export default function Sidebar({ exclude }: { exclude?: string }) {
  const all = getAllArticles();
  const counts = countryCounts();
  const latest = all.filter((a) => a.slug !== exclude).slice(0, 5);
  const closing = all
    .filter(isClosingSoon)
    .sort((a, b) => (a.lastDate || "").localeCompare(b.lastDate || ""))
    .slice(0, 5);
  const order = [...PRIMARY_COUNTRIES, ...enabledCountries.filter((c) => !PRIMARY_COUNTRIES.includes(c))];
  const withNews = order.filter((c) => counts[c]);

  return (
    <aside className="sidebar" aria-label="More from TheJobSeek">
      <section>
        <SectionLabel first="Latest" second="Updates" />
        <ol className="numbered">
          {latest.map((a) => (
            <li key={a.slug}>
              <Link href={articlePath(a)}>{a.title}</Link>
            </li>
          ))}
        </ol>
      </section>

      {closing.length > 0 && (
        <section>
          <SectionLabel first="Closing" second="Soon" />
          <ul className="deadline-list">
            {closing.map((a) => (
              <li key={a.slug}>
                <span className="deadline-date">Last date · {formatDate(a.lastDate!)}</span>
                <Link href={articlePath(a)}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} format="rectangle" minHeight={250} />

      {withNews.length > 0 && (
        <section>
          <SectionLabel first="By" second="Country" />
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
        </section>
      )}

      <div className="promo-box">
        <p className="promo-title">How we report</p>
        <p>
          Every story is based on an official notice or decision and links to its source with a{" "}
          <span className="stamp">✓ source</span> stamp. We never charge for jobs or visas.
        </p>
        {SITE.social.whatsapp ? (
          <a className="btn btn-gold" href={SITE.social.whatsapp} target="_blank" rel="noopener">
            Get free WhatsApp alerts
          </a>
        ) : (
          <Link className="btn btn-gold" href="/editorial-policy/">Read our editorial policy</Link>
        )}
      </div>
    </aside>
  );
}
