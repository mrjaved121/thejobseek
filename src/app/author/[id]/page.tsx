import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { AUTHORS } from "@/lib/authors";
import { getByAuthor } from "@/lib/articles";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const a = AUTHORS[id];
  if (!a) return {};
  return {
    title: `${a.name} – ${a.role}`,
    description: a.bio.slice(0, 160),
    alternates: { canonical: `/author/${id}/` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) notFound();
  const items = getByAuthor(id);
  return (
    <div className="static" style={{ maxWidth: "100%" }}>
      <Breadcrumbs items={[{ name: author.name, path: `/author/${id}/` }]} />
      <h1 className="page-title">{author.name}</h1>
      <p className="muted">{author.role}</p>
      <p>{author.bio}</p>
      <h2 className="section-title">Articles by {author.name}</h2>
      <div className="cards">
        {items.map((a) => (
          <ArticleCard key={a.slug} a={a} />
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: author.name,
            jobTitle: author.role,
            description: author.bio,
            url: `${SITE.url}/author/${id}`,
            worksFor: { "@id": `${SITE.url}/#organization` },
            sameAs: author.sameAs,
          },
        }}
      />
    </div>
  );
}
