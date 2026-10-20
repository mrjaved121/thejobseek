import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getByCategory } from "@/lib/articles";
import { CATEGORIES } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 600;

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
    alternates: { canonical: `/category/${cat}` },
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
    <div className="grid">
      <div>
        <Breadcrumbs items={[{ name: c.name, path: `/category/${cat}` }]} />
        <h1 className="page-title">{c.name}</h1>
        <p className="lede">{c.description}</p>
        <div className="cards">
          {items.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
        {!items.length && <p>Updates in this section are coming soon.</p>}
      </div>
      <Sidebar />
    </div>
  );
}
