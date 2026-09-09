"use client";

import { motion, useReducedMotion } from "framer-motion";

const ChatLauncher = ({ isOpen, onClick, buttonRef, panelId, showPing }) => {
  const reduced = useReducedMotion();

  return (
    <div className="fixed z-50 bottom-5 right-5 md:bottom-8 md:right-8">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant to ask about Abdullah"}
        aria-expanded={isOpen}
        aria-controls={panelId}
        whileTap={{ scale: 0.96 }}
        className="group relative flex items-center justify-center gap-2 h-14 w-14
          md:h-auto md:w-auto md:px-5 md:py-3.5 rounded-full
          font-opensans font-semibold text-sm text-deep-blue tracking-wide
          transition duration-300 hover:opacity-90
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue
          focus-visible:ring-offset-2 focus-visible:ring-offset-deep-blue"
        style={{
          background:
            "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.55)",
        }}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 md:w-5 md:h-5 text-deep-blue"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 md:w-5 md:h-5 text-deep-blue"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM8 9h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0 4h5a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z" />
          </svg>
        )}

        <span className="hidden md:inline">Ask AI</span>

        {/* Same attention ping already used on the Contact availability badge. */}
        {showPing && !isOpen && !reduced && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatLauncher;
