import Link from "next/link";
import Story from "@/components/Story";
import AdSlot from "@/components/AdSlot";
import SectionLabel from "@/components/SectionLabel";
import { getAllArticles, getByCountry, articlePath, formatDate, isClosingSoon } from "@/lib/articles";
import { COUNTRIES, PRIMARY_COUNTRIES, SITE } from "@/lib/site";

export default function Home() {
  const all = getAllArticles();
  if (!all.length) {
    return <p className="empty">The first updates are being prepared. Please check back soon.</p>;
  }

  const [lead, ...rest] = all;
  const underLead = rest.slice(0, 2);
  const middle = rest.slice(2, 10);
  const latest = all.slice(0, 6);
  const closing = all
    .filter(isClosingSoon)
    .sort((a, b) => (a.lastDate || "").localeCompare(b.lastDate || ""))
    .slice(0, 4);

  const sections = PRIMARY_COUNTRIES.filter((c) => getByCountry(c).length > 0);

  return (
    <>
      <h1 className="visually-hidden">TheJobSeek – job and work visa news for the UAE and the Gulf</h1>

      {/* ===== Top block: lead | headlines list | latest + alerts ===== */}
      <section className="top-grid" aria-label="Top stories">
        <div className="top-a">
          <Story a={lead} variant="lead" priority />
          {underLead.length > 0 && (
            <div className="two-cards">
              {underLead.map((a) => (
                <Story key={a.slug} a={a} variant="card" />
              ))}
            </div>
          )}
        </div>

        {middle.length > 0 && (
          <div className="top-b">
            {middle.map((a) => (
              <Story key={a.slug} a={a} variant="list" />
            ))}
          </div>
        )}

        <aside className="top-c" aria-label="Latest and alerts">
          <SectionLabel first="Latest" second="Updates" />
          <ol className="numbered">
            {latest.map((a) => (
              <li key={a.slug}>
                <Link href={articlePath(a)}>{a.title}</Link>
              </li>
            ))}
          </ol>

          {closing.length > 0 && (
            <>
              <SectionLabel first="Closing" second="Soon" />
              <ul className="deadline-list">
                {closing.map((a) => (
                  <li key={a.slug}>
                    <span className="deadline-date">Last date · {formatDate(a.lastDate!)}</span>
                    <Link href={articlePath(a)}>{a.title}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="promo-box">
            <p className="promo-title">Don&apos;t miss a job or visa update</p>
            <p>Every story is checked against the official notice and links to its source.</p>
            {SITE.social.whatsapp ? (
              <a className="btn btn-gold" href={SITE.social.whatsapp} target="_blank" rel="noopener">
                Get free WhatsApp alerts
              </a>
            ) : (
              <Link className="btn btn-gold" href="/search/">Search all updates</Link>
            )}
          </div>
        </aside>
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />

      {/* ===== Country sections ===== */}
      {sections.map((c) => {
        const items = getByCountry(c);
        const [first, ...more] = items;
        return (
          <section key={c} className="country-section" aria-labelledby={`sec-${c}`}>
            <div className="section-bar">
              <SectionLabel first={COUNTRIES[c].name} second="News" href={`/${c}/`} id={`sec-${c}`} />
              <Link href={`/${c}/`} className="section-more">More {COUNTRIES[c].name} news →</Link>
            </div>
            <div className={more.length ? "section-grid" : "section-grid single"}>
              <Story a={first} variant="lead" />
              {more.length > 0 && (
                <div className="section-cards">
                  {more.slice(0, 4).map((a) => (
                    <Story key={a.slug} a={a} variant="card" />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
