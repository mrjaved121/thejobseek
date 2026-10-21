import { type Article } from "@/lib/articles";
import { COUNTRIES, COUNTRY_PHOTOS } from "@/lib/site";

/**
 * Story image: small WebP files generated at build time by scripts/build-thumbs.mjs
 * (<slug>.webp, 384x216, under 8 KB). If an article sets
 * `image:` to a full https URL, that image is used directly instead.
 */
export default function Thumb({ a, size = "md", priority = false }: { a: Article; size?: "lg" | "md" | "sm"; priority?: boolean }) {
  const country = COUNTRIES[a.country];
  const external = a.image && /^https?:\/\//.test(a.image) ? a.image : "";
  const src = external || `/thumbs/${a.slug}.webp`; // one small WebP (384x216, <= 8 KB) made by scripts/build-thumbs.mjs
  return (
    <div className={`thumb thumb-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={384}
        height={216}
        alt={a.imageAlt || (a.image ? "" : COUNTRY_PHOTOS[a.country] || "")}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {size !== "sm" && (
        <span className="thumb-tag">
          {country.name}
        </span>
      )}
    </div>
  );
}
