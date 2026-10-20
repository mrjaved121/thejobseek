import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import { getByCountry } from "@/lib/articles";
import { COUNTRIES, enabledCountries, type CountryKey } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 600;

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
    robots: empty ? { index: false, follow: true } : undefined,
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: `/${country}` },
    openGraph: { title: c.title, description: c.description, url: `/${country}` },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const c = COUNTRIES[country as CountryKey];
  if (!c?.enabled) notFound();
  const items = getByCountry(country);
  return (
    <div className="grid">
      <div>
        <Breadcrumbs items={[{ name: `${c.name} Job News`, path: `/${country}` }]} />
        <h1 className="page-title">{c.flag} {c.name} Job News</h1>
        <p className="lede">{c.description}</p>
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />
        <div className="cards">
          {items.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
        {!items.length && <p>New {c.name} updates are coming soon.</p>}
      </div>
      <Sidebar />
    </div>
  );
}
