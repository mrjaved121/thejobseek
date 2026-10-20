import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${SITE.name}: who we are, what we cover and how we verify job, labour law and work visa news for the UAE, the Gulf and abroad.`,
  alternates: { canonical: "/about/" },
};

export default function About() {
  return (
    <StaticPage title="About TheJobSeek" path="/about/">
      <p>
        {SITE.name} is an independent job news website for people looking for work in the
        United Arab Emirates and the wider Gulf, and for Gulf-based workers planning a move to
        the UK, USA, Canada, Australia or Europe. We publish hiring announcements, government job
        portals, licensing exam rules, and changes to labour and visa rules that affect workers,
        plus practical guides to the UAE Labour Law.
      </p>
      <h2>What we cover</h2>
      <ul>
        <li><strong>UAE:</strong> hiring news from Dubai, Abu Dhabi, Sharjah and the other emirates, labour law and work visa updates, and practical guides for expat job seekers.</li>
        <li><strong>Gulf:</strong> hiring, labour law, residency and work visa updates from Saudi Arabia, Qatar, Kuwait, Oman and Bahrain.</li>
        <li><strong>Licensing and exams:</strong> professional licensing rules such as DHA, SCFHS and language tests for skilled migration.</li>
        <li><strong>UK, USA, Canada, Australia and Europe:</strong> official work visa and immigration changes that matter to overseas workers.</li>
      </ul>
      <h2>How we work</h2>
      <p>
        We write every update in our own words from the official notice, include the
        application deadline where one exists, and link to the original source so readers can
        verify it and apply directly. Read our <Link href="/editorial-policy/">editorial policy</Link> for details.
      </p>
      <h2>Who runs TheJobSeek</h2>
      <p>
        {SITE.name} is run from Dubai by its founder and editor, <Link href="/author/mr-jay/">Mr Jay</Link>, who
        reviews every article against its official source before it is published.
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
