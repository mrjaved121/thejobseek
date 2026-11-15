import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: `How ${SITE.name} sources, writes and corrects job news, and how AI tools are used.`,
  alternates: { canonical: "/editorial-policy/" },
};

export default function EditorialPolicy() {
  return (
    <StaticPage title="Editorial Policy" path="/editorial-policy/" updated="15 November 2026">
      <h2>Sources</h2>
      <p>
        We base job news on official sources: government and public service commission
        websites, official gazettes and press releases, ministry announcements (such as the UAE
        Ministry of Human Resources and Emiratisation), official newspaper advertisements, and
        employers&apos; own career pages. When an official text is not available online, we may rely on an established news organisation that reports a specific official decision, and we name both the decision and the news source. We do not publish job news based only on social media
        posts or unverified forwards.
      </p>
      <h2>Verification</h2>
      <p>
        Each article takes the organization name, post titles, eligibility, deadlines and the
        application link from the source it cites, and links to that source so readers can check it
        themselves. On article pages, &ldquo;Official source&rdquo; with a ✓ is shown only when the source is the
        employer&apos;s or a government&apos;s own website; a press report is labelled simply &ldquo;Source&rdquo;.
        Always confirm details on the employer&apos;s or authority&apos;s own site before applying.
      </p>
      <h2>How we use AI</h2>
      <p>
        We monitor government, employer and news websites automatically, and we use AI tools to
        research, draft and publish articles from the notices and reports we find. Automated checks
        compare drafts with other pages on the site for repeated text. Not every article is read by a
        person before it goes live, so mistakes are possible: the editor is responsible for the site,
        and errors that are reported to us are corrected. AI tools are instructed never to invent
        facts, dates, salaries or quotes.
      </p>
      <h2>Originality</h2>
      <p>
        Articles are written in our own words and add useful context such as eligibility
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
