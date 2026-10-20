import { ImageResponse } from "next/og";
import { getAllArticles, getArticle } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

// Auto-generated 1200x675 share image for every article (Google Discover wants >=1200px wide).
export const size = { width: 1200, height: 675 };
export const contentType = "image/png";
export const alt = "TheJobSeek job news";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ country: a.country, slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  const a = getArticle(country, slug);
  const title = a?.title || "Job News";
  const label = a ? `${COUNTRIES[a.country].name} · ${CATEGORIES[a.category].name}` : "TheJobSeek";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f3d47 0%, #0b2f37 100%)",
          color: "white",
          padding: 70,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: "#f2c45a", textTransform: "uppercase", letterSpacing: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: title.length > 80 ? 54 : 66, fontWeight: 800, lineHeight: 1.15 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          The<span style={{ color: "#f2c45a" }}>JobSeek</span>
          <span style={{ marginLeft: 16, fontSize: 26, fontWeight: 400, color: "#b9d3d7" }}>thejobseek.com</span>
        </div>
      </div>
    ),
    size
  );
}
