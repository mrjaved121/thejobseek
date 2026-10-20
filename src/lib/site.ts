import taxonomy from "../../content/taxonomy.json";

export const SITE = {
  name: "TheJobSeek",
  domain: "thejobseek.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://thejobseek.com").replace(/\/$/, ""),
  tagline: "Verified Gulf job & work visa news",
  description:
    "TheJobSeek publishes verified job, work visa and labour law news for the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain, based on official notices and decisions.",
  locale: "en",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@thejobseek.com",
  social: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "",
  },
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
};

type Country = { name: string; title: string; description: string; enabled: boolean; flag: string };

// Countries and categories live in content/taxonomy.json (shared with the news automation).
export const COUNTRIES = taxonomy.countries as Record<string, Country>;
export type CountryKey = string;

export const enabledCountries = Object.keys(COUNTRIES).filter((c) => COUNTRIES[c].enabled);

// Navigation and homepage order: GCC only, UAE first.
export const PRIMARY_COUNTRIES = ["uae", "saudi-arabia", "qatar", "kuwait", "oman", "bahrain"];

export const CATEGORIES = taxonomy.categories as Record<string, { name: string; description: string }>;
