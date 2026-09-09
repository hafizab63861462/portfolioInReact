"use client";

import { useCallback } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Tab-cycle trap only, attached via React onKeyDown rather than a document
// listener, so it cannot interfere with Tab anywhere else on the page.
export default function useFocusTrap(containerRef, enabled = true) {
  return useCallback(
    (event) => {
      if (!enabled || event.key !== "Tab") return;
      const nodes = Array.from(
        containerRef.current?.querySelectorAll(FOCUSABLE) || [],
      ).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [containerRef, enabled],
  );
}
