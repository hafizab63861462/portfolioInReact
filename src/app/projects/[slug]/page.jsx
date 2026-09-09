import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/data/projectsData";
import { ACCENT } from "@/data/accents";
import ProjectDetailView from "./ProjectDetailView";

// Prerenders all 10 project pages as static HTML at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params; // params is a Promise as of Next 16
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.shortDescription,
    keywords: project.seoKeywords,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      url: `/projects/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  // Resolve on the server and hand the client view one plain object, so the
  // full projectsData module never enters the client bundle.
  return (
    <ProjectDetailView project={project} accent={ACCENT[project.accent]} />
  );
}
