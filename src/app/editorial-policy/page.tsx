import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `How ${SITE.name} sources, verifies, writes and corrects job news.`,
  alternates: { canonical: "/editorial-policy/" },
};

export default function EditorialPolicy() {
  return (
    <StaticPage title="Editorial Policy" path="/editorial-policy/" updated="20 October 2026">
      <h2>Sources</h2>
      <p>
        We base job news on official sources: government and public service commission
        websites, official gazettes and press releases, ministry announcements (such as the UAE
        Ministry of Human Resources and Emiratisation), official newspaper advertisements, and
        employers&apos; own career pages. We do not publish job news based only on social media
        posts or unverified forwards.
      </p>
      <h2>Verification</h2>
      <p>
        Before publishing, an editor checks the organization name, post titles, eligibility,
        deadlines and the application link against the original notice. Every article links to
        its source so readers can check it themselves.
      </p>
      <h2>How we use AI</h2>
      <p>
        We monitor official government and public-sector websites automatically, and we use AI
        tools to help prepare a first draft summary of new notices. An editor reviews every draft
        against the original notice, corrects it where needed and decides whether it is published.
        No article is published automatically. AI tools are never used to invent facts, dates,
        salaries or quotes.
      </p>
      <h2>Originality</h2>
      <p>
        We write every article in our own words and add useful context such as eligibility
        summaries, required documents and how to apply. We do not copy articles from other news
        or job websites.
      </p>
      <h2>Independence and advertising</h2>
      <p>
        Advertising never influences which jobs we cover. Ads are clearly labelled. We do not
        accept payment to publish job notices as news.
      </p>
      <h2 id="corrections">Corrections</h2>
      <p>
        If we make a mistake we correct it promptly and update the article&apos;s &ldquo;Updated&rdquo;
        date. Report errors to <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
      <h2>Scam warning</h2>
      <p>
        We never charge job seekers. Anyone asking for money for a job or visa in our name is
        not connected to {SITE.name}.
      </p>
    </StaticPage>
  );
}
