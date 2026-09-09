// Builds the knowledge base once at module load (cold start). Pure, no I/O.
//
// Chunk shape:
//   { id, group, source, label, slug?, priority, fields{title,tags,keywords,
//     headline,body}, text, tokens }
// `text` is what actually goes into the prompt; `fields` only feeds retrieval.

import { projects } from "../../data/projectsData.js";
import {
  profile, experience, education, skills, achievements, strengths, contact,
} from "../../data/profile.js";
import { testimonials } from "../../data/testimonials.js";

const estimateTokens = (s) => Math.ceil(s.length / 3.8);

// Status must be stated explicitly, including when it is unknown — otherwise
// the model has nothing grounded to answer "is he still working on X?" with
// and is tempted to infer from dates or technology.
const STATUS_TEXT = {
  current: "Status: this is a CURRENT, ongoing project that Abdullah is working on.",
  past: "Status: this is a PAST, completed project. Abdullah is no longer working on it.",
  unspecified:
    "Status: this portfolio does not state whether this project is current or past. " +
    "Do not assume it is ongoing.",
};
const statusText = (p) => STATUS_TEXT[p.status] ?? STATUS_TEXT.unspecified;
const flatSkills = () => Object.values(skills).flat();

function chunk({ id, group, source, label, slug, priority = 0, title, tags = [], keywords = [], headline = "", body }) {
  const text = [headline, body].filter(Boolean).join("\n");
  return {
    id, group, source, label, slug, priority,
    fields: { title, tags, keywords, headline, body },
    text: `${title}\n${text}`,
    tokens: estimateTokens(text) + estimateTokens(title),
  };
}

function buildProfileCore() {
  const current = experience.find((e) => e.current);
  return chunk({
    id: "profile:core",
    group: "profile",
    source: "profile",
    label: "Hafiz Abdullah",
    priority: 0.3,
    title: "Hafiz Abdullah — professional profile",
    tags: ["profile", "summary", "about", "who", "overview", "specialise", "specialize"],
    keywords: ["software engineer", "full stack", "developer", "MERN"],
    headline: profile.headline,
    body:
      `${profile.summary}\n` +
      `Experience: ${profile.experienceSummary}. Based in ${profile.location}.\n` +
      `Current role: ${current.role} at ${current.company} (since ${current.start}).\n` +
      `Core technologies: ${flatSkills().join(", ")}.`,
  });
}

function buildExperience() {
  return experience.map((e) =>
    chunk({
      id: `experience:${e.id}`,
      group: `experience:${e.id}`,
      source: "experience",
      label: `${e.role}, ${e.company}`,
      priority: e.current ? 0.2 : 0,
      title: `${e.role} at ${e.company} (${e.start} – ${e.end})`,
      tags: [
        e.company.toLowerCase(), "experience", "role", "job", "company",
        ...e.relatedProjects,
        // The current ROLE needs the same status vocabulary as current
        // projects, or "where does he work now?" is outranked by projects.
        ...(e.current
          ? ["current", "currently", "now", "present", "ongoing", "latest"]
          : ["past", "previous", "former"]),
      ],
      keywords: e.technologies,
      body:
        `Location: ${e.location}.\n` +
        (e.note ? `${e.note}\n` : "") +
        e.highlights.map((h) => `- ${h}`).join("\n") +
        `\nTechnologies: ${e.technologies.join(", ")}.`,
    }),
  );
}

function buildEducation() {
  return education.map((ed) =>
    chunk({
      id: `education:${ed.id}`,
      group: "education",
      source: "education",
      label: "Education",
      title: `Education: ${ed.degree}`,
      tags: ["education", "degree", "university", "study", "studied", "college", "qualification"],
      body: `${ed.degree} from ${ed.institution}, ${ed.start} – ${ed.end}, ${ed.location}.`,
    }),
  );
}

function buildSkills() {
  return chunk({
    id: "skills:all",
    group: "skills",
    source: "skills",
    label: "Skills",
    priority: 0.1,
    title: "Technical skills and technologies",
    tags: ["skills", "technologies", "stack", "tech", "frontend", "backend", "database", "cloud", "devops"],
    keywords: flatSkills(),
    body: Object.entries(skills)
      .map(([k, v]) => `${k}: ${v.join(", ")}`)
      .join("\n"),
  });
}

function buildAchievements() {
  return chunk({
    id: "achievements",
    group: "achievements",
    source: "skills",
    label: "Achievements",
    title: "Key achievements and strengths",
    tags: ["achievements", "accomplishments", "strengths", "highlights", "best", "proud"],
    body:
      achievements.map((a) => `- ${a}`).join("\n") +
      "\nStrengths:\n" +
      strengths.map((s) => `- ${s}`).join("\n"),
  });
}

function buildContact() {
  return chunk({
    id: "contact",
    group: "contact",
    source: "contact",
    label: "Contact",
    title: "Getting in touch and availability",
    tags: ["contact", "hire", "available", "availability", "freelance", "reach", "phone", "booking"],
    body:
      `${contact.availability}.\n` +
      `Preferred: ${contact.preferred}.\n` +
      `Phone (published on this site): ${contact.phone}\n` +
      `Calendly: ${contact.calendly}\n` +
      `LinkedIn: ${contact.linkedin}\n` +
      `GitHub: ${contact.github}\n` +
      `${contact.upwork}\n${contact.fiverr}\n` +
      `No personal email address is published; use the contact form or Calendly.`,
  });
}

function buildTestimonials() {
  if (!testimonials.length) {
    return [
      chunk({
        id: "testimonials:none",
        group: "testimonials",
        source: "testimonials",
        label: null, // suppressed from the source chip
        title: "Client testimonials and reviews",
        tags: ["testimonials", "reviews", "feedback", "recommendations", "references", "ratings", "say", "clients", "colleagues"],
        body:
          "No client testimonials, reviews or recommendations have been published in " +
          "this portfolio yet. Visitors who would like references can request them " +
          "through the contact form or by booking a call.",
      }),
    ];
  }

  // One combined chunk rather than one per review: the reviews are short, and
  // "what do people say about him?" should surface all of them at once, which
  // per-review chunks would prevent (the retriever caps chunks per group).
  const byProject = testimonials.filter((t) => t.projectSlug);
  return [
    chunk({
      id: "testimonials:all",
      group: "testimonials",
      source: "testimonials",
      label: "Testimonials",
      slug: byProject.length === 1 ? byProject[0].projectSlug : undefined,
      priority: 0.1,
      title: `Client testimonials and reviews (${testimonials.length} published)`,
      tags: ["testimonials", "reviews", "feedback", "recommendations", "references",
             "ratings", "say", "said", "clients", "colleagues", "praise", "endorsement"],
      keywords: testimonials.map((t) => t.author),
      body:
        `${testimonials.length} client and colleague reviews are published in this portfolio:\n\n` +
        testimonials
          .map((t) => {
            const attribution = [t.author, t.role, t.company].filter(Boolean).join(", ");
            const project = t.projectSlug ? ` (regarding ${t.projectSlug})` : "";
            return `- ${attribution}${project}: "${t.text}"`;
          })
          .join("\n\n") +
        // Worded to avoid the token "company": it caused this chunk to match
        // "what companies has he worked for?" and be mis-credited in the chip.
        "\n\nThese reviews were provided anonymised, so they are published " +
        "without named individuals or organisations attached.",
    }),
  ];
}

// Broad questions ("what projects has he worked on?") need a roster, not three
// arbitrary deep-dives. This single cheap chunk answers them properly; the
// per-project chunks still win on specific questions.
function buildProjectsIndex() {
  return chunk({
    id: "projects:index",
    group: "projects-index",
    source: "projects",
    label: "Projects",
    priority: 0.15,
    title: "All projects Hafiz Abdullah has worked on",
    tags: ["projects", "portfolio", "work", "built", "list", "overview", "kind",
           "type", "industry", "industries", "current", "currently", "ongoing",
           "now", "past", "previous", "completed", "status", "latest", "active"],
    keywords: projects.map((p) => p.title),
    body:
      projects
        .map(
          (p) =>
            `- ${p.title} (${p.stack}) — ${p.industry}. [${p.status}] ${p.shortDescription}`,
        )
        .join("\n") +
      `\n\nCurrent / ongoing projects: ${
        projects.filter((p) => p.status === "current").map((p) => p.title).join("; ") ||
        "none listed"
      }.` +
      `\nPast / completed projects: ${
        projects.filter((p) => p.status === "past").map((p) => p.title).join("; ") ||
        "none listed"
      }.` +
      `\nProjects whose current/past status is NOT stated in this portfolio: ${
        projects.filter((p) => p.status === "unspecified").map((p) => p.title).join("; ") ||
        "none"
      }. Do not assume these are ongoing.` +
      `\n\nIndustries covered: ${[...new Set(projects.map((p) => p.industry))].join("; ")}.`,
  });
}

function buildProjects() {
  const out = [];
  for (const p of projects) {
    const techAll = Object.values(p.technologies).flat();
    const employer = experience.find((e) => e.relatedProjects?.includes(p.slug));
    const sharedTags = [
      p.slug, "project", ...(employer ? [employer.company.toLowerCase()] : []),
    ];

    // Overview: cheap chunk that answers "what is X?"
    out.push(
      chunk({
        id: `project:${p.slug}:overview`,
        group: `project:${p.slug}`,
        source: "projects",
        label: p.title.split("—")[0].trim(),
        slug: p.slug,
        title: `${p.title} (${p.stack})`,
        tags: [...sharedTags, "overview", "what", "status", p.status,
               ...(p.status === "current"
                 ? ["current", "currently", "ongoing", "now", "active", "latest"]
                 : []),
               ...(p.status === "past"
                 ? ["past", "completed", "former", "previous", "finished"]
                 : [])],
        keywords: [...p.seoKeywords, ...p.skills, p.industry],
        headline: p.headline,
        body:
          `${statusText(p)}\n` +
          `Industry: ${p.industry}.\n${p.shortDescription}\n${p.portfolioSummary}\n` +
          `Technologies — ${Object.entries(p.technologies).map(([k, v]) => `${k}: ${v.join(", ")}`).join("; ")}.\n` +
          `Key features: ${p.keyFeatures.join("; ")}.\n` +
          `Results: ${p.results.join("; ")}.`,
      }),
    );

    // Detail: the expensive chunk that answers "what was his role on X?"
    out.push(
      chunk({
        id: `project:${p.slug}:detail`,
        group: `project:${p.slug}`,
        source: "projects",
        label: p.title.split("—")[0].trim(),
        slug: p.slug,
        title: `${p.title} — role, responsibilities and challenges`,
        tags: [...sharedTags, "role", "responsibilities", "challenges", "did", "built", p.status],
        keywords: [...p.skills, ...techAll],
        body:
          p.description.join("\n") +
          `\nHis role:\n` + p.role.map((r) => `- ${r}`).join("\n") +
          `\nTechnical challenges:\n` + p.technicalChallenges.map((c) => `- ${c}`).join("\n"),
      }),
    );
  }
  return out;
}

export const KB = [
  buildProfileCore(),
  ...buildExperience(),
  ...buildEducation(),
  buildSkills(),
  buildAchievements(),
  buildContact(),
  ...buildTestimonials(),
  buildProjectsIndex(),
  ...buildProjects(),
];

export const CORE_ID = "profile:core";
