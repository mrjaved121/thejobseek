import Link from "next/link";

export default function NotFound() {
  return (
    <div className="static">
      <h1 className="page-title">Page not found</h1>
      <p>This update may have been moved or removed. Try the latest news instead:</p>
      <p>
        <Link href="/">Latest news</Link> · <Link href="/uae/">UAE job news</Link> ·{" "}
        <Link href="/countries/">All countries</Link> · <Link href="/search/">Search</Link>
      </p>
    </div>
  );
}
