import { type Article } from "@/lib/articles";
import { COUNTRIES, COUNTRY_PHOTOS } from "@/lib/site";

/**
 * Story image: small WebP files generated at build time by scripts/build-thumbs.mjs
 * (<slug>.webp 384x216 and <slug>-s.webp 256x144, each under 8 KB). If an article sets
 * `image:` to a full https URL, that image is used directly instead.
 */
export default function Thumb({ a, size = "md", priority = false }: { a: Article; size?: "lg" | "md" | "sm"; priority?: boolean }) {
  const country = COUNTRIES[a.country];
  const external = a.image && /^https?:\/\//.test(a.image) ? a.image : "";
  // Three small WebPs made by scripts/build-thumbs.mjs: 160x90, 256x144 and 384x216 (all <= 8 KB). The browser picks the right one.
  const src = external || `/thumbs/${a.slug}.webp`;
  const srcSet = external ? undefined : `/thumbs/${a.slug}-xs.webp 160w, /thumbs/${a.slug}-s.webp 256w, /thumbs/${a.slug}.webp 384w`;
  // "sm" shows a 4:3 crop 72px high, i.e. 128px of the 16:9 image's width.
  const sizes = size === "sm" ? "128px" : size === "md" ? "(max-width: 760px) 92vw, 250px" : "(max-width: 760px) 92vw, 620px";
  return (
    <div className={`thumb thumb-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={external ? undefined : sizes}
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
