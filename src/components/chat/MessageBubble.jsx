"use client";

import { memo } from "react";
import Link from "next/link";
import FormattedText from "./FormattedText";

const BotAvatar = () => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
    style={{ background: "linear-gradient(135deg, #24CBFF, #FC59FF)" }}
    aria-hidden="true"
  >
    <svg className="w-3.5 h-3.5 text-deep-blue" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2a2 2 0 0 1 2 2v1h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3V4a2 2 0 0 1 2-2zM9 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
    </svg>
  </div>
);

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const summary = message.sources?.summary;
  const docs = message.sources?.docs ?? [];
  const deepLink = docs.find((d) => d.slug);

  return (
    <div className={`flex gap-2.5 items-end ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <BotAvatar />}
      <div className={isUser ? "max-w-[85%]" : "max-w-[85%]"}>
        <div
          className={
            isUser
              ? "rounded-2xl rounded-br-md bg-blue px-4 py-3 font-opensans text-sm leading-relaxed text-deep-blue font-medium whitespace-pre-wrap break-words"
              : "rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 font-opensans text-sm leading-relaxed text-grey break-words"
          }
        >
          {isUser ? message.content : <FormattedText text={message.content} />}
        </div>

        {!isUser && summary && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue/30 bg-blue/10 text-blue text-[11px] font-opensans font-semibold tracking-wide">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 2h9l5 5v15a0 0 0 0 1 0 0H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5z" />
              </svg>
              {summary}
            </span>
            {deepLink && (
              <Link
                href={`/projects/${deepLink.slug}`}
                className="text-[11px] font-opensans font-semibold text-yellow hover:underline underline-offset-2"
              >
                View {deepLink.label} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessageBubble);
