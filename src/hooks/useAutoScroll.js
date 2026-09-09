"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { SCROLL_PIN_THRESHOLD_PX } from "@/config/chat";

export default function useAutoScroll(dep) {
  const scrollRef = useRef(null);
  const pinnedRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const reduced = useReducedMotion();

  const scrollToBottom = useCallback(
    (smooth = false) => {
      const el = scrollRef.current;
      if (!el) return;
      // Direct scrollTop, never scrollIntoView: inside a position:fixed panel
      // scrollIntoView also scrolls ancestors and yanks the page behind it.
      if (smooth && !reduced) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      else el.scrollTop = el.scrollHeight;
      pinnedRef.current = true;
      setShowJump(false);
    },
    [reduced],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
      pinnedRef.current = gap <= SCROLL_PIN_THRESHOLD_PX;
      setShowJump(!pinnedRef.current);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Follow new content only if the user was already at the bottom.
  useEffect(() => {
    if (pinnedRef.current) scrollToBottom(false);
  }, [dep, scrollToBottom]);

  return { scrollRef, showJump, scrollToBottom };
}
