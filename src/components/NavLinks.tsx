"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Section links with the current section highlighted. */
export default function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname() || "/";
  return (
    <>
      {items.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className={active ? "active" : undefined}>
            {it.label}
          </Link>
        );
      })}
    </>
  );
}
