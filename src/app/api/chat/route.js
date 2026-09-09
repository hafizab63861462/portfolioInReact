import Anthropic from "@anthropic-ai/sdk";
import { retrieve } from "@/lib/chat/retrieve";
import {
  buildSystemPrompt, buildMessages, NO_INFORMATION, REFUSAL_PERSONAL,
} from "@/lib/chat/prompt";
import {
  validate, checkOrigin, rateLimit, clientIp, hashIp, errorResponse, json,
} from "@/lib/chat/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 700;

// Module scope so the client is reused across warm invocations.
let client;
const getClient = () => (client ??= new Anthropic());

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

  const used = selected.filter(
    (c) =>
      SOURCE_LABELS[c.source] &&
      c.label &&
      c.score >= 0.35 * topScore,
  );

  const types = ORDER.filter((t) => used.some((c) => c.source === t));
  const seen = new Set();
  const docs = [];
  for (const c of used) {
    if (seen.has(c.label)) continue;
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

export async function POST(req) {
  const started = Date.now();
  const requestId = `r_${Math.random().toString(36).slice(2, 10)}`;

  if (process.env.CHAT_ENABLED === "false") {
    return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(JSON.stringify({ requestId, event: "missing_api_key" }));
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
  const messages = buildMessages(history, message);

  try {
    const res = await getClient().messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        system,
        messages,
        // No `thinking` (Haiku 4.5 requires budget_tokens and grounded
        // extraction does not need it), no `output_config.effort` (errors on
        // Haiku 4.5), and no `cache_control` (our prefix is under Haiku's
        // 4096-token minimum, so it would silently never cache).
      },
      { timeout: 9_000, maxRetries: 0 },
    );

    const reply = res.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!reply) {
      console.error(JSON.stringify({ requestId, event: "empty_reply", stopReason: res.stop_reason }));
      return errorResponse(502, "upstream_error", "The assistant couldn't answer that. Please try again.");
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
        stopReason: res.stop_reason,
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
        truncated: res.stop_reason === "max_tokens",
      },
    });
  } catch (err) {
    // Log the class only — an SDK error object can carry request details.
    console.error(
      JSON.stringify({ requestId, event: "upstream_error", name: err?.name, status: err?.status }),
    );

    if (err instanceof Anthropic.AuthenticationError) {
      return errorResponse(503, "unavailable", "The assistant is currently unavailable.");
    }
    if (err instanceof Anthropic.RateLimitError) {
      return errorResponse(429, "rate_limited", "The assistant is busy. Please try again shortly.", {
        "retry-after": "30",
      });
    }
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      return errorResponse(504, "upstream_timeout", "That took too long. Please try again.");
    }
    return errorResponse(502, "upstream_error", "Something went wrong. Please try again.");
  }
}

export async function GET() {
  return errorResponse(405, "method_not_allowed", "Use POST.");
}
