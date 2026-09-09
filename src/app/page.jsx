import { projects } from "@/data/projectsData";
import HomeSections from "./HomeSections";

export default function Page() {
  // Project down to only the six fields the cards render. Keeps the ~51KB of
  // project prose (descriptions, roles, seoKeywords...) on the server instead
  // of shipping all ten projects' full text to every visitor.
  const cards = projects.map(
    ({ slug, title, stack, accent, shortDescription, image }) => ({
      slug,
      title,
      stack,
      accent,
      shortDescription,
      image,
    }),
  );

  return <HomeSections cards={cards} />;
}
