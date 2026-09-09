import { ImageResponse } from "next/og";

export const alt = "Hafiz Abdullah — Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 80,
          background: "#010026",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", height: 8, width: 180, background: "#2CBCE9" }} />
        <div style={{ fontSize: 68, fontWeight: 600, marginTop: 36 }}>
          Hafiz Abdullah
        </div>
        <div style={{ fontSize: 34, color: "#2CBCE9", marginTop: 16 }}>
          Full-Stack Software Engineer
        </div>
        <div style={{ fontSize: 26, color: "#ededed", marginTop: 28 }}>
          React · Next.js · Node.js · NestJS · MongoDB
        </div>
        <div style={{ fontSize: 22, color: "#757575", marginTop: 44 }}>
          5+ years · Lahore, Pakistan
        </div>
      </div>
    ),
    { ...size },
  );
}
