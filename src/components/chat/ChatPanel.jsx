"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import MessageList from "./MessageList";
import ChatComposer from "./ChatComposer";
import useFocusTrap from "@/hooks/useFocusTrap";

const ChatHeader = ({ onClose, onClear, canClear }) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-white/5 shrink-0"
      style={{ background: "#06001e" }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #24CBFF, #FC59FF)" }}
        aria-hidden="true"
      >
        <svg className="w-5 h-5 text-deep-blue" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 0 1 2 2v1h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3V4a2 2 0 0 1 2-2zM9 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-playfair font-semibold text-white text-base leading-tight">
          Portfolio Assistant
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          <span className="font-opensans text-[11px] text-white/60">
            Ask about Abdullah&apos;s work
          </span>
        </div>
      </div>

      {canClear &&
        (confirming ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              setConfirming(false);
            }}
            aria-label="Confirm clearing the conversation"
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-opensans font-semibold
              text-red border border-red/40 bg-red/10 hover:bg-red/20 transition duration-300"
          >
            Sure?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Clear the conversation"
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-opensans text-white/60
              hover:text-white hover:bg-white/5 transition duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
          >
            Clear
          </button>
        ))}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close AI assistant"
        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5
          transition duration-300 focus:outline-none focus-visible:ring-2
          focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#06001e]"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
};

const ChatPanel = ({ id, chat, isDesktop, onClose, announce }) => {
  const panelRef = useRef(null);
  const composerRef = useRef(null);
  const hintId = useId();
  const onKeyDown = useFocusTrap(panelRef, true);

  useEffect(() => {
    // Next frame, so focusing does not fight the open animation.
    const raf = requestAnimationFrame(() => composerRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      ref={panelRef}
      id={id}
      role="dialog"
      // aria-modal only on mobile: on desktop the page stays visible and
      // interactive, so claiming modality would lie to screen readers.
      aria-modal={isDesktop ? undefined : "true"}
      aria-label="AI assistant — ask about Abdullah"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        background: "#05003a",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        transformOrigin: "bottom right",
      }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden border-t border-white/10
        md:inset-auto md:bottom-8 md:right-8 md:w-[400px] md:h-[620px]
        md:max-h-[calc(100vh-10rem)] md:rounded-2xl md:border"
    >
      <ChatHeader
        onClose={onClose}
        canClear={chat.canClear}
        onClear={() => {
          chat.clear();
          announce("Conversation cleared.");
          composerRef.current?.focus();
        }}
      />
      <MessageList
        messages={chat.messages}
        status={chat.status}
        error={chat.error}
        onRetry={chat.retry}
        onPick={chat.send}
      />
      <ChatComposer
        onSend={chat.send}
        disabled={chat.isSending}
        inputRef={composerRef}
        hintId={hintId}
      />
    </motion.div>
  );
};

export default ChatPanel;
