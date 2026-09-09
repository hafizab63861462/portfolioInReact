"use client";

import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import ChatLauncher from "./ChatLauncher";
import ChatPanel from "./ChatPanel";
import useChat from "@/hooks/useChat";
import useMediaQuery from "@/hooks/useMediaQuery";

const PANEL_ID = "ai-chat-panel";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const launcherRef = useRef(null);
  const wasOpenRef = useRef(false);
  const hasOpenedRef = useRef(false);

  // md: is 1060px in this Tailwind config, and this is its JS twin.
  const isDesktop = useMediaQuery("(min-width: 1060px)");
  const chat = useChat();

  if (isOpen) hasOpenedRef.current = true;

  // Document-level so Esc works even if focus escaped the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Return focus to the launcher on close, guarded so it does not steal focus
  // on first mount.
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) launcherRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Lock body scroll only for the mobile full-screen sheet. Restores the
  // previous value rather than hardcoding "".
  useEffect(() => {
    if (!isOpen || isDesktop) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isDesktop]);

  useEffect(() => {
    if (!announcement) return;
    const t = setTimeout(() => setAnnouncement(""), 1500);
    return () => clearTimeout(t);
  }, [announcement]);

  return (
    <MotionConfig reducedMotion="user">
      {/* Narrow assertive region for status only — never message content, so
          it cannot compete with the polite log in MessageList. */}
      <span className="sr-only" role="status" aria-live="assertive">
        {announcement}
      </span>

      <ChatLauncher
        isOpen={isOpen}
        panelId={PANEL_ID}
        buttonRef={launcherRef}
        showPing={!hasOpenedRef.current}
        onClick={() => setIsOpen((v) => !v)}
      />

      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            key="chat-panel"
            id={PANEL_ID}
            chat={chat}
            isDesktop={isDesktop}
            announce={setAnnouncement}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

// App-level scroll state re-renders the layout; this widget takes no props,
// so memo makes those re-renders free for the whole chat subtree.
export default memo(ChatWidget);
