/** Share links (no third-party scripts). The "Copy link" button is handled by public/site.js. */
export default function ShareBar({ url, title, label = "Share" }: { url: string; title: string; label?: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { name: "WhatsApp", cls: "wa", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "Facebook", cls: "fb", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", cls: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: "LinkedIn", cls: "li", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
  return (
    <div className="share" role="group" aria-label={label}>
      <span className="share-label">{label}</span>
      {links.map((l) => (
        <a key={l.name} className={`share-btn ${l.cls}`} href={l.href} target="_blank" rel="noopener nofollow">
          {l.name}
        </a>
      ))}
      <button type="button" className="share-btn copy" data-copy={url} aria-live="polite">
        Copy link
      </button>
    </div>
  );
}
