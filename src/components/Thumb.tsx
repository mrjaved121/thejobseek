import { type Article } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

/**
 * Story image. Uses the article's own photo when `image:` is set in its frontmatter
 * (a file in /public or a licensed URL); otherwise draws a branded illustration
 * for the topic, so every story has a consistent visual without any download.
 */
const ICONS: Record<string, React.ReactNode> = {
  "govt-jobs": (
    <path d="M12 3 3 8v2h18V8l-9-5Zm-7 9v6m4.5-6v6m5-6v6M19 12v6M3 20h18" />
  ),
  "private-jobs": (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  "exams-results": (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M8.5 12.5l2.2 2.2 4.8-4.8" />
    </>
  ),
  "visa-labour-law": (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3.2" />
      <path d="M8.5 17h7" />
    </>
  ),
  guides: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />
    </>
  ),
};

export default function Thumb({ a, size = "md", priority = false }: { a: Article; size?: "lg" | "md" | "sm"; priority?: boolean }) {
  if (a.image) {
    return (
      <div className={`thumb thumb-${size}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.image} alt={a.imageAlt || ""} loading={priority ? "eager" : "lazy"} decoding="async" />
      </div>
    );
  }
  const country = COUNTRIES[a.country];
  return (
    <div className={`thumb thumb-${size} art art-${a.category} art-c-${a.country}`} aria-hidden>
      {size !== "sm" && <span className="art-mark">{country.name}</span>}
      <svg className="art-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[a.category] || ICONS["visa-labour-law"]}
      </svg>
      {size !== "sm" && (
        <span className="art-label">
          <span className="art-flag">{country.flag}</span> {country.name}
          <span className="art-cat"> · {CATEGORIES[a.category].name}</span>
        </span>
      )}
      {size === "sm" && <span className="art-flag-sm">{country.flag}</span>}
    </div>
  );
}
