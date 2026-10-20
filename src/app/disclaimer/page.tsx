import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Disclaimer for ${SITE.name} job news.`,
  alternates: { canonical: "/disclaimer" },
};

export default function Disclaimer() {
  return (
    <StaticPage title="Disclaimer" path="/disclaimer" updated="20 October 2026">
      <p>
        {SITE.name} publishes job news summarised from official sources. We are not affiliated
        with any government department, public service commission or employer mentioned on this
        website unless clearly stated.
      </p>
      <p>
        Information may change after publication. Always verify eligibility, deadlines, fees
        and application methods on the official website or notice before applying.
      </p>
      <p>
        We never ask for money for jobs, interviews or visas. Do not pay anyone who claims to
        offer a job through {SITE.name}. In Pakistan, overseas employment should go only through
        promoters licensed by the Bureau of Emigration &amp; Overseas Employment. In the UAE, a
        visit visa does not allow you to work; employers must arrange a proper work permit.
      </p>
      <p>Logos and names of organisations belong to their respective owners.</p>
    </StaticPage>
  );
}
