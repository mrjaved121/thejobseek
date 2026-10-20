import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search job & visa news",
  description: "Search TheJobSeek for job, recruitment and work visa news by keyword, country or organization.",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true }, // search result pages should not be indexed
};

export default function SearchPage() {
  return (
    <div className="search-page">
      <h1 className="section-h1">Search news</h1>
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
