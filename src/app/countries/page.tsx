import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { COUNTRIES, COUNTRY_CODES, CATEGORIES, PRIMARY_COUNTRIES } from "@/lib/site";
import { countryCounts } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Job & Work Visa News by Country",
  description:
    "Browse verified job, recruitment and work visa news by country: UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, UK, USA, Canada, Australia and Europe.",
  alternates: { canonical: "/countries/" },
};

export default function Countries() {
  const counts = countryCounts();
  return (
    <div>
      <Breadcrumbs items={[{ name: "All countries", path: "/countries/" }]} />
      <h1 className="page-title">All countries &amp; topics</h1>
      <p className="lede">Every update links to the government or employer notice it is based on.</p>
      <ul className="country-grid">
        {PRIMARY_COUNTRIES.map((c) => (
          <li key={c}>
            <Link href={`/${c}/`} className="country-tile">
              <span className="code-badge code-badge-lg" aria-hidden>{COUNTRY_CODES[c]}</span>
              <span className="country-name">{COUNTRIES[c].name}</span>
              <span className="country-count">
                {counts[c] ? `${counts[c]} update${counts[c] > 1 ? "s" : ""}` : "Coming soon"}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="page-title" style={{ fontSize: "1.5rem", marginTop: 32 }}>Topics</h2>
      <ul className="country-grid">
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <li key={k}>
            <Link href={`/category/${k}/`} className="country-tile topic-tile">
              <span className="country-name">{v.name}</span>
              <span className="country-count">{v.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
