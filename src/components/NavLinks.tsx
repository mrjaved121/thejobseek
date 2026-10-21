/** Section links. public/site.js highlights the current section (no framework JavaScript needed). */
export default function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <>
      {items.map((it) => (
        <a key={it.href} href={it.href} data-nav>
          {it.label}
        </a>
      ))}
    </>
  );
}
