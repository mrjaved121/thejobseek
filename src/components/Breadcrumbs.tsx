import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="crumbs">
        {all.map((it, i) => (
          <span key={it.path}>
            {i < all.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
            {i < all.length - 1 && " › "}
          </span>
        ))}
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
