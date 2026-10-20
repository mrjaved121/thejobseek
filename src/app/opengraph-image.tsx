import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TheJobSeek – UAE, Gulf & Global Job and Work Visa News";

export default function Image() {
  const file = path.join(process.cwd(), "public", "images", "countries", "uae.jpg");
  const photo = fs.existsSync(file) ? `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}` : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#13235b", fontFamily: "sans-serif" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "center",
            padding: 80, color: "white",
            background: "linear-gradient(90deg, rgba(11,22,64,0.95) 0%, rgba(11,22,64,0.8) 60%, rgba(11,22,64,0.3) 100%)",
          }}
        >
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800 }}>
            The<span style={{ color: "#f4b41a" }}>JobSeek</span>
          </div>
          <div style={{ display: "flex", fontSize: 42, marginTop: 18, color: "#dfe5f5", maxWidth: 860 }}>
            Verified UAE, Gulf &amp; global job and work visa news
          </div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#13235b", background: "#f4b41a", padding: "8px 20px" }}>thejobseek.com</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
