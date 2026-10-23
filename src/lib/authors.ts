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

// One real, named author on every article (E-E-A-T): journalists, Google and AI engines
// check who is behind a source before citing it.
export const AUTHORS: Record<string, Author> = {
  "mr-jay": {
    id: "mr-jay",
    name: "Mr Jay",
    role: "Founder & Editor, TheJobSeek",
    location: "Dubai, United Arab Emirates",
    bio: "Mr Jay is the founder and editor of TheJobSeek. Based in Dubai, he has lived and worked in the UAE as an expat and writes about jobs, hiring and work rules in the UAE and the Gulf, along with the main overseas job markets for Gulf-based workers. He checks every article against its official or original source before it is published.",
    image: process.env.NEXT_PUBLIC_AUTHOR_IMAGE || "",
    linkedin: process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN || "",
    sameAs: [],
    covers: [
      "UAE jobs and hiring: Dubai, Abu Dhabi, Sharjah and the other emirates",
      "Gulf job markets: Saudi Arabia, Qatar, Kuwait, Oman and Bahrain",
      "Emiratisation, Saudization and other localisation job programmes",
      "Salaries, job-market reports, layoffs and hiring trends",
      "Jobs and work rules in the UK, USA, Canada, Australia and Europe for Gulf-based workers",
    ],
    verification: [
      "Every story starts from an official notice, a government or company announcement, or a reputable news report.",
      "Key numbers, dates and names are checked against the original source, which is linked in every article.",
      "Articles are written from scratch in plain English and checked so no text is copied from any source.",
      "Errors are corrected quickly and the article shows the date it was updated.",
    ],
    knowsAbout: ["UAE jobs", "Gulf job market", "UAE Labour Law", "Emiratisation", "Saudization", "work visas", "expat employment"],
  },
};

export const DEFAULT_AUTHOR = "mr-jay";

export const getAuthor = (id: string) => AUTHORS[id] || AUTHORS[DEFAULT_AUTHOR];

export const authorSameAs = (a: Author) => [a.linkedin, ...(a.sameAs || [])].filter(Boolean) as string[];
