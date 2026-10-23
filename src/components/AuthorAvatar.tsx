import type { Author } from "@/lib/authors";

/** Author photo when one is set, otherwise the first letter of the name. */
export default function AuthorAvatar({ author, size, className }: { author: Author; size: number; className: string }) {
  if (author.image) {
    return (
      <img
        src={author.image}
        alt={`Photo of ${author.name}`}
        width={size}
        height={size}
        className={`${className} avatar-img`}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <span className={className} aria-hidden>
      {author.name[0]}
    </span>
  );
}
