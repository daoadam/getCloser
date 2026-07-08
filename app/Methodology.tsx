"use client";

// The trust page — "how we calculate this." A plain-spoken, honest breakdown
// of every assumption behind the simulator, so couples can trust the shape of
// the answer even where the figures are estimates. Every number here is kept in
// lockstep with lib/calc.ts.

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

// One assumption line inside a white card.
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#f4eee6] py-2.5 text-sm last:border-0">
      <span className="text-[#3f3a40]">{label}</span>
      <span className="shrink-0 text-right font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-[#ece5db] bg-white p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em] sm:text-[26px]">
      {children}
    </h2>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-[#6b6068]">{children}</p>;
}

export default function Methodology({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <button
          onClick={onBack}
          className="flex items-center gap-2"
          aria-label="Close the Distance home"
        >
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

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-12 sm:py-12">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
          <Mascot mood="think" size={84} className="shrink-0" />
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              Methodology
            </div>
            <h1 className="mt-2.5 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[46px]">
              How we calculate this
            </h1>
            <p className="mt-3.5 max-w-[560px] text-[16px] leading-relaxed text-[#6b6068] sm:text-[18px]">
              We&apos;d rather be honest than impressive. Here&apos;s exactly what&apos;s real,
              what&apos;s indicative, and where we use a rough rule of thumb — so you can trust the
              shape of the answer, even where the figures are estimates.
            </p>
          </div>
        </div>

        {/* ── Principles ────────────────────────────────────── */}
        <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {[
            ["Indicative, not live", "Prices are realistic medians, not a feed of today's listings."],
            ["Conservative by default", "Where we guess, we round so the number doesn't flatter."],
            ["Internally consistent", "Every city is priced the same way, so comparisons are fair."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[18px] border border-[#ece5db] bg-white p-[18px]">
              <div className="text-sm font-semibold">{t}</div>
              <div className="mt-1 text-[13px] leading-snug text-[#8a7f86]">{d}</div>
            </div>
          ))}
        </div>

        {/* ── 01 Income & currency ──────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
          <div>
            <SectionHeading>01 · Income &amp; currency</SectionHeading>
            <Lede>
              You enter take-home pay — after tax, per person, per month — in whatever currency
              you&apos;re actually paid. We convert everything to AUD internally, then show your
              result in the destination&apos;s currency.
            </Lede>
          </div>
          <Card>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#a59ca2]">
              What we assume
            </div>
            <Row label="Pay basis" value="After-tax, per person /mo" />
            <Row label="Exchange rates" value="Live mid-market (open.er-api)" />
            <Row label="If offline" value="Built-in fallback rates" />
            <Row label="Working currency" value="AUD, shown in local" />
          </Card>
        </div>

        {/* ── 02 Rent & buying ──────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
          <div>
            <SectionHeading>02 · Rent &amp; buying</SectionHeading>
            <Lede>
              Rent is the indicative median for a two-bedroom place, converted to a monthly figure.
              Buying uses standard AU-derived assumptions — applied globally, so treat the buy path
              as a guide more than a quote.
            </Lede>
          </div>
          <Card>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#a59ca2]">
              What we assume
            </div>
            <Row label="Rent" value="Median 2-bed × 52/12" />
            <Row label="Bond & setup" value="4wk bond + 2wk + $1,500" />
            <Row label="Deposit" value="20% of median house" />
            <Row label="Mortgage" value="6.0% p.a. · 30-yr amortised" />
            <Row label="Stamp duty" value="~4% (avg across states)" />
            <Row label="Conveyancing & setup" value="$2,500" />
            <Row label="Rates / insurance / upkeep" value="$2,000 + $1,500 + 1%/yr" />
          </Card>
        </div>

        {/* ── 03 Everyday living ────────────────────────────── */}
        <div className="mt-8">
          <SectionHeading>03 · Everyday living</SectionHeading>
          <Lede>
            Base monthly costs for a couple sharing, then scaled by each area&apos;s cost-of-living
            index. Groceries and going-out flex with the lifestyle you choose.
          </Lede>
          <Card className="mt-4">
            <Row label="Utilities & internet" value="$320 /mo" />
            <Row label="Transport (for two)" value="$400 /mo" />
            <Row label="Health & insurance" value="$250 /mo" />
            <Row label="Subscriptions & memberships" value="$120 /mo" />
            <Row
              label="Groceries · frugal / comfortable / relaxed"
              value="$700 / $950 / $1,200"
            />
            <Row label="Lifestyle & going out · by lifestyle" value="$300 / $750 / $1,300" />
            <Row label="Children · each, all-in" value="$1,300 /mo" />
          </Card>
          <p className="mt-2.5 px-0.5 text-[12.5px] text-[#a59ca2]">
            All figures shown at a cost-of-living index of 1.0 — each city scales these up or down by
            its own index.
          </p>
        </div>

        {/* ── 04 The move & the in-between ───────────────────── */}
        <div className="mt-8">
          <SectionHeading>04 · The move &amp; the in-between</SectionHeading>
          <Lede>
            The part other calculators skip: flights and shipping to relocate, the visits while
            you&apos;re still apart, the partner-visa pathway, and a buffer for the months the mover
            earns nothing after landing.
          </Lede>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
            <Card>
              <div className="flex items-baseline justify-between gap-4 border-b border-[#f4eee6] py-2.5 text-[13.5px] font-semibold text-[#a59ca2]">
                <span>Region</span>
                <span>Move / visit flight</span>
              </div>
              <Row label="Oceania" value="$1,300 / $600" />
              <Row label="Asia" value="$1,800 / $900" />
              <Row label="Europe" value="$2,600 / $1,800" />
              <Row label="Americas" value="$2,600 / $1,800" />
              <Row label="Africa & Middle East" value="$2,800 / $2,000" />
              <Row label="Interstate (within AU)" value="$800 / $350" />
            </Card>
            <Card>
              <Row label="Partner visa (AU 820/801, 309/100)" value="~$10,000" />
              <Row label="Typical visa wait" value="~18 months" />
              <Row label="Australia ⇄ New Zealand" value="No partner visa" />
              <Row label="Visits while apart" value="visits/yr × flight" />
              <Row label="Landing buffer" value="mover's income × months" />
              <Row label="Emergency buffer (optional)" value="months × total costs" />
            </Card>
          </div>
        </div>

        {/* ── 05 Verdict + 06 Future ────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
          <div>
            <SectionHeading>05 · The verdict</SectionHeading>
            <p className="mb-4 mt-3 text-[15px] leading-relaxed text-[#6b6068]">
              Based purely on what&apos;s left over each month after the basics — in AUD-equivalent
              terms.
            </p>
            <Card>
              {[
                ["#1f8a5b", "Comfortably", "≥ $1,500 left /mo"],
                ["#e0a83a", "Doable but tight", "$300 – $1,500"],
                ["#d4604f", "Not quite yet", "< $300 left /mo"],
              ].map(([dot, label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-[#f4eee6] py-3 text-sm last:border-0"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-[9px] w-[9px] rounded-full"
                      style={{ background: dot }}
                    />
                    {label}
                  </span>
                  <span className="font-semibold tabular-nums">{value}</span>
                </div>
              ))}
            </Card>
          </div>
          <div>
            <SectionHeading>06 · Your future</SectionHeading>
            <p className="mb-4 mt-3 text-[15px] leading-relaxed text-[#6b6068]">
              A deliberately plain, linear projection — no assumed price growth, pay rises, or
              grants. Honest, if anything understated.
            </p>
            <Card>
              <Row label="Deposit target" value="20% of median house" />
              <Row label="Renting" value="Surplus builds the deposit" />
              <Row label="Buying" value="Deposit + principal paid" />
            </Card>
          </div>
        </div>

        {/* ── Honesty card ──────────────────────────────────── */}
        <div className="mt-8 rounded-[22px] border border-[#f0e0bd] bg-[#fbf3e2] p-6 sm:p-7">
          <div className="font-display text-[18px] font-semibold text-[#7a5a16] sm:text-[22px]">
            Where this is rough — on purpose
          </div>
          <div className="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-x-7">
            {[
              "City prices are indicative medians — internally consistent, but not sourced from a live feed or guaranteed current.",
              "Visa, stamp duty and mortgage figures are rough global constants, not per-country-pair accurate.",
              "We list selected areas, not every suburb — and tax treatment is simplified to take-home pay.",
              "Before going to market, prices would be replaced with live data (e.g. SQM Research / CoreLogic).",
            ].map((t) => (
              <div key={t} className="flex gap-2.5">
                <span className="text-[#c79a2e]">•</span>
                <span className="text-[13.5px] leading-relaxed text-[#7a6328]">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Not advice ────────────────────────────────────── */}
        <div className="mt-5 flex items-start gap-3.5 rounded-[18px] border border-[#ece5db] bg-white p-5 sm:px-6">
          <span className="text-xl">⚠️</span>
          <p className="text-[13.5px] leading-relaxed text-[#6b6068]">
            Close the Distance is a planning tool to start a conversation, not financial or immigration
            advice. Figures are estimates and your real numbers will vary — check current rates, visa
            rules and prices with a qualified professional before making decisions.
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em] sm:text-[30px]">
            Now see it with your numbers
          </h2>
          <button
            onClick={onStart}
            className="mt-4 inline-flex items-center gap-2.5 rounded-[15px] bg-[#b25c72] px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_22px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105"
          >
            Start your plan — free →
          </button>
        </div>
      </div>
    </main>
  );
}
