"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Item = { t: string; d: string; x: string; u: string; c: string; k: string; g: string; o: string; dt: string };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dubai" });

export default function SearchClient() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q") || "";
    setQ(initial);
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [q]);

  const results = useMemo(() => {
    if (!items) return [];
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return items.slice(0, 20);
    return items
      .map((it) => {
        const title = it.t.toLowerCase();
        const rest = `${it.d} ${it.x} ${it.c} ${it.k} ${it.g} ${it.o}`.toLowerCase();
        let score = 0;
        for (const w of words) {
          if (title.includes(w)) score += 3;
          else if (rest.includes(w)) score += 1;
          else return null;
        }
        return { it, score };
      })
      .filter((r): r is { it: Item; score: number } => r !== null)
      .sort((a, b) => b.score - a.score || b.it.dt.localeCompare(a.it.dt))
      .map((r) => r.it);
  }, [items, q]);

  return (
    <>
      <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="visually-hidden">Search news</label>
        <input
          id="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try: Dubai visa, PPSC, Skilled Worker, nurse"
          autoComplete="off"
          autoFocus
        />
      </form>
      <p className="search-status" aria-live="polite">
        {items === null
          ? "Loading…"
          : q
            ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
            : "Latest updates"}
      </p>
      <div className="river">
        {results.map((it) => (
          <article key={it.u} className="story story-river">
            <Link href={it.u} tabIndex={-1} aria-hidden className="story-media">
              <div className="thumb thumb-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/thumbs/${it.u.split("/").filter(Boolean).pop()}-640.webp`} alt="" width={640} height={360} loading="lazy" decoding="async" />
              </div>
            </Link>
            <div className="story-body">
              <div className="kicker-row">
                <span className="kicker">{it.c}</span>
                <span className="kicker-sep" aria-hidden>|</span>
                <span className="kicker kicker-muted">{it.k}</span>
              </div>
              <h2 className="story-title"><Link href={it.u}>{it.t}</Link></h2>
              <p className="story-deck">{it.d}</p>
              <div className="story-meta"><time dateTime={it.dt}>{fmt(it.dt)}</time></div>
            </div>
          </article>
        ))}
      </div>
      {items !== null && q && results.length === 0 && (
        <p className="empty">No updates match “{q}”. Try a country, an organization name or a job title.</p>
      )}
    </>
  );
}
