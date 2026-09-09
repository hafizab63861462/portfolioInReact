import { ImageResponse } from "next/og";
import { projects, getProjectBySlug } from "@/data/projectsData";
import { ACCENT } from "@/data/accents";

export const alt = "Project by Hafiz Abdullah";

// Without this the image route is server-rendered on demand (one function
// invocation per social crawl). With it, all 10 cards are baked at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Statically generated at build time — one card per project, baked into the
// build. This is the capability CRA could not provide: social crawlers do not
// execute JS, so client-side meta tags never produce a link preview.
export default async function Image({ params }) {
  const { slug } = await params; // Promise as of Next 16
  const project = getProjectBySlug(slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#010026", color: "#ffffff", fontSize: 56,
          }}
        >
          Hafiz Abdullah
        </div>
      ),
      { ...size },
    );
  }

  const color = ACCENT[project.accent]?.color ?? "#2CBCE9";

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
        <div style={{ display: "flex", height: 8, width: 180, background: color }} />
        <div style={{ fontSize: 30, color, marginTop: 32 }}>{project.stack}</div>
        <div style={{ fontSize: 60, fontWeight: 600, marginTop: 14, lineHeight: 1.15 }}>
          {project.title}
        </div>
        <div style={{ fontSize: 28, color: "#ededed", marginTop: 24 }}>
          {project.industry}
        </div>
        <div style={{ fontSize: 24, color: "#757575", marginTop: 40 }}>
          Hafiz Abdullah · Full-Stack Software Engineer
        </div>
      </div>
    ),
    { ...size },
  );
}
