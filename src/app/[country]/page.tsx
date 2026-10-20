import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Listing from "@/components/Listing";
import JsonLd from "@/components/JsonLd";
import { collectionSchema } from "@/lib/schema";
import { listRobots, listOpenGraph } from "@/lib/seo";
import { getByCountry } from "@/lib/articles";
import { COUNTRIES, COUNTRY_PHOTOS, countryPhoto, enabledCountries, type CountryKey } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return enabledCountries.map((country) => ({ country }));
}

type Props = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const c = COUNTRIES[country as CountryKey];
  if (!c) return {};
  const empty = getByCountry(country).length === 0;
  return {
    robots: listRobots(!empty),
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: `/${country}/` },
    openGraph: listOpenGraph(c.title, c.description, `/${country}/`, countryPhoto(country) ? { url: countryPhoto(country), alt: COUNTRY_PHOTOS[country] } : undefined),
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const c = COUNTRIES[country as CountryKey];
  if (!c?.enabled) notFound();
  const items = getByCountry(country);
  return (
    <>
    <JsonLd data={collectionSchema(c.title, c.description, `/${country}/`, items)} />
    <Listing
      eyebrow="Country news"
      title={<>{c.name} job &amp; work visa news</>}
      lede={c.description}
      crumbs={[{ name: `${c.name} Job News`, path: `/${country}/` }]}
      items={items}
      emptyText={`New ${c.name} updates from official sources are coming soon.`}
      banner={countryPhoto(country) ? { src: countryPhoto(country), alt: COUNTRY_PHOTOS[country] } : undefined}
    />
    </>
  );
}
