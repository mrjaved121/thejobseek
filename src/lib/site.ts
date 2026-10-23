import taxonomy from "../../content/taxonomy.json";

export const SITE = {
  name: "TheJobSeek",
  domain: "thejobseek.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://thejobseek.com").replace(/\/$/, ""),
  tagline: "UAE & Gulf job news",
  alternateNames: ["The Job Seek", "TheJobSeek.com", "thejobseek.com"],
  // Add every official profile you create (LinkedIn page, X, YouTube, Google Business, etc.): used in schema sameAs.
  profiles: [] as string[],
  description:
    "TheJobSeek publishes verified job, work visa and labour law news for the UAE and the Gulf, plus the UK, USA, Canada, Australia and Europe, based on official notices and decisions.",
  locale: "en",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@thejobseek.com",
  social: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://www.facebook.com/thejobseeknews",
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

// Navigation and homepage order: GCC first (UAE leading), then UK, USA, Canada, Australia, Europe.
export const PRIMARY_COUNTRIES = ["uae", "saudi-arabia", "qatar", "kuwait", "oman", "bahrain", "uk", "usa", "canada", "australia", "europe"];

export const COUNTRY_CODES: Record<string, string> = {
  uae: "AE", "saudi-arabia": "SA", qatar: "QA", kuwait: "KW", oman: "OM", bahrain: "BH",
  uk: "UK", usa: "US", canada: "CA", australia: "AU", europe: "EU", pakistan: "PK", india: "IN",
};

// One photo per country (public/images/countries/<key>.webp, free Unsplash licence, see content/country-photo-credits.md).
// Used for every article thumbnail of that country (unless the article sets its own `image:`) and for country page banners.
export const COUNTRY_PHOTOS: Record<string, string> = {
  uae: "Burj Khalifa and the Dubai skyline, UAE",
  "saudi-arabia": "Kingdom Centre tower in Riyadh, Saudi Arabia",
  qatar: "Katara Towers in Lusail, Qatar",
  kuwait: "Kuwait Towers in Kuwait City",
  oman: "Al Lawatiya Mosque in Muscat, Oman",
  bahrain: "Bahrain World Trade Center in Manama",
  uk: "Big Ben and the Houses of Parliament, London, UK",
  usa: "Empire State Building and the New York skyline, USA",
  canada: "CN Tower and the Toronto skyline, Canada",
  australia: "Sydney Opera House and harbour, Australia",
  europe: "European Union flags in Brussels",
};
// Banner shown on country pages (small WebP made at build time) and the JPEG used for social share previews.
export const countryPhoto = (c: string) => (COUNTRY_PHOTOS[c] ? `/thumbs/country-${c}.webp` : "");
export const countryShareImage = (c: string) => (COUNTRY_PHOTOS[c] ? `/images/countries/${c}.jpg` : "");

// Pillar guides: linked from the sidebar and from every article of that country (internal links help ranking).
export const ESSENTIAL_GUIDES: { country: string; slug: string; label: string }[] = [
  { country: "uae", slug: "uae-labour-law-guide-private-sector-workers", label: "UAE Labour Law 2026: the complete guide" },
  { country: "uae", slug: "how-to-find-a-job-in-uae-guide", label: "How to find a job in the UAE" },
  { country: "uae", slug: "uae-end-of-service-gratuity-calculation-guide", label: "UAE gratuity calculator guide" },
  { country: "uae", slug: "uae-job-offer-scam-warning-signs", label: "How to spot a fake UAE job offer" },
];

export const CATEGORIES = taxonomy.categories as Record<string, { name: string; description: string }>;
