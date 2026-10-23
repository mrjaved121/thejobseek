import { SITE, COUNTRIES, CATEGORIES, COUNTRY_PHOTOS } from "./site";
import { type Article, articlePath } from "./articles";
import { getAuthor, authorSameAs } from "./authors";

const abs = (p: string) => `${SITE.url}${p}`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": abs("/#organization"),
  name: SITE.name,
  alternateName: SITE.alternateNames,
  slogan: SITE.tagline,
  description: SITE.description,
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs("/icon.png"), width: 512, height: 512 },
  email: SITE.contactEmail,
  publishingPrinciples: abs("/editorial-policy/"),
  correctionsPolicy: abs("/editorial-policy/#corrections"),
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  areaServed: ["AE", "SA", "QA", "KW", "OM", "BH"],
  founder: { "@id": abs("/author/mr-jay/#person") },
  contactPoint: { "@type": "ContactPoint", contactType: "editorial", email: SITE.contactEmail, url: abs("/contact/") },
  sameAs: [...Object.values(SITE.social), ...SITE.profiles].filter(Boolean),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": abs("/#website"),
  name: SITE.name,
  alternateName: SITE.alternateNames,
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
    image: [
      { "@type": "ImageObject", url: abs(`${articlePath(a)}opengraph-image.png`), width: 1200, height: 675 },
    ],
    thumbnailUrl: abs(`/thumbs/${a.slug}.webp`),
    datePublished: a.date,
    dateModified: a.updated || a.date,
    inLanguage: "en",
    articleSection: [COUNTRIES[a.country].name, CATEGORIES[a.category]?.name].filter(Boolean),
    isAccessibleForFree: true,
    wordCount: a.markdown.split(/\s+/).length,
    keywords: a.tags.join(", "),
    contentLocation: { "@type": a.country === "europe" ? "Place" : "Country", name: COUNTRIES[a.country].name },
    about: a.organization ? [{ "@type": "Organization", name: a.organization }] : undefined,
    abstract: a.keyPoints.length ? a.keyPoints.join(" ") : undefined,
    author: [
      {
        "@type": "Person",
        "@id": abs(`/author/${author.id}/#person`),
        name: author.name,
        url: abs(`/author/${author.id}/`),
        jobTitle: author.role,
        worksFor: { "@id": abs("/#organization") },
        ...(author.image ? { image: abs(author.image) } : {}),
        ...(authorSameAs(author).length ? { sameAs: authorSameAs(author) } : {}),
      },
    ],
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

/** FAQPage for articles that have question-and-answer pairs (helps AI assistants and "People also ask"). */
export function faqSchema(a: Article) {
  if (!a.faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: a.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** CollectionPage + ItemList for country and topic pages. */
export function collectionSchema(name: string, description: string, path: string, items: Article[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": abs(path),
    url: abs(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": abs("/#website") },
    publisher: { "@id": abs("/#organization") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(articlePath(a)),
        name: a.title,
      })),
    },
  };
}
