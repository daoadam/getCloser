"use client";

// The front door before the calculator — a marketing landing page that sells
// the one question GetCloser answers, then hands the couple to the intake.
// Every call-to-action funnels into onStart (→ step 1 of the simulator).

import Mascot from "./Mascot";
import type { LegalTab } from "./Legal";

// Small inline heart-with-a-gap used as the wordmark glyph.
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

// Faint accent washes used behind sections / on chips, matching the design's
// color-mix() fills.
const ACCENT_WASH = "rgba(178,92,114,0.09)";
const ACCENT_CHIP = "rgba(178,92,114,0.12)";
const ACCENT_BORDER = "rgba(178,92,114,0.20)";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
      {children}
    </div>
  );
}

export default function Landing({
  onStart,
  onMethodology,
  onFaq,
  onGuides,
  onLegal,
}: {
  onStart: () => void;
  onMethodology?: () => void;
  onFaq?: () => void;
  onGuides?: () => void;
  onLegal?: (tab: LegalTab) => void;
}) {
  return (
    <main className="flex-1 scroll-smooth">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-14">
        <div className="flex items-center gap-2 text-[#b25c72]">
          <HeartGap />
          <span className="font-display text-xl font-semibold tracking-tight">GetCloser</span>
        </div>
        <div className="flex items-center gap-7 text-sm font-medium text-zinc-600">
          <a href="#how" className="hidden hover:text-[#b25c72] sm:inline">How it works</a>
          <a href="#why" className="hidden hover:text-[#b25c72] sm:inline">Why GetCloser</a>
          <a href="#anywhere" className="hidden hover:text-[#b25c72] sm:inline">Anywhere</a>
          {onGuides && (
            <button onClick={onGuides} className="hidden hover:text-[#b25c72] sm:inline">
              Guides
            </button>
          )}
          <a href="/blog" className="hidden hover:text-[#b25c72] sm:inline">Journal</a>
          <button
            onClick={onStart}
            className="rounded-xl bg-[#b25c72] px-5 py-2.5 font-semibold text-white transition hover:bg-[#9c4a60]"
          >
            Start free
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative px-6 pb-16 pt-8 sm:px-14 sm:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 70% at 22% 30%, rgba(178,92,114,0.09), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold text-[#b25c72]"
              style={{ background: ACCENT_CHIP }}
            >
              For couples living apart 🌍
            </div>
            <h1 className="mt-5 font-display text-[3rem] font-semibold leading-[1.02] tracking-tight sm:text-[3.9rem]">
              Can you afford to close the{" "}
              <em className="italic text-[#b25c72]">distance?</em>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#6b6068] sm:text-xl">
              You&rsquo;re doing long distance. In about a minute, see exactly what moving in
              together would cost — the verdict, the money, and the years after — anywhere in the
              world.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="rounded-2xl bg-[#b25c72] px-7 py-4 text-[17px] font-semibold text-white shadow-[0_10px_26px_-8px_rgba(178,92,114,0.75)] transition hover:bg-[#9c4a60]"
              >
                Start your plan — free →
              </button>
              <span className="text-sm text-[#a59ca2]">No sign-up · ~1 minute</span>
            </div>
            <div className="mt-9 flex items-center gap-6">
              <Stat value="191" label="cities" />
              <span className="h-8 w-px bg-[#e3dbd0]" />
              <Stat value="47" label="countries" />
              <span className="h-8 w-px bg-[#e3dbd0]" />
              <Stat value="$0" label="forever free" />
            </div>
          </div>

          {/* Result-card peek — a glimpse of the payoff */}
          <div className="relative">
            <div className="absolute -top-14 right-8 z-10">
              <Mascot mood="wave" size={92} />
            </div>
            <div className="rotate-[1.5deg] rounded-3xl border border-[#efe8df] bg-white p-6 shadow-[0_30px_70px_-30px_rgba(43,35,41,0.4)]">
              <div className="mb-3 text-[11px] text-[#a59ca2]">
                Sam &amp; Alex · moving to Prospect, Adelaide
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#c6e6d4] bg-[#e9f5ee] px-4 py-3.5">
                <Mascot mood="happy" size={46} animate={false} />
                <div className="font-display text-[19px] font-semibold leading-tight text-[#1f6b46]">
                  You can comfortably move in together
                </div>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2.5">
                <MiniStat value="$4,991" label="Left /mo" highlight />
                <MiniStat value="$58k" label="To move" />
                <MiniStat value="18 mo" label="Until" />
              </div>
              <div className="mt-3.5">
                <CardLine label="Rent (shared)" value="$2,427" divider />
                <CardLine label="Lifestyle & going out" value="$773" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────── */}
      <div className="border-y border-[#efe8df] bg-white px-6 py-4 sm:px-14">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center text-[13.5px] text-[#8a7f86]">
          <span>✓ Free, no sign-up</span>
          <span>✓ Works anywhere in the world</span>
          <span>✓ Multi-currency, live rates</span>
          <span>✓ Not financial advice — a real starting point</span>
        </div>
      </div>

      {/* ── What you get ────────────────────────────────────── */}
      <section id="why" className="px-6 pt-20 sm:px-14">
        <div className="mx-auto max-w-6xl text-center">
          <Eyebrow>What GetCloser tells you</Eyebrow>
          <h2 className="mt-3.5 font-display text-[2.4rem] font-semibold tracking-tight sm:text-[2.6rem]">
            The whole money-and-place picture, in plain words
          </h2>
          <p className="mx-auto mt-3.5 max-w-2xl text-lg text-[#6b6068]">
            Most apps for couples sell daily questions and countdowns. We answer the one question
            that actually decides things.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-3">
          <FeatureCard
            emoji="✅"
            title="A clear verdict"
            body="Can you comfortably move in, will it be tight, or not quite yet — said plainly, with the number behind it."
          />
          <FeatureCard
            emoji="🧾"
            title="The real upfront cost"
            body="Bond, flights, the partner visa, and the buffer to land on your feet — the total nobody else adds up."
          />
          <FeatureCard
            emoji="🏡"
            title="Your future together"
            body="When you could own a place, with kids in the budget — the years after the move, not just moving day."
          />
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how" className="px-6 pt-20 sm:px-14">
        <div className="mx-auto max-w-6xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-3.5 font-display text-[2.4rem] font-semibold tracking-tight sm:text-[2.6rem]">
            Three steps. About a minute.
          </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-3">
          <StepCard
            n="01"
            title="Tell us about the two of you"
            body="Where you each live, what you each take home, and what you've saved so far."
          />
          <StepCard
            n="02"
            title="Pick where you'd live"
            body="Rent or buy your first place, anywhere across 191 cities — tap a spot on the map."
          />
          <StepCard
            n="03"
            title="See your plan"
            body="The verdict, the monthly money, the upfront cost, and your future — all on one screen."
          />
        </div>
      </section>

      {/* ── The bit other calculators skip (plum, full-bleed) ── */}
      <section
        className="mt-20 px-6 py-20 text-white sm:px-14"
        style={{ background: "linear-gradient(140deg,#3b2a40,#5a3f54)" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#f3c9d4]">
              The bit other calculators skip
            </div>
            <h2 className="mt-4 font-display text-[2.3rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.5rem]">
              The cost of being apart — and landing on your feet.
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#e7d9df]">
              Rent calculators stop at the rent. Closing a real distance means flights to visit, the
              months one of you has no income after moving, and the partner visa. We put it all in.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <PlumRow label="✈️  Visits while you're apart" value="$5,400" />
            <PlumRow label="🛤  Landing-on-your-feet buffer" value="$19,470" />
            <PlumRow label="🛂  Partner visa · ~18 mo wait" value="$10,000" />
          </div>
        </div>
      </section>

      {/* ── Anywhere ────────────────────────────────────────── */}
      <section id="anywhere" className="px-6 py-20 sm:px-14">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="rounded-[22px] border border-[#ece5db] bg-white p-6 shadow-[0_2px_8px_rgba(43,35,41,0.04)] lg:order-1">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-[#a59ca2]">
              Same life, other countries · in AUD
            </div>
            <CompareRow flag="🇦🇺" name="Adelaide" value="$4,991" dot="#1f8a5b" valueColor="#1f8a5b" />
            <CompareRow flag="🇩🇪" name="Berlin" value="$4,505" dot="#1f8a5b" valueColor="#1f8a5b" />
            <CompareRow flag="🇯🇵" name="Tokyo" value="$4,227" dot="#1f8a5b" valueColor="#1f8a5b" />
            <CompareRow flag="🇬🇧" name="London" value="$2,462" dot="#e0a83a" valueColor="#1f8a5b" />
            <CompareRow flag="🇸🇬" name="Singapore" value="−$965" dot="#d4604f" valueColor="#d4604f" />
          </div>
          <div className="lg:order-2">
            <Eyebrow>Anywhere in the world</Eyebrow>
            <h2 className="mt-4 font-display text-[2.3rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.5rem]">
              The same life, priced in 47 countries.
            </h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#6b6068]">
              Curious if you&rsquo;d be better off somewhere else? GetCloser re-runs your exact plan
              across the world in your own currency — so you can compare like with like, then move
              your whole scenario with one tap.
            </p>
            <button
              onClick={onStart}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border-[1.5px] px-6 py-3 text-[15px] font-semibold text-[#b25c72] transition hover:bg-[#b25c72]/5"
              style={{ borderColor: ACCENT_BORDER }}
            >
              Explore destinations →
            </button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="px-6 pb-16 sm:px-14">
        <div
          className="mx-auto max-w-6xl rounded-[28px] border px-8 py-14 text-center"
          style={{ background: ACCENT_WASH, borderColor: ACCENT_BORDER }}
        >
          <div className="mx-auto w-fit">
            <Mascot mood="happy" size={80} />
          </div>
          <h2 className="mt-4 font-display text-[2.6rem] font-semibold tracking-tight sm:text-[2.9rem]">
            Ready to close the distance?
          </h2>
          <p className="mx-auto mt-3.5 max-w-md text-lg text-[#6b6068]">
            Answer a few quick questions and see your plan in about a minute. Free, no sign-up.
          </p>
          <button
            onClick={onStart}
            className="mt-7 rounded-2xl bg-[#b25c72] px-9 py-4 text-lg font-semibold text-white shadow-[0_10px_26px_-8px_rgba(178,92,114,0.75)] transition hover:bg-[#9c4a60]"
          >
            Start your plan — free →
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-[#2b2329] px-6 py-10 text-[#cfc6cc] sm:px-14">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="max-w-sm">
            <div className="mb-3 flex items-center gap-2">
              <HeartGap stroke="#f3c9d4" />
              <span className="font-display text-lg font-semibold text-[#f3c9d4]">GetCloser</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-[#8f868d]">
              Indicative figures for a two-bedroom place and typical living costs. Visa, stamp duty
              and mortgage numbers are rough global estimates — a starting point for the
              conversation, not financial or immigration advice.
            </p>
          </div>
          <div className="flex gap-14 text-[13.5px]">
            <FooterCol
              heading="Product"
              links={["How it works", "Guides", "Journal", "FAQ"]}
              actions={{
                ...(onGuides ? { Guides: onGuides } : {}),
                ...(onFaq ? { FAQ: onFaq } : {}),
              }}
              hrefs={{ Journal: "/blog" }}
            />
            <FooterCol
              heading="Trust"
              links={["Methodology", "Privacy", "Terms"]}
              actions={{
                ...(onMethodology ? { Methodology: onMethodology } : {}),
                ...(onLegal
                  ? { Privacy: () => onLegal("privacy"), Terms: () => onLegal("terms") }
                  : {}),
              }}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Small building blocks ─────────────────────────────────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-[#a59ca2]">{label}</div>
    </div>
  );
}

function MiniStat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#efe8df] px-2 py-3 text-center">
      <div className={`font-display text-xl font-semibold ${highlight ? "text-[#1f8a5b]" : ""}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[9px] uppercase tracking-[0.05em] text-[#a59ca2]">{label}</div>
    </div>
  );
}

function CardLine({ label, value, divider }: { label: string; value: string; divider?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between px-0.5 py-2 text-[13px] text-[#3f3a40] ${
        divider ? "border-b border-[#f2ece4]" : ""
      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function FeatureCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-[22px] border border-[#ece5db] bg-white p-7">
      <div
        className="flex items-center justify-center rounded-2xl text-2xl"
        style={{ background: ACCENT_CHIP, height: 52, width: 52 }}
      >
        {emoji}
      </div>
      <h3 className="mt-4 font-display text-[1.45rem] font-semibold">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-[#6b6068]">{body}</p>
    </div>
  );
}

function StepCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-[22px] border border-[#ece5db] bg-white p-7">
      <div className="font-display text-[2.1rem] font-semibold" style={{ color: "#c79aa8" }}>
        {n}
      </div>
      <h3 className="mt-2.5 font-display text-[1.3rem] font-semibold">{title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b6068]">{body}</p>
    </div>
  );
}

function PlumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-4">
      <span className="text-base">{label}</span>
      <span className="font-display text-xl font-semibold">{value}</span>
    </div>
  );
}

function CompareRow({
  flag,
  name,
  value,
  dot,
  valueColor,
}: {
  flag: string;
  name: string;
  value: string;
  dot: string;
  valueColor: string;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#f4eee6] py-2.5 text-[14.5px]">
      <span className="flex items-center gap-2.5 font-medium">
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
        {flag} {name}
      </span>
      <span className="font-semibold" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function FooterCol({
  heading,
  links,
  actions,
  hrefs,
}: {
  heading: string;
  links: string[];
  actions?: Record<string, () => void>;
  hrefs?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col items-start gap-2.5">
      <span className="font-semibold text-white">{heading}</span>
      {links.map((l) =>
        hrefs?.[l] ? (
          <a
            key={l}
            href={hrefs[l]}
            className="text-left text-[#cfc6cc]/90 transition hover:text-white hover:underline"
          >
            {l}
          </a>
        ) : actions?.[l] ? (
          <button
            key={l}
            onClick={actions[l]}
            className="text-left text-[#cfc6cc]/90 transition hover:text-white hover:underline"
          >
            {l}
          </button>
        ) : (
          <span key={l} className="cursor-default text-[#cfc6cc]/90">
            {l}
          </span>
        )
      )}
    </div>
  );
}
