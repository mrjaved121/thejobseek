import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import JobCard from "@/components/JobCard";
import ApplySafely from "@/components/ApplySafely";
import JsonLd from "@/components/JsonLd";
import { getJobs, jobCountries } from "@/lib/jobs";
import { COUNTRIES, COUNTRY_PHOTOS, countryPhoto, countryShareImage } from "@/lib/site";
import { listRobots, listOpenGraph } from "@/lib/seo";
import { collectionSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return jobCountries().map(({ country }) => ({ country }));
}

type Props = { params: Promise<{ country: string }> };

const OVERSEAS = ["uk", "usa", "canada", "australia", "europe"];

const texts = (c: string, n: number) => {
  const name = COUNTRIES[c].name;
  return {
    title: OVERSEAS.includes(c)
      ? `${name} Jobs for Foreigners: Hiring & Apply Links`
      : `${name} Jobs: Latest Hiring & Apply Links`,
    description: `${n} open ${name} jobs from verified hiring news: government and private sector, each with the official apply link and closing date. Updated daily.`,
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  if (!COUNTRIES[country]) return {};
  const n = getJobs(country).length;
  const t = texts(country, n);
  const share = countryShareImage(country);
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/jobs/${country}/` },
    robots: listRobots(n > 0),
    openGraph: listOpenGraph(t.title, t.description, `/jobs/${country}/`, share ? { url: share, alt: COUNTRY_PHOTOS[country] } : undefined),
  };
}

export default async function CountryJobs({ params }: Props) {
  const { country } = await params;
  const c = COUNTRIES[country];
  if (!c) notFound();
  const jobs = getJobs(country);
  const gov = jobs.filter((a) => a.category === "govt-jobs");
  const priv = jobs.filter((a) => a.category === "private-jobs");
  const t = texts(country, jobs.length);
  const photo = countryPhoto(country);
  const others = jobCountries().filter((x) => x.country !== country);
  const sections = [
    { id: "private", title: `Private sector jobs in ${c.name}`, items: priv },
    { id: "government", title: `Government jobs in ${c.name}`, items: gov },
  ].filter((s) => s.items.length > 0);

  return (
    <>
      <JsonLd data={collectionSchema(t.title, t.description, `/jobs/${country}/`, jobs)} />
      <div className={`section-head${photo ? " has-banner" : ""}`}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="banner-img" src={photo} alt={COUNTRY_PHOTOS[country]} width={640} height={200} fetchPriority="high" decoding="async" />
        )}
        <Breadcrumbs items={[{ name: "Jobs", path: "/jobs/" }, { name: `${c.name} jobs`, path: `/jobs/${country}/` }]} />
        <p className="eyebrow">Jobs</p>
        <h1 className="section-h1">{c.name} jobs</h1>
        <p className="lede">
          {jobs.length} open hiring {jobs.length === 1 ? "announcement" : "announcements"} in {c.name}
          {priv.length > 0 && gov.length > 0 ? ` (${priv.length} private sector, ${gov.length} government)` : ""}. Each
          story is checked against its source and links to the official place to apply. Updated every morning.
        </p>
      </div>
      <div className="grid">
        <div>
          {sections.length > 1 && (
            <nav aria-label="Job types" className="job-chips">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="job-chip">
                  {s.id === "government" ? "Government" : "Private sector"} <span>{s.items.length}</span>
                </a>
              ))}
            </nav>
          )}

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="job-section">
              <h2 className="job-section-title">{s.title}</h2>
              <div className="job-list">
                {s.items.map((a) => (
                  <JobCard key={a.slug} a={a} showCountry={false} />
                ))}
              </div>
              {i === 0 && <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />}
            </section>
          ))}

          <ApplySafely />

          <section className="job-about">
            <h2>More from {c.name}</h2>
            <p>
              For work visa rules, labour law updates and job-market news, see all{" "}
              <Link href={`/${country}/`}>{c.name} news</Link>.
            </p>
            {others.length > 0 && (
              <>
                <h3>Jobs in other countries</h3>
                <nav aria-label="Jobs in other countries" className="job-chips">
                  {others.map(({ country: o, count }) => (
                    <Link key={o} href={`/jobs/${o}/`} className="job-chip">
                      {COUNTRIES[o].name} <span>{count}</span>
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </section>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
