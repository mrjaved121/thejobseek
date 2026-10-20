import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Listing from "@/components/Listing";
import { getByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({ cat }));
}

type Props = { params: Promise<{ cat: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const c = CATEGORIES[cat];
  if (!c) return {};
  const items = getByCategory(cat);
  return {
    title: `${c.name} – UAE & Pakistan`,
    description: c.description,
    alternates: { canonical: `/category/${cat}/` },
    // Thin category pages (no articles yet) should not be indexed.
    robots: items.length ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;
  const c = CATEGORIES[cat];
  if (!c) notFound();
  const items = getByCategory(cat);
  return (
    <Listing
      eyebrow="Topic"
      title={c.name}
      lede={c.description}
      crumbs={[{ name: c.name, path: `/category/${cat}/` }]}
      items={items}
      emptyText="Updates in this section are coming soon."
    />
  );
}
