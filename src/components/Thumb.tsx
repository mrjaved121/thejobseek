import { type Article } from "@/lib/articles";
import { COUNTRIES } from "@/lib/site";

/**
 * Story image: small WebP files generated at build time by scripts/build-thumbs.mjs
 * (<slug>-640.webp for cards, <slug>-1200.webp for large stories). If an article sets
 * `image:` to a full https URL, that image is used directly instead.
 */
export default function Thumb({ a, size = "md", priority = false }: { a: Article; size?: "lg" | "md" | "sm"; priority?: boolean }) {
  const country = COUNTRIES[a.country];
  const external = a.image && /^https?:\/\//.test(a.image) ? a.image : "";
  const base = `/thumbs/${a.slug}`;
  const sizes = size === "lg" ? "(max-width: 760px) 100vw, 760px" : size === "md" ? "(max-width: 760px) 50vw, 360px" : "120px";
  return (
    <div className={`thumb thumb-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={external || `${base}-640.webp`}
        srcSet={external ? undefined : `${base}-640.webp 640w, ${base}-1200.webp 1200w`}
        sizes={external ? undefined : sizes}
        width={640}
        height={360}
        alt={a.imageAlt || ""}
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
