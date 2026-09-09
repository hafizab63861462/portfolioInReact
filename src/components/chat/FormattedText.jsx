"use client";

// Minimal markdown-ish renderer for model output.
//
// Returns React ELEMENTS, never HTML strings, so dangerouslySetInnerHTML never
// appears and XSS from model output is structurally impossible rather than
// merely sanitized. The link protocol is whitelisted by the regex, so
// `javascript:` can never reach an href.
//
// A full markdown library would be ~120KB for the five constructs an LLM
// actually emits in short factual answers.

const INLINE = /(\*\*[^*\n]+\*\*|`[^`\n]+`|https?:\/\/[^\s<>)"']+)/g;

function renderInline(text) {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((token, i) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-deep-blue border border-white/10 text-blue text-[12px]"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      if (/^https?:\/\//.test(token)) {
        return (
          <a
            key={i}
            href={token}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-blue underline underline-offset-2 hover:text-yellow break-all"
          >
            {token}
          </a>
        );
      }
      return token;
    });
}

const BULLET = /^\s*[-*]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

const FormattedText = ({ text }) => {
  const blocks = String(text ?? "").split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        if (!lines.length) return null;

        if (lines.every((l) => BULLET.test(l))) {
          return (
            <ul key={bi} className="list-disc pl-5 space-y-1 my-1">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(BULLET, ""))}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => NUMBERED.test(l))) {
          return (
            <ol key={bi} className="list-decimal pl-5 space-y-1 my-1">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(NUMBERED, ""))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={bi} className="whitespace-pre-wrap [&:not(:first-child)]:mt-2">
            {renderInline(block)}
          </p>
        );
      })}
    </>
  );
};

export default FormattedText;
