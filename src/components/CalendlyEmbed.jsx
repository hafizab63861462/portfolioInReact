"use client";

import { useEffect, useRef, useState } from "react";
import { CALENDLY_SCRIPT_URL, CALENDLY_URL } from "../config/calendly";

const EMBED_MIN_HEIGHT = 700;

const loadCalendlyScript = () =>
  new Promise((resolve, reject) => {
    if (window.Calendly) {
      resolve(window.Calendly);
      return;
    }

    const existing = document.querySelector(
      `script[src="${CALENDLY_SCRIPT_URL}"]`,
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(window.Calendly));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Calendly);
    script.onerror = reject;
    document.head.appendChild(script);
  });

const CalendlyEmbed = () => {
  const containerRef = useRef(null);
  const initializedRef = useRef(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || initializedRef.current || embedFailed) return;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const initEmbed = async () => {
      try {
        const Calendly = await loadCalendlyScript();
        if (cancelled || !containerRef.current || initializedRef.current) return;

        Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: containerRef.current,
          resize: true,
        });

        initializedRef.current = true;
      } catch {
        if (!cancelled) setEmbedFailed(true);
      }
    };

    initEmbed();

    return () => {
      cancelled = true;
    };
  }, [isVisible, embedFailed]);

  if (embedFailed) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
        <p className="font-opensans text-grey max-w-md">
          The scheduler could not load. You can still book a meeting directly on
          Calendly.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-4 px-8 rounded-lg font-opensans font-semibold text-deep-blue text-sm tracking-wide transition duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]"
          style={{
            background:
              "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
          }}
        >
          BOOK ON CALENDLY ↗
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget w-full"
      style={{ minWidth: 320, minHeight: EMBED_MIN_HEIGHT }}
      data-url={CALENDLY_URL}
      aria-label="Calendly scheduling widget"
    />
  );
};

export default CalendlyEmbed;
