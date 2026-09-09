// Dependency-free BM25-lite retrieval over ~30 chunks.
//
// Not embeddings: at this corpus size a tuned alias map beats a generic
// embedding model on domain jargon, with no network hop and no cost.

import { STOPWORDS, ALIASES, PHRASE_ALIASES } from "./lexicon.js";
import { KB, CORE_ID } from "./kb.js";

const FIELD_BOOST = { title: 3.0, tags: 2.2, headline: 1.6, keywords: 1.3, body: 1.0 };
const K1 = 1.2;
const B = 0.6;
const ALIAS_WEIGHT = 0.6;
const PREV_TURN_WEIGHT = 0.45;
const PREV_GROUP_BONUS = 0.8;
const MAX_PER_GROUP = 2;
const LAMBDA = 0.35;
const BUDGET_TOKENS = 2800;
const MAX_CHUNKS = 8;
const MIN_CHUNKS = 3;
const REL_FLOOR = 0.25;
const ABS_FLOOR = 1.2;

// Keeps ". + #" inside tokens so next.js / web3.js / c# survive, then also
// emits the dotless and prefix forms.
export function tokenize(text) {
  const out = [];
  for (const raw of String(text)
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .split(/[^a-z0-9+#.\-]+/)) {
    const t = raw.replace(/^[.\-]+|[.\-]+$/g, "");
    if (!t || t.length > 40) continue;
    out.push(t);
    if (t.includes(".")) {
      out.push(t.replace(/\./g, ""));
      out.push(t.split(".")[0]);
    }
  }
  return out;
}

// Light suffix folding only — a full stemmer over-merges on a 30-doc corpus.
function fold(t) {
  if (t.length >= 5 && t.endsWith("ies")) return `${t.slice(0, -3)}y`;
  if (t.length >= 5 && t.endsWith("es")) return t.slice(0, -2);
  if (t.length >= 4 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  if (t.length >= 6 && t.endsWith("ing")) return t.slice(0, -3);
  if (t.length >= 6 && t.endsWith("ed")) return t.slice(0, -2);
  return t;
}

function normalize(tokens, { expand = true } = {}) {
  const weights = new Map();
  const bump = (term, w) => {
    if (!term || STOPWORDS.has(term)) return;
    weights.set(term, Math.max(weights.get(term) ?? 0, w));
  };
  for (const raw of tokens) {
    if (STOPWORDS.has(raw)) continue;
    bump(raw, 1);
    bump(fold(raw), 1);
    if (expand) {
      for (const alias of ALIASES[raw] ?? []) {
        for (const a of tokenize(alias)) bump(fold(a), ALIAS_WEIGHT);
      }
    }
  }
  return weights;
}

// ── index (built once at module load) ──────────────────────────────────────
const index = KB.map((c) => {
  const tf = new Map();
  for (const [field, boost] of Object.entries(FIELD_BOOST)) {
    const raw = c.fields[field];
    const text = Array.isArray(raw) ? raw.join(" ") : raw || "";
    for (const tok of tokenize(text)) {
      if (STOPWORDS.has(tok)) continue;
      for (const term of new Set([tok, fold(tok)])) {
        tf.set(term, (tf.get(term) ?? 0) + boost);
      }
      // index-time alias expansion so both sides normalise identically
      for (const alias of ALIASES[tok] ?? []) {
        for (const a of tokenize(alias)) {
          const t = fold(a);
          tf.set(t, (tf.get(t) ?? 0) + boost * ALIAS_WEIGHT);
        }
      }
    }
  }
  return { chunk: c, tf, len: [...tf.values()].reduce((a, b) => a + b, 0), terms: new Set(tf.keys()) };
});

const N = index.length;
const df = new Map();
for (const d of index) for (const t of d.terms) df.set(t, (df.get(t) ?? 0) + 1);
const idf = new Map();
for (const [t, n] of df) idf.set(t, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
const avgLen = index.reduce((a, d) => a + d.len, 0) / N;

// ── follow-up detection ────────────────────────────────────────────────────
const ANAPHORA = /\b(it|its|it's|that|this|those|these|they|them|their|there|same|previous|earlier|the one|that one)\b/i;
const FOLLOWUP = /^(and|but|so|also|what about|how about|why|why not|how so|tell me more|more|elaborate|expand|which one|ok|okay)\b/i;

function needsContext(message) {
  const content = tokenize(message).filter((t) => !STOPWORDS.has(t));
  return content.length < 8 || ANAPHORA.test(message) || FOLLOWUP.test(message.trim());
}

function queryWeights(message) {
  const weights = normalize(tokenize(message));
  const lower = message.toLowerCase();
  for (const [re, terms] of PHRASE_ALIASES) {
    if (!re.test(lower)) continue;
    for (const term of terms) {
      for (const a of tokenize(term)) {
        const t = fold(a);
        weights.set(t, Math.max(weights.get(t) ?? 0, 1));
      }
    }
  }
  return weights;
}

function scoreAll(weights, bonusGroups = new Set()) {
  return index.map((d) => {
    let score = 0;
    for (const [term, qw] of weights) {
      const wtf = d.tf.get(term);
      if (!wtf) continue;
      const termIdf = idf.get(term) ?? 0;
      score += qw * termIdf * ((wtf * (K1 + 1)) / (wtf + K1 * (1 - B + (B * d.len) / avgLen)));
    }
    if (score > 0) score += d.chunk.priority;
    if (bonusGroups.has(d.chunk.group)) score += PREV_GROUP_BONUS;
    return { ...d, score };
  });
}

const jaccard = (a, b) => {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter || 1);
};

/**
 * @param {string} message   current (already sanitized) visitor message
 * @param {Array<{role:string,content:string}>} history
 * @returns {{selected:Array, topScore:number, lowConfidence:boolean}}
 */
export function retrieve(message, history = []) {
  const weights = queryWeights(message);

  // Follow-ups: resolve server-side by re-running on the previous user turn.
  // The endpoint never accepts client-supplied chunk ids — that would let a
  // caller force arbitrary documents into context.
  let bonusGroups = new Set();
  if (needsContext(message)) {
    const prev = [...history].reverse().find((m) => m.role === "user");
    if (prev) {
      for (const [t, w] of queryWeights(prev.content)) {
        weights.set(t, Math.max(weights.get(t) ?? 0, w * PREV_TURN_WEIGHT));
      }
      const prevRanked = scoreAll(queryWeights(prev.content))
        .filter((d) => d.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);
      bonusGroups = new Set(prevRanked.map((d) => d.chunk.group));
    }
  }

  const ranked = scoreAll(weights, bonusGroups).sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score ?? 0;
  const lowConfidence = topScore < ABS_FLOOR;

  const core = index.find((d) => d.chunk.id === CORE_ID);
  const selected = [{ ...core, score: topScore || 1 }];
  let budget = BUDGET_TOKENS - core.chunk.tokens;
  const perGroup = new Map([[core.chunk.group, 1]]);

  if (!lowConfidence) {
    for (const cand of ranked) {
      if (selected.length >= MAX_CHUNKS || budget <= 0) break;
      if (cand.chunk.id === CORE_ID || cand.score <= 0) continue;
      if (cand.score < REL_FLOOR * topScore) break;
      const used = perGroup.get(cand.chunk.group) ?? 0;
      if (used >= MAX_PER_GROUP) continue;
      if (cand.chunk.tokens > budget) continue; // skip, a smaller one may fit

      // MMR: penalise candidates that mostly repeat what is already selected
      const redundancy = Math.max(0, ...selected.map((s) => jaccard(cand.terms, s.terms)));
      if (cand.score - LAMBDA * redundancy * topScore <= 0) continue;

      selected.push(cand);
      perGroup.set(cand.chunk.group, used + 1);
      budget -= cand.chunk.tokens;
    }
  }

  // Top up so the model always has something grounded to work from.
  if (selected.length < MIN_CHUNKS) {
    for (const id of ["skills:all", "contact"]) {
      if (selected.some((s) => s.chunk.id === id)) continue;
      const d = index.find((x) => x.chunk.id === id);
      if (d) selected.push({ ...d, score: 0 });
    }
  }

  return {
    selected: selected.map((s) => ({ ...s.chunk, score: s.score })),
    topScore,
    lowConfidence,
  };
}
