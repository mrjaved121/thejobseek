import Link from "next/link";

/** Two-tone boxed section label: navy box + gold box, e.g. [UAE][NEWS]. */
export default function SectionLabel({ first, second, href, id }: { first: string; second?: string; href?: string; id?: string }) {
  const inner = (
    <>
      <span className="lbl-a">{first}</span>
      {/* A real space between the two boxes, so the heading reads "UAE News" (not "UAENews") as text. The flex layout ignores it visually. */}
      {second && " "}
      {second && <span className="lbl-b">{second}</span>}
    </>
  );
  return (
    <h2 className="section-label" id={id}>
      {href ? <Link href={href}>{inner}</Link> : inner}
    </h2>
  );
}
