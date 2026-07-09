"use client";

// The FAQ — "the honest answers." Plain-spoken responses to what couples ask
// most: where the numbers come from, visas, privacy, and what Close the Distance is (and
// isn't). Answers are kept in lockstep with lib/calc.ts and the Methodology
// page, so nothing here over-promises.

import { useState } from "react";
import Mascot from "./Mascot";

// Wordmark glyph, matching Landing's heart-with-a-gap.
function HeartGap({ stroke = "currentColor" }: { stroke?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 21s7-4.35 9.5-8.5C23.5 9 21.5 5 18 5c-2 0-3.2 1.2-4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Item = { q: string; a: string };
type Category = { id: string; title: string; chip: string; items: Item[] };

// Honest, concrete answers — every claim here matches what the app actually
// does and how lib/calc.ts is built.
const CATEGORIES: Category[] = [
  {
    id: "numbers",
    title: "About the numbers",
    chip: "Numbers",
    items: [
      {
        q: "Where do these figures come from?",
        a: "Rents and prices are indicative medians for a two-bedroom place, and living costs start from a base for a couple sharing, scaled by each city's cost-of-living index. They're internally consistent so comparisons are fair — but they're a realistic starting point, not a live feed of today's listings. The full breakdown lives on our methodology page.",
      },
      {
        q: "How accurate is it, really?",
        a: "Accurate enough to make a confident decision about the shape of your move — comfortable, tight, or not yet — even where the exact dollars are estimates. And every line on your results is editable, so you can drop in your own real quotes the moment you have them.",
      },
      {
        q: "Why is everything shown in AUD when I compare cities?",
        a: "When you put cities side by side we do the maths in a single currency so the comparison is genuinely apples-to-apples — AUD is just the common yardstick. Your own plan is still shown in the destination's local currency.",
      },
      {
        q: "Do you use live exchange rates?",
        a: "Yes — we pull live mid-market rates the moment you run the numbers, and fall back to sensible built-in rates if you're offline. Rates move every day, so treat any conversion as close, not exact to the cent.",
      },
    ],
  },
  {
    id: "visas",
    title: "Visas & moving",
    chip: "Visas",
    items: [
      {
        q: "Is the partner-visa cost accurate?",
        a: "We use ~$10,000 and roughly 18 months as an indicative all-in figure for the AU partner pathways (subclasses 820/801 and 309/100) — application fees plus health, police and biometrics. Real costs and timelines vary by case and change over time. This isn't immigration advice; confirm current fees with the Department of Home Affairs or a registered agent.",
      },
      {
        q: "What if one of us is a New Zealander?",
        a: "Australia and New Zealand have a special arrangement — NZ citizens can generally live and work in Australia without a partner visa — so for an AU⇄NZ move we don't add that cost or wait. It's still worth checking your exact situation, but the paperwork is usually far lighter.",
      },
      {
        q: "Why do you call the visa “the real wait”?",
        a: "Because for most couples the money comes together long before the paperwork does. The partner-visa pathway is often the single longest delay between deciding to move and actually living together — so we surface it up front instead of quietly leaving it out.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Your data & privacy",
    chip: "Privacy",
    items: [
      {
        q: "Do you store my answers?",
        a: "No. The whole thing runs in your browser — your incomes, savings and plan never leave your device unless you explicitly choose to email or save a plan. There's no account and no tracking of your numbers.",
      },
      {
        q: "What happens when I share my plan?",
        a: "Your shareable link carries the scenario inside the URL itself — nothing is uploaded to us. Anyone with that link can open the same numbers, so only pass it to people you'd trust with them.",
      },
      {
        q: "Will you email me?",
        a: "Only if you ask us to — say, when you choose to email a plan to yourself. There's no mailing list and no marketing; we don't have your address unless you hand it over.",
      },
    ],
  },
  {
    id: "using",
    title: "Using Close the Distance",
    chip: "Using it",
    items: [
      {
        q: "Do I need to sign up?",
        a: "No account. Answer a few questions and your plan is right there — free to use. We'll ask for an email at the end so you can hear from us, but you can skip it.",
      },
      {
        q: "Can I change the numbers after I see my plan?",
        a: "Yes — every figure on your results is editable. Swap in your real rent quote, your actual savings, the flights you've already priced, and the verdict updates instantly.",
      },
      {
        q: "Is this financial advice?",
        a: "No — Close the Distance is a planning tool to help you start the conversation, not financial or immigration advice. Your real numbers will vary, and big decisions deserve a chat with a qualified professional. We'll always be upfront about where our figures are estimates.",
      },
    ],
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke={open ? "#b25c72" : "#b0a8ae"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqCard({
  item,
  open,
  onToggle,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-[16px] border bg-white transition-colors ${
        open ? "border-[#b25c72]/40" : "border-[#ece5db]"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-5 py-[18px] text-left sm:px-[22px]"
      >
        <span className="text-[15px] font-semibold leading-snug sm:text-base">{item.q}</span>
        <span className="pt-0.5">
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <p className="px-5 pb-[18px] text-[13.5px] leading-relaxed text-[#6b6068] sm:px-[22px] sm:text-[14.5px]">
          {item.a}
        </p>
      )}
    </div>
  );
}

function StillStuck() {
  return (
    <div className="rounded-[16px] border border-[#b25c72]/20 bg-[#b25c72]/[0.07] p-[18px]">
      <div className="text-sm font-semibold">Still stuck?</div>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6b6068]">
        We read every message.
      </p>
      <a
        href="mailto:hello@closethedistance.blog?subject=Close%20the%20Distance%20question"
        className="mt-3 block rounded-xl bg-[#b25c72] py-[11px] text-center text-[13.5px] font-semibold text-white transition hover:brightness-105"
      >
        Email us
      </a>
    </div>
  );
}

export default function Faq({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  // Each question is independently collapsible; the first of every category
  // starts open, mirroring the mockup.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.map((c) => [`${c.id}-0`, true]))
  );
  const [active, setActive] = useState(CATEGORIES[0].id);

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const jumpTo = (id: string) => {
    setActive(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="main" className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <button onClick={onBack} className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">Close the Distance</span>
        </button>
        <button
          onClick={onBack}
          className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          ← Back to the calculator
        </button>
      </div>

      <div className="mx-auto max-w-[1040px] px-5 py-10 sm:px-12 sm:py-12">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
          <Mascot mood="think" size={84} className="shrink-0" />
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              Questions, answered
            </div>
            <h1 className="mt-2.5 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[46px]">
              The honest answers
            </h1>
            <p className="mt-3.5 max-w-[560px] text-[16px] leading-relaxed text-[#6b6068] sm:text-[18px]">
              What couples ask us most — about the numbers, visas, your privacy, and what Close the Distance
              is (and isn&apos;t).
            </p>
          </div>
        </div>

        {/* ── Category chips (mobile) ───────────────────────── */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => jumpTo(c.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                active === c.id
                  ? "bg-[#b25c72] text-white"
                  : "border border-[#ece5db] bg-white text-[#6b6068]"
              }`}
            >
              {c.chip}
            </button>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-1 gap-10 sm:grid-cols-[230px_1fr] sm:items-start">
          {/* ── Category rail (desktop) ─────────────────────── */}
          <div className="sticky top-20 hidden sm:block">
            <div className="rounded-[16px] border border-[#ece5db] bg-white p-2.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => jumpTo(c.id)}
                  className={`block w-full rounded-[11px] px-3.5 py-2.5 text-left text-sm transition ${
                    active === c.id
                      ? "bg-[#b25c72]/10 font-semibold text-[#b25c72]"
                      : "font-medium text-[#5a525a] hover:bg-[#faf6f1]"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
            <div className="mt-3.5">
              <StillStuck />
            </div>
          </div>

          {/* ── Q&A ─────────────────────────────────────────── */}
          <div>
            {CATEGORIES.map((c, ci) => (
              <div key={c.id} id={`cat-${c.id}`} className={ci > 0 ? "mt-8 scroll-mt-20" : "scroll-mt-20"}>
                <div className="mb-3.5 font-display text-[22px] font-semibold tracking-[-0.01em] sm:text-[24px]">
                  {c.title}
                </div>
                <div className="flex flex-col gap-3">
                  {c.items.map((item, ii) => {
                    const key = `${c.id}-${ii}`;
                    return (
                      <FaqCard
                        key={key}
                        item={item}
                        open={!!open[key]}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Still stuck — shown inline on mobile */}
            <div className="mt-8 sm:hidden">
              <StillStuck />
            </div>

            {/* ── CTA ───────────────────────────────────────── */}
            <div className="mt-10 text-center sm:text-left">
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] sm:text-[28px]">
                Ready to see your own numbers?
              </h2>
              <button
                onClick={onStart}
                className="mt-4 inline-flex items-center gap-2.5 rounded-[15px] bg-[#b25c72] px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_22px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105"
              >
                Start your plan — free →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
