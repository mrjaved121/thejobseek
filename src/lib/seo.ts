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
        ? { url: image.url.replace(/\.webp$/, ".jpg"), width: 1200, height: 675, alt: image.alt }
        : { url: "/opengraph-image.png", width: 1200, height: 630, alt: `${SITE.name} – Job & Work Visa News` },
    ],
  };
}
