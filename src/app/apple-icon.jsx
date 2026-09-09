import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#010026",
          color: "#2CBCE9",
          fontSize: 96,
          fontWeight: 600,
          letterSpacing: -4,
        }}
      >
        HA
      </div>
    ),
    { ...size },
  );
}
