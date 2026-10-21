import { SITE } from "@/lib/site";

/** Lightweight "Follow us on Facebook" box (plain link, no Facebook scripts, so pages stay fast). */
export default function FollowFacebook({ compact = false }: { compact?: boolean }) {
  if (!SITE.social.facebook) return null;
  return (
    <a className={`fb-follow${compact ? " fb-follow-compact" : ""}`} href={SITE.social.facebook} target="_blank" rel="noopener me">
      <span className="fb-icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z"/></svg>
      </span>
      <span className="fb-text">
        <strong>Follow TheJobSeek on Facebook</strong>
        {!compact && <span>Daily UAE &amp; Gulf job and visa updates in your feed</span>}
      </span>
      <span className="fb-btn">Follow</span>
    </a>
  );
}
