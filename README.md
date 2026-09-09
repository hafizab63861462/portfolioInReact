# Hafiz Abdullah — Portfolio

Personal portfolio for Hafiz Abdullah, a full-stack software engineer.
Live: https://hafizportfolio.netlify.app/

Built with **Next.js 16 (App Router)**, React 19, Tailwind CSS 3 and
framer-motion. Deployed on Netlify.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run build` produces a static prerender of the home page and all ten
project pages, plus generated Open Graph cards, sitemap and robots.

## Structure

```
src/
  app/                 App Router: layout, home, /projects/[slug], /api/chat
  scenes/              page sections (Landing, MySkills, Projects, ...)
  components/          shared UI, including components/chat/ (the assistant)
  data/                projectsData.js, profile.js, testimonials.js
  lib/chat/            knowledge base, retrieval, prompt, request guard
  hooks/
```

## AI portfolio assistant

A floating assistant answers visitor questions about Abdullah's professional
background. It is grounded in `src/data/` and is designed not to invent
anything: if a fact is not in the knowledge base, it says so.

- **Knowledge base** — built at cold start from `projectsData.js`,
  `profile.js` and `testimonials.js` into ~30 retrievable chunks.
- **Retrieval** — dependency-free BM25-lite with alias expansion
  (`src/lib/chat/retrieve.js`). No embeddings and no vector store; at this
  corpus size a tuned alias map performs better and costs nothing.
- **Model** — `openai/gpt-oss-120b` on [Groq](https://console.groq.com/keys),
  which is free. Override with `CHAT_MODEL`; `openai/gpt-oss-20b` is faster.
  `reasoning_effort` is set to `low` because gpt-oss models emit reasoning
  tokens that count against `max_tokens` and can otherwise leave the reply
  empty.
- **Privacy** — the assistant discusses professional information only. It may
  share the phone number already published on this site, but his personal
  email address is deliberately absent from the knowledge base.

### Adding testimonials

Paste real client quotes into `src/data/testimonials.js`. While that array is
empty the assistant truthfully says none have been published — it will never
invent one. No code change is needed when entries are added.

### Retrieval tests

```bash
node src/lib/chat/retrieve.test.mjs   # no API calls, no cost
```

Add a fixture whenever a real question retrieves the wrong document.

## Environment

Copy `.env.example` to `.env.local` and fill it in. All chat variables are
server-only — none carry the `NEXT_PUBLIC_` prefix, which is what keeps the
API key out of the browser bundle. The key's shape is validated at runtime, so
a key from a different provider is skipped and reported rather than producing
a bare 401.

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Required. Free key from console.groq.com/keys (starts with `gsk_`) |
| `CHAT_MODEL` | Optional model override (default `openai/gpt-oss-120b`) |
| `ALLOWED_ORIGINS` | Comma-separated origin allowlist (unset = skip locally) |
| `IP_SALT` | Salt for hashed IPs in logs (raw IPs are never logged) |
| `CHAT_ENABLED` | Set to `false` to disable the assistant without a redeploy |

Set these in the Netlify UI before the first deploy that includes the chat
route, or the first request will return 503.
