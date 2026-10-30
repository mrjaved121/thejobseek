import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Story from "@/components/Story";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import AuthorAvatar from "@/components/AuthorAvatar";
import { AUTHORS, authorSameAs } from "@/lib/authors";
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
    description: `${a.name}, ${a.role}, based in ${a.location}. What he covers, how every story is verified, and all his latest UAE, Gulf and global job news.`,
    alternates: { canonical: `/author/${id}/` },
    openGraph: { type: "profile", title: `${a.name} – ${a.role}`, url: `/author/${id}/`, images: [{ url: a.image || "/opengraph-image.png", width: 1200, height: 630, alt: `${a.name}, ${a.role}` }] },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = AUTHORS[id];
  if (!author) notFound();
  const items = getByAuthor(id);
  const sameAs = authorSameAs(author);
  return (
    <div className="static" style={{ maxWidth: "100%" }}>
      <Breadcrumbs items={[{ name: author.name, path: `/author/${id}/` }]} />
      <div className="author-hero">
        <AuthorAvatar author={author} size={96} className="avatar" />
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{author.name}</h1>
          <p className="muted">{author.role}</p>
          <p className="small">Based in {author.location}</p>
        </div>
      </div>

      <p>{author.bio}</p>

      <ul className="author-facts small">
        <li><strong>Articles:</strong> {items.length}</li>
        <li><strong>Email:</strong> <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
        {author.linkedin && (
          <li><strong>LinkedIn:</strong> <a href={author.linkedin} target="_blank" rel="noopener me">View profile</a></li>
        )}
        {SITE.social.facebook && (
          <li><strong>Facebook:</strong> <a href={SITE.social.facebook} target="_blank" rel="noopener">{SITE.name} page</a></li>
        )}
      </ul>

      <h2>What I cover</h2>
      <ul>
        {author.covers.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <h2 id="how-i-verify">How I verify every story</h2>
      <ul>
        {author.verification.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
      <p>
        Full details are in our <Link href="/editorial-policy/">editorial policy</Link>. Spotted a mistake or have a
        news tip? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>

      <h2 className="section-title">Latest articles by {author.name}</h2>
      <div className="river">
        {items.map((a) => (
          <Story key={a.slug} a={a} variant="river" />
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE.url}/author/${id}/`,
          mainEntity: {
            "@type": "Person",
            "@id": `${SITE.url}/author/${id}/#person`,
            name: author.name,
            jobTitle: author.role,
            description: author.bio,
            url: `${SITE.url}/author/${id}/`,
            ...(author.image ? { image: `${SITE.url}${author.image}` } : {}),
            homeLocation: { "@type": "Place", name: author.location },
            knowsAbout: author.knowsAbout,
            email: SITE.contactEmail,
            worksFor: { "@id": `${SITE.url}/#organization` },
            ...(sameAs.length ? { sameAs } : {}),
          },
        }}
      />
    </div>
  );
}
