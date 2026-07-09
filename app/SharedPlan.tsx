"use client";

// SharedPlan — the read-only snapshot a couple sends to friends/family. When a
// scenario arrives via a #s=… link, the Simulator restores it and shows this
// polished, non-editable view instead of dropping the recipient into the form.
// Everything here is driven by the same simulate() result the couple saw, so
// the numbers always match. The single job of the page is to land the verdict
// and funnel the visitor into building their own plan (onStart), mirroring
// Landing/Guides/Faq.

import { Area } from "@/lib/areas";
import { fmt, Lifestyle, Location, SimResult } from "@/lib/calc";
import { getCountry } from "@/lib/countries";
import Mascot from "./Mascot";

// Wordmark glyph, matching Landing/Guides/Faq's heart-with-a-gap.
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

// A short dotted arc between the two endpoints, echoing the hero in the design.
function DottedArc() {
  return (
    <svg width="40" height="14" viewBox="0 0 40 14" aria-hidden className="shrink-0">
      <path
        d="M2 12 Q20 -2 38 12"
        fill="none"
        stroke="#b25c72"
        strokeWidth="1.5"
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      <circle cx="2" cy="12" r="3" fill="#b25c72" />
      <circle cx="38" cy="12" r="3" fill="#b25c72" />
    </svg>
  );
}

// Read-only verdict styling — a self-contained copy of the calculator's three
// outcomes so SharedPlan stays decoupled from the Simulator internals.
const VERDICT: Record<
  SimResult["verdict"],
  { badge: string; band: string; dot: string; num: string }
> = {
  comfortable: {
    badge: "They can comfortably move in together.",
    band: "border-emerald-200 bg-emerald-50 text-emerald-900",
    dot: "bg-emerald-500",
    num: "text-emerald-600",
  },
  tight: {
    badge: "It's doable — but it'll be tight.",
    band: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-500",
    num: "text-amber-600",
  },
  "not-yet": {
    badge: "Not quite yet — here's the gap.",
    band: "border-rose-200 bg-rose-50 text-rose-900",
    dot: "bg-rose-500",
    num: "text-rose-600",
  },
};

function place(loc: Location): string {
  const c = getCountry(loc.country);
  const flag = c?.flag ?? "";
  const name = c?.name ?? loc.country;
  return `${flag} ${name}${loc.state ? `, ${loc.state}` : ""}`.trim();
}

export default function SharedPlan({
  sharedBy,
  sharedAt,
  names,
  locationA,
  locationB,
  area,
  lifestyle,
  kids,
  result,
  onStart,
}: {
  sharedBy: string;
  sharedAt?: string;
  names: { yourName: string; partnerName: string };
  locationA: Location;
  locationB: Location;
  area: Area;
  lifestyle: Lifestyle;
  kids: number;
  result: SimResult;
  onStart: () => void;
}) {
  const cur = result.currency;
  const v = VERDICT[result.verdict];

  const you = names.yourName.trim() || "You";
  const them = names.partnerName.trim() || "Your partner";
  const sharer = sharedBy.trim() || you;
  const fiveYr = result.milestones.find((m) => m.years === 5) ?? result.milestones[1];

  const lifestyleLabel =
    lifestyle === "frugal" ? "Frugal" : lifestyle === "relaxed" ? "Relaxed" : "Comfortable";

  // The road to closing the distance — milestones built straight from the
  // result, so a visa stop only appears when the move is actually international.
  const steps: { emoji: string; label: string; sub: string; done: boolean; here?: boolean }[] = [
    { emoji: "📍", label: "Today", sub: "Apart", done: true },
    {
      emoji: "🪙",
      label: "Afford it",
      sub: result.leftover >= 0 ? `${fmt(result.leftover, cur)}/mo` : "raise income",
      done: result.leftover >= 0,
    },
    {
      emoji: "💪",
      label: "Save upfront",
      sub: result.gap > 0 ? `${fmt(result.gap, cur)} to go` : "saved!",
      done: result.gap <= 0,
    },
  ];
  if (result.international && result.visaMonths > 0) {
    steps.push({ emoji: "🛂", label: "Visa & move", sub: `~${result.visaMonths} mo`, done: false, here: true });
  }
  steps.push({
    emoji: "🏠",
    label: "Move in",
    sub: result.monthsToMoveIn === null ? "together" : `~${result.monthsToMoveIn} mo`,
    done: false,
    here: !(result.international && result.visaMonths > 0),
  });
  steps.push({ emoji: "🏡", label: "Their future", sub: fmt(fiveYr.saved, cur), done: false });

  // Future-projection sentence, matching the calculator's own copy.
  const futureLine =
    result.housing === "buy"
      ? result.yearsToDeposit === null
        ? "A deposit here is out of reach at this pace — a cheaper area helps."
        : `Ready to buy in about ${result.yearsToDeposit.toFixed(1)} years — then they own from the day they move in.`
      : result.yearsToDeposit === null
        ? "A deposit here is out of reach at this pace — a cheaper area helps."
        : result.yearsToDeposit <= 10
          ? `On track to own a place together in about ${result.yearsToDeposit.toFixed(1)} years — in ${area.region}.`
          : `A deposit here is roughly ${result.yearsToDeposit.toFixed(0)} years away — a cheaper area gets there sooner.`;

  const depositPct = Math.max(4, Math.min(100, Math.round(fiveYr.depositPct)));

  return (
    <div className="min-h-screen bg-[#faf6f1] text-zinc-800">
      {/* top bar */}
      <header className="sticky top-0 z-10 border-b border-[#efe8df] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2">
            <HeartGap stroke="#b25c72" />
            <span className="font-display text-lg font-semibold text-[#b25c72]">Close the Distance</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="hidden items-center gap-1.5 text-zinc-400 sm:flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 11V8a6 6 0 0 1 12 0v3" stroke="#a59ca2" strokeWidth="2" strokeLinecap="round" />
                <rect x="4" y="11" width="16" height="9" rx="2" fill="#cfc6cc" />
              </svg>
              Read-only shared plan
            </span>
            <button
              onClick={onStart}
              className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 font-semibold text-zinc-700 transition hover:border-[#b25c72] hover:text-[#b25c72]"
            >
              Make your own →
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
        {/* hero */}
        <section className="relative text-center">
          <div className="pointer-events-none absolute inset-x-0 -top-5 h-40 bg-[radial-gradient(70%_80%_at_50%_0%,rgba(178,92,114,0.10),transparent_60%)]" />
          <div className="relative">
            <Mascot mood="happy" size={88} className="mx-auto" />
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#efe8df] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-zinc-500 shadow-sm">
              Shared by {sharer} 💛{sharedAt ? ` · ${sharedAt}` : ""}
            </div>
            <h1 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-[1.06] tracking-tight text-zinc-900 sm:text-5xl">
              {you} &amp; {them} are closing the distance.
            </h1>
            <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 text-[15px] text-zinc-500">
              <span>{place(locationA)}</span>
              <DottedArc />
              <span>{place(locationB)}</span>
            </div>
          </div>
        </section>

        {/* verdict */}
        <section
          className={`mt-7 flex items-center justify-center gap-3 rounded-2xl border px-5 py-4 text-center ${v.band}`}
        >
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${v.dot}`} />
          <span className="font-display text-lg font-semibold sm:text-2xl">{v.badge}</span>
        </section>

        {/* three headline numbers */}
        <section className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { n: fmt(result.leftover, cur), l: "Left over each month", accent: result.leftover >= 0 },
            { n: fmt(result.upfront, cur), l: "Upfront to move in" },
            {
              n: result.monthsToMoveIn === null ? "—" : `${result.monthsToMoveIn} mo`,
              l: "Until they move in",
            },
          ].map((c) => (
            <div
              key={c.l}
              className="rounded-2xl border border-[#ece5db] bg-white p-4 text-center sm:p-6"
            >
              <div
                className={`font-display text-2xl font-semibold tabular-nums sm:text-[38px] ${
                  c.accent ? v.num : "text-zinc-900"
                }`}
              >
                {c.n}
              </div>
              <div className="mt-1.5 text-[10px] uppercase tracking-wide text-zinc-400 sm:text-[11px]">
                {c.l}
              </div>
            </div>
          ))}
        </section>

        {/* plan at a glance */}
        <h2 className="mt-7 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          The plan at a glance
        </h2>
        <section className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GlanceCard
            label="First home"
            value={`${area.city}, ${area.region}`}
            sub={`${result.housing === "buy" ? "Buying" : "Renting"} · ~${fmt(area.weeklyRent2br, area.currency)}/wk`}
          />
          <GlanceCard
            label="Together each month"
            value={fmt(result.combinedIncome, cur)}
            sub="Combined take-home"
          />
          <GlanceCard
            label="Saved so far"
            value={fmt(result.savings, cur)}
            sub={result.gap > 0 ? `${fmt(result.gap, cur)} still to save` : "Fully saved 💛"}
          />
          <GlanceCard
            label="Living style"
            value={lifestyleLabel}
            sub={kids > 0 ? `${kids} ${kids === 1 ? "child" : "children"}` : "No kids yet"}
          />
        </section>

        {/* journey timeline */}
        <section className="mt-5 rounded-3xl border border-[#ece5db] bg-white p-5 sm:p-7">
          <div className="mb-5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Their road to closing the distance
          </div>
          <ol className="flex gap-2 overflow-x-auto pb-1 sm:justify-between sm:gap-3">
            {steps.map((s) => (
              <li
                key={s.label}
                className="flex w-[88px] shrink-0 flex-col items-center text-center sm:w-auto sm:flex-1"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ${
                    s.here
                      ? "border-2 border-[#b25c72] bg-white"
                      : s.done
                        ? "bg-[#b25c72]/15"
                        : "border-2 border-dashed border-[#d8cfc6] bg-[#f6f1ea]"
                  }`}
                >
                  {s.emoji}
                </span>
                <span
                  className={`mt-2 text-xs font-semibold ${s.here ? "text-[#b25c72]" : "text-zinc-700"}`}
                >
                  {s.label}
                </span>
                <span className="text-[11px] text-zinc-400">{s.sub}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* money + future */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          {/* monthly money */}
          <div className="rounded-3xl border border-[#ece5db] bg-white p-5 sm:p-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Monthly money, together
            </div>
            <div className="mt-3">
              <Row label={result.housing === "buy" ? "Mortgage" : "Rent (shared)"} value={fmt(result.rent || result.monthlyMortgage, cur)} />
              {result.costs.map((c) => (
                <Row key={c.key} label={c.label} value={fmt(c.amount, cur)} />
              ))}
              <Row label="Income together" value={fmt(result.combinedIncome, cur)} muted />
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-[#e3dbd0] pt-3">
              <span className="text-base font-semibold text-zinc-900">Left over each month</span>
              <span className={`font-display text-2xl font-semibold tabular-nums ${v.num}`}>
                {fmt(result.leftover, cur)}
              </span>
            </div>
          </div>

          {/* future */}
          <div className="rounded-3xl bg-[linear-gradient(140deg,#3b2a40,#6a4a60)] p-6 text-white sm:p-7">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/70">
              Their future, together
            </div>
            <p className="mt-4 mb-0.5 text-sm text-white/70">
              In 5 years, at this pace, they&apos;d have saved
            </p>
            <div className="font-display text-4xl font-semibold sm:text-[44px]">
              {fmt(fiveYr.saved, cur)}
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#e9c46a]" style={{ width: `${depositPct}%` }} />
            </div>
            <p className="mt-3.5 text-sm text-white/90">{futureLine}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-7 rounded-3xl border border-[#b25c72]/20 bg-[#b25c72]/[0.07] p-8 text-center sm:p-11">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[34px]">
            Closing your own distance?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-zinc-500 sm:text-base">
            See what moving in together would cost you two — your verdict in about a minute. Free, no
            sign-up.
          </p>
          <button
            onClick={onStart}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#b25c72] px-7 py-4 text-base font-semibold text-white shadow-[0_10px_26px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105 sm:text-[17px]"
          >
            Build your own plan →
          </button>
        </section>

        <p className="mx-auto mt-6 max-w-xl text-center text-[11.5px] leading-relaxed text-zinc-400">
          A shared snapshot of {sharer}&apos;s plan. Figures are indicative, shown in {cur} — a
          starting point for the conversation, not financial or immigration advice.
        </p>
      </main>
    </div>
  );
}

function GlanceCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-[#ece5db] bg-white p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-1 text-[15px] font-semibold leading-snug text-zinc-900 sm:text-base">
        {value}
      </div>
      <div className="mt-0.5 text-[12.5px] text-zinc-500">{sub}</div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between border-b border-[#f4eee6] py-2.5 text-sm last:border-0">
      <span className={muted ? "text-zinc-400" : "text-zinc-700"}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
