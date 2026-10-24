import { getAllArticles, type Article } from "./articles";
import { COUNTRIES, PRIMARY_COUNTRIES } from "./site";

/** Article categories that are actual hiring news (shown in the Jobs hub). */
export const JOB_CATEGORIES = ["govt-jobs", "private-jobs"] as const;

const today = () => new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 10); // Dubai date

/** Closed = the application deadline has passed. Closed jobs leave the Jobs hub automatically on the next build. */
export const isClosed = (a: Article) => Boolean(a.lastDate && a.lastDate < today());

/** Open hiring news, newest first. */
export function getJobs(country?: string): Article[] {
  return getAllArticles().filter(
    (a) =>
      (JOB_CATEGORIES as readonly string[]).includes(a.category) &&
      !isClosed(a) &&
      (!country || a.country === country)
  );
}

/** Countries that have at least one open job story, in navigation order (Gulf first). */
export function jobCountries(): { country: string; count: number }[] {
  const all = getJobs();
  const order = [...PRIMARY_COUNTRIES, ...Object.keys(COUNTRIES).filter((c) => !PRIMARY_COUNTRIES.includes(c))];
  return order
    .map((c) => ({ country: c, count: all.filter((a) => a.country === c).length }))
    .filter((x) => x.count > 0 && COUNTRIES[x.country]?.enabled);
}

export const applyDomain = (a: Article) => {
  try {
    return a.applyUrl ? new URL(a.applyUrl).hostname.replace(/^www\./, "") : "";
  } catch {
    return "";
  }
};
