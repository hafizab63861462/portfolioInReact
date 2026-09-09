import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Replaces the broken `<link rel="icon" />` (empty href) and the missing
// favicon.ico the CRA manifest pointed at.
export default function Icon() {
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
          fontSize: 38,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        HA
      </div>
    ),
    { ...size },
  );
}
