import { SITE, COUNTRIES } from "./site";
import { type Article, articlePath } from "./articles";
import { getAuthor } from "./authors";

const abs = (p: string) => `${SITE.url}${p}`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": abs("/#organization"),
  name: SITE.name,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs("/icon"), width: 512, height: 512 },
  email: SITE.contactEmail,
  publishingPrinciples: abs("/editorial-policy"),
  correctionsPolicy: abs("/editorial-policy#corrections"),
  sameAs: Object.values(SITE.social).filter(Boolean),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  name: SITE.name,
  url: SITE.url,
  inLanguage: "en",
  publisher: { "@id": abs("/#organization") },
});

export function articleSchema(a: Article) {
  const author = getAuthor(a.author);
  const url = abs(articlePath(a));
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: a.title.slice(0, 110),
    description: a.description,
    image: [abs(`${articlePath(a)}/opengraph-image`)],
    datePublished: a.date,
    dateModified: a.updated || a.date,
    inLanguage: "en",
    articleSection: COUNTRIES[a.country].name,
    keywords: a.tags.join(", "),
    contentLocation: { "@type": "Place", name: COUNTRIES[a.country].name },
    author: [{ "@type": "Person", name: author.name, url: abs(`/author/${author.id}`) }],
    publisher: { "@id": abs("/#organization") },
    isBasedOn: a.sourceUrl || undefined,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}
