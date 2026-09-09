"use client";

import { motion, useReducedMotion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import useAutoScroll from "@/hooks/useAutoScroll";
import {
  DISCLAIMER, FALLBACK_TEXT, GREETING, MAX_RENDERED_MESSAGES, SUGGESTIONS,
  WHATSAPP_NUMBER, WHATSAPP_URL,
} from "@/config/chat";

const TypingIndicator = () => {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className="w-fit rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="font-opensans text-sm italic text-white/60">Thinking…</span>
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-1.5 w-fit rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3.5"
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const WhatsAppFallback = () => (
  <div className="mt-3 pt-3 border-t border-white/10">
    <p className="font-opensans text-xs text-grey leading-relaxed">{FALLBACK_TEXT}</p>
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-full
        bg-green-500/15 border border-green-500/40 text-green-400
        text-xs font-opensans font-semibold transition duration-300
        hover:bg-green-500/25 hover:text-green-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#05003a]"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.03c-.25.69-1.44 1.32-1.98 1.37-.55.05-1.06.25-3.6-.75-3.06-1.21-4.98-4.37-5.13-4.57-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.2 1.05-2.5.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.35.08.12.08.72-.17 1.41z" />
      </svg>
      WhatsApp {WHATSAPP_NUMBER}
    </a>
  </div>
);

const ErrorNotice = ({ error, onRetry }) => (
  <div className="rounded-xl border border-red/30 bg-red/10 px-4 py-3">
    <p className="font-opensans text-xs text-grey leading-relaxed">{error.message}</p>
    {error.retryable && (
      <button
        type="button"
        onClick={onRetry}
        aria-label="Retry sending your last message"
        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red/50
          text-red text-xs font-opensans font-semibold transition duration-300
          hover:text-white hover:bg-red/20 focus:outline-none focus-visible:ring-2
          focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#05003a]"
      >
        Try again
      </button>
    )}
    <WhatsAppFallback />
  </div>
);

const EmptyState = ({ onPick, disabled }) => (
  <div>
    <p className="font-playfair font-semibold text-xl text-white leading-snug">
      Ask about Abdullah
    </p>
    <p className="mt-2 font-opensans text-sm text-grey leading-relaxed">{GREETING}</p>

    <p className="mt-6 mb-3 text-[11px] font-opensans font-semibold uppercase tracking-widest text-dark-grey">
      Try asking
    </p>
    <div role="group" aria-label="Suggested questions" className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="text-left text-xs font-opensans px-3 py-1.5 rounded-full
            border border-white/10 bg-white/[0.04] text-grey
            hover:border-blue/40 hover:bg-blue/10 hover:text-white transition-all duration-300
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#05003a]"
        >
          {q}
        </button>
      ))}
    </div>

    <p className="mt-6 font-opensans text-[11px] text-dark-grey leading-relaxed">{DISCLAIMER}</p>
  </div>
);

const MessageList = ({ messages, status, error, onRetry, onPick }) => {
  const { scrollRef, showJump, scrollToBottom } = useAutoScroll(
    `${messages.length}:${status}`,
  );
  const visible = messages.slice(-MAX_RENDERED_MESSAGES);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-busy={status === "sending"}
        aria-label="Conversation"
        // min-h-0 is load-bearing: without it this flex child will not shrink
        // below its content height and the list never scrolls.
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-5 flex flex-col gap-4"
      >
        {!messages.length && <EmptyState onPick={onPick} disabled={status === "sending"} />}
        {visible.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {status === "sending" && <TypingIndicator />}
        {status === "error" && error && <ErrorNotice error={error} onRetry={onRetry} />}
      </div>

      {showJump && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
            border border-white/10 text-xs font-opensans text-grey
            hover:text-white hover:border-blue/40 transition duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          style={{ background: "#06001e", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
        >
          Jump to latest ↓
        </button>
      )}
    </div>
  );
};

export default MessageList;
