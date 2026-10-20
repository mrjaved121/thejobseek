import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${SITE.name}: who we are, what we cover and how we verify job news for the UAE and Pakistan.`,
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <StaticPage title="About TheJobSeek" path="/about/">
      <p>
        {SITE.name} is an independent job news website for people looking for work in the
        United Arab Emirates, the Gulf, Pakistan and abroad. Every day we publish recruitment announcements,
        government job notices, exam and result updates, and changes to labour and visa rules
        that affect workers.
      </p>
      <h2>What we cover</h2>
      <ul>
        <li><strong>UAE:</strong> hiring news from Dubai, Abu Dhabi, Sharjah and the other emirates, labour law and work visa updates, and practical guides for expat job seekers.</li>
        <li><strong>Gulf:</strong> labour, residency and work visa updates from Saudi Arabia, Qatar, Kuwait, Oman and Bahrain.</li>
        <li><strong>Pakistan and India:</strong> federal and provincial government jobs (FPSC, PPSC, SPSC, KPPSC, BPSC, UPSC), testing services, exam schedules and results.</li>
        <li><strong>UK, USA, Canada, Australia and Europe:</strong> official work visa and immigration changes that matter to overseas workers.</li>
      </ul>
      <h2>How we work</h2>
      <p>
        We write every update in our own words from the official notice, include the
        application deadline where one exists, and link to the original source so readers can
        verify it and apply directly. Read our <Link href="/editorial-policy/">editorial policy</Link> for details.
      </p>
      <h2>What we are not</h2>
      <p>
        We are not a recruitment agency, employer or visa agent. We do not collect CVs for
        jobs listed in our news and we never ask job seekers to pay for a job.
      </p>
      <h2>Contact</h2>
      <p>
        Questions, corrections or tips: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> or our{" "}
        <Link href="/contact/">contact page</Link>.
      </p>
    </StaticPage>
  );
}
