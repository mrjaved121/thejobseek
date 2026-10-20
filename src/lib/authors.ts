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
  "mr-jay": {
    id: "mr-jay",
    name: "Mr Jay",
    role: "Founder & Editor",
    bio: "Mr Jay is the founder and editor of TheJobSeek. Based in Dubai, he has lived and worked in the UAE and follows UAE and Gulf labour law, hiring and work visa news closely, along with the main overseas destinations for Gulf-based job seekers. He reviews every article against its official source before publication.",
    sameAs: [],
  },
  "editorial-team": {
    id: "editorial-team",
    name: "TheJobSeek Editorial Team",
    role: "Editorial Team",
    bio: "The TheJobSeek editorial team tracks official recruitment notices, government portals and labour regulations in the UAE, the wider Gulf, the UK, USA, Canada, Australia and Europe, and turns them into clear, verified updates for job seekers.",
  },
};

export const getAuthor = (id: string) => AUTHORS[id] || AUTHORS["editorial-team"];
