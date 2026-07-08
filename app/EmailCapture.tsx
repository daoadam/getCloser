"use client";

// Reusable email capture — homepage box, post footers, about page, and the
// calculator's results gate all funnel into the same Supabase `subscribers`
// table with a `source` tag so we know which door people came through.
// Duplicate signups are treated as success (unique constraint downstream).

import { useState } from "react";
import { getSupabaseClient, supabaseConfigured } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture({
  source,
  buttonLabel = "Count me in →",
  placeholder = "you@email.com",
  onDone,
  compact = false,
  failOpen = false,
}: {
  source: string;
  buttonLabel?: string;
  placeholder?: string;
  onDone?: (email: string) => void;
  compact?: boolean;
  // When true, a backend failure still counts as success — used by the
  // calculator gate so our hiccups never hold someone's results hostage.
  failOpen?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setState("error");
      return;
    }
    setState("busy");
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase
          .from("subscribers")
          .insert({ email: trimmed, source });
        // 23505 = already subscribed — that's a success as far as we care.
        if (error && error.code !== "23505") throw error;
      }
      try {
        localStorage.setItem("ctd-email", trimmed);
      } catch {
        /* private mode etc. */
      }
      setState("done");
      onDone?.(trimmed);
    } catch {
      if (failOpen) {
        try {
          localStorage.setItem("ctd-email", trimmed);
        } catch {
          /* ignore */
        }
        setState("done");
        onDone?.(trimmed);
      } else {
        setState("error");
      }
    }
  }

  if (state === "done") {
    return (
      <p className={`font-semibold text-[#1f6b46] ${compact ? "text-[13px]" : "text-[14.5px]"}`}>
        You&rsquo;re in 💌 — we&rsquo;ll only write when it&rsquo;s worth it.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-[420px] gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (state === "error") setState("idle");
        }}
        placeholder={placeholder}
        aria-label="Email address"
        className={`min-w-0 flex-1 rounded-xl border bg-white px-3.5 text-[14px] outline-none transition focus:border-[#b25c72] ${
          state === "error" ? "border-[#c2452d]" : "border-[#ddd5cb]"
        } ${compact ? "py-2" : "py-2.5"}`}
      />
      <button
        type="submit"
        disabled={state === "busy"}
        className={`shrink-0 rounded-xl bg-[#b25c72] px-4 font-semibold text-white transition hover:brightness-105 disabled:opacity-60 ${
          compact ? "py-2 text-[13px]" : "py-2.5 text-[14px]"
        }`}
      >
        {state === "busy" ? "…" : buttonLabel}
      </button>
      {state === "error" && (
        <span className="sr-only" role="alert">
          Please enter a valid email address.
        </span>
      )}
      {!supabaseConfigured && (
        <input type="hidden" data-note="supabase not configured; stored locally only" />
      )}
    </form>
  );
}
