"use client";

// Guides — the content hub. Plain-English explainers on the things couples ask
// about most: the money, the partner-visa pathway, surviving the last stretch
// of long distance, and what it costs to land in a given city. Everything funnels
// back into the calculator via onStart, mirroring Landing/Faq/Methodology.

import { useState } from "react";
import Mascot from "./Mascot";

// Wordmark glyph, matching Landing/Faq's heart-with-a-gap.
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

type Cat = "money" | "visas" | "distance" | "cities" | "buying";

const FILTERS: { id: Cat | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "money", label: "Money" },
  { id: "visas", label: "Visas & moving" },
  { id: "distance", label: "Long distance" },
  { id: "cities", label: "City guides" },
];

const CAT_LABEL: Record<Cat, string> = {
  money: "Money",
  visas: "Visas & moving",
  distance: "Long distance",
  cities: "City guides",
  buying: "Buying together",
};

// Soft diagonal-stripe placeholders, one tint per topic family — stands in for
// article art without shipping broken <img> links.
const TINTS: Record<Cat, { a: string; b: string; ink: string }> = {
  money: { a: "#e7ece9", b: "#eef3f0", ink: "#7fa890" },
  visas: { a: "#efe1e5", b: "#f6edf0", ink: "#b08a98" },
  distance: { a: "#ece6dd", b: "#f4eee5", ink: "#a89072" },
  cities: { a: "#e7ece9", b: "#eef3f0", ink: "#7fa890" },
  buying: { a: "#efe1e5", b: "#f6edf0", ink: "#b08a98" },
};

type Article = { cat: Cat; mins: number; title: string; blurb: string; file: string };

const ARTICLES: Article[] = [
  {
    cat: "money",
    mins: 6,
    title: "How much does it really cost to move in together?",
    blurb: "Bond, flights, the buffer to land on your feet — the full number.",
    file: "moving-in.jpg",
  },
  {
    cat: "distance",
    mins: 5,
    title: "Surviving the last 18 months apart",
    blurb: "Budgeting the visits, and keeping the end in sight.",
    file: "long-distance.jpg",
  },
  {
    cat: "buying",
    mins: 7,
    title: "Rent first, or buy together?",
    blurb: "A couple's guide to the deposit-vs-flexibility call.",
    file: "rent-vs-buy.jpg",
  },
  {
    cat: "money",
    mins: 4,
    title: "The setup costs nobody budgets for",
    blurb: "Bond, whitegoods, connection fees — the first-week sting.",
    file: "setup-costs.jpg",
  },
  {
    cat: "cities",
    mins: 6,
    title: "Moving in together in Melbourne",
    blurb: "Where two incomes stretch, suburb by suburb.",
    file: "melbourne.jpg",
  },
  {
    cat: "visas",
    mins: 9,
    title: "Subclass 820 vs 309: which path?",
    blurb: "Onshore or offshore — cost, wait and what suits you.",
    file: "visa-paths.jpg",
  },
];

const CITY_GUIDES = [
  "🇦🇺 Moving in together in Sydney",
  "🇦🇺 … in Melbourne",
  "🇦🇺 … in Brisbane",
  "🇦🇺 … in Adelaide",
  "🇳🇿 … in Auckland",
  "🇬🇧 … in London",
];

function StripeArt({ cat, height }: { cat: Cat; height: number }) {
  const t = TINTS[cat];
  return (
    <div
      className="flex items-end p-3"
      style={{
        height,
        background: `repeating-linear-gradient(135deg, ${t.a}, ${t.a} 12px, ${t.b} 12px, ${t.b} 24px)`,
      }}
    />
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#ece5db] bg-white">
      <StripeArt cat={a.cat} height={150} />
      <div className="p-5">
        <div className="text-[11.5px] font-semibold text-[#a59ca2]">
          {CAT_LABEL[a.cat]} · {a.mins} min
        </div>
        <h3 className="mt-2 font-display text-[19px] font-semibold leading-[1.18]">{a.title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#6b6068]">{a.blurb}</p>
      </div>
    </div>
  );
}

export default function Guides({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  const [filter, setFilter] = useState<Cat | "all">("all");
  const shown =
    filter === "all" ? ARTICLES : ARTICLES.filter((a) => a.cat === filter);

  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <button onClick={onBack} className="flex items-center gap-2" aria-label="GetCloser home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">GetCloser</span>
        </button>
        <button
          onClick={onBack}
          className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          ← Back to the calculator
        </button>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-12 sm:py-12">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              Guides
            </div>
            <h1 className="mt-2.5 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[46px]">
              Closing the distance, explained
            </h1>
            <p className="mt-3.5 max-w-[540px] text-[16px] leading-relaxed text-[#6b6068] sm:text-[18px]">
              Everything we&apos;ve learned helping couples make the move — visas, money, and
              surviving long distance until you don&apos;t have to.
            </p>
          </div>
          <Mascot mood="happy" size={88} className="hidden shrink-0 sm:block" />
        </div>

        {/* ── Search + filters ──────────────────────────────── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2.5 rounded-[14px] border border-[#ddd5cb] bg-white px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="#b0a8ae" strokeWidth="2" />
              <path d="M20 20l-3-3" stroke="#b0a8ae" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[14.5px] text-[#a59ca2]">
              Search guides — visas, deposits, cities…
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] transition ${
                  filter === f.id
                    ? "bg-[#b25c72] font-semibold text-white"
                    : "border border-[#ece5db] bg-white font-medium text-[#6b6068]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Featured ──────────────────────────────────────── */}
        {filter === "all" && (
          <div className="mt-6 grid overflow-hidden rounded-[24px] border border-[#ece5db] bg-white sm:grid-cols-[1.1fr_1fr]">
            <StripeArt cat="visas" height={320} />
            <div className="flex flex-col justify-center p-7 sm:p-9">
              <div className="flex items-center gap-2.5 text-[12px]">
                <span className="rounded-full bg-[#b25c72]/[0.12] px-2.5 py-1 font-semibold text-[#b25c72]">
                  Visas &amp; moving
                </span>
                <span className="text-[#a59ca2]">Featured · 8 min read</span>
              </div>
              <h2 className="mt-3.5 font-display text-[26px] font-semibold leading-[1.1] tracking-[-0.01em] sm:text-[32px]">
                The real cost of an Australian partner visa in 2026
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#6b6068]">
                Application fees, health checks, police certificates and the long wait — what the
                820/801 and 309/100 pathways actually cost a couple, start to finish.
              </p>
              <span className="mt-[18px] inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#b25c72]">
                Read the guide →
              </span>
            </div>
          </div>
        )}

        {/* ── Article grid ──────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <ArticleCard key={a.file} a={a} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="mt-6 text-center text-[14px] text-[#a59ca2]">
            No guides in this topic yet — more on the way.
          </p>
        )}

        {/* ── Popular city guides ───────────────────────────── */}
        <div className="mt-8 rounded-[22px] border border-[#ece5db] bg-white p-6 sm:px-[26px]">
          <div className="flex items-baseline justify-between">
            <div className="font-display text-[22px] font-semibold">Popular city guides</div>
            <span className="text-[13px] font-semibold text-[#b25c72]">See all 191 →</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {CITY_GUIDES.map((c) => (
              <span
                key={c}
                className="rounded-[12px] border border-[#ece5db] bg-[#faf6f1] px-4 py-2.5 text-[14px] font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ── Newsletter + CTA ──────────────────────────────── */}
        <div className="mt-6 grid gap-5 sm:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[22px] bg-gradient-to-br from-[#3b2a40] to-[#5a3f54] p-7 text-white">
            <div className="font-display text-[24px] font-semibold">New guides, now and then</div>
            <p className="mt-2.5 max-w-[380px] text-[14.5px] leading-relaxed text-[#e7d9df]">
              A short note when we publish something worth your time — no spam, no daily nudges.
            </p>
            <div className="mt-[18px] flex max-w-[420px] gap-2.5">
              <div className="flex-1 rounded-[12px] border border-white/20 bg-white/[0.12] px-3.5 py-3 text-[14px] text-white/60">
                you@email.com
              </div>
              <button className="rounded-[12px] bg-white px-5 py-3 text-[14px] font-semibold text-[#3b2a40] transition hover:brightness-95">
                Subscribe
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-[22px] border border-[#b25c72]/20 bg-[#b25c72]/[0.09] p-7 text-center">
            <div className="font-display text-[23px] font-semibold">Skip the reading?</div>
            <p className="mt-2 text-[14px] text-[#6b6068]">
              Get your own answer in about a minute.
            </p>
            <button
              onClick={onStart}
              className="mt-4 rounded-[14px] bg-[#b25c72] py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_22px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105"
            >
              Start your plan →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
