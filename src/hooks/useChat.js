"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { postChat } from "@/api/chatApi";
import {
  MAX_HISTORY_SENT, MAX_INPUT_CHARS, MAX_PERSISTED_MESSAGES, STORAGE_KEY,
} from "@/config/chat";

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const initialState = { messages: [], status: "idle", error: null };

// useReducer rather than three useStates: send/succeed/fail must be atomic,
// and retry() reads the transcript from inside an async callback.
function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { ...initialState, messages: action.messages };
    case "SEND":
      return { messages: [...state.messages, action.message], status: "sending", error: null };
    case "RETRY":
      return { ...state, status: "sending", error: null };
    case "SUCCESS":
      return { messages: [...state.messages, action.message], status: "idle", error: null };
    case "FAILURE":
      return { ...state, status: "error", error: action.error };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

const isValidMessage = (m) =>
  m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string";

export default function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const abortRef = useRef(null);

  // sessionStorage, not localStorage: route changes need no storage at all
  // (the widget never unmounts), so this only buys reload survival — and a
  // week-old transcript reappearing would be confusing.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isValidMessage)) {
        dispatch({ type: "HYDRATE", messages: parsed });
      }
    } catch {
      /* private mode, corrupt value — start fresh */
    }
  }, []);

  useEffect(() => {
    try {
      if (!state.messages.length) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      const json = JSON.stringify(state.messages.slice(-MAX_PERSISTED_MESSAGES));
      if (json.length <= 32_000) sessionStorage.setItem(STORAGE_KEY, json);
    } catch {
      /* Safari private mode throws on setItem */
    }
  }, [state.messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (transcript) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const payload = transcript
      .slice(-MAX_HISTORY_SENT - 1)
      .map(({ role, content }) => ({ role, content }));
    const current = payload.pop();

    try {
      const { reply, sources } = await postChat({
        message: current.content,
        history: payload,
        signal: controller.signal,
      });
      dispatch({
        type: "SUCCESS",
        message: {
          id: uid(), role: "assistant", content: reply,
          sources: sources ?? null, createdAt: Date.now(),
        },
      });
    } catch (err) {
      if (err?.name === "AbortError") return; // never surfaces as an error state
      dispatch({
        type: "FAILURE",
        error: {
          kind: err?.kind ?? "server",
          message: err?.message ?? "Something went wrong.",
          retryable: err?.retryable !== false,
        },
      });
    }
  }, []);

  const send = useCallback(
    (text) => {
      const content = String(text ?? "").trim().slice(0, MAX_INPUT_CHARS);
      if (!content || state.status === "sending") return;
      const message = { id: uid(), role: "user", content, sources: null, createdAt: Date.now() };
      dispatch({ type: "SEND", message });
      run([...state.messages, message]);
    },
    [run, state.messages, state.status],
  );

  // The failed user message stays in the transcript, so retry just re-posts it.
  const retry = useCallback(() => {
    if (state.status === "sending" || !state.messages.length) return;
    dispatch({ type: "RETRY" });
    run(state.messages);
  }, [run, state.messages, state.status]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "CLEAR" });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    messages: state.messages,
    status: state.status,
    error: state.error,
    isSending: state.status === "sending",
    canClear: state.messages.length > 0,
    send,
    retry,
    clear,
  };
}
