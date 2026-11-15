import Link from "next/link";
import { getAllArticles, articlePath, isClosingSoon, formatDate, countryCounts } from "@/lib/articles";
import { COUNTRIES, COUNTRY_CODES, PRIMARY_COUNTRIES, enabledCountries, SITE, ESSENTIAL_GUIDES } from "@/lib/site";
import AdSlot from "./AdSlot";
import SectionLabel from "./SectionLabel";
import FollowFacebook from "./FollowFacebook";

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

      <FollowFacebook />

      <section>
        <SectionLabel first="Essential" second="UAE Guides" />
        <ul className="guide-list">
          {ESSENTIAL_GUIDES.filter((g) => g.slug !== exclude).map((g) => (
            <li key={g.slug}>
              <Link href={`/${g.country}/${g.slug}/`}>{g.label}</Link>
            </li>
          ))}
        </ul>
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
          <SectionLabel first="All news" second="By country" />
          <p className="small muted country-list-note">
            {all.length} published articles in total (news, guides and job stories, including closed ones). Open jobs are counted on the{" "}
            <Link href="/jobs/">Jobs page</Link>.
          </p>
          <ul className="country-list">
            {withNews.map((c) => (
              <li key={c}>
                <Link href={`/${c}/`}>
                  <span className="code-badge" aria-hidden>{COUNTRY_CODES[c]}</span> {COUNTRIES[c].name}
                </Link>{" "}
                <span className="count" title={`${counts[c]} published articles`}>{counts[c]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="promo-box">
        <p className="promo-title">How we report</p>
        <p>
          Every story links to the source it is based on. A <span className="stamp">✓</span> stamp marks an employer&apos;s
          or government&apos;s own website; press reports are labelled &quot;Source&quot;. We never charge for jobs or visas.
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
