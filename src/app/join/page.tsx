import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

// Landing page for Facebook ads: one job, sending visitors to the free Facebook group.
// Kept out of Google (noindex, not in the sitemap): it is a short promo page, not content.
export const metadata: Metadata = {
  title: "Join our free Gulf jobs Facebook group",
  description:
    "Join the free TheJobSeek Facebook group for daily UAE, Saudi, Qatar, Kuwait, Oman and Bahrain job and work visa updates, with official apply links.",
  alternates: { canonical: "/join/" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Free Gulf jobs & work visa updates on Facebook",
    description: "Daily hiring news from the UAE and the Gulf, with the official link to apply. Free to join.",
    url: "/join/",
  },
};

const BENEFITS = [
  "Daily hiring news from the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain",
  "The official employer or government link to apply, in every post",
  "Work visa, labour law and Saudization / Emiratisation changes in plain English",
  "Scam warnings: how to spot fake job offers and fake agents",
];

function JoinButton({ place }: { place: string }) {
  const group = SITE.social.facebookGroup;
  return (
    <a
      className="join-cta"
      href={group}
      target="_blank"
      rel="noopener"
      data-cta="join-facebook-group"
      data-cta-place={place}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z" />
      </svg>
      Join the free Facebook group
    </a>
  );
}

export default function JoinPage() {
  return (
    <div className="join-page">
      <section className="join-hero">
        <p className="join-kicker">Free · No agents · No fees</p>
        <h1>Gulf jobs &amp; work visa updates, every day on Facebook</h1>
        <p className="join-lead">
          Join our free Facebook group and see who is hiring in Dubai, Abu Dhabi, Riyadh, Doha and across the
          Gulf, with the official link to apply.
        </p>
        <JoinButton place="top" />
        <p className="join-small">Opens Facebook. Tap &ldquo;Join group&rdquo; there.</p>
      </section>

      <section className="join-box">
        <h2>What you get in the group</h2>
        <ul className="join-list">
          {BENEFITS.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="join-box join-warning">
        <h2>Our promise</h2>
        <p>
          {SITE.name} is a job news site, not a recruitment agency. Joining is free, we never ask for money, and we
          never sell jobs or visas. You always apply directly on the employer&apos;s or government&apos;s own website.
          If anyone asks you to pay for a job, a visa or an interview, it is a scam.
        </p>
      </section>

      <section className="join-hero join-hero-bottom">
        <h2>Ready to get daily job updates?</h2>
        <JoinButton place="bottom" />
        <p className="join-small">
          Prefer the website? Read the <Link href="/">latest Gulf job news</Link>.
        </p>
      </section>
    </div>
  );
}
