import Breadcrumbs from "./Breadcrumbs";

export default function StaticPage({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="static">
      <Breadcrumbs items={[{ name: title, path }]} />
      <h1 className="page-title">{title}</h1>
      {updated && <p className="muted small">Last updated: {updated}</p>}
      {children}
    </div>
  );
}
