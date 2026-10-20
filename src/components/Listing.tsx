import Story from "./Story";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import AdSlot from "./AdSlot";
import { type Article, excerpt } from "@/lib/articles";

/** Section front: title band, lead story, then a chronological news list. */
export default function Listing({
  eyebrow,
  title,
  lede,
  crumbs,
  items,
  emptyText,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  crumbs: { name: string; path: string }[];
  items: Article[];
  emptyText: string;
}) {
  const [lead, ...rest] = items;
  return (
    <>
      <div className="section-head">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-h1">{title}</h1>
        <p className="lede">{lede}</p>
        <p className="section-count">
          {items.length} {items.length === 1 ? "update" : "updates"}
        </p>
      </div>
      <div className="grid">
        <div>
          {lead ? (
            <>
              <div className="listing-lead">
                <Story a={lead} variant="lead" />
              </div>
              <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_TOP} />
              {rest.length > 0 && (
                <div className="river">
                  {rest.map((a) => (
                    <Story key={a.slug} a={a} variant="river" excerptText={excerpt(a)} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="empty">{emptyText}</p>
          )}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
