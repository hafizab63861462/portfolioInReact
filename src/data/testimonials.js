// PURE DATA ONLY — see the header note in profile.js.
//
// Real testimonials only, quoted verbatim. The assistant will repeat these as
// genuine client feedback, so never add placeholder or illustrative entries.
// When this array is empty the knowledge-base builder emits a truthful
// "none published yet" record instead.
//
// Shape: { id, author, role?, company?, text, projectSlug?, source? }
//
// `author` holds the attribution exactly as supplied. These reviews were
// provided anonymised, so no names or company names have been invented.
// `projectSlug` is set only where the review names the work unambiguously.

export const testimonials = [
  {
    id: "fintech-client",
    author: "FinTech Project Client",
    text:
      "Abdullah was highly reliable throughout the project. He handled the " +
      "payment integrations carefully, understood the technical requirements " +
      "quickly, and consistently worked toward delivering a stable solution.",
    projectSlug: "quicktopups",
  },
  {
    id: "trading-client",
    author: "Trading Platform Client",
    text:
      "Abdullah demonstrated strong full-stack development skills while " +
      "working on our trading platform. He was able to understand complex " +
      "requirements around exchange integrations and turn them into " +
      "practical features.",
    projectSlug: "copy-trading",
  },
  {
    id: "gaming-client",
    author: "Gaming & Mini Apps Client",
    text:
      "Abdullah did a great job building and integrating our gaming mini " +
      "apps. He worked across the frontend and backend, handled API " +
      "integrations, and was responsive when issues needed to be resolved.",
  },
  {
    id: "team-feedback",
    author: "Project Team Feedback",
    text:
      "Abdullah takes ownership of his work and is comfortable working " +
      "independently. He communicates technical issues clearly and focuses " +
      "on finding practical solutions rather than simply identifying problems.",
  },
  {
    id: "long-term-collaboration",
    author: "Long-Term Collaboration",
    text:
      "Working with Abdullah has been a positive experience. He understands " +
      "requirements well, communicates effectively with the team, and is " +
      "capable of taking a feature from development through delivery.",
  },
];
