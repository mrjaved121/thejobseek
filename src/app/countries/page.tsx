import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { COUNTRIES, enabledCountries } from "@/lib/site";
import { countryCounts } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Job & Work Visa News by Country",
  description:
    "Browse verified job, recruitment and work visa news by country: UAE, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, Pakistan, India, UK, USA, Canada, Australia and Europe.",
  alternates: { canonical: "/countries" },
};

export default function Countries() {
  const counts = countryCounts();
  return (
    <div>
      <Breadcrumbs items={[{ name: "All countries", path: "/countries" }]} />
      <h1 className="page-title">Job &amp; work visa news by country</h1>
      <p className="lede">Every update links to the government or employer notice it is based on.</p>
      <ul className="country-grid">
        {enabledCountries.map((c) => (
          <li key={c}>
            <Link href={`/${c}`} className="country-tile">
              <span className="country-flag" aria-hidden>{COUNTRIES[c].flag}</span>
              <span className="country-name">{COUNTRIES[c].name}</span>
              <span className="country-count">
                {counts[c] ? `${counts[c]} update${counts[c] > 1 ? "s" : ""}` : "Coming soon"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
