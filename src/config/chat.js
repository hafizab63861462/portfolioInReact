export const CHAT_ENDPOINT = "/api/chat";

export const MAX_INPUT_CHARS = 600;      // mirrors the server cap
export const MAX_HISTORY_SENT = 6;       // last 3 exchanges
export const MAX_RENDERED_MESSAGES = 50;
export const MAX_PERSISTED_MESSAGES = 20;
export const REQUEST_TIMEOUT_MS = 20_000;
export const TEXTAREA_MAX_PX = 128;      // keep in sync with max-h-32
export const SCROLL_PIN_THRESHOLD_PX = 48;
export const STORAGE_KEY = "abdullah.chat.v1";

export const GREETING =
  "Hi — I'm Abdullah's portfolio assistant. Ask me about his experience, projects, skills or background.";

export const SUGGESTIONS = [
  "Tell me about Abdullah",
  "What technologies does he use?",
  "What projects has he worked on?",
  "How much experience does he have?",
  "What is his educational background?",
  "What kind of projects can he work on?",
];

export const DISCLAIMER =
  "AI assistant — answers come only from Abdullah's portfolio. It won't discuss personal or private information.";

// Fallback shown whenever the assistant cannot answer — no credits, no key,
// upstream failure or a network problem. The number is already published in
// the site footer and Contact section.
export const WHATSAPP_NUMBER = "+92 321 4365740";
export const WHATSAPP_URL = "https://wa.me/923214365740";
export const FALLBACK_TEXT =
  "The AI assistant isn't available right now. For a quick reply, message Abdullah directly on WhatsApp:";
