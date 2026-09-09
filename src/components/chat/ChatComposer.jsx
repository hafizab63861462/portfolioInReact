"use client";

import { useLayoutEffect, useState } from "react";
import { MAX_INPUT_CHARS, TEXTAREA_MAX_PX } from "@/config/chat";

const ChatComposer = ({ onSend, disabled, inputRef, hintId }) => {
  // Draft text is local, so typing never re-renders the message list.
  const [value, setValue] = useState("");

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    // Reset to auto BEFORE reading scrollHeight or the box never shrinks.
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_PX)}px`;
  }, [value, inputRef]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    // Without this guard, accepting an IME candidate sends the message.
    if (e.nativeEvent.isComposing) return;
    e.preventDefault();
    submit();
  };

  return (
    <div
      className="shrink-0 border-t border-white/5 px-3 pt-3"
      style={{
        background: "#06001e",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          rows={1}
          value={value}
          disabled={disabled}
          maxLength={MAX_INPUT_CHARS}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Message the AI assistant"
          aria-describedby={hintId}
          placeholder="Ask about Abdullah's work…"
          className="flex-1 max-h-32 resize-none overflow-y-auto
            bg-deep-blue border border-white/10 rounded-2xl px-4 py-3
            font-opensans text-white placeholder-dark-grey text-sm leading-relaxed
            focus:outline-none focus:border-blue transition duration-300
            disabled:opacity-50"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="shrink-0 h-11 w-11 rounded-full flex items-center justify-center
            text-deep-blue transition duration-300 hover:opacity-90 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#06001e]"
          style={{
            background:
              "linear-gradient(90deg, #24CBFF 14.53%, #FC59FF 69.36%, #FFBD0C 117.73%)",
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p id={hintId} className="hidden md:block text-[10px] font-opensans text-dark-grey">
          Enter to send · Shift + Enter for a new line
        </p>
        {value.length > 450 && (
          <p
            className={`text-[10px] font-opensans ml-auto ${
              value.length > 550 ? "text-yellow" : "text-dark-grey"
            }`}
          >
            {value.length}/{MAX_INPUT_CHARS}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatComposer;
