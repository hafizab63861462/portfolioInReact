import { projects } from "@/data/projectsData";

const BASE = "https://hafizportfolio.netlify.app";

export default function sitemap() {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${BASE}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    })),
  ];
}
