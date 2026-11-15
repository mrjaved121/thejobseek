import { SITE } from "./site";

export type Author = {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  /** Square photo in /public, e.g. "/images/authors/mr-jay.webp". Leave empty to show an initial instead. */
  image?: string;
  linkedin?: string;
  /** Other personal profiles (X, Facebook, etc.). */
  sameAs?: string[];
  covers: string[];
  verification: string[];
  knowsAbout: string[];
};

// One named editor on every article. The personal details come from SITE.editor in src/lib/site.ts (edit them there).
const E = SITE.editor;
export const AUTHORS: Record<string, Author> = {
  [E.id]: {
    id: E.id,
    name: E.name,
    role: E.role,
    location: E.location,
    bio: [E.bio, E.credentials].filter(Boolean).join(" "),
    image: E.photo,
    linkedin: E.linkedin,
    sameAs: E.profiles,
    covers: [
      "UAE jobs and hiring: Dubai, Abu Dhabi, Sharjah and the other emirates",
      "Gulf job markets: Saudi Arabia, Qatar, Kuwait, Oman and Bahrain",
      "Emiratisation, Saudization and other localisation job programmes",
      "Salaries, job-market reports, layoffs and hiring trends",
      "Jobs and work rules in the UK, USA, Canada, Australia and Europe for Gulf-based workers",
    ],
    verification: [
      "Every story starts from an official notice, a government or company announcement, or a news report, and the article links to it.",
      "Articles are prepared with the help of automated tools, including AI. Key numbers, dates and names are taken from the linked source, where readers can confirm them.",
      "Articles are written in plain English and run through an automatic check for text repeated from other pages.",
      "Not every article is read by a person before it goes live. Errors reported to us are corrected and the article shows the date it was updated.",
    ],
    knowsAbout: ["UAE jobs", "Gulf job market", "UAE Labour Law", "Emiratisation", "Saudization", "work visas", "expat employment"],
  },
};

export const DEFAULT_AUTHOR = E.id;

export const getAuthor = (id: string) => AUTHORS[id] || AUTHORS[DEFAULT_AUTHOR];

export const authorSameAs = (a: Author) => [a.linkedin, ...(a.sameAs || [])].filter(Boolean) as string[];
