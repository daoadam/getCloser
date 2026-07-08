"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area, AREAS_BY_COUNTRY, DESTINATION_COUNTRIES, areaState, areasByRegion, getArea } from "@/lib/areas";
import { CostLine, fmt, Housing, Lifestyle, Location, relocationFor, simulate } from "@/lib/calc";
import { AU_STATES, COUNTRIES_BY_REGION, getCountry, REGION_LABEL } from "@/lib/countries";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CURRENCY_OPTIONS, toAUD, useRates } from "@/lib/rates";
import EmailCapture from "./EmailCapture";
import MapPicker from "./MapPicker";
import Mascot, { Mood } from "./Mascot";
import Landing from "./Landing";
import Methodology from "./Methodology";
import Faq from "./Faq";
import SharedPlan from "./SharedPlan";
import Legal, { LegalTab } from "./Legal";

const LIFESTYLES: { id: Lifestyle; label: string; sub: string; emoji: string }[] = [
  { id: "frugal", label: "Frugal", sub: "Save hard", emoji: "🌱" },
  { id: "comfortable", label: "Comfortable", sub: "Balanced", emoji: "☕" },
  { id: "relaxed", label: "Relaxed", sub: "Enjoy it", emoji: "🌴" },
];

const REGION_ORDER = ["oceania", "asia", "europe", "americas", "africa-me"] as const;

// A non-AU, non-NZ country means the AU partner-visa pathway.
function needsVisa(loc: Location): boolean {
  return loc.country !== "AU" && loc.country !== "NZ";
}

const VERDICT_COPY = {
  comfortable: {
    badge: "You can comfortably move in together",
    tone: "bg-emerald-50 border-emerald-200 text-emerald-900",
    dot: "bg-emerald-500",
  },
  tight: {
    badge: "It's doable — but it'll be tight",
    tone: "bg-amber-50 border-amber-200 text-amber-900",
    dot: "bg-amber-500",
  },
  "not-yet": {
    badge: "Not quite yet — here's the gap",
    tone: "bg-rose-50 border-rose-200 text-rose-900",
    dot: "bg-rose-500",
  },
} as const;

// Pip stays encouraging — happy when it's easy, hopeful-thinking otherwise.
// Never sad.
const VERDICT_MOOD: Record<"comfortable" | "tight" | "not-yet", Mood> = {
  comfortable: "happy",
  tight: "think",
  "not-yet": "think",
};

const HORIZONS = [1, 5, 10];
// Headline destinations for the side-by-side comparison (shown in AUD).
const COMPARE_COUNTRIES = ["AU", "NZ", "GB", "US", "CA", "JP", "SG", "DE"];
// Intake steps before the results screen.
const INTAKE_STEPS = 5;
const RESULTS_STEP = INTAKE_STEPS + 1;

// The intake rail: a label + a line from Pip for each step, shown beside the
// form so it always feels like Pip is walking the couple through it.
const INTAKE_META: { label: string; bubble: string; mood: Mood }[] = [
  {
    label: "The two of you",
    bubble: "First — who are the two of you, and where? It tells me the distance we're closing. 💛",
    mood: "think",
  },
  {
    label: "What you each earn",
    bubble: "Now the money coming in — each in your own currency. I'll handle the conversion. 🪙",
    mood: "think",
  },
  {
    label: "Where you stand today",
    bubble: "Your starting line — savings and any debts. This is what makes the timeline real. 📊",
    mood: "think",
  },
  {
    label: "Where to live",
    bubble:
      "Now the fun part — where would you actually live? Pick a spot on the map, or search a suburb. You can change it any time. 📍",
    mood: "think",
  },
  {
    label: "Your life together",
    bubble:
      "Last one, then I'll show you everything! How do you two like to live — and are kids in the picture? 💛",
    mood: "happy",
  },
];

export default function Simulator() {
  const [step, setStep] = useState(0); // 0 = welcome, 1..5 = intake, 6 = results
  const [showMethodology, setShowMethodology] = useState(false); // trust page overlay
  const [showFaq, setShowFaq] = useState(false); // FAQ overlay
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null); // Privacy/Terms overlay
  // A scenario opened via a #s=… link shows the read-only SharedPlan snapshot.
  const [sharedView, setSharedView] = useState(false);
  const [sharedAt, setSharedAt] = useState("");

  const [yourName, setYourName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [locationA, setLocationA] = useState<Location>({ country: "AU", state: "SA" });
  const [locationB, setLocationB] = useState<Location>({ country: "GB", state: "" });
  // Income is entered in each person's home currency, then converted to AUD.
  const [incomeLocalA, setIncomeLocalA] = useState(3800);
  const [incomeLocalB, setIncomeLocalB] = useState(3400);
  // Currency defaults to each person's country but can be overridden — you can
  // live in one country and be paid in another.
  const [currencyA, setCurrencyA] = useState("AUD");
  const [currencyB, setCurrencyB] = useState("GBP");
  const [savings, setSavings] = useState(5000);
  const [monthlyDebts, setMonthlyDebts] = useState(0);
  // Optional one-offs, off by default.
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [emergencyOn, setEmergencyOn] = useState(false);
  const [emergencyMonths, setEmergencyMonths] = useState(3);
  const [petsOn, setPetsOn] = useState(false);
  const [petRelocation, setPetRelocation] = useState(1500);
  const [transferOn, setTransferOn] = useState(false);
  const [transferFeePct, setTransferFeePct] = useState(2);
  const [destCountry, setDestCountry] = useState("AU");
  const [areaId, setAreaId] = useState("au-adl-prospect");
  const [areaQuery, setAreaQuery] = useState("");
  const [housing, setHousing] = useState<Housing>("rent");
  const [transitionMonths, setTransitionMonths] = useState(3);
  const [visitsPerYear, setVisitsPerYear] = useState(2);
  const [lifestyle, setLifestyle] = useState<Lifestyle>("comfortable");
  const [kids, setKids] = useState(0);
  const [horizon, setHorizon] = useState(5);
  const [moveInDate, setMoveInDate] = useState("");

  const [email, setEmail] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "done" | "error">("idle");

  // Results-page edits: per-line overrides + custom lines the couple adds.
  const [costOverrides, setCostOverrides] = useState<Record<string, number>>({});
  const [extraCosts, setExtraCosts] = useState<{ id: string; label: string; amount: number }[]>([]);
  const extraIdRef = useRef(0);
  // Skip the next place-change reset once (used when restoring a shared link).
  const skipClearRef = useRef(false);
  // Edits are tied to the chosen place/currency — reset them if it changes.
  useEffect(() => {
    if (skipClearRef.current) {
      skipClearRef.current = false;
      return;
    }
    setCostOverrides({});
    setExtraCosts([]);
  }, [areaId, housing]);

  // Deep-link from /methodology's CTA — ?start=1 drops straight into intake.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("start") === "1") {
      setStep(1);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Restore a scenario shared via #s=… link (read + edit your own copy).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.hash.match(/^#s=(.+)$/);
    if (!m) return;
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      if (o.v !== 1) return;
      skipClearRef.current = true;
      setYourName(o.yourName ?? "");
      setPartnerName(o.partnerName ?? "");
      setLocationA(o.locationA);
      setLocationB(o.locationB);
      setIncomeLocalA(o.incomeLocalA);
      setIncomeLocalB(o.incomeLocalB);
      setSavings(o.savings);
      setMonthlyDebts(o.monthlyDebts);
      setDestCountry(o.destCountry);
      setAreaId(o.areaId);
      setHousing(o.housing);
      setTransitionMonths(o.transitionMonths);
      setVisitsPerYear(o.visitsPerYear);
      setLifestyle(o.lifestyle);
      setKids(o.kids);
      setEmergencyOn(o.emergencyOn);
      setEmergencyMonths(o.emergencyMonths);
      setPetsOn(o.petsOn);
      setPetRelocation(o.petRelocation);
      setTransferOn(o.transferOn);
      setTransferFeePct(o.transferFeePct);
      setCostOverrides(o.costOverrides ?? {});
      setExtraCosts(o.extraCosts ?? []);
      setMoveInDate(o.moveInDate ?? "");
      setSharedAt(o.sharedAt ?? "");
      setSharedView(true);
      window.history.replaceState(null, "", window.location.pathname);
    } catch {
      /* ignore a bad link */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { rates, live: ratesLive } = useRates();

  // Currency defaults to the home country whenever it changes (override sticks
  // until the next country change). The sim works in AUD.
  useEffect(() => {
    setCurrencyA(getCountry(locationA.country)?.currency ?? "AUD");
  }, [locationA.country]);
  useEffect(() => {
    setCurrencyB(getCountry(locationB.country)?.currency ?? "AUD");
  }, [locationB.country]);

  const incomeA = toAUD(incomeLocalA, currencyA, rates);
  const incomeB = toAUD(incomeLocalB, currencyB, rates);

  const area = getArea(areaId)!;

  // Everything the sim needs except the area & display currency — reused to
  // compare cities. Incomes/savings/debts are in AUD here.
  const baseInput = useMemo(
    () => ({
      incomeA,
      incomeB,
      housing,
      lifestyle,
      kids,
      savings,
      monthlyDebts,
      locationA,
      locationB,
      transitionMonths,
      visitsPerYear,
      emergencyMonths: emergencyOn ? emergencyMonths : 0,
      petRelocation: petsOn ? petRelocation : 0,
      transferFeePct: transferOn ? transferFeePct : 0,
      rates,
    }),
    [
      incomeA, incomeB, housing, lifestyle, kids, savings, monthlyDebts, locationA, locationB,
      transitionMonths, visitsPerYear, emergencyOn, emergencyMonths, petsOn, petRelocation,
      transferOn, transferFeePct, rates,
    ]
  );

  // The headline result is shown in the destination's own currency, with any
  // edits the couple typed on the results page applied.
  const result = useMemo(
    () => simulate({ ...baseInput, area, displayCurrency: area.currency, costOverrides, extraCosts }),
    [baseInput, area, costOverrides, extraCosts]
  );

  // Same life, other countries — computed in AUD so they're comparable.
  const comparisons = useMemo(() => {
    const codes = Array.from(new Set([area.country, ...COMPARE_COUNTRIES]));
    return codes
      .map((c) => {
        const ar = c === area.country ? area : AREAS_BY_COUNTRY[c]?.[0];
        if (!ar) return null;
        const res = simulate({ ...baseInput, area: ar, displayCurrency: "AUD" });
        return {
          area: ar,
          rent: res.rent,
          leftover: res.leftover,
          upfront: res.upfront,
          months: res.monthsToMoveIn,
          years: res.yearsToDeposit,
          verdict: res.verdict,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.leftover - a.leftover);
  }, [baseInput, area]);

  // Pip's ideas: three quick what-ifs that change one lever of the plan.
  const altScenarios = useMemo(() => {
    const c = area.currency;
    const list: { key: string; emoji: string; title: string; sub: string; apply: () => void }[] = [];

    if (lifestyle !== "frugal") {
      const r = simulate({ ...baseInput, area, displayCurrency: c, lifestyle: "frugal" });
      const gain = r.leftover - result.leftover;
      if (gain > 0)
        list.push({
          key: "lean",
          emoji: "🌱",
          title: "Live leaner",
          sub: `+${fmt(gain, c)}/mo spare`,
          apply: () => setLifestyle("frugal"),
        });
    }

    const inCountry = AREAS_BY_COUNTRY[destCountry] ?? [];
    const cheapest = [...inCountry].sort((a, b) =>
      housing === "buy" ? a.medianHouse - b.medianHouse : a.weeklyRent2br - b.weeklyRent2br
    )[0];
    if (cheapest && cheapest.id !== areaId) {
      const r = simulate({ ...baseInput, area: cheapest, displayCurrency: cheapest.currency });
      list.push({
        key: "cheap",
        emoji: "📍",
        title: `Try ${cheapest.city}`,
        sub: `${fmt(r.upfront, cheapest.currency)} to move`,
        apply: () => setAreaId(cheapest.id),
      });
    }

    const other: Housing = housing === "buy" ? "rent" : "buy";
    const r3 = simulate({ ...baseInput, area, displayCurrency: c, housing: other });
    list.push({
      key: "flip",
      emoji: other === "buy" ? "🔑" : "🏠",
      title: other === "buy" ? "Buy instead" : "Rent instead",
      sub: `${fmt(r3.upfront, c)} upfront`,
      apply: () => setHousing(other),
    });

    return list.slice(0, 3);
  }, [baseInput, area, result, lifestyle, housing, destCountry, areaId]);

  // A shareable link with the whole scenario encoded — no backend needed.
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const o = {
        v: 1,
        yourName,
        partnerName,
        locationA,
        locationB,
        incomeLocalA,
        incomeLocalB,
        savings,
        monthlyDebts,
        destCountry,
        areaId,
        housing,
        transitionMonths,
        visitsPerYear,
        lifestyle,
        kids,
        emergencyOn,
        emergencyMonths,
        petsOn,
        petRelocation,
        transferOn,
        transferFeePct,
        costOverrides,
        extraCosts,
        moveInDate,
        // Stamped at share time so the snapshot can read "Shared · Jun 2026".
        sharedAt: new Date().toLocaleDateString("en-AU", { month: "short", year: "numeric" }),
      };
      const enc = btoa(unescape(encodeURIComponent(JSON.stringify(o))));
      return `${window.location.origin}${window.location.pathname}#s=${enc}`;
    } catch {
      return "";
    }
  }, [
    yourName, partnerName, locationA, locationB, incomeLocalA, incomeLocalB, savings, monthlyDebts,
    destCountry, areaId, housing, transitionMonths, visitsPerYear, lifestyle, kids, emergencyOn,
    emergencyMonths, petsOn, petRelocation, transferOn, transferFeePct, costOverrides, extraCosts,
    moveInDate,
  ]);

  const next = () => setStep((s) => Math.min(s + 1, RESULTS_STEP));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // Results are gated behind an email (captured once — returning visitors with
  // a stored address skip straight through).
  const [gatePassed, setGatePassed] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("ctd-email")) setGatePassed(true);
    } catch {
      /* private mode — gate shows, that's fine */
    }
  }, []);

  function pickCountry(c: string) {
    setDestCountry(c);
    setAreaQuery("");
    const first = AREAS_BY_COUNTRY[c]?.[0];
    if (first) setAreaId(first.id);
  }

  if (sharedView) {
    return (
      <SharedPlan
        sharedBy={yourName}
        sharedAt={sharedAt}
        names={{ yourName, partnerName }}
        locationA={locationA}
        locationB={locationB}
        area={area}
        lifestyle={lifestyle}
        kids={kids}
        result={result}
        onStart={() => {
          setSharedView(false);
          setStep(1);
        }}
      />
    );
  }

  if (step === RESULTS_STEP && !gatePassed) {
    return (
      <main className="flex min-h-[100svh] flex-1 flex-col items-center justify-center bg-[#faf6f1] px-6 py-16 text-center">
        <Mascot mood="happy" size={104} />
        <h1 className="mt-5 font-display text-[32px] font-semibold tracking-[-0.02em] text-[#2b2329] sm:text-[40px]">
          Your plan is ready 💌
        </h1>
        <p className="mt-3 max-w-[440px] text-[15.5px] leading-relaxed text-[#6b6068]">
          Pop your email in and we&rsquo;ll open it up — plus you&rsquo;ll hear from us when we
          publish something worth your time. No spam, no daily nudges, unsubscribe whenever.
        </p>
        <div className="mt-6 flex justify-center">
          <EmailCapture
            source="calculator-gate"
            buttonLabel="Show my plan →"
            failOpen
            onDone={() => setGatePassed(true)}
          />
        </div>
        <button
          onClick={back}
          className="mt-6 text-[13px] font-medium text-[#a59ca2] transition hover:text-[#b25c72]"
        >
          ← back to the last step
        </button>
      </main>
    );
  }

  if (step === RESULTS_STEP) {
    return (
      <Results
        names={{ yourName, partnerName }}
        area={area}
        lifestyle={lifestyle}
        kids={kids}
        result={result}
        comparisons={comparisons}
        altScenarios={altScenarios}
        shareUrl={shareUrl}
        moveInDate={moveInDate}
        setMoveInDate={setMoveInDate}
        edited={Object.keys(costOverrides).length > 0 || extraCosts.length > 0}
        onCostAmount={(line, v) =>
          line.custom
            ? setExtraCosts((p) => p.map((e) => (e.id === line.key ? { ...e, amount: v } : e)))
            : setCostOverrides((p) => ({ ...p, [line.key]: v }))
        }
        onCostLabel={(id, label) =>
          setExtraCosts((p) => p.map((e) => (e.id === id ? { ...e, label } : e)))
        }
        onAddCost={(label) =>
          setExtraCosts((p) => [...p, { id: `x${++extraIdRef.current}`, label: label ?? "", amount: 0 }])
        }
        onRemoveCost={(id) => setExtraCosts((p) => p.filter((e) => e.id !== id))}
        onResetCosts={() => {
          setCostOverrides({});
          setExtraCosts([]);
        }}
        onPickArea={(ar) => {
          setDestCountry(ar.country);
          setAreaId(ar.id);
        }}
        horizon={horizon}
        setHorizon={setHorizon}
        email={email}
        setEmail={setEmail}
        saveState={saveState}
        setSaveState={setSaveState}
        onTweak={() => setStep(1)}
        onRestart={() => setStep(0)}
        onMethodology={() => setShowMethodology(true)}
      />
    );
  }

  if (showMethodology) {
    return (
      <Methodology
        onBack={() => setShowMethodology(false)}
        onStart={() => {
          setShowMethodology(false);
          setStep(1);
        }}
      />
    );
  }

  if (showFaq) {
    return (
      <Faq
        onBack={() => setShowFaq(false)}
        onStart={() => {
          setShowFaq(false);
          setStep(1);
        }}
      />
    );
  }

  if (legalTab) {
    return (
      <Legal
        initialTab={legalTab}
        onBack={() => setLegalTab(null)}
        onStart={() => {
          setLegalTab(null);
          setStep(1);
        }}
      />
    );
  }

  if (step === 0) {
    return (
      <Landing
        onStart={next}
        onMethodology={() => setShowMethodology(true)}
        onFaq={() => setShowFaq(true)}
        onLegal={(tab) => setLegalTab(tab)}
      />
    );
  }

  return (
    <IntakeShell step={step}>
        {/* Step 1 — the two of you & where you each are */}
        {step === 1 && (
          <Step
            key="step1"
            title="The two of you"
            subtitle="Your names, and where you each are right now."
            onBack={back}
            onNext={next}
          >
            <PersonCard
              defaultName="You"
              name={yourName}
              onName={setYourName}
              location={locationA}
              onLocation={setLocationA}
            />
            <PersonCard
              defaultName="Them"
              name={partnerName}
              onName={setPartnerName}
              location={locationB}
              onLocation={setLocationB}
            />

            {(needsVisa(locationA) || needsVisa(locationB)) && (
              <p className="mt-4 text-xs text-zinc-400">
                Heads up: an AU partner visa runs ~{fmt(10000)} and typically ~18 months per person —
                indicative only, not immigration advice.
              </p>
            )}
            {(locationA.country === "NZ" || locationB.country === "NZ") && (
              <p className="mt-2 text-xs text-zinc-400">
                New Zealanders can live and work in Australia on a Special Category Visa — no partner
                visa needed. 💛
              </p>
            )}
          </Step>
        )}

        {/* Step 2 — what you each earn (in your own currency) */}
        {step === 2 && (
          <Step
            key="step2"
            title="What you each earn"
            subtitle="Take-home pay after tax, in your own currency — we'll convert to AUD."
            onBack={back}
            onNext={next}
          >
            <EarnCard
              initial={(yourName.trim()[0] || "Y").toUpperCase()}
              tint="you"
              who={yourName ? `${yourName}'s` : "Your"}
              value={incomeLocalA}
              onValue={setIncomeLocalA}
              currency={currencyA}
              onCurrency={setCurrencyA}
              aud={incomeA}
            />
            <EarnCard
              initial={(partnerName.trim()[0] || "T").toUpperCase()}
              tint="them"
              who={partnerName ? `${partnerName}'s` : "Their"}
              value={incomeLocalB}
              onValue={setIncomeLocalB}
              currency={currencyB}
              onCurrency={setCurrencyB}
              aud={incomeB}
            />

            {/* Combined take-home, in AUD — the number we plan the move around. */}
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#b25c72]/20 bg-[#b25c72]/[0.07] px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[#7a5560]">Together, each month</p>
                <p className="text-xs text-zinc-400">Combined take-home, after tax</p>
              </div>
              <p className="font-display text-2xl font-semibold tabular-nums text-[#b25c72]">
                {fmt(incomeA + incomeB)}
              </p>
            </div>

            <p className="mt-4 text-xs text-zinc-400">
              {ratesLive ? "Live mid-market rates" : "Indicative rates"} · use what actually lands in
              your accounts each month.
            </p>
          </Step>
        )}

        {/* Step 3 — where you stand today */}
        {step === 3 && (
          <Step
            key="step3"
            title="Where you stand today"
            subtitle="Your starting point — this is what makes the timeline real instead of guesswork."
            onBack={back}
            onNext={next}
          >
            {/* Variant C — the core starting-line inputs sit in a clean white card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 [&>div:first-child]:mt-0">
              <Slider
                label="Saved toward the move (together)"
                value={savings}
                onChange={setSavings}
                min={0}
                max={100000}
                step={1000}
              />
              <Slider
                label="Monthly debt repayments (together)"
                value={monthlyDebts}
                onChange={setMonthlyDebts}
                min={0}
                max={4000}
                step={50}
                suffix="/mo"
              />
              <p className="mt-5 text-xs text-zinc-400">
                Include loans, credit cards and HECS. Leave debts at $0 if you have none.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white">
              <button
                type="button"
                onClick={() => setExtrasOpen((o) => !o)}
                aria-expanded={extrasOpen}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span>
                  <span className="block text-sm font-medium text-zinc-700">
                    Extras most couples forget
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Optional — a safety buffer, pets, transfer fees
                  </span>
                </span>
                <span className={`text-lg text-zinc-400 transition-transform ${extrasOpen ? "rotate-180" : ""}`}>
                  ⌄
                </span>
              </button>

              {extrasOpen && (
                <div className="space-y-3 border-t border-zinc-100 px-4 pb-4 pt-2">
                  <ToggleRow
                    on={emergencyOn}
                    onToggle={() => setEmergencyOn((v) => !v)}
                    title="Keep an emergency buffer"
                    hint="Months of costs to have saved before you move"
                  >
                    <Slider
                      label="Buffer"
                      value={emergencyMonths}
                      onChange={setEmergencyMonths}
                      min={1}
                      max={6}
                      step={1}
                      format={(n) => `${n} mo`}
                    />
                  </ToggleRow>

                  <ToggleRow
                    on={petsOn}
                    onToggle={() => setPetsOn((v) => !v)}
                    title="Moving pets with you"
                    hint="One-off cost of flights & quarantine"
                  >
                    <Slider
                      label="Pet move cost"
                      value={petRelocation}
                      onChange={setPetRelocation}
                      min={0}
                      max={8000}
                      step={100}
                    />
                  </ToggleRow>

                  <ToggleRow
                    on={transferOn}
                    onToggle={() => setTransferOn((v) => !v)}
                    title="Moving savings across borders"
                    hint="Transfer fee on sending your money over"
                  >
                    <Slider
                      label="Transfer fee"
                      value={transferFeePct}
                      onChange={setTransferFeePct}
                      min={0}
                      max={5}
                      step={0.5}
                      format={(n) => `${n}%`}
                    />
                  </ToggleRow>
                </div>
              )}
            </div>
          </Step>
        )}

        {/* Step 4 — where + closing the distance */}
        {step === 4 && (
          <Step
            key="step4"
            title="Where do you want to live?"
            subtitle="Pick the place you&apos;d close the distance in. You can change it later."
            onBack={back}
            onNext={next}
          >
            <div className="mb-5 flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
              {(["rent", "buy"] as Housing[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHousing(h)}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                    housing === h ? "bg-white text-[#8a3f54] shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {h === "rent" ? "Rent our first place" : "Buy our first place"}
                </button>
              ))}
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-zinc-700">Country</span>
              <select
                value={destCountry}
                onChange={(e) => pickCountry(e.target.value)}
                aria-label="Destination country"
                className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
              >
                {DESTINATION_COUNTRIES.map((c) => {
                  const co = getCountry(c);
                  return (
                    <option key={c} value={c}>
                      {co ? `${co.flag} ${co.name}` : c}
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="mt-4">
              <MapPicker
                areas={AREAS_BY_COUNTRY[destCountry]}
                selectedId={areaId}
                onSelect={setAreaId}
                housing={housing}
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Prices are indicative, not live — and we list selected areas, not every suburb yet.
            </p>

            <input
              type="text"
              value={areaQuery}
              onChange={(e) => setAreaQuery(e.target.value)}
              placeholder="Search a suburb or city…"
              aria-label="Search a suburb or city"
              className="mt-4 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
            />

            <div className="mt-2 max-h-72 space-y-3 overflow-y-auto pr-1">
              {(() => {
                const q = areaQuery.trim().toLowerCase();
                const groups = Object.entries(areasByRegion(destCountry))
                  .map(([metro, list]) => {
                    const shown = q
                      ? list.filter(
                          (a) =>
                            a.city.toLowerCase().includes(q) || a.region.toLowerCase().includes(q)
                        )
                      : list;
                    return [metro, shown] as const;
                  })
                  .filter(([, shown]) => shown.length);

                if (!groups.length) {
                  return (
                    <p className="px-1 py-6 text-center text-sm text-zinc-400">
                      No match here — we list indicative areas, not every suburb yet.
                    </p>
                  );
                }

                return groups.map(([metro, shown]) => (
                  <div key={metro}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {metro}
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {shown.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAreaId(a.id)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            areaId === a.id
                              ? "border-[#b25c72] bg-[#b25c72]/10"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          <span className="text-sm font-medium text-zinc-800">{a.city}</span>
                          <span className="text-sm text-zinc-500">
                            {housing === "buy"
                              ? fmt(a.medianHouse, a.currency)
                              : `${fmt(a.weeklyRent2br, a.currency)}/wk`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

          </Step>
        )}

        {/* Step 5 — life together */}
        {step === 5 && (
          <Step
            key="step5"
            title="Your life together"
            subtitle="This shapes the budget and the years ahead."
            onBack={back}
            onNext={next}
            nextLabel="See your plan →"
          >
            <span className="block text-sm font-medium text-zinc-700">How do you like to live?</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {LIFESTYLES.map((l) => {
                const selected = lifestyle === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLifestyle(l.id)}
                    aria-pressed={selected}
                    className={`rounded-2xl border px-3 py-4 text-center transition ${
                      selected
                        ? "border-[#b25c72] bg-[#b25c72]/[0.08]"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <span className="block text-[1.4rem] leading-none" aria-hidden>
                      {l.emoji}
                    </span>
                    <span className="mt-2 block text-[15px] font-semibold text-zinc-800">{l.label}</span>
                    <span
                      className={`block text-xs ${selected ? "font-medium text-[#b25c72]" : "text-zinc-500"}`}
                    >
                      {l.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3">
              <div>
                <span className="block text-sm font-medium text-zinc-700">Kids in the plan</span>
                <span className="block text-xs text-zinc-500">Factored into the future</span>
              </div>
              <Stepper value={kids} onChange={setKids} min={0} max={3} />
            </div>

            {/* The in-between — moved off Step 4 so the place screen stays a pure
                picker. Only shown when someone actually relocates to close the
                distance; it's what makes the long-distance cost real. */}
            {(relocationFor(locationA, area.country, areaState(area)).relocates ||
              relocationFor(locationB, area.country, areaState(area)).relocates) && (
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                <span className="block text-sm font-medium text-zinc-700">
                  The in-between — closing the distance to {area.city}
                </span>
                <span className="block text-xs text-zinc-500">
                  The bit other calculators skip — the cost of being apart, and landing on your feet.
                </span>
                <Slider
                  label="Visits to each other, per year"
                  value={visitsPerYear}
                  onChange={setVisitsPerYear}
                  min={0}
                  max={12}
                  step={1}
                  format={(n) => `${n}×`}
                />
                <Slider
                  label="Months the mover has no income after landing"
                  value={transitionMonths}
                  onChange={setTransitionMonths}
                  min={0}
                  max={12}
                  step={1}
                  format={(n) => `${n} mo`}
                />
              </div>
            )}
          </Step>
        )}
    </IntakeShell>
  );
}

/* ----------------------------- Results screen ----------------------------- */

type Comparison = {
  area: Area;
  rent: number;
  leftover: number;
  upfront: number;
  months: number | null;
  years: number | null;
  verdict: ReturnType<typeof simulate>["verdict"];
};

// Short verdict words for the compact comparison chips.
const VERDICT_LABEL: Record<Comparison["verdict"], string> = {
  comfortable: "Comfortable",
  tight: "Tight",
  "not-yet": "Not yet",
};

// One of the three headline numbers shown at a glance under the verdict.
function StatTile({
  value,
  label,
  tone = "neutral",
}: {
  value: string;
  label: string;
  tone?: "neutral" | "good" | "bad";
}) {
  const color =
    tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-rose-600" : "text-[#2b2329]";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm sm:p-5">
      <div className={`font-display text-2xl font-semibold tabular-nums sm:text-3xl ${color}`}>
        {value}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400 sm:text-[11px]">
        {label}
      </div>
    </div>
  );
}

function Results({
  names,
  area,
  lifestyle,
  kids,
  result,
  comparisons,
  altScenarios,
  shareUrl,
  moveInDate,
  setMoveInDate,
  edited,
  onCostAmount,
  onCostLabel,
  onAddCost,
  onRemoveCost,
  onResetCosts,
  onPickArea,
  horizon,
  setHorizon,
  email,
  setEmail,
  saveState,
  setSaveState,
  onTweak,
  onRestart,
  onMethodology,
}: {
  names: { yourName: string; partnerName: string };
  area: Area;
  lifestyle: Lifestyle;
  kids: number;
  result: ReturnType<typeof simulate>;
  comparisons: Comparison[];
  altScenarios: { key: string; emoji: string; title: string; sub: string; apply: () => void }[];
  shareUrl: string;
  moveInDate: string;
  setMoveInDate: (s: string) => void;
  edited: boolean;
  onCostAmount: (line: CostLine, amount: number) => void;
  onCostLabel: (id: string, label: string) => void;
  onAddCost: (label?: string) => void;
  onRemoveCost: (id: string) => void;
  onResetCosts: () => void;
  onPickArea: (a: Area) => void;
  horizon: number;
  setHorizon: (n: number) => void;
  email: string;
  setEmail: (s: string) => void;
  saveState: "idle" | "saving" | "done" | "error";
  setSaveState: (s: "idle" | "saving" | "done" | "error") => void;
  onTweak: () => void;
  onRestart: () => void;
  onMethodology: () => void;
}) {
  const a = area;
  const buying = result.housing === "buy";
  const cur = result.currency; // destination currency everything is shown in
  const symbol = currencySymbol(cur);
  const verdict = VERDICT_COPY[result.verdict];
  // A single, plain-English line beneath the verdict that puts the money in context.
  const verdictSummary =
    result.verdict === "comfortable"
      ? `Around ${fmt(result.leftover, cur)} left over each month after the basics.`
      : result.verdict === "tight"
        ? `Just ${fmt(result.leftover, cur)} spare each month — doable, but keep an eye on it.`
        : result.leftover < 0
          ? `You're short ${fmt(Math.abs(result.leftover), cur)} a month right now — here's how to close it.`
          : `It's close — about ${fmt(result.leftover, cur)} spare each month. Here's how to get there.`;
  const milestone = result.milestones.find((m) => m.years === horizon) ?? result.milestones[1];
  const couple =
    names.yourName && names.partnerName
      ? `${names.yourName} & ${names.partnerName}`
      : names.yourName || "The two of you";
  const [copied, setCopied] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSaveState("saving");
    const supabase = getSupabaseClient();
    try {
      if (supabase) {
        const { error } = await supabase.from("scenarios").insert({
          email,
          area_id: a.id,
          area_label: `${a.city}, ${a.region}`,
          combined_income: result.combinedIncome,
          leftover: result.leftover,
          upfront: result.upfront,
          months_to_move_in: result.monthsToMoveIn,
          verdict: result.verdict,
          lifestyle,
        });
        if (error) throw error;
      }
      setSaveState("done");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#b25c72]" title="Back to the journal">
            <HeartGap />
            <span className="font-display text-xl font-semibold tracking-tight">Close the Distance</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  /* clipboard blocked */
                }
              }}
              className="rounded-lg bg-[#b25c72] px-3 py-1.5 font-semibold text-white transition hover:bg-[#9c4a60]"
            >
              {copied ? "Link copied 💛" : "Share"}
            </button>
            <button onClick={onTweak} className="rounded-lg px-3 py-1.5 font-medium text-zinc-600 hover:bg-zinc-100">
              Tweak
            </button>
            <button onClick={onRestart} className="rounded-lg px-3 py-1.5 font-medium text-zinc-400 hover:bg-zinc-100">
              Restart
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-500">
          {couple} · moving to {a.city}, {a.region}
        </p>

        <div className="step-in mt-3 flex flex-col gap-5">
          {/* The verdict — Pip delivers the headline with the money in one line */}
          <div className={`flex items-center gap-4 rounded-3xl border p-5 sm:gap-5 sm:p-6 ${verdict.tone}`}>
            <Mascot mood={VERDICT_MOOD[result.verdict]} size={72} className="shrink-0" />
            <div>
              <p className="font-display text-2xl font-semibold leading-tight sm:text-[1.9rem]">
                {verdict.badge}
              </p>
              <p className="mt-1.5 text-sm opacity-80">{verdictSummary}</p>
            </div>
          </div>

          {/* The three headline numbers, at a glance */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatTile
              value={fmt(result.leftover, cur)}
              label="Left over /mo"
              tone={result.leftover >= 0 ? "good" : "bad"}
            />
            <StatTile value={fmt(result.upfront, cur)} label="To move in" />
            <StatTile
              value={result.monthsToMoveIn === null ? "—" : `${result.monthsToMoveIn} mo`}
              label="Until you move"
            />
          </div>

          {/* The journey — your road to closing the distance */}
          <Journey
            result={result}
            cur={cur}
            moveInDate={moveInDate}
            setMoveInDate={setMoveInDate}
          />

          {/* Pip's ideas — quick what-ifs */}
          {altScenarios.length > 0 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Pip&apos;s ideas to close the gap
              </h3>
              <p className="mt-1 text-xs text-zinc-400">Tap one to try it on your plan.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {altScenarios.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={s.apply}
                    className="rounded-2xl border border-zinc-200 p-4 text-left transition hover:border-[#b25c72] hover:bg-[#b25c72]/5"
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="mt-2 block text-sm font-semibold text-zinc-800">{s.title}</span>
                    <span className="block text-xs font-medium text-[#8a3f54]">{s.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Where else in the world — elevated from the bottom */}
          <CompareCard comparisons={comparisons} currentId={area.id} onPickArea={onPickArea} />

          <div className="flex items-center gap-3 pt-2">
            <span className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              The full breakdown
            </span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-5">
          {/* Money breakdown */}
          <div id="j-money" className="scroll-mt-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Monthly money, together
              </h3>
              <span className="text-sm text-zinc-500">Income {fmt(result.combinedIncome, cur)}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              These are estimates — tap any number to make it your own.
            </p>

            <ul className="mt-3 divide-y divide-zinc-100">
              {result.costs.map((c) => (
                <EditableCost
                  key={c.key}
                  line={c}
                  symbol={symbol}
                  onAmount={onCostAmount}
                  onLabel={onCostLabel}
                  onRemove={onRemoveCost}
                />
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {["Pets", "Family support", "Renters insurance"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onAddCost(s)}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 transition hover:border-[#b25c72] hover:text-[#8a3f54]"
                >
                  + {s}
                </button>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onAddCost()}
                className="text-sm font-medium text-[#b25c72] transition hover:text-[#8a3f54]"
              >
                + Add your own
              </button>
              {edited && (
                <button
                  type="button"
                  onClick={onResetCosts}
                  className="text-xs text-zinc-400 transition hover:text-zinc-600"
                >
                  Reset to estimates
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
              <span className="text-sm text-zinc-500">Total costs</span>
              <span className="text-sm font-medium tabular-nums">{fmt(result.totalCosts, cur)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-base font-semibold">Left over each month</span>
              <span
                className={`text-base font-semibold tabular-nums ${
                  result.leftover >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {fmt(result.leftover, cur)}
              </span>
            </div>

            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              ✨ Utilities, groceries, transport and the rest are indicative local averages — a
              friendly starting point, not live figures. Your real numbers will vary.
            </p>
          </div>

          {/* Cost to actually move in */}
          <div id="j-movein" className="scroll-mt-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              To actually move in
            </h3>

            <ul className="mt-4 divide-y divide-zinc-100">
              {result.housing === "buy" ? (
                <>
                  <li className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-zinc-700">
                      Home deposit
                      <span className="ml-1 text-xs text-zinc-400">· 20%</span>
                    </span>
                    <span className="text-sm font-medium tabular-nums">{fmt(result.deposit, cur)}</span>
                  </li>
                  <li className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-zinc-700">
                      Stamp duty & fees
                      <span className="ml-1 text-xs text-zinc-400">· legals, inspections</span>
                    </span>
                    <span className="text-sm font-medium tabular-nums">
                      {fmt(result.setupCost - result.deposit, cur)}
                    </span>
                  </li>
                </>
              ) : (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">Bond, advance rent & setup</span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.setupCost, cur)}</span>
                </li>
              )}
              {result.moveCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Getting there
                    <span className="ml-1 text-xs text-zinc-400">· flights & shipping</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.moveCost, cur)}</span>
                </li>
              )}
              {result.visaCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Partner visa
                    <span className="ml-1 text-xs text-zinc-400">· ~{result.visaMonths} mo wait</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.visaCost, cur)}</span>
                </li>
              )}
              {result.visitCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Visits while apart
                    <span className="ml-1 text-xs text-zinc-400">· ~{Math.round(result.apartMonths)} mo apart</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.visitCost, cur)}</span>
                </li>
              )}
              {result.transitionBuffer > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Landing-on-your-feet buffer
                    <span className="ml-1 text-xs text-zinc-400">· income while job-hunting</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.transitionBuffer, cur)}</span>
                </li>
              )}
              {result.emergencyCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Emergency buffer<span className="ml-1 text-xs text-zinc-400">· a safety net</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.emergencyCost, cur)}</span>
                </li>
              )}
              {result.petRelocationCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Moving pets<span className="ml-1 text-xs text-zinc-400">· flights & quarantine</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.petRelocationCost, cur)}</span>
                </li>
              )}
              {result.transferCost > 0 && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Moving savings over<span className="ml-1 text-xs text-zinc-400">· transfer fee</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums">{fmt(result.transferCost, cur)}</span>
                </li>
              )}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
              <span className="text-base font-semibold">Upfront, all in</span>
              <span className="text-base font-semibold tabular-nums">{fmt(result.upfront, cur)}</span>
            </div>
            {result.savings > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm text-zinc-500">
                <span>Less what you&apos;ve saved</span>
                <span className="tabular-nums">−{fmt(Math.min(result.savings, result.upfront), cur)}</span>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-zinc-200 pt-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {result.monthsToMoveIn === null ? "—" : `${result.monthsToMoveIn} mo`}
                </p>
                <p className="text-xs text-zinc-500">
                  {result.monthsToMoveIn === null
                    ? "Costs exceed income — nothing to save with yet"
                    : result.gatedBy === "visa"
                      ? "And the visa is the real wait, not the money"
                      : result.gap === 0
                        ? "You've already saved enough upfront"
                        : "Until you've saved the rest"}
                </p>
              </div>
              {result.gap > 0 && (
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{fmt(result.gap, cur)}</p>
                  <p className="text-xs text-zinc-500">Still to save</p>
                </div>
              )}
            </div>
          </div>
            </div>

            <div className="flex flex-col gap-5">
          {/* Future */}
          <div
            id="j-future"
            className="scroll-mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-linear-to-br from-[#3b2a40] to-[#6a4a60] p-6 text-white"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                Your future, together
              </h3>
              <div className="flex rounded-full bg-white/10 p-0.5">
                {HORIZONS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHorizon(h)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      horizon === h ? "bg-white text-[#3b2a40]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {h} yr
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-4 text-sm text-white/70">
              {buying
                ? `In ${horizon} years, you'd hold in equity`
                : `In ${horizon} years, at this pace you'd have saved`}
            </p>
            <p className="text-3xl font-semibold tabular-nums">{fmt(milestone.saved, cur)}</p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>{buying ? `Of ${a.city} owned outright` : `Toward a home deposit in ${a.region}`}</span>
                <span>
                  {Math.round(milestone.depositPct * 100)}% of{" "}
                  {fmt(buying ? result.deposit * 5 : result.depositTarget, cur)}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#e9c46a] transition-all"
                  style={{ width: `${Math.max(milestone.depositPct * 100, 2)}%` }}
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-white/85">
              {buying
                ? result.yearsToDeposit === null
                  ? "You can't cover the deposit here yet — a cheaper area, or renting first, gets you in the door sooner."
                  : `You'd be ready to buy in about ${result.yearsToDeposit.toFixed(1)} years — then you own from the day you move in.`
                : result.yearsToDeposit === null
                  ? "Right now your surplus here won't build a deposit — try a cheaper area or a leaner lifestyle."
                  : result.yearsToDeposit <= 10
                    ? `On track to own a place together in about ${result.yearsToDeposit.toFixed(1)} years.`
                    : `A deposit here is roughly ${result.yearsToDeposit.toFixed(0)} years away — a cheaper area gets you there sooner.`}
              {kids > 0 && " (With kids already in the budget.)"}
            </p>
            <p className="mt-3 text-xs text-white/50">
              Linear estimate before any price growth, pay rises, or grants.
            </p>
          </div>

          {/* Notify signup */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            {saveState === "done" ? (
              <p className="text-sm font-medium text-emerald-700">
                You&apos;re on the list 💛 We&apos;ll let you know as Close the Distance grows.
              </p>
            ) : (
              <form onSubmit={handleSave}>
                <label htmlFor="notify-email" className="block text-sm font-medium text-zinc-700">
                  Get an email as we add features
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="notify-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
                  />
                  <button
                    type="submit"
                    disabled={saveState === "saving"}
                    className="shrink-0 rounded-xl bg-[#b25c72] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9c4a60] disabled:opacity-60"
                  >
                    {saveState === "saving" ? "…" : "Notify me"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  {saveState === "error"
                    ? "Couldn't save that just now — give it another go?"
                    : "No spam — just the occasional update as we build."}
                </p>
              </form>
            )}
          </div>
            </div>
          </div>

        </div>

        <footer className="mt-10 text-xs text-zinc-400">
          Figures are indicative local medians for a two-bedroom place and typical living costs,
          shown in {a.currency} — not live data. Visa, stamp duty and mortgage assumptions are rough
          global estimates. This is a starting point for the conversation, not financial or
          immigration advice.{" "}
          <button
            onClick={onMethodology}
            className="font-medium text-zinc-500 underline underline-offset-2 transition hover:text-zinc-700"
          >
            How we calculate this →
          </button>
        </footer>
      </div>
    </main>
  );
}

const fmtYears = (years: number | null) => (years === null ? "—" : `~${years.toFixed(1)} yrs`);
const cityFlag = (a: Area) => getCountry(a.country)?.flag ?? "";

// "Same life, other countries" — your plan across the world, in AUD. A
// head-to-head between your pick and its best-value rival, then the full
// leaderboard ranked by what's left over each month.
function CompareCard({
  comparisons,
  currentId,
  onPickArea,
}: {
  comparisons: Comparison[];
  currentId: string;
  onPickArea: (a: Area) => void;
}) {
  // comparisons is already sorted by leftover, highest first.
  const current = comparisons.find((c) => c.area.id === currentId) ?? comparisons[0];
  // Best rival = the highest-leftover option that isn't your pick.
  const rival = comparisons.find((c) => c.area.id !== current.area.id);

  return (
    <div className="flex flex-col gap-5">
      {/* Head to head — your pick vs. its best-value rival */}
      {rival && (
        <HeadToHead current={current} rival={rival} onPickArea={onPickArea} />
      )}

      {/* The full leaderboard */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-900">
            Where your money goes furthest
          </h3>
          <span className="hidden text-xs text-zinc-400 sm:block">Left over /mo, in AUD · highest first</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Your exact plan in other countries — tap one to move your whole scenario there.
        </p>

        <div className="mt-4 flex items-center px-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          <span className="w-7">#</span>
          <span className="flex-1">City</span>
          <span className="hidden w-24 text-right sm:block">Rent /mo</span>
          <span className="w-24 text-right">Left over</span>
          <span className="hidden w-24 text-right md:block">To a deposit</span>
          <span className="w-24 text-right">Verdict</span>
        </div>

        <ul className="mt-1 divide-y divide-zinc-100">
          {comparisons.map((c, i) => {
            const isCurrent = c.area.id === currentId;
            const v = VERDICT_COPY[c.verdict];
            return (
              <li key={c.area.id}>
                <button
                  type="button"
                  onClick={() => onPickArea(c.area)}
                  disabled={isCurrent}
                  className={`flex w-full items-center rounded-xl px-1 py-3 text-left text-sm transition ${
                    isCurrent ? "cursor-default" : "hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`w-7 font-display font-semibold ${
                      i < 3 ? "text-[#b25c72]" : "text-zinc-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-1 items-center gap-2 font-medium text-zinc-800">
                    <span>{cityFlag(c.area)} {c.area.city}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-[#b25c72]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8a3f54]">
                        Your pick
                      </span>
                    )}
                  </span>
                  <span className="hidden w-24 text-right tabular-nums text-zinc-500 sm:block">
                    {fmt(c.rent, "AUD")}
                  </span>
                  <span
                    className={`w-24 text-right font-semibold tabular-nums ${
                      c.leftover >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {fmt(c.leftover, "AUD")}
                  </span>
                  <span className="hidden w-24 text-right tabular-nums text-zinc-500 md:block">
                    {fmtYears(c.years)}
                  </span>
                  <span className="flex w-24 items-center justify-end gap-1.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${v.dot}`} />
                    <span className="text-xs text-zinc-500">{VERDICT_LABEL[c.verdict]}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 px-1 text-[11px] text-zinc-400">
          Indicative medians for a two-bedroom place and typical living costs, normalised to AUD.
          Not live data — a starting point, not financial advice.
        </p>
      </div>
    </div>
  );
}

function HeadToHead({
  current,
  rival,
  onPickArea,
}: {
  current: Comparison;
  rival: Comparison;
  onPickArea: (a: Area) => void;
}) {
  // Whichever leaves more each month wears the "Better value" badge.
  const [winner, other] =
    rival.leftover > current.leftover ? [rival, current] : [current, rival];
  const monthlyGap = Math.abs(current.leftover - rival.leftover);
  // Positive = winner reaches a deposit sooner than the other.
  const yearsSooner =
    winner.years !== null && other.years !== null ? other.years - winner.years : null;

  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Head to head</h3>
      <div className="relative mt-3 grid gap-4 sm:grid-cols-2">
        <CompareColumn c={current} winner={winner.area.id === current.area.id} onPickArea={onPickArea} />
        <CompareColumn c={rival} winner={winner.area.id === rival.area.id} onPickArea={onPickArea} />
        <span className="pointer-events-none absolute left-1/2 top-1/2 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white font-display text-sm font-semibold text-zinc-400 shadow-sm sm:flex">
          vs
        </span>
      </div>

      {monthlyGap > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#b25c72]/20 bg-[#b25c72]/[0.07] px-4 py-3">
          <Mascot mood="happy" size={40} className="shrink-0" />
          <p className="text-sm text-[#7a5560]">
            <strong className="text-zinc-700">
              {winner.area.city} leaves you ~{fmt(monthlyGap, "AUD")} more every month
            </strong>
            {yearsSooner !== null && yearsSooner >= 0.3
              ? ` — and gets you to a deposit about ${yearsSooner.toFixed(1)} years sooner.`
              : "."}{" "}
            Same two incomes, very different runway.
          </p>
        </div>
      )}
    </div>
  );
}

function CompareColumn({
  c,
  winner,
  onPickArea,
}: {
  c: Comparison;
  winner: boolean;
  onPickArea: (a: Area) => void;
}) {
  const v = VERDICT_COPY[c.verdict];
  const rows: [string, string, boolean][] = [
    ["Rent /mo (2-bed)", fmt(c.rent, "AUD"), false],
    ["Left over /mo", fmt(c.leftover, "AUD"), c.leftover >= 0],
    ["Upfront to move in", fmt(c.upfront, "AUD"), false],
    ["Years to a deposit", fmtYears(c.years), false],
  ];
  return (
    <div
      className={`relative rounded-3xl bg-white p-6 ${
        winner
          ? "border-2 border-[#b25c72] shadow-[0_8px_26px_-12px_rgba(178,92,114,0.5)]"
          : "border border-zinc-200 shadow-sm"
      }`}
    >
      {winner && (
        <span className="absolute -top-3 right-5 rounded-full bg-[#b25c72] px-3 py-1 text-[11px] font-semibold tracking-tight text-white">
          Better value
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-display text-xl font-semibold tracking-tight">
            {cityFlag(c.area)} {c.area.city}
          </div>
          <div className="text-xs text-zinc-400">{c.area.region}</div>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-600">
          <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
          {VERDICT_LABEL[c.verdict]}
        </span>
      </div>
      <dl className="mt-4">
        {rows.map(([label, value, good], i) => (
          <div
            key={label}
            className={`flex items-center justify-between py-2.5 text-sm ${
              i < rows.length - 1 ? "border-b border-zinc-100" : ""
            }`}
          >
            <dt className="text-zinc-600">{label}</dt>
            <dd className={`font-semibold tabular-nums ${good ? "text-emerald-600" : "text-zinc-800"}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={() => onPickArea(c.area)}
        className="mt-4 w-full rounded-xl border border-zinc-200 py-2 text-sm font-semibold text-zinc-600 transition hover:border-[#b25c72] hover:text-[#8a3f54]"
      >
        Use {c.area.city}
      </button>
    </div>
  );
}

/* ------------------------------- Primitives ------------------------------- */

function Step({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="step-in">
      <h2 className="font-display text-3xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100">
          ← Back
        </button>
        <button
          onClick={onNext}
          className="rounded-xl bg-[#b25c72] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9c4a60]"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-zinc-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
      />
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  format,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  format?: (n: number) => string;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        <span className="text-sm font-semibold tabular-nums">
          {format ? format(value) : fmt(value)}
          {!format && suffix && <span className="text-xs font-normal text-zinc-400"> {suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full"
      />
    </div>
  );
}

// A money input that holds text, so backspacing to empty doesn't get stuck on
// 0 and there are no stray leading zeros. Empty reads as 0 for the maths.
function NumberInput({
  value,
  onValue,
  className,
  placeholder,
  ariaLabel,
}: {
  value: number;
  onValue: (n: number) => void;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [text, setText] = useState(value ? String(value) : "");
  useEffect(() => {
    const n = text === "" ? 0 : Number(text);
    if (n !== value) setText(value ? String(value) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");
        setText(raw);
        onValue(raw === "" ? 0 : Number(raw));
      }}
      className={className}
    />
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition ${
        on ? "bg-[#b25c72]" : "bg-zinc-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </span>
  );
}

function ToggleRow({
  on,
  onToggle,
  title,
  hint,
  children,
}: {
  on: boolean;
  onToggle: () => void;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={on}
        aria-label={title}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-sm font-medium text-zinc-700">{title}</span>
          <span className="block text-xs text-zinc-500">{hint}</span>
        </span>
        <Switch on={on} />
      </button>
      {on && <div className="-mt-2">{children}</div>}
    </div>
  );
}

// The results hero: a Duolingo-style winding road of the milestones to closing
// the distance, with Pip on the stage you've reached and a move-in countdown.
function Journey({
  result,
  cur,
  moveInDate,
  setMoveInDate,
}: {
  result: ReturnType<typeof simulate>;
  cur: string;
  moveInDate: string;
  setMoveInDate: (s: string) => void;
}) {
  const verdict = VERDICT_COPY[result.verdict];

  const days = moveInDate
    ? Math.max(0, Math.ceil((new Date(moveInDate).getTime() - Date.now()) / 86_400_000))
    : null;
  const arrived = days === 0;

  const intl = result.international;
  const nodes = [
    { emoji: "📍", label: "Today", value: "You're apart" },
    {
      emoji: "💸",
      label: "Afford the month",
      value:
        result.leftover >= 0
          ? `${fmt(result.leftover, cur)}/mo spare`
          : `short ${fmt(Math.abs(result.leftover), cur)}`,
      target: "j-money",
    },
    {
      emoji: "🪙",
      label: "Save the upfront",
      value: result.monthsToMoveIn === null ? "raise income first" : `${fmt(result.gap, cur)} to go`,
      target: "j-movein",
    },
    {
      emoji: intl ? "🛂" : "📦",
      label: intl ? "Visa & the move" : "The move",
      value: result.visaMonths > 0 ? `~${result.visaMonths} mo wait` : "moving day",
      target: "j-movein",
    },
    {
      emoji: arrived ? "🎉" : "💛",
      label: "Move in together",
      value: days === null ? "set your date ↓" : arrived ? "Today! 🎉" : `${days} days to go`,
    },
    { emoji: "🏡", label: "Your future", value: fmt(result.milestones[1].saved, cur), target: "j-future" },
  ];
  const currentIdx = result.verdict === "comfortable" ? 4 : result.verdict === "tight" ? 2 : 1;

  const N = nodes.length;
  const TOP = 52;
  const GAP = 124;
  const H = TOP + (N - 1) * GAP + 60;
  const pos = nodes.map((_, i) => ({ x: i % 2 === 0 ? 26 : 74, y: TOP + i * GAP }));
  let d = `M ${pos[0].x} ${pos[0].y}`;
  for (let i = 1; i < N; i++) {
    const my = (pos[i - 1].y + pos[i].y) / 2;
    d += ` C ${pos[i - 1].x} ${my}, ${pos[i].x} ${my}, ${pos[i].x} ${pos[i].y}`;
  }

  // Point along the winding road at a fractional node index.
  function ptAt(progress: number) {
    const t = Math.max(0, Math.min(N - 1, progress));
    const seg = Math.min(N - 2, Math.floor(t));
    const lt = t - seg;
    const p0 = pos[seg];
    const p3 = pos[seg + 1];
    const my = (p0.y + p3.y) / 2;
    const u = 1 - lt;
    return {
      x: u * u * u * p0.x + 3 * u * u * lt * p0.x + 3 * u * lt * lt * p3.x + lt * lt * lt * p3.x,
      y: u * u * u * p0.y + 3 * u * u * lt * my + 3 * u * lt * lt * my + lt * lt * lt * p3.y,
    };
  }

  // Pip walks from the start to your current stage when the page opens.
  const [pip, setPip] = useState(() => ptAt(currentIdx));
  const walkedRef = useRef(false);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || walkedRef.current) {
      setPip(ptAt(currentIdx));
      return;
    }
    walkedRef.current = true;
    let raf = 0;
    const start = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setPip(ptAt(eased * currentIdx));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  const tooSoon = days !== null && result.monthsToMoveIn !== null && days < result.monthsToMoveIn * 30;

  return (
    <div className={`overflow-hidden rounded-3xl border p-6 ${verdict.tone}`}>
      <p className="text-sm font-semibold uppercase tracking-wide opacity-70">
        Your road to closing the distance 💛
      </p>

      <div className="relative mt-3" style={{ height: H }}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${H}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="3 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.3}
          />
        </svg>

        {nodes.map((node, i) => (
          <button
            key={node.label}
            type="button"
            onClick={() =>
              node.target &&
              document.getElementById(node.target)?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            aria-label={`${node.label}: ${node.value}`}
            className={`absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center ${
              node.target ? "cursor-pointer" : "cursor-default"
            }`}
            style={{ left: `${pos[i].x}%`, top: pos[i].y }}
          >
            <span className="relative">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-sm transition ${
                  i <= currentIdx ? "border-white bg-white" : "border-white/50 bg-white/30"
                } ${node.target ? "hover:scale-105" : ""}`}
              >
                {node.emoji}
              </span>
              <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b25c72] text-[10px] font-bold text-white">
                {i + 1}
              </span>
            </span>
            <span className="mt-1.5 text-xs font-semibold leading-tight">{node.label}</span>
            <span className="text-[11px] leading-tight opacity-75">{node.value}</span>
          </button>
        ))}

        {/* Pip — you are here */}
        <div
          className="pointer-events-none absolute z-10"
          style={{ left: `${pip.x}%`, top: pip.y, transform: "translate(-50%, -82%)" }}
        >
          <Mascot mood={VERDICT_MOOD[result.verdict]} size={44} />
        </div>
      </div>

      <div className="mt-1 rounded-2xl bg-white/40 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="movein-date" className="text-sm font-medium">
            When do you want to move in?
          </label>
          <input
            id="movein-date"
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="rounded-lg border border-white/70 bg-white/80 px-2 py-1 text-sm"
          />
          {days !== null && (
            <span className="font-display text-base font-semibold">
              {arrived ? "Today! 🎉" : `${days} days to go`}
            </span>
          )}
        </div>
        {tooSoon && (
          <p className="mt-2 text-xs opacity-80">
            That&apos;s a little sooner than your savings reach (~{result.monthsToMoveIn} months) —
            give it a touch longer or trim the plan, and you&apos;re golden. 💛
          </p>
        )}
      </div>
    </div>
  );
}

function currencySymbol(cur: string) {
  const parts = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 0,
  }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value ?? "$";
}

// An editable monthly cost row — standard lines edit their amount; custom lines
// (pets, family support…) edit their label too and can be removed.
function EditableCost({
  line,
  symbol,
  onAmount,
  onLabel,
  onRemove,
}: {
  line: CostLine;
  symbol: string;
  onAmount: (line: CostLine, amount: number) => void;
  onLabel: (id: string, label: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-2 py-1.5">
      {line.custom ? (
        <input
          value={line.label}
          onChange={(e) => onLabel(line.key, e.target.value)}
          placeholder="Pets, family, hobby…"
          className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-zinc-700 transition hover:border-zinc-200 focus:border-[#b25c72] focus:outline-none"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm text-zinc-700">
          {line.label}
          {line.hint && <span className="ml-1 text-xs text-zinc-400">· {line.hint}</span>}
        </span>
      )}
      <span className="flex items-center gap-1">
        <span className="text-xs text-zinc-400">{symbol}</span>
        <NumberInput
          value={line.amount}
          onValue={(v) => onAmount(line, v)}
          ariaLabel={`${line.label || "Custom"} monthly amount`}
          className="w-24 rounded-md border border-zinc-200 bg-white px-2 py-1 text-right text-sm font-medium tabular-nums focus:border-[#b25c72] focus:outline-none focus:ring-1 focus:ring-[#b25c72]/30"
        />
        {line.custom && (
          <button
            type="button"
            onClick={() => onRemove(line.key)}
            className="px-1 text-lg leading-none text-zinc-300 transition hover:text-rose-500"
            aria-label="Remove cost"
          >
            ×
          </button>
        )}
      </span>
    </li>
  );
}

// Variant C earn card: an avatar marks whose pay it is, with the take-home
// input + currency, and the AUD conversion when it isn't already in dollars.
function EarnCard({
  initial,
  tint,
  who,
  value,
  onValue,
  currency,
  onCurrency,
  aud,
}: {
  initial: string;
  tint: "you" | "them";
  who: string;
  value: number;
  onValue: (n: number) => void;
  currency: string;
  onCurrency: (c: string) => void;
  aud: number;
}) {
  const avatar =
    tint === "you" ? "bg-[#b25c72]/15 text-[#b25c72]" : "bg-[#6a4a60]/15 text-[#6a4a60]";
  return (
    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-5 first:mt-0">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span
          aria-hidden
          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-bold ${avatar}`}
        >
          {initial}
        </span>
        <span className="text-sm font-semibold text-zinc-800">{who} take-home pay</span>
      </div>
      <div className="flex items-center gap-2.5">
        <NumberInput
          value={value}
          onValue={onValue}
          ariaLabel={`${who} take-home pay`}
          className="min-w-0 flex-1 rounded-xl border border-zinc-300 px-3.5 py-3 font-display text-xl font-semibold tabular-nums focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
        />
        <select
          value={currency}
          onChange={(e) => onCurrency(e.target.value)}
          aria-label="Pay currency"
          className="flex-none rounded-xl border border-zinc-300 bg-white px-2.5 py-3 text-sm font-semibold focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30"
        >
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="flex-none text-xs text-zinc-400">/mo</span>
      </div>
      {currency !== "AUD" && (
        <p className="mt-2.5 text-xs text-zinc-500">
          ≈ <span className="font-semibold text-[#6a4a60]">{fmt(aud)}</span> /mo in AUD
        </p>
      )}
    </div>
  );
}

const selectClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-[#b25c72] focus:outline-none focus:ring-2 focus:ring-[#b25c72]/30";

// One grouped block per person: their name and where they live.
function PersonCard({
  defaultName,
  name,
  onName,
  location,
  onLocation,
}: {
  defaultName: string;
  name: string;
  onName: (s: string) => void;
  location: Location;
  onLocation: (l: Location) => void;
}) {
  const isAU = location.country === "AU";
  return (
    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
      <TextField label="Name" value={name} onChange={onName} placeholder={defaultName} />

      <div className={`mt-3 grid gap-3 ${isAU ? "grid-cols-2" : "grid-cols-1"}`}>
        <label className="block">
          <span className="block text-sm font-medium text-zinc-700">Country</span>
          <select
            value={location.country}
            onChange={(e) => {
              const country = e.target.value;
              onLocation({ country, state: country === "AU" ? location.state || "SA" : "" });
            }}
            aria-label={`${name || defaultName} country`}
            className={selectClass}
          >
            {REGION_ORDER.map((region) => (
              <optgroup key={region} label={REGION_LABEL[region]}>
                {COUNTRIES_BY_REGION[region].map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {isAU && (
          <label className="block">
            <span className="block text-sm font-medium text-zinc-700">State</span>
            <select
              value={location.state}
              onChange={(e) => onLocation({ ...location, state: e.target.value })}
              aria-label={`${name || defaultName} state`}
              className={selectClass}
            >
              {AU_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  const btn =
    "h-9 w-9 rounded-full border border-zinc-300 text-lg leading-none text-zinc-700 transition hover:border-[#b25c72] hover:text-[#b25c72] disabled:opacity-40 disabled:hover:border-zinc-300 disabled:hover:text-zinc-700";
  return (
    <div className="flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        −
      </button>
      <span className="w-5 text-center text-base font-semibold tabular-nums">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
        +
      </button>
    </div>
  );
}

// Variant C — the Pip-led split. A dark rail walks the couple through the
// intake (logo, Pip + a line for the step, and the 5-step list with the
// current one lit), while the form sits in the panel on the right. On mobile
// the rail folds into a compact Pip header band above the form.
function IntakeShell({ step, children }: { step: number; children: React.ReactNode }) {
  const meta = INTAKE_META[step - 1] ?? INTAKE_META[0];
  return (
    <main className="flex min-h-[100svh] flex-1 flex-col lg:flex-row">
      {/* Rail — desktop */}
      <aside className="hidden bg-gradient-to-b from-[#3b2a40] to-[#5a3f54] px-10 py-11 text-white lg:flex lg:w-[420px] lg:flex-none lg:flex-col">
        <Link href="/" className="mb-9 flex items-center gap-2 text-[#f3c9d4]" title="Back to the journal">
          <HeartGap />
          <span className="font-display text-xl font-semibold tracking-tight">Close the Distance</span>
        </Link>

        <div className="mb-1 flex justify-center">
          <Mascot mood={meta.mood} size={116} />
        </div>
        <div
          key={`bubble-${step}`}
          className="step-in mb-8 rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3.5 text-[15px] leading-relaxed text-[#f6ecef]"
        >
          {meta.bubble}
        </div>

        <ol className="mt-auto flex flex-col gap-0.5">
          {INTAKE_META.map((m, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li
                key={m.label}
                className={`flex items-center gap-3 py-2 transition-opacity ${active ? "" : "opacity-50"}`}
              >
                <span
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
                    active || done
                      ? "bg-white text-[#3b2a40]"
                      : "border-[1.5px] border-white/50 text-white"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
                <span className={`text-sm ${active ? "font-semibold" : ""}`}>{m.label}</span>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Rail — mobile header band */}
      <div className="bg-gradient-to-b from-[#3b2a40] to-[#5a3f54] px-5 pb-5 pt-6 text-white lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#f3c9d4]" title="Back to the journal">
            <HeartGap />
            <span className="font-display text-base font-semibold tracking-tight">Close the Distance</span>
          </Link>
          <span className="text-xs text-[#d7c4cd]">
            Step {step} / {INTAKE_STEPS}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Mascot mood={meta.mood} size={56} className="shrink-0" />
          <div
            key={`mbubble-${step}`}
            className="step-in rounded-2xl rounded-tl-sm bg-white/12 px-3.5 py-2.5 text-[13px] leading-snug text-[#f6ecef]"
          >
            {meta.bubble}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-start justify-center px-5 py-10 lg:items-center lg:px-16">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </main>
  );
}

function HeartGap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 21s7-4.35 9.5-8.5C23.5 9 21.5 5 18 5c-2 0-3.2 1.2-4 2.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
