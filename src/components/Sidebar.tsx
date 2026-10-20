import Link from "next/link";
import { getAllArticles, articlePath, isClosingSoon, formatDate } from "@/lib/articles";
import { SITE } from "@/lib/site";
import AdSlot from "./AdSlot";

export default function Sidebar() {
  const all = getAllArticles();
  const closing = all
    .filter(isClosingSoon)
    .sort((a, b) => (a.lastDate || "").localeCompare(b.lastDate || ""))
    .slice(0, 6);
  const latest = all.slice(0, 6);
  return (
    <aside className="sidebar">
      {closing.length > 0 && (
        <div className="box">
          <h2>⏰ Closing this week</h2>
          <ul>
            {closing.map((a) => (
              <li key={a.slug}>
                <Link href={articlePath(a)}>{a.title}</Link>
                <div className="small muted">Last date: {formatDate(a.lastDate!)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} format="rectangle" minHeight={250} />
      <div className="box">
        <h2>Latest updates</h2>
        <ol>
          {latest.map((a) => (
            <li key={a.slug}>
              <Link href={articlePath(a)}>{a.title}</Link>
            </li>
          ))}
        </ol>
      </div>
      {SITE.social.whatsapp && (
        <div className="box">
          <h2>Daily job alerts</h2>
          <p className="small">Get new UAE and Pakistan job news on WhatsApp, free.</p>
          <a className="btn" href={SITE.social.whatsapp} target="_blank" rel="noopener">
            Join WhatsApp Channel
          </a>
        </div>
      )}
    </aside>
  );
}
