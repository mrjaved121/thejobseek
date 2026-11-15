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
    "Daily job news for the UAE and Gulf: who is hiring, official apply links, salaries and work visa updates, plus jobs in the UK, USA and Europe.",
  locale: "en",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@thejobseek.com",
  social: {
    tiktok: process.env.NEXT_PUBLIC_TIKTOK || "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://www.facebook.com/thejobseeknews",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "",
  },
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  // The container loads GA4 (G-PV4N10ET8M), the click events and Microsoft Clarity.
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-PZF88HCT",
  // The person responsible for the site. This is the ONE place to edit these details: the author page, About,
  // Contact and the schema markup all read from here. Fill the optional fields only with real, checkable
  // information; anything left empty is simply not shown.
  editor: {
    id: "mr-jay",
    name: "Mr Jay",
    role: "Founder & Editor, TheJobSeek",
    location: "Dubai, United Arab Emirates",
    bio: "Mr Jay is the founder and editor of TheJobSeek. Based in Dubai, he has lived and worked in the UAE as an expat and writes about jobs, hiring and work rules in the UAE and the Gulf, along with the main overseas job markets for Gulf-based workers.",
    photo: process.env.NEXT_PUBLIC_AUTHOR_IMAGE || "", // square photo in /public, e.g. "/images/authors/editor.webp"
    linkedin: process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN || "",
    profiles: [] as string[], // other personal profiles (X, Facebook, ...)
    fullName: "", // optional: legal/full name, if different from `name`
    credentials: "", // optional: one line of relevant experience or qualifications
    phone: "", // optional: public editorial phone number, international format
    postalAddress: "", // optional: public postal address, one line
  },
};

// Government and public-body websites whose own notices count as an "official source".
// Hosts ending in .gov / .gov.xx / .gob.xx / .gouv.xx / .go.xx / .mil are matched automatically (see isOfficialSource in articles.ts).
export const OFFICIAL_HOSTS = ["canada.ca", "gc.ca", "u.ae", "europa.eu", "gov.scot", "mediaoffice.ae", "mediaoffice.abudhabi", "gop.pk"];

type Country = { name: string; title: string; description: string; enabled: boolean; flag: string };

// Countries and categories live in content/taxonomy.json (shared with the news automation).
export const COUNTRIES = taxonomy.countries as Record<string, Country>;
export type CountryKey = string;

export const enabledCountries = Object.keys(COUNTRIES).filter((c) => COUNTRIES[c].enabled);

// Navigation and homepage order: GCC first (UAE leading), then UK, USA, Canada, Australia, Europe.
export const PRIMARY_COUNTRIES = ["uae", "saudi-arabia", "qatar", "kuwait", "bahrain", "oman", "uk", "usa", "canada", "australia", "europe", "world"];

export const COUNTRY_CODES: Record<string, string> = {
  uae: "AE", "saudi-arabia": "SA", qatar: "QA", kuwait: "KW", oman: "OM", bahrain: "BH",
  uk: "UK", usa: "US", canada: "CA", australia: "AU", europe: "EU", world: "WW", pakistan: "PK", india: "IN",
};

// One photo per country (public/images/countries/<key>.webp, free Unsplash licence, see content/country-photo-credits.md).
// Used for the article thumbnails of that country (unless the article sets its own `image:`) and for country page banners.
// scripts/build-thumbs.mjs gives each article its own crop of the photo, chosen from the slug, so cards in a section differ.
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
