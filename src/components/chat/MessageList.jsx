"use client";

import { motion, useReducedMotion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import useAutoScroll from "@/hooks/useAutoScroll";
import {
  DISCLAIMER, GREETING, MAX_RENDERED_MESSAGES, SUGGESTIONS,
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
