"use client";

import { useState } from "react";

/** Share links (no third-party scripts, so no tracking and no slowdown). */
export default function ShareBar({ url, title, label = "Share" }: { url: string; title: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { name: "WhatsApp", cls: "wa", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "Facebook", cls: "fb", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "X", cls: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: "LinkedIn", cls: "li", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="share" role="group" aria-label={label}>
      <span className="share-label">{label}</span>
      {links.map((l) => (
        <a key={l.name} className={`share-btn ${l.cls}`} href={l.href} target="_blank" rel="noopener nofollow">
          {l.name}
        </a>
      ))}
      <button type="button" className="share-btn copy" onClick={copy} aria-live="polite">
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
