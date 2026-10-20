"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/**
 * Manual AdSense unit. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT and a slot ID exist,
 * so the site looks clean while the AdSense application is under review.
 * The reserved min-height prevents layout shift (good for Core Web Vitals / CLS).
 */
export default function AdSlot({
  slot,
  format = "auto",
  minHeight = 280,
}: {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  minHeight?: number;
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!CLIENT || !slot || !ref.current) return;
    if (ref.current.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocked or not ready */
    }
  }, [pathname, slot]);

  if (!CLIENT || !slot) return null;

  return (
    <div className="ad" style={{ minHeight }} aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <ins
        key={pathname}
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
