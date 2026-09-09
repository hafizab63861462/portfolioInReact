// Retrieval fixtures. Plain `node src/lib/chat/retrieve.test.mjs` — no API
// calls, no cost. Every constant in retrieve.js is a guess until measured
// here, so add a case whenever a real question retrieves the wrong thing.

import { retrieve } from "./retrieve.js";

// [question, expectedChunkIdSubstring, history?]
const CASES = [
  ["Who is Abdullah?", "profile:core"],
  ["Tell me about Abdullah", "profile:core"],
  ["What does Abdullah specialize in?", "profile:core"],
  ["How much experience does he have?", "profile:core"],
  ["How many years of experience?", "profile:core"],

  ["What companies has he worked for?", "experience:"],
  ["Where does he work now?", "experience:walee"],
  ["What did he do at Mergestack?", "experience:mergestack"],
  ["Tell me about his time at Devfied", "experience:devfied"],
  ["Has he mentored anyone?", "experience:walee"],

  ["What is his educational background?", "education:"],
  ["Where did he go to uni?", "education:"],
  ["What degree does he have?", "education:"],
  ["Did he study computer science?", "education:"],

  ["What technologies does he use?", "skills:"],
  ["What backend technologies does he know?", "skills:"],
  ["What frontend technologies does he use?", "skills:"],
  ["What databases has he worked with?", "skills:"],
  ["Does he know devops?", "skills:"],
  ["mongo experience", "mongodb|skills:|project:"],
  ["Has he worked with NestJS?", "skills:|experience:"],

  ["What projects has he worked on?", "project:"],
  ["Tell me about the crypto trading platform", "project:copy-trading"],
  ["What is M1neral?", "project:m1neral"],
  ["Tell me about Opto Health", "project:opto-health"],
  ["Has he worked with payment gateways?", "project:quicktopups"],
  ["Did he build anything with React Native?", "project:quicktopups-mobile"],
  ["spatial search", "project:m1neral"],
  ["What kind of ecommerce work has he done?", "project:ebay-clone"],

  ["What do people say about Abdullah?", "testimonials"],
  ["Any client reviews?", "testimonials"],
  ["What do his colleagues say about his work?", "testimonials"],

  ["Why should someone hire him?", "contact|achievements|profile:core"],
  ["Is he available for freelance work?", "contact"],
  ["What are his major achievements?", "achievements"],
  ["What industries has he worked in?", "project:|profile:core"],

  // project status
  ["What is he currently working on?", "project:quicktopups"],
  ["What are his current projects?", "projects:index"],
  ["Is he still working on M1neral?", "project:m1neral"],
  ["What did he work on in the past?", "projects:index|project:m1neral|project:copy-trading"],

  // testimonials (now populated)
  ["What do clients say about his work?", "testimonials:all"],
  ["Any reviews from the trading platform client?", "testimonials:all"],

  // follow-up resolution
  [
    "What was his role in that one?",
    "project:copy-trading",
    [
      { role: "user", content: "Tell me about the crypto trading platform" },
      { role: "assistant", content: "Copyit is a cross-exchange copy trading platform." },
    ],
  ],
  [
    "And what about his education?",
    "education:",
    [
      { role: "user", content: "Tell me about M1neral" },
      { role: "assistant", content: "M1neral is a minerals and royalties platform." },
    ],
  ],
];

// Questions that should retrieve nothing confident (lowConfidence === true).
const LOW_CONFIDENCE = [
  "What is his salary?",
  "asdfghjkl qwerty",
  "What's the weather today?",
];

let pass = 0;
const failures = [];

for (const [q, expect, history] of CASES) {
  const { selected, topScore } = retrieve(q, history ?? []);
  const ids = selected.map((c) => c.id);
  const ok = new RegExp(expect).test(ids.join(" "));
  if (ok) pass++;
  else failures.push(`  ✗ ${JSON.stringify(q)}\n      want /${expect}/  got: ${ids.join(", ")} (top=${topScore.toFixed(2)})`);
}

for (const q of LOW_CONFIDENCE) {
  const { lowConfidence, topScore } = retrieve(q);
  if (lowConfidence) pass++;
  else failures.push(`  ✗ ${JSON.stringify(q)}\n      want lowConfidence=true, got false (top=${topScore.toFixed(2)})`);
}

const total = CASES.length + LOW_CONFIDENCE.length;
console.log(`\nretrieval fixtures: ${pass}/${total} passing`);
if (failures.length) {
  console.log("\n" + failures.join("\n"));
  process.exit(1);
}
console.log("all green\n");
