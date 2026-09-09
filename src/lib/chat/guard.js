// Request validation, origin allowlist, rate limiting, logging helpers.
// Ordered cheapest-rejection-first by the caller.

import crypto from "node:crypto";

export const LIMITS = {
  MAX_BODY_BYTES: 12_000,
  MAX_MESSAGE_CHARS: 600,
  MAX_HISTORY_ENTRIES: 8,
  MAX_HISTORY_CONTENT: 1200,
  KEEP_HISTORY: 6, // last 3 exchanges
  PER_MINUTE: 8,
  PER_HOUR: 40,
};

export function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

export const errorResponse = (status, code, message, headers) =>
  json(status, { error: { code, message } }, headers);

export function checkOrigin(req) {
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Unset allowlist => local development; don't lock the developer out.
  if (!allowed.length) return null;

  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const ok =
    (origin && allowed.some((a) => origin === a || origin.endsWith(a.replace(/^https?:\/\//, "")))) ||
    (!origin && allowed.some((a) => referer.startsWith(a)));

  // Spoofable by curl, but browsers set Origin truthfully and will not let JS
  // lie about it — so this does stop the bot being embedded on another site.
  // Visitor-facing copy: a 403 here almost always means ALLOWED_ORIGINS is
  // misconfigured, not that the visitor did anything wrong.
  return ok
    ? null
    : errorResponse(403, "forbidden", "The assistant isn't available from this address.");
}

// Module-scope map: survives across warm invocations on one instance. Stops a
// runaway tab or a naive loop from one machine. It does NOT coordinate across
// concurrent serverless instances. On Groq's free tier the provider's own
// quota is the hard ceiling, with CHAT_ENABLED as the kill switch.
const hits = new Map();

export function rateLimit(ip) {
  const now = Date.now();
  const times = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);

  const lastMinute = times.filter((t) => now - t < 60_000).length;
  if (lastMinute >= LIMITS.PER_MINUTE) {
    return errorResponse(429, "rate_limited", "Too many messages. Give it a minute.", {
      "retry-after": "60",
    });
  }
  if (times.length >= LIMITS.PER_HOUR) {
    return errorResponse(429, "rate_limited", "Message limit reached. Please try again later.", {
      "retry-after": "600",
    });
  }

  times.push(now);
  hits.set(ip, times);
  if (hits.size > 5000) hits.clear(); // crude bound; this is a soft guard
  return null;
}

const VALID_ROLES = new Set(["user", "assistant"]);

export async function validate(req) {
  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > LIMITS.MAX_BODY_BYTES) {
    return { error: errorResponse(413, "payload_too_large", "That message is too long.") };
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return { error: errorResponse(400, "invalid_request", "Malformed request.") };
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return { error: errorResponse(400, "invalid_request", "Message is required.") };
  }
  if (message.length > LIMITS.MAX_MESSAGE_CHARS) {
    return { error: errorResponse(400, "invalid_request", "That message is too long.") };
  }

  // Anything not named here is ignored — in particular the client can never
  // supply model, system, temperature, max_tokens or chunk ids.
  let history = Array.isArray(body?.history) ? body.history : [];
  history = history
    .slice(-LIMITS.MAX_HISTORY_ENTRIES)
    .filter(
      (m) =>
        m && VALID_ROLES.has(m.role) && typeof m.content === "string" && m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, LIMITS.MAX_HISTORY_CONTENT) }))
    .slice(-LIMITS.KEEP_HISTORY);

  // The Messages API requires the transcript to start with a user turn.
  while (history.length && history[0].role !== "user") history.shift();

  return { value: { message, history } };
}

export function clientIp(req) {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}

export function hashIp(ip) {
  return crypto
    .createHash("sha256")
    .update(`${ip}${process.env.IP_SALT || ""}`)
    .digest("hex")
    .slice(0, 8);
}
