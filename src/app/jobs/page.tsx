import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import JobCard from "@/components/JobCard";
import ApplySafely from "@/components/ApplySafely";
import JsonLd from "@/components/JsonLd";
import { getJobs, jobCountries } from "@/lib/jobs";
import { getAllArticles } from "@/lib/articles";
import { COUNTRIES } from "@/lib/site";
import { listRobots, listOpenGraph } from "@/lib/seo";
import { collectionSchema } from "@/lib/schema";

const TITLE = "Jobs in UAE, Gulf & Worldwide – Official Apply Links";
const DESC =
  "Latest hiring news from the UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, UK, USA, Canada, Australia and Europe, with official apply links.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/jobs/" },
  robots: listRobots(true),
  openGraph: listOpenGraph(TITLE, DESC, "/jobs/"),
};

const PER_COUNTRY = 4;

export default function JobsHub() {
  const jobs = getJobs();
  const countries = jobCountries();
  const published = getAllArticles().length;
  return (
    <>
      <JsonLd data={collectionSchema(TITLE, DESC, "/jobs/", jobs)} />
      <div className="section-head">
        <Breadcrumbs items={[{ name: "Jobs", path: "/jobs/" }]} />
        <p className="eyebrow">Jobs</p>
        <h1 className="section-h1">Jobs in the UAE, Gulf &amp; worldwide</h1>
        <p className="lede">
          <strong>{jobs.length} open hiring announcements</strong>: job stories whose closing date has not passed.
          (The site has {published} published articles in total, which also counts visa news, guides and closed jobs.)
          Each story links to its source, and to the employer&apos;s or government&apos;s own application page where one exists.
        </p>
      </div>
      <div className="grid">
        <div>
          <nav aria-label="Jobs by country" className="job-chips">
            {countries.map(({ country, count }) => (
              <Link key={country} href={`/jobs/${country}/`} className="job-chip">
                {COUNTRIES[country].name} jobs <span title={`${count} open`}>{count}</span>
              </Link>
            ))}
          </nav>

          {countries.map(({ country, count }, i) => {
            const items = jobs.filter((a) => a.country === country).slice(0, PER_COUNTRY);
            return (
              <section key={country} className="job-section">
                <h2 className="job-section-title">
                  <Link href={`/jobs/${country}/`}>{COUNTRIES[country].name} jobs</Link>
                </h2>
                <div className="job-list">
                  {items.map((a) => (
                    <JobCard key={a.slug} a={a} showCountry={false} />
                  ))}
                </div>
                {count > items.length && (
                  <p className="more-link">
                    <Link href={`/jobs/${country}/`}>See all {count} {COUNTRIES[country].name} jobs →</Link>
                  </p>
                )}
                {i === 1 && <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />}
              </section>
            );
          })}

          <ApplySafely />

          <section className="job-about">
            <h2>About these listings</h2>
            <p>
              TheJobSeek is a news site, not a recruitment agency. This page collects our reports on real hiring
              announcements: companies and governments opening new jobs, recruitment drives and job fairs. We
              list a story when it comes from an official notice or a news report that we name and link, and we link to
              the official application page whenever one exists. Posts marked <strong>Employer job post</strong> are
              job ads sent to us directly by the hiring company; for those, CVs emailed to info@thejobseek.com are
              forwarded only to that employer. Applying is always free. Jobs disappear from this page once their
              closing date has passed or the employer tells us the vacancy is filled.
            </p>
          </section>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
