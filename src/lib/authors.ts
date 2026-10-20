export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  sameAs?: string[];
};

// Real author pages with real bios matter for Google News and AdSense trust (E-E-A-T).
// Edit these to match the people who actually write and check articles.
export const AUTHORS: Record<string, Author> = {
  "javed-latif": {
    id: "javed-latif",
    name: "Javed Latif",
    role: "Founder & Editor",
    bio: "Javed Latif is the founder and editor of TheJobSeek. A Dubai-based developer and digital marketer originally from Faisalabad, he has lived and worked in the UAE and follows UAE and Pakistan recruitment closely. He reviews every article against official sources before publication.",
    sameAs: [],
  },
  "editorial-team": {
    id: "editorial-team",
    name: "TheJobSeek Editorial Team",
    role: "Editorial Team",
    bio: "The TheJobSeek editorial team tracks official recruitment notices, government portals and labour regulations in the UAE and Pakistan, and turns them into clear, verified updates for job seekers.",
  },
};

export const getAuthor = (id: string) => AUTHORS[id] || AUTHORS["editorial-team"];
