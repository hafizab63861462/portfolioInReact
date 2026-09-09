// Stopwords + alias map for the lexical retriever.
// Deliberately short: IDF already neutralises domain-common words. "project"
// appears in all ~30 chunks, so its IDF is ~0.016 — effectively zero — with
// no hand-tuning needed.

export const STOPWORDS = new Set(`
a an the and or but if then than that this these those of in on at to from by
for with about into over after before between during without within is are was
were be been being am do does did doing have has had having can could should
would will shall may might must i you he she it we they me him her us them my
your his its our their what which who whom whose when where why how all any both
each few more most other some such no nor not only own same so too very just
also as up down out off again further once there here s t don
abdullah hafiz
use uses used using utilise utilize know knows knowing tell tells telling
give gives given get gets got want wants need needs make makes made take
takes look looking see please thanks thank hi hello hey okay yes yeah sure
`.trim().split(/\s+/));

// NOTE on stopwords: generic verbs like "use" must be here. The contact chunk
// contains "use the contact form", so with "use" scored as a content term a
// question like "what technologies does he use?" ranked contact above skills.

// Applied at BOTH index time and query time so the two sides normalise
// identically. Expanded terms are scored at 0.6; literal terms at 1.0.
export const ALIASES = {
  // ── technologies ──
  mongo: ["mongodb"], mongoose: ["mongodb"], nosql: ["mongodb", "database"],
  nest: ["nestjs"], next: ["nextjs"], ssr: ["nextjs"],
  rn: ["react-native", "mobile"],
  mobile: ["react-native", "android", "ios", "app"],
  elastic: ["elasticsearch", "search"],
  gql: ["graphql"], apollo: ["graphql"],
  ws: ["websocket", "realtime"], socket: ["websocket", "realtime"],
  realtime: ["websocket", "realtime"],
  mern: ["mongodb", "express", "react", "nodejs"],
  js: ["javascript"], ts: ["typescript"],

  // ── topic buckets ──
  devops: ["cloud", "aws", "deployment", "infrastructure"],
  infra: ["cloud", "aws", "deployment"],
  hosting: ["cloud", "deployment"], deploy: ["cloud", "deployment"],
  scale: ["scalable", "architecture"], scaling: ["scalable", "architecture"],
  db: ["database"], databases: ["database"],
  api: ["rest", "api"], apis: ["rest", "api"],
  technology: ["skills", "technologies", "stack"],
  technologies: ["skills", "technologies", "stack"],
  tech: ["skills", "technologies", "stack"],
  stack: ["skills", "technologies", "stack"],
  language: ["skills", "languages"], languages: ["skills", "languages"],
  framework: ["skills", "technologies"], frameworks: ["skills", "technologies"],
  tool: ["skills", "tools"], tools: ["skills", "tools"],
  backend: ["nodejs", "api", "database"],
  frontend: ["react", "ui"],
  auth: ["authentication", "security"],

  // ── education ──
  uni: ["education", "degree", "university"],
  university: ["education", "degree"], college: ["education"],
  degree: ["education"], school: ["education"], studied: ["education"],
  study: ["education"], graduated: ["education"], graduate: ["education"],
  bsc: ["education", "degree"], gpa: ["education"], major: ["education"],
  qualification: ["education"], qualifications: ["education"],
  educational: ["education", "degree"], academic: ["education"],
  academics: ["education"], schooling: ["education"],
  background: ["profile", "experience"],

  // ── testimonials ──
  review: ["testimonials"], reviews: ["testimonials"],
  testimonial: ["testimonials"], feedback: ["testimonials"],
  recommendation: ["testimonials"], recommendations: ["testimonials"],
  reference: ["testimonials"], references: ["testimonials"],
  rating: ["testimonials"], ratings: ["testimonials"],
  say: ["testimonials"], clients: ["testimonials", "contact"],

  // ── hiring intent ──
  hire: ["contact", "availability"], hiring: ["contact", "availability"],
  available: ["contact", "availability"],
  availability: ["contact", "availability"],
  freelance: ["contact", "availability"],
  contact: ["contact"], email: ["contact"], phone: ["contact"],
  call: ["contact"], reach: ["contact"], resume: ["contact"], cv: ["contact"],

  // ── seniority / leadership ──
  lead: ["leadership", "mentoring"],
  leadership: ["mentoring", "team"],
  mentor: ["mentoring", "leadership"], mentoring: ["mentoring", "leadership"],
  manage: ["leadership", "team"], team: ["leadership", "team"],
  senior: ["experience", "seniority"], seniority: ["experience"],
  years: ["experience"], year: ["experience"],
  employer: ["experience", "company"], employers: ["experience", "company"],
  worked: ["experience"], work: ["experience"],
  job: ["experience"], jobs: ["experience"], career: ["experience"],
  companies: ["experience", "company"],

  // ── domains ──
  crypto: ["copy-trading", "binance", "bybit", "trading"],
  trading: ["copy-trading", "trading"],
  binance: ["copy-trading"], bybit: ["copy-trading"],
  fintech: ["fintech", "payments"],
  payment: ["quicktopups", "fintech"], payments: ["quicktopups", "fintech"],
  gateway: ["payments", "fintech"], gateways: ["payments", "fintech"],
  healthcare: ["healthcare", "medical", "patient"],
  health: ["healthcare"], medical: ["healthcare"], patient: ["healthcare"],
  doctor: ["healthcare"], hospital: ["healthcare"], clinic: ["healthcare"],
  gis: ["geospatial", "spatial", "map"],
  map: ["geospatial", "spatial"], maps: ["geospatial", "spatial"],
  location: ["geospatial", "search"], geo: ["geospatial"],
  spatial: ["geospatial", "spatial"],
  web3: ["web3", "blockchain"], blockchain: ["web3"],
  ecommerce: ["ebay-clone", "marketplace"],
  marketplace: ["ebay-clone"], shop: ["ebay-clone", "marketplace"],
  ads: ["omnilocal", "adtech"], advertising: ["omnilocal", "adtech"],
  marketing: ["omnilocal", "adtech"],
  industry: ["industry"], industries: ["industry"],

  // project status — without these, "currently working on" matched whichever
  // chunk happened to contain the word "current" rather than the status index
  current: ["current", "ongoing", "status", "projects"],
  currently: ["current", "ongoing", "status", "projects"],
  ongoing: ["current", "ongoing", "status", "projects"],
  now: ["current", "ongoing", "status"],
  presently: ["current", "ongoing", "status"],
  latest: ["current", "ongoing", "projects"],
  recent: ["current", "ongoing", "projects"],
  active: ["current", "ongoing", "status"],
  past: ["past", "completed", "status"],
  previous: ["past", "completed", "status"],
  completed: ["past", "completed", "status"],
  finished: ["past", "completed", "status"],
  former: ["past", "completed", "status"],
  status: ["status", "current", "past"],

  // ── brand -> slug ──
  copyit: ["copy-trading"], qtp: ["quicktopups"],
  quicktopup: ["quicktopups"], mineral: ["m1neral"], minerals: ["m1neral"],
  opto: ["opto-health"], ebay: ["ebay-clone"], jira: ["bug-management-system"],
  bug: ["bug-management-system"], walee: ["walee"], devfied: ["devfied"],
  mergestack: ["mergestack"],
};

// Matched against the raw lowercased query before tokenizing.
export const PHRASE_ALIASES = [
  [/copy\s*trad(e|ing)/, ["copy-trading", "trading"]],
  [/react\s*native/, ["react-native", "mobile"]],
  [/spatial\s*search/, ["geospatial", "search", "m1neral"]],
  [/how\s+(long|many\s+years)/, ["experience"]],
  [/years?\s+of\s+experience/, ["experience"]],
  [/tech(nology)?\s+stack/, ["technologies", "stack"]],
  [/what\s+do\s+(clients|people|colleagues)\s+say/, ["testimonials"]],
  [/where\s+(did|does)\s+he\s+(study|studied|go)/, ["education"]],
  [/payment\s+gateway/, ["payments", "fintech", "quicktopups"]],
  [/why\s+should.*hire/, ["contact", "achievements", "experience"]],
  [/tell\s+me\s+about/, ["profile"]],
];
