import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { getAllArticles, getArticle } from "@/lib/articles";
import { COUNTRIES, CATEGORIES } from "@/lib/site";

// Auto-generated 1200x675 share image for every article (Google Discover wants >=1200px wide):
// the country photo (JPEG copy made by scripts/build-thumbs.mjs) with the headline on a navy shade.
export const dynamic = "force-static";
export const size = { width: 1200, height: 675 };
export const contentType = "image/png";
export const alt = "TheJobSeek job news";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ country: a.country, slug: a.slug }));
}

function photoData(country: string) {
  const file = path.join(process.cwd(), "public", "images", "countries", `${country}.jpg`);
  return fs.existsSync(file) ? `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}` : "";
}

export default async function Image({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country, slug } = await params;
  const a = getArticle(country, slug);
  const title = a?.title || "Job News";
  const label = a ? `${COUNTRIES[a.country].name} · ${CATEGORIES[a.category].name}` : "TheJobSeek";
  const photo = photoData(country);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#13235b", fontFamily: "sans-serif" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={1200} height={675} alt="" style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 675, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 675,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            color: "white",
            background: "linear-gradient(90deg, rgba(11,22,64,0.94) 0%, rgba(11,22,64,0.82) 58%, rgba(11,22,64,0.35) 100%)",
          }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 800, color: "#13235b", background: "#f4b41a", padding: "8px 18px", textTransform: "uppercase", letterSpacing: 2 }}>
              {label}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: title.length > 80 ? 52 : 62, fontWeight: 800, lineHeight: 1.15, maxWidth: 960 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 800 }}>
            The<span style={{ color: "#f4b41a" }}>JobSeek</span>
            <span style={{ marginLeft: 16, fontSize: 26, fontWeight: 400, color: "#dfe5f5" }}>thejobseek.com · Verified job news</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
