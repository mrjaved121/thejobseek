import Link from "next/link";

export default function NotFound() {
  return (
    <div className="static">
      <h1 className="page-title">Page not found</h1>
      <p>This job update may have been moved or removed.</p>
      <p>
        <Link href="/uae/">See UAE job news</Link> · <Link href="/pakistan/">See Pakistan job news</Link>
      </p>
    </div>
  );
}
