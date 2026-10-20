import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TheJobSeek – Job & Work Visa News";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f3d47 0%, #0b2f37 100%)",
          color: "white",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800 }}>
          The<span style={{ color: "#f2c45a" }}>JobSeek</span>
        </div>
        <div style={{ fontSize: 44, marginTop: 20, color: "#b9d3d7" }}>
          Verified job & work visa news from official sources
        </div>
      </div>
    ),
    size
  );
}
