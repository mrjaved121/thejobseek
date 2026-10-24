import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/Sidebar";
import AdSlot from "@/components/AdSlot";
import JobCard from "@/components/JobCard";
import ApplySafely from "@/components/ApplySafely";
import JsonLd from "@/components/JsonLd";
import { getJobs, jobCountries } from "@/lib/jobs";
import { COUNTRIES } from "@/lib/site";
import { listRobots, listOpenGraph } from "@/lib/seo";
import { collectionSchema } from "@/lib/schema";

const TITLE = "Jobs in the UAE, Gulf & Worldwide – Latest Hiring with Official Apply Links";
const DESC =
  "Latest verified hiring news from the UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, the UK, USA, Canada, Australia and Europe, with the employer's official apply link and closing date.";

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
  return (
    <>
      <JsonLd data={collectionSchema(TITLE, DESC, "/jobs/", jobs)} />
      <div className="section-head">
        <Breadcrumbs items={[{ name: "Jobs", path: "/jobs/" }]} />
        <p className="eyebrow">Jobs</p>
        <h1 className="section-h1">Jobs in the UAE, Gulf &amp; worldwide</h1>
        <p className="lede">
          {jobs.length} open hiring announcements, checked against their source. Each one links to the
          employer&apos;s or government&apos;s own careers page, so you apply directly. Updated every morning.
        </p>
      </div>
      <div className="grid">
        <div>
          <nav aria-label="Jobs by country" className="job-chips">
            {countries.map(({ country, count }) => (
              <Link key={country} href={`/jobs/${country}/`} className="job-chip">
                {COUNTRIES[country].name} jobs <span>{count}</span>
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
              list a story only when it comes from an official notice or a reliable news source, and we link to
              the official application page whenever one exists. Jobs disappear from this page once their closing
              date has passed.
            </p>
          </section>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
