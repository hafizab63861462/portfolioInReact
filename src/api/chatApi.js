import { CHAT_ENDPOINT, REQUEST_TIMEOUT_MS } from "@/config/chat";

export class ChatApiError extends Error {
  constructor(message, { kind = "server", status, code } = {}) {
    super(message);
    this.name = "ChatApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
    // "unavailable" is a persistent condition (no API key, disabled, or
    // exhausted credits). Offering a retry there just invites the visitor to
    // hammer a button that cannot succeed.
    this.retryable = kind !== "client" && code !== "unavailable";
  }
}

const MESSAGES = {
  rate_limit: "You're sending messages a bit fast. Give it a few seconds and try again.",
  network: "Couldn't reach the assistant. Check your connection and try again.",
  server: "The assistant is having trouble right now. Please try again.",
};

export async function postChat({ message, history, signal }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  let res;
  try {
    res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ChatApiError(MESSAGES.network, { kind: "network" });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }

  // A misconfigured deploy returns HTML with a 200; without this the failure
  // surfaces as a confusing JSON parse error.
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new ChatApiError(MESSAGES.server, { kind: "server", status: res.status });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 429) {
      throw new ChatApiError(data?.error?.message || MESSAGES.rate_limit, {
        kind: "rate_limit", status: 429, code: data?.error?.code,
      });
    }
    if (res.status >= 500) {
      const code = data?.error?.code;
      throw new ChatApiError(
        code === "unavailable"
          ? "The assistant is offline right now. Please use the contact form below."
          : data?.error?.message || MESSAGES.server,
        { kind: "server", status: res.status, code },
      );
    }
    throw new ChatApiError(
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Something about that request wasn't accepted.",
      { kind: "client", status: res.status },
    );
  }

  if (typeof data?.reply !== "string" || !data.reply.trim()) {
    throw new ChatApiError("The assistant returned an empty response.", { kind: "server" });
  }

  return {
    reply: data.reply,
    sources: data.sources && typeof data.sources === "object" ? data.sources : null,
  };
}
