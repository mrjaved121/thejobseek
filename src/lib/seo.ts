import type { Metadata } from "next";
import { SITE } from "./site";

/** Robots for list pages: index when the page has articles, otherwise noindex (thin page). */
export const listRobots = (hasItems: boolean): Metadata["robots"] =>
  hasItems
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: true };

/** Full Open Graph block for list pages (Next replaces, not merges, the root openGraph). */
export function listOpenGraph(title: string, description: string, url: string, image?: { url: string; alt: string }): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: SITE.name,
    locale: "en_AE",
    title,
    description,
    url,
    images: [
      image
        ? { url: image.url, width: 1200, height: 675, alt: image.alt }
        : { url: "/opengraph-image.png", width: 1200, height: 630, alt: `${SITE.name} – Job & Work Visa News` },
    ],
  };
}

/** Meta description of at most `max` characters: whole sentences if they fit, otherwise cut at a word with an ellipsis. */
export function metaDescription(text: string, max = 158): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const sentences = t.match(/[^.!?]+[.!?]+/g) || [];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  if (out.trim().length >= 90) return out.trim();
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]\s*$/, "") + "…";
}
