import Groq from "groq-sdk";
import { retrieve } from "@/lib/chat/retrieve";
import {
  buildSystemPrompt, buildMessages, NO_INFORMATION, REFUSAL_PERSONAL,
} from "@/lib/chat/prompt";
import {
  validate, checkOrigin, rateLimit, clientIp, hashIp, errorResponse, json,
} from "@/lib/chat/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Groq's free tier. Override with CHAT_MODEL if you want to trade quality for
// speed — openai/gpt-oss-20b is faster, the 120b follows the grounding rules
// more reliably, and both are free.
const MODEL = process.env.CHAT_MODEL || "openai/gpt-oss-120b";
// gpt-oss models emit reasoning tokens that count against max_tokens and are
// returned in a separate `reasoning` field, so a low budget can leave
// `content` empty. reasoning_effort "low" cut output ~3.5x in testing
// (52 -> 15 tokens for the same answer), which matters on the free tier's
// per-minute limits.
const MAX_TOKENS = 900;
const REASONING_EFFORT = "low";

// Groq keys start with "gsk_". Validating the shape means a key from another
// provider is skipped and reported rather than producing a bare 401 that looks
// like a billing or code fault.
const KEY_VARS = ["GROQ_API_KEY", "CLAUDE_API_KEY", "CLUDE_API_KEY"];
const GROQ_KEY_PREFIX = "gsk_";

function resolveApiKey() {
  const rejected = [];
  for (const name of KEY_VARS) {
    const value = (process.env[name] || "").trim();
    if (!value) continue;
    if (value.startsWith(GROQ_KEY_PREFIX)) return { key: value, name, rejected };
    rejected.push(name);
  }
  return { key: "", name: null, rejected };
}

// Module scope so the client is reused across warm invocations.
let client;
let clientKey;
function getClient(key) {
  if (!client || clientKey !== key) {
    client = new Groq({ apiKey: key });
    clientKey = key;
  }
  return client;
}

// Suppressed sources are the ones present on nearly every request; showing
// them would make the chip identical everywhere and therefore meaningless.
const SOURCE_LABELS = {
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  testimonials: "Testimonials",
  profile: null,
  contact: null,
};
const ORDER = ["projects", "experience", "skills", "education", "testimonials"];

const joinAnd = (items) =>
  items.length <= 1
    ? items[0] ?? ""
    : `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;

function buildSources(selected, topScore, reply) {
  const trimmed = reply.trim();
  if (trimmed === NO_INFORMATION || trimmed === REFUSAL_PERSONAL) {
    return { types: [], docs: [], summary: null };
  }

  // profile:core is always injected with an artificial top score, so it must
  // be excluded when deciding what actually matched.
  const ranked = selected
    .filter((c) => c.id !== "profile:core" && c.score > 0)
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best) return { types: [], docs: [], summary: null };

  // If the strongest match is a source we never advertise (contact, or the
  // "no testimonials yet" sentinel), the answer did not really come from
  // Projects or Experience — so claim nothing rather than crediting a weaker
  // chunk that merely cleared a relative floor.
  if (!SOURCE_LABELS[best.source] || !best.label) {
    return { types: [], docs: [], summary: null };
  }

  // Credit only chunks close to the best match. A loose floor (0.35) let an
  // unrelated project get credited on a contact question.
  const used = ranked.filter(
    (c) => SOURCE_LABELS[c.source] && c.label && c.score >= 0.75 * best.score,
  );

  // Cap at two source types. Naming three is nearly always over-claiming —
  // e.g. the testimonials chunk clearing the floor on a project-status
  // question purely because it contains the word "working".
  const bestByType = new Map();
  for (const c of used) {
    if (!bestByType.has(c.source) || bestByType.get(c.source) < c.score) {
      bestByType.set(c.source, c.score);
    }
  }
  const keep = new Set(
    [...bestByType.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([source]) => source),
  );
  const types = ORDER.filter((t) => keep.has(t));
  const seen = new Set();
  const docs = [];
  for (const c of used) {
    if (!keep.has(c.source) || seen.has(c.label)) continue;
    seen.add(c.label);
    docs.push({ type: c.source, label: c.label, slug: c.slug ?? null });
  }

  return {
    types,
    docs: docs.slice(0, 4),
    summary: types.length
      ? `Based on Abdullah's ${joinAnd(types.map((t) => SOURCE_LABELS[t]))}`
      : null,
  };
}

// Groq uses 429 for BOTH the transient per-minute limit and the daily quota.
// Conflating them is a real bug: a per-minute limit clears in seconds and must
// stay retryable, while a daily one will not clear for hours.
function isDailyQuotaExhausted(err) {
  if (err?.status !== 429) return false;
  const message = String(err?.error?.error?.message ?? err?.message ?? "").toLowerCase();
  if (message.includes("per minute") || message.includes("tpm") || message.includes("rpm")) {
    return false;
  }
  return (
    message.includes("per day") ||
    message.includes("tpd") ||
    message.includes("rpd") ||
    message.includes("daily") ||
    message.includes("credit") ||
    message.includes("billing")
  );
}

const retryAfter = (err) => {
  const raw = err?.headers?.get?.("retry-after") ?? err?.headers?.["retry-after"];
  const seconds = Number(raw);
  return Number.isFinite(seconds) && seconds > 0 ? String(Math.ceil(seconds)) : "30";
};

export async function POST(req) {
  const started = Date.now();
  const requestId = `r_${Math.random().toString(36).slice(2, 10)}`;

  if (process.env.CHAT_ENABLED === "false") {
    return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
  }

  const resolved = resolveApiKey();
  if (!resolved.key) {
    console.error(
      JSON.stringify({
        requestId,
        event: "missing_api_key",
        // Names only — never the values.
        ignoredMalformed: resolved.rejected,
        action:
          "Set GROQ_API_KEY in .env.local to a Groq key starting with 'gsk_' " +
          "(get one free at console.groq.com/keys).",
      }),
    );
    return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
  }

  const originError = checkOrigin(req);
  if (originError) return originError;

  const ip = clientIp(req);
  const limited = rateLimit(ip);
  if (limited) return limited;

  const parsed = await validate(req);
  if (parsed.error) return parsed.error;
  const { message, history } = parsed.value;

  const retrievalStart = Date.now();
  const { selected, topScore, lowConfidence } = retrieve(message, history);
  const retrievalMs = Date.now() - retrievalStart;

  const system = buildSystemPrompt(selected, lowConfidence);
  const messages = buildMessages(system, history, message);

  try {
    const res = await getClient(resolved.key).chat.completions.create(
      {
        model: MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        top_p: 0.9,
        reasoning_effort: REASONING_EFFORT,
      },
      { timeout: 9_000, maxRetries: 0 },
    );

    const choice = res.choices?.[0];
    const reply = (choice?.message?.content || "").trim();

    if (!reply) {
      console.error(
        JSON.stringify({
          requestId,
          event: "empty_reply",
          finishReason: choice?.finish_reason,
          // If this is "length", reasoning tokens consumed the whole budget:
          // raise MAX_TOKENS or lower REASONING_EFFORT.
          reasoningChars: (choice?.message?.reasoning || "").length,
        }),
      );
      return errorResponse(
        502, "upstream_error",
        "The assistant couldn't answer that. Please try again.",
      );
    }

    const sources = buildSources(selected, topScore, reply);

    // Deliberately never logs the visitor's question or the reply — only
    // shapes and retrieval telemetry. Recruiters type identifying things.
    console.log(
      JSON.stringify({
        requestId,
        status: 200,
        latencyMs: Date.now() - started,
        retrievalMs,
        msgLen: message.length,
        historyLen: history.length,
        chunkIds: selected.map((c) => c.id),
        topScore: Number(topScore.toFixed(2)),
        lowConfidence,
        usage: res.usage,
        finishReason: choice?.finish_reason,
        model: MODEL,
        ipHash: hashIp(ip),
      }),
    );

    return json(200, {
      reply,
      sources,
      meta: {
        requestId,
        grounded: sources.types.length > 0,
        truncated: choice?.finish_reason === "length",
      },
    });
  } catch (err) {
    // Log the class only — an SDK error object can carry request details.
    console.error(
      JSON.stringify({
        requestId, event: "upstream_error", name: err?.name, status: err?.status,
      }),
    );

    if (err?.status === 401 || err?.status === 403) {
      console.error(
        JSON.stringify({
          requestId,
          event: "auth_failed",
          keyVar: resolved.name,
          action: "Check the key at console.groq.com/keys",
        }),
      );
      return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
    }

    // Daily quota will not clear for hours — not retryable.
    if (isDailyQuotaExhausted(err)) {
      console.error(
        JSON.stringify({
          requestId,
          event: "daily_quota_exhausted",
          action: "Groq free-tier daily quota reached; it resets on Groq's schedule",
        }),
      );
      return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
    }

    // Per-minute limit — clears in seconds, so keep it retryable and pass
    // through Groq's own retry-after when it supplies one.
    if (err?.status === 429) {
      return errorResponse(
        429, "rate_limited", "The assistant is busy. Please try again in a moment.",
        { "retry-after": retryAfter(err) },
      );
    }

    if (err?.name === "APIConnectionTimeoutError" || err?.name === "AbortError") {
      return errorResponse(504, "upstream_timeout", "That took too long. Please try again.");
    }

    return errorResponse(502, "upstream_error", "Something went wrong. Please try again.");
  }
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST.");
}
