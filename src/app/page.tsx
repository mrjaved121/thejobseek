import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import { getAllArticles, getByCountry, sourceDomain } from "@/lib/articles";
import { COUNTRIES, PRIMARY_COUNTRIES, enabledCountries } from "@/lib/site";

export const revalidate = 600;

export default function Home() {
  const all = getAllArticles();
  const [lead, ...rest] = all;
  const weekAgo = Date.now() - 7 * 86400000;
  const thisWeek = all.filter((a) => new Date(a.date).getTime() >= weekAgo).length;
  const sources = new Set(all.map(sourceDomain).filter(Boolean)).size;
  const order = [...PRIMARY_COUNTRIES, ...enabledCountries.filter((c) => !PRIMARY_COUNTRIES.includes(c))];

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">Job &amp; work visa news</p>
        <h1 id="hero-title" className="hero-title">
          Today&apos;s job and work visa updates, checked against the official notice.
        </h1>
        <p className="hero-sub">
          Recruitment, government jobs and visa rule changes for the UAE, the Gulf, Pakistan,
          the UK, Canada, the USA, Australia and Europe. Every story links to the source so you
          can apply directly.
        </p>
        <dl className="hero-facts">
          <div><dt>Updates this week</dt><dd>{thisWeek}</dd></div>
          {sources > 0 && <div><dt>Official sources cited</dt><dd>{sources}</dd></div>}
          <div><dt>Cost to job seekers</dt><dd>Free</dd></div>
        </dl>
      </section>

      <div className="grid">
        <div>
          {lead ? <ArticleCard a={lead} lead /> : <p>No updates published yet.</p>}
          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />
          {rest.length > 0 && (
            <section aria-labelledby="latest">
              <h2 id="latest" className="section-title">Latest updates</h2>
              <div className="cards">
                {rest.slice(0, 8).map((a) => (
                  <ArticleCard key={a.slug} a={a} />
                ))}
              </div>
            </section>
          )}
          {order.map((c) => {
            const items = getByCountry(c).slice(0, 4);
            if (!items.length || !COUNTRIES[c]) return null;
            return (
              <section key={c} aria-labelledby={`sec-${c}`}>
                <h2 id={`sec-${c}`} className="section-title">
                  <span><span aria-hidden>{COUNTRIES[c].flag}</span> {COUNTRIES[c].name}</span>
                  <Link href={`/${c}`} className="section-more">All {COUNTRIES[c].name} news →</Link>
                </h2>
                <div className="cards">
                  {items.map((a) => (
                    <ArticleCard key={a.slug} a={a} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
