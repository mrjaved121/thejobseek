import Link from "next/link";
import Story from "@/components/Story";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { getAllArticles, getByCountry, excerpt, articlePath, formatDate } from "@/lib/articles";
import { COUNTRIES, CATEGORIES, PRIMARY_COUNTRIES, enabledCountries } from "@/lib/site";

export default function Home() {
  const all = getAllArticles();
  if (!all.length) {
    return <p className="empty">The first updates are being prepared. Please check back soon.</p>;
  }
  const [lead, ...others] = all;
  const side = others.slice(0, 3);
  const river = others.slice(3, 23);
  const order = [...PRIMARY_COUNTRIES, ...enabledCountries.filter((c) => !PRIMARY_COUNTRIES.includes(c))];
  const sections = all.length > 8 ? order.filter((c) => getByCountry(c).length > 0).slice(0, 6) : [];

  return (
    <>
      <h1 className="visually-hidden">TheJobSeek – job and work visa news for the UAE, Gulf, Pakistan and abroad</h1>

      <section className="top-stories" aria-label="Top stories">
        <div className="top-lead">
          <Story a={lead} variant="lead" />
        </div>
        {side.length > 0 && (
          <div className="top-side">
            {side.map((a) => (
              <Story key={a.slug} a={a} variant="side" />
            ))}
          </div>
        )}
      </section>

      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />

      <div className="grid">
        <div>
          {river.length > 0 && (
            <section aria-labelledby="latest-news">
              <h2 id="latest-news" className="section-title">
                <span>Latest news</span>
              </h2>
              <div className="river">
                {river.map((a) => (
                  <Story key={a.slug} a={a} variant="river" excerptText={excerpt(a)} />
                ))}
              </div>
            </section>
          )}

          {sections.length > 0 && (
            <section aria-labelledby="by-country">
              <h2 id="by-country" className="section-title">
                <span>By country</span>
              </h2>
              <div className="section-blocks">
                {sections.map((c) => {
                  const [first, ...more] = getByCountry(c);
                  return (
                    <div key={c} className="section-block">
                      <h3 className="block-title">
                        <Link href={`/${c}/`}>
                          <span aria-hidden>{COUNTRIES[c].flag}</span> {COUNTRIES[c].name}
                        </Link>
                      </h3>
                      <Story a={first} variant="side" />
                      <ul className="block-list">
                        {more.slice(0, 3).map((a) => (
                          <li key={a.slug}>
                            <Link href={articlePath(a)}>{a.title}</Link>
                            <time dateTime={a.date}>{formatDate(a.date)}</time>
                          </li>
                        ))}
                      </ul>
                      <Link href={`/${c}/`} className="block-more">More {COUNTRIES[c].name} news →</Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {river.length < 5 && (
            <section aria-labelledby="topics">
              <h2 id="topics" className="section-title">
                <span>Browse by topic</span>
              </h2>
              <ul className="topic-tiles">
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <li key={k}>
                    <Link href={`/category/${k}/`}>
                      <strong>{v.name}</strong>
                      <span>{v.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
