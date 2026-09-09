// PURE DATA ONLY — no imports, no JSX, no process.env, no browser APIs.
// This module is consumed by both the React app and the server-side chat
// route; anything environment-specific here would break one of them.
//
// Every value below comes from Hafiz Abdullah's CV. Nothing is inferred.
// If a fact is not here, the assistant is required to say it does not know.

export const profile = {
  name: "Hafiz Abdullah",
  title: "Software Engineer",
  location: "Lahore, Pakistan",
  // The one sanctioned figure. The assistant must never compute a duration
  // from the dates below — it quotes this string or nothing.
  experienceSummary: "5+ years",
  headline:
    "Full-stack JavaScript engineer — React, Next.js, Node.js, NestJS and React Native.",
  summary:
    "Software Engineer with 5+ years of experience building full-stack applications. " +
    "Expertise in the MERN stack and modern backend technologies, with a focus on " +
    "designing scalable solutions.",
};

export const experience = [
  {
    id: "walee",
    company: "Walee",
    role: "Associate Lead",
    start: "01/2025",
    end: "Present",
    current: true,
    location: "Lahore, Pakistan",
    highlights: [
      "Leads frontend and backend development of scalable web features using Next.js and Node.js",
      "Designs and maintains RESTful APIs and services with NestJS and MongoDB",
      "Collaborates with cross-functional teams to deliver product requirements on time",
      "Mentors junior developers and reviews pull requests to uphold code quality",
    ],
    technologies: ["Next.js", "Node.js", "NestJS", "MongoDB", "REST"],
    relatedProjects: [],
  },
  {
    id: "devfied",
    company: "Devfied",
    role: "Senior Software Engineer",
    start: "09/2024",
    end: "06/2026",
    location: "Lahore, Pakistan",
    // Overlaps the Walee role; the two ran concurrently.
    concurrentWith: "walee",
    note: "This role ran concurrently with the Associate Lead role at Walee.",
    highlights: [
      "Built full-stack features for the Opto Health healthcare platform — patient triage flow, doctor assignment engine, and dynamic intake forms using React.js and Node.js",
      "Developed a cross-exchange copy trading platform enabling users to replicate trades across Binance and Bybit with real-time analytics and performance tracking",
      "Designed MongoDB schemas and REST APIs supporting both platforms, optimizing queries for performance and scalability",
      "Delivered reusable React components and collaborated with product teams to ship features on schedule",
    ],
    technologies: ["React", "Node.js", "MongoDB", "REST"],
    relatedProjects: ["opto-health", "copy-trading"],
  },
  {
    id: "mergestack-swe",
    company: "Mergestack",
    role: "Software Engineer",
    start: "01/2023",
    end: "09/2024",
    location: "Lahore, Pakistan",
    highlights: [
      "Promoted from Associate Software Engineer to Software Engineer",
      "Worked on M1neral — a transaction management platform for minerals and royalties",
      "Built spatial search and map-based discovery features using React.js, enabling buyers, sellers and service providers to find and evaluate mineral opportunities",
      "Developed backend services with Node.js and MongoDB to manage complex transaction data, document workflows and multi-party collaboration",
      "Integrated Elasticsearch to power fast, location-aware search across large mineral and royalty datasets",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Elasticsearch"],
    relatedProjects: ["m1neral"],
  },
  {
    id: "mergestack-associate",
    company: "Mergestack",
    role: "Associate Software Engineer",
    start: "01/2022",
    end: "01/2023",
    location: "Lahore, Pakistan",
    highlights: [
      "Worked on M1neral — a transaction management platform for minerals and royalties",
      "Built spatial search and map-based discovery features using React.js",
      "Developed backend services with Node.js and MongoDB",
    ],
    technologies: ["React", "Node.js", "MongoDB"],
    relatedProjects: ["m1neral"],
  },
];

export const education = [
  {
    id: "bsc-se",
    degree: "BSc in Software Engineering",
    institution:
      "Faculty of Computing & Information Technology (FCIT / PUCIT)",
    start: "10/2018",
    end: "12/2022",
    location: "Lahore, Pakistan",
  },
];

export const skills = {
  languages: ["JavaScript"],
  frontend: ["React", "Next.js", "React Native"],
  backend: ["Node.js", "NestJS", "REST", "GraphQL"],
  databases: ["MongoDB", "Elasticsearch"],
  cloud: ["AWS"],
  other: ["Web3.js", "Git", "GitHub"],
};

export const achievements = [
  "Built a cross-exchange copy trading platform allowing users to replicate strategies across multiple trading platforms (Binance and Bybit)",
  "Contributed to the Opto Health platform, improving patient care through automation and effective resource allocation",
  "Led a team in developing QuickTopups.com, a digital recharge platform integrating multiple payment services",
];

export const strengths = [
  "Technical proficiency in full-stack development, with expertise in modern frameworks and technologies",
  "Strong problem solving, with a focus on delivering practical solutions",
];

// CONTACT POLICY (decided by Hafiz Abdullah):
//   - The phone number is ALREADY published on this site (Contact section and
//     footer), so the assistant may share it.
//   - His personal email address is deliberately NOT in this knowledge base.
//     The system prompt forbids guessing or reconstructing it.
export const contact = {
  phone: "+92 321 4365740",
  calendly: "https://calendly.com/abdullah-hafiz300/30min",
  linkedin: "https://www.linkedin.com/in/hafiz-abdullah-4b2471203/",
  github: "https://github.com/hafizab63861462",
  upwork: "Upwork — Top Rated freelancer",
  fiverr: "Fiverr — hafizabdulla377",
  preferred:
    "The contact form on this site, or booking a 30-minute call via Calendly",
  availability: "Available for freelance projects, full-time roles and consulting engagements",
};
