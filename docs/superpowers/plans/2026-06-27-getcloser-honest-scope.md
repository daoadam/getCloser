# GetCloser Honest-Scope & Engine Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the app charging a phantom $10k Australian visa to everyone, stop applying Australian mortgage/deposit/stamp-duty assumptions worldwide, stop showing AUD-only results, and align the marketing copy with what the tool actually does.

**Architecture:** The fixes are mostly data-driven: replace hardcoded global constants in `lib/calc.ts` with small per-country lookup tables (visa, home-finance) that fall back to Australian defaults, make the verdict cost-of-living-relative, and add a display-currency switch in the results UI. Marketing/UX copy is edited in place. No new dependencies, no backend changes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest. Pure calculation logic lives in `lib/calc.ts` and is unit-tested in `lib/calc.test.ts`.

## Global Constraints

- All money math stays AUD-based internally; `convert()` ([lib/currency.ts](../../../lib/currency.ts)) is the only currency bridge. Rate table key meaning: `rate[code]` = how many of `code` one AUD buys.
- Pure logic in `lib/calc.ts` must remain free of React imports (shared by `lib/rates.ts` hook and tests).
- No `console.log` in committed code.
- Immutable updates only (spread, no mutation).
- Test runner: `npm test` (= `vitest run`). Single file: `npx vitest run lib/calc.test.ts`.
- Numbers added to lookup tables are **indicative**, not authoritative — every user-facing number must keep its "indicative / not advice" framing.
- Conventional-commit messages (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).

---

## File Structure

- `lib/calc.ts` — **modify.** Add `VISA_BY_DEST` + `FINANCE_BY_COUNTRY` tables, `visaModeled` field, cost-of-living-relative verdict. Remove the four standalone buy-constants now living in the finance table.
- `lib/calc.test.ts` — **modify.** Add tests for destination-aware visa, finance profiles, and relative verdict.
- `app/Simulator.tsx` — **modify.** Representative comparison cities; pass through `visaModeled`; display-currency state + toggle; raise savings cap; step-1 visa-warning copy; share-data note.
- `app/Landing.tsx` — **modify.** Hero + trust-strip copy honesty.

Engine tasks (1–3) are independent and testable in isolation. UI tasks (4–6) depend on the engine producing the new fields.

---

## Task 1: Destination-aware visa model

Replace the single flat `PARTNER_VISA` constant (applied to every non-AU/NZ move) with a per-**destination** lookup. Destinations we have rough numbers for get a modeled visa; everything else returns zero cost plus a `visaModeled: false` flag so the UI can say "not modeled — add your own" instead of inventing a number.

**Files:**
- Modify: `lib/calc.ts:15-72` (the `Relocation` type and `relocationFor`), `lib/calc.ts:107-141` (`SimResult` type), `lib/calc.ts:277-284` (relocation wiring in `simulate`)
- Test: `lib/calc.test.ts`

**Interfaces:**
- Consumes: `getCountry(code)` from `./countries`, `Location` type (existing).
- Produces:
  - `relocationFor(loc: Location, destCountry: string, destState: string): Relocation` — `Relocation` now includes `visaModeled: boolean`.
  - `SimResult.visaModeled: boolean` — `true` when every international mover's destination visa is modeled (or nobody moves internationally); `false` when at least one international move targets an un-modeled destination.

- [ ] **Step 1: Write the failing tests**

Add to `lib/calc.test.ts` inside the existing `describe("relocationFor", …)` block (after the AU↔NZ reciprocal test), and add a new `describe` for the result flag at the end of the file:

```typescript
  it("a modeled destination uses that country's visa, not a flat 10k", () => {
    const toUk = relocationFor({ country: "NG", state: "" }, "GB", "");
    expect(toUk.international).toBe(true);
    expect(toUk.visa).toBeGreaterThan(0);
    expect(toUk.visa).toBeLessThan(10000); // UK spouse visa is far cheaper than the AU pathway
    expect(toUk.visaModeled).toBe(true);
  });

  it("an un-modeled destination charges no phantom visa and flags it", () => {
    const toBrazil = relocationFor({ country: "AU", state: "SA" }, "BR", "");
    expect(toBrazil.international).toBe(true);
    expect(toBrazil.visa).toBe(0);
    expect(toBrazil.visaModeled).toBe(false);
  });

  it("moving TO Australia still models the AU partner visa", () => {
    const toAu = relocationFor({ country: "GB", state: "" }, "AU", "SA");
    expect(toAu.visa).toBe(10000);
    expect(toAu.visaModeled).toBe(true);
  });
```

```typescript
describe("simulate visaModeled flag", () => {
  it("is false when an international mover targets an un-modeled country", () => {
    const brazil = AREAS_BY_COUNTRY["BR"][0];
    const r = simulate(base({ area: brazil, locationA: { country: "AU", state: "SA" } }));
    expect(r.visaModeled).toBe(false);
    expect(r.visaCost).toBe(0);
  });

  it("is true for a domestic move (no visa needed)", () => {
    const r = simulate(base());
    expect(r.visaModeled).toBe(true);
  });
});
```

Add `AREAS_BY_COUNTRY` to the imports at the top of `lib/calc.test.ts`:

```typescript
import { AREAS_BY_COUNTRY, getArea } from "./areas";
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/calc.test.ts`
Expected: FAIL — `visaModeled` is undefined, and BR currently returns `visa: 10000`.

- [ ] **Step 3: Add the visa table and `visaModeled` to the `Relocation` type**

In `lib/calc.ts`, replace the `Relocation` type (lines 15-22) with:

```typescript
export type Relocation = {
  move: number; // one-off flights + shipping for this person
  flight: number; // round-trip visit flight while still apart
  visa: number; // partner/spouse visa cost for the destination, 0 if none/unknown
  visaMonths: number; // typical processing time before settling, 0 if none/unknown
  visaModeled: boolean; // do we actually have a visa estimate for this destination?
  international: boolean;
  relocates: boolean; // does this person actually have to move?
};
```

Replace the `PARTNER_VISA` / `PARTNER_VISA_MONTHS` constants (lines 33-36) with a per-destination table:

```typescript
type VisaInfo = { cost: number; months: number };

// Indicative partner/spouse-visa cost (AUD) + typical processing time, keyed by
// DESTINATION country. Rough, not immigration advice. Anything not listed is
// treated as "we don't model this yet" (no phantom fee) — see DEFAULT_VISA.
const VISA_BY_DEST: Record<string, VisaInfo> = {
  AU: { cost: 10000, months: 18 }, // 820/801 or 309/100, fees + health/police/biometrics
  NZ: { cost: 2800, months: 12 }, // partnership-based residence
  GB: { cost: 5400, months: 3 }, // spouse visa fee + IHS
  US: { cost: 3000, months: 12 }, // CR1/IR1 spousal
  CA: { cost: 1500, months: 12 }, // spousal sponsorship
  DE: { cost: 1200, months: 4 }, // family reunion residence permit
  SG: { cost: 800, months: 2 }, // long-term visit pass (eligibility varies)
  JP: { cost: 600, months: 2 }, // spouse-of-national visa
};
// Unknown destination: no modeled cost. The UI surfaces this as "add your own".
const DEFAULT_VISA: VisaInfo = { cost: 0, months: 0 };
```

- [ ] **Step 4: Rewrite `relocationFor` to use the table**

Replace the body of `relocationFor` (lines 39-72) with:

```typescript
export function relocationFor(loc: Location, destCountry: string, destState: string): Relocation {
  // Same country as the destination — a domestic move, no visa.
  if (loc.country === destCountry) {
    if (loc.country === "AU") {
      const sameState = loc.state === destState;
      return {
        move: sameState ? 0 : 800,
        flight: sameState ? 0 : 350,
        visa: 0,
        visaMonths: 0,
        visaModeled: true, // no visa needed — that's a known answer, not a gap
        international: false,
        relocates: !sameState,
      };
    }
    return {
      move: 0, flight: 0, visa: 0, visaMonths: 0,
      visaModeled: true, international: false, relocates: false,
    };
  }

  // Different country — an international move. Flights scale with the mover's
  // region. AU & NZ have reciprocal rights (no partner visa either way).
  const country = getCountry(loc.country);
  const base = country ? REGION_RELO[country.region] : REGION_RELO.europe;
  const reciprocal =
    (loc.country === "AU" || loc.country === "NZ") && (destCountry === "AU" || destCountry === "NZ");

  if (reciprocal) {
    return {
      move: base.move, flight: base.flight, visa: 0, visaMonths: 0,
      visaModeled: true, international: true, relocates: true,
    };
  }

  const modeled = Object.prototype.hasOwnProperty.call(VISA_BY_DEST, destCountry);
  const v = modeled ? VISA_BY_DEST[destCountry] : DEFAULT_VISA;
  return {
    move: base.move,
    flight: base.flight,
    visa: v.cost,
    visaMonths: v.months,
    visaModeled: modeled,
    international: true,
    relocates: true,
  };
}
```

- [ ] **Step 5: Thread `visaModeled` into `SimResult`**

In the `SimResult` type (lines 107-141), add after the `visaMonths` field (line 124):

```typescript
  visaModeled: boolean; // false if any international move targets an un-modeled destination
```

In `simulate`, after the line computing `international` (line 284), add:

```typescript
  // True unless an actual international mover lacks a modeled visa estimate.
  const visaModeled =
    (!relocA.international || relocA.visaModeled) && (!relocB.international || relocB.visaModeled);
```

Add `visaModeled,` to the returned object (next to `visaMonths,` around line 384).

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run lib/calc.test.ts`
Expected: PASS (all existing + the 5 new cases).

- [ ] **Step 7: Commit**

```bash
git add lib/calc.ts lib/calc.test.ts
git commit -m "fix(calc): destination-aware visa model, no phantom AU fee for non-AU moves"
```

---

## Task 2: Per-country home-finance profiles

Replace the four global buy-constants (`DEPOSIT_PCT`, `MORTGAGE_RATE`, `MORTGAGE_YEARS`, `STAMP_DUTY_PCT`) with a per-country profile table so Berlin isn't charged Australian mortgage rates and stamp duty.

**Files:**
- Modify: `lib/calc.ts:172-182` (constants), `lib/calc.ts:204-401` (uses inside `simulate`)
- Test: `lib/calc.test.ts`

**Interfaces:**
- Consumes: `area.country` (existing `Area.country`).
- Produces: internal `FINANCE_BY_COUNTRY` table + `DEFAULT_FINANCE` (AU). No public signature change; behaviour of `simulate` for `buy` housing now varies by `area.country`.

- [ ] **Step 1: Write the failing test**

Add a new `describe` block to `lib/calc.test.ts`:

```typescript
describe("per-country home finance", () => {
  it("uses a lower mortgage rate for Germany than Australia", () => {
    const adl = simulate(base({ housing: "buy", area: getArea("au-adl-prospect")! }));
    const berlin = AREAS_BY_COUNTRY["DE"][0];
    const ber = simulate(base({ housing: "buy", area: berlin, displayCurrency: "AUD" }));
    // Same-priced house would cost less to service in DE; here we just assert the
    // engine applied a different (lower) rate by checking the hint text.
    expect(ber.costs.find((c) => c.key === "mortgage")?.hint).toContain("3.5%");
    expect(adl.costs.find((c) => c.key === "mortgage")?.hint).toContain("6.0%");
  });

  it("charges no stamp duty in New Zealand", () => {
    const akl = AREAS_BY_COUNTRY["NZ"][0];
    const r = simulate(base({ housing: "buy", area: akl, displayCurrency: "AUD" }));
    expect(r.stampDuty).toBe(0);
  });

  it("falls back to Australian assumptions for an un-profiled country", () => {
    const saoPaulo = AREAS_BY_COUNTRY["BR"][0];
    const r = simulate(base({ housing: "buy", area: saoPaulo, displayCurrency: "AUD" }));
    expect(r.costs.find((c) => c.key === "mortgage")?.hint).toContain("6.0%");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run lib/calc.test.ts`
Expected: FAIL — every country currently reports `6.0%` and NZ has 4% stamp duty.

- [ ] **Step 3: Add the finance table, remove the standalone constants**

In `lib/calc.ts`, replace the four constants (lines 174-177):

```typescript
const DEPOSIT_PCT = 0.2;
const MORTGAGE_RATE = 0.06; // variable home-loan rate, p.a.
const MORTGAGE_YEARS = 30;
const STAMP_DUTY_PCT = 0.04; // rough average across states
```

with:

```typescript
type FinanceProfile = {
  mortgageRate: number; // variable home-loan rate, p.a.
  depositPct: number; // typical deposit as a fraction of price
  stampDutyPct: number; // transfer/stamp duty as a fraction of price
  mortgageYears: number; // typical loan term
};

// Indicative home-buying assumptions by country. Rough, not advice. Countries
// not listed fall back to the Australian profile (DEFAULT_FINANCE).
const FINANCE_BY_COUNTRY: Record<string, FinanceProfile> = {
  AU: { mortgageRate: 0.06, depositPct: 0.2, stampDutyPct: 0.04, mortgageYears: 30 },
  NZ: { mortgageRate: 0.065, depositPct: 0.2, stampDutyPct: 0, mortgageYears: 30 },
  GB: { mortgageRate: 0.055, depositPct: 0.1, stampDutyPct: 0.03, mortgageYears: 25 },
  US: { mortgageRate: 0.068, depositPct: 0.2, stampDutyPct: 0.01, mortgageYears: 30 },
  CA: { mortgageRate: 0.055, depositPct: 0.1, stampDutyPct: 0.015, mortgageYears: 25 },
  DE: { mortgageRate: 0.035, depositPct: 0.2, stampDutyPct: 0.05, mortgageYears: 20 },
  SG: { mortgageRate: 0.035, depositPct: 0.25, stampDutyPct: 0.03, mortgageYears: 25 },
  JP: { mortgageRate: 0.015, depositPct: 0.1, stampDutyPct: 0.03, mortgageYears: 35 },
};
const DEFAULT_FINANCE: FinanceProfile = FINANCE_BY_COUNTRY.AU;
```

- [ ] **Step 4: Use the profile inside `simulate`**

In `simulate`, just after `const buying = housing === "buy";` (line 208), add:

```typescript
  const fin = FINANCE_BY_COUNTRY[area.country] ?? DEFAULT_FINANCE;
```

Replace the ownership-number block (lines 219-226) so it reads:

```typescript
  const medianHouse = l2d(area.medianHouse);
  const deposit = Math.round(medianHouse * fin.depositPct);
  const loan = medianHouse - deposit;
  const monthlyMortgageAmt = Math.round(monthlyMortgage(loan, fin.mortgageRate, fin.mortgageYears));
  const ownershipExtras = Math.round(
    (a2d(RATES_YEARLY) + a2d(HOME_INSURANCE_YEARLY) + medianHouse * MAINTENANCE_PCT) / 12
  );
  const stampDuty = buying ? Math.round(medianHouse * fin.stampDutyPct) : 0;
```

Replace the mortgage line's hint (line 239) so it reads:

```typescript
        mk("mortgage", "Mortgage (shared)", monthlyMortgageAmt, `${(fin.mortgageRate * 100).toFixed(1)}% over ${fin.mortgageYears}yr`),
```

In the buy-branch milestone block, replace the `principalPaid(loan, MORTGAGE_RATE, MORTGAGE_YEARS, years)` call (line 343) with:

```typescript
      const equity = deposit + principalPaid(loan, fin.mortgageRate, fin.mortgageYears, years);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run lib/calc.test.ts`
Expected: PASS. (If any existing buy-mode test asserted exact AU figures, it still passes — Adelaide uses the AU profile, which is unchanged numerically.)

- [ ] **Step 6: Commit**

```bash
git add lib/calc.ts lib/calc.test.ts
git commit -m "fix(calc): per-country mortgage/deposit/stamp-duty profiles, AU fallback"
```

---

## Task 3: Cost-of-living-relative verdict

The "comfortable / tight / not-yet" bar is an Adelaide-anchored AUD number. Scale it by the area's cost-of-living index so $300 left over in Singapore isn't judged the same as $300 in Adelaide.

**Files:**
- Modify: `lib/calc.ts:326-329`
- Test: `lib/calc.test.ts`

**Interfaces:**
- Consumes: `colIndex` (already destructured from `area` at line 207), `a2d` helper (existing).
- Produces: no signature change; `SimResult.verdict` now scales with `colIndex`.

- [ ] **Step 1: Write the failing test**

Add to `lib/calc.test.ts`:

```typescript
describe("verdict scales with cost of living", () => {
  it("the comfortable bar is higher in a pricier city", () => {
    // A leftover that is 'comfortable' at colIndex 1.0 should not automatically
    // be 'comfortable' once the same surplus is measured against a 1.45 city.
    const cheap = { ...getArea("au-adl-prospect")!, colIndex: 1.0 };
    const dear = { ...getArea("au-adl-prospect")!, colIndex: 1.45 };
    const leftoverAt = (area: typeof cheap) =>
      simulate(base({ area, incomeA: 5200, incomeB: 0 })).verdict;
    // Same income/costs base, only colIndex differs: the dearer city should be a
    // stricter (worse-or-equal) verdict.
    const order = { comfortable: 2, tight: 1, "not-yet": 0 } as const;
    expect(order[leftoverAt(dear)]).toBeLessThanOrEqual(order[leftoverAt(cheap)]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails (or is trivially true)**

Run: `npx vitest run lib/calc.test.ts -t "verdict scales"`
Expected: FAIL — thresholds are currently flat, so both cities can land on the same verdict and the inequality can break depending on figures. (If it passes by luck before the change, Step 4 makes the relationship intentional and robust.)

- [ ] **Step 3: Make the thresholds cost-of-living-relative**

Replace the verdict block (lines 326-329):

```typescript
  let verdict: SimResult["verdict"];
  if (leftover >= a2d(1500 * colIndex)) verdict = "comfortable";
  else if (leftover >= a2d(300 * colIndex)) verdict = "tight";
  else verdict = "not-yet";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/calc.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/calc.ts lib/calc.test.ts
git commit -m "fix(calc): scale comfortable/tight verdict bar by cost of living"
```

---

## Task 4: Representative comparison cities

The "Where your money goes furthest" leaderboard uses `AREAS_BY_COUNTRY[c][0]` — an arbitrary first suburb. Use a representative city per country (largest metro), and always include the user's destination country.

**Files:**
- Modify: `lib/areas.ts` (add `representativeAreaFor` export), `app/Simulator.tsx:259-278` (comparisons memo)
- Test: `lib/calc.test.ts` (or a new `lib/areas.test.ts`)

**Interfaces:**
- Consumes: `AREAS_BY_COUNTRY` (existing).
- Produces: `representativeAreaFor(country: string): Area | undefined` exported from `lib/areas.ts` — returns the highest-rent area in that country (proxy for "main city"), or `undefined` if the country has no areas.

- [ ] **Step 1: Write the failing test**

Create `lib/areas.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { AREAS_BY_COUNTRY, representativeAreaFor } from "./areas";

describe("representativeAreaFor", () => {
  it("returns the priciest (proxy: main) area for a country", () => {
    const au = representativeAreaFor("AU")!;
    const maxRent = Math.max(...AREAS_BY_COUNTRY["AU"].map((a) => a.weeklyRent2br));
    expect(au.weeklyRent2br).toBe(maxRent);
  });

  it("returns undefined for a country with no areas", () => {
    expect(representativeAreaFor("ZZ")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/areas.test.ts`
Expected: FAIL — `representativeAreaFor` is not exported.

- [ ] **Step 3: Add `representativeAreaFor` to `lib/areas.ts`**

Append to `lib/areas.ts` (after `areaState`, near line 426):

```typescript
// A stand-in "main city" for a country in cross-country comparisons: the
// highest-rent area we hold is a decent proxy for the primary metro.
export function representativeAreaFor(country: string): Area | undefined {
  const list = AREAS_BY_COUNTRY[country];
  if (!list || list.length === 0) return undefined;
  return list.reduce((best, a) => (a.weeklyRent2br > best.weeklyRent2br ? a : best), list[0]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/areas.test.ts`
Expected: PASS.

- [ ] **Step 5: Use it in the comparisons memo**

In `app/Simulator.tsx`, update the import (line 4) to include the new helper:

```typescript
import { Area, AREAS_BY_COUNTRY, DESTINATION_COUNTRIES, areaState, areasByRegion, getArea, representativeAreaFor } from "@/lib/areas";
```

Replace the comparisons memo body (lines 259-278) so it uses a representative area and always includes the destination country:

```typescript
  const comparisons = useMemo(() => {
    const codes = Array.from(new Set([area.country, ...COMPARE_COUNTRIES]));
    return codes
      .map((c) => {
        const ar = c === area.country ? area : representativeAreaFor(c);
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
```

- [ ] **Step 6: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/areas.ts lib/areas.test.ts app/Simulator.tsx
git commit -m "fix(compare): use representative city per country in leaderboard"
```

---

## Task 5: Honest copy, savings cap, visa-gap & share-data notes

Align marketing/UX copy with reality, surface the un-modeled-visa case, raise the savings cap, and tell users the share link contains their data.

**Files:**
- Modify: `app/Landing.tsx:105-109` (hero), `app/Landing.tsx:160-164` (trust strip)
- Modify: `app/Simulator.tsx:535-540` (step-1 visa warning), `app/Simulator.tsx:610-616` (savings slider), `app/Simulator.tsx:1036-1056` (share button area), and the visa line in `Results` (`lib/calc.ts`-driven block at `app/Simulator.tsx:1228-1236`)

**Interfaces:**
- Consumes: `result.visaModeled` (from Task 1), `result.international` (existing).
- Produces: no new exports — UI/copy only.

- [ ] **Step 1: Soften the hero promise**

In `app/Landing.tsx`, replace the hero paragraph (lines 105-109):

```tsx
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#6b6068] sm:text-xl">
              You&rsquo;re doing long distance. In about a minute, see what moving in together would
              cost — the verdict, the money, and the years after. Strongest for moves to Australia
              &amp; New Zealand, with ballpark estimates for {" "}
              <span className="whitespace-nowrap">40+ more countries.</span>
            </p>
```

- [ ] **Step 2: Fix the trust strip overclaim**

In `app/Landing.tsx`, replace the "Works anywhere" trust-strip item (line 162):

```tsx
          <span>✓ Built for AU/NZ moves · ballpark elsewhere</span>
```

- [ ] **Step 3: Rewrite the step-1 visa warning to be destination-honest**

In `app/Simulator.tsx`, replace the visa heads-up block (lines 535-540):

```tsx
            {(needsVisa(locationA) || needsVisa(locationB)) && (
              <p className="mt-4 text-xs text-zinc-400">
                Heads up: if you&apos;re moving to Australia, a partner visa runs ~{fmt(10000)} and
                typically ~18 months per person. Visa costs for other destinations vary a lot — we
                estimate a few and let you fill in the rest. Indicative only, not immigration advice.
              </p>
            )}
```

- [ ] **Step 4: Raise the savings cap**

In `app/Simulator.tsx`, change the savings `Slider` `max` (line 615) from `100000` to `1000000` and `step` (line 616) from `1000` to `5000`:

```tsx
                min={0}
                max={1000000}
                step={5000}
```

- [ ] **Step 5: Show the un-modeled-visa state on the results breakdown**

In `app/Simulator.tsx`, the upfront list renders a visa line only when `result.visaCost > 0` (lines 1228-1236). Add an adjacent honest row for the modeled-but-zero / un-modeled case. Immediately **after** the closing `)}` of the `{result.visaCost > 0 && ( … )}` block (line 1236), insert:

```tsx
              {result.international && !result.visaModeled && (
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-zinc-700">
                    Partner / spouse visa
                    <span className="ml-1 text-xs text-zinc-400">· not estimated for this country</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddCost("Partner / spouse visa")}
                    className="text-sm font-medium text-[#b25c72] transition hover:text-[#8a3f54]"
                  >
                    + Add your estimate
                  </button>
                </li>
              )}
```

- [ ] **Step 6: Tell users the share link carries their data**

In `app/Simulator.tsx`, the share/Tweak/Restart row sits in a `flex items-center gap-2 text-sm` div (lines 1035-1056). Below that row's closing `</div>` (line 1056), add a caption. Replace line 1056-1057 region — specifically, insert right after the `</div>` that closes the button group and before `</div>` that closes the header `mb-8` flex container is awkward; instead add the note under the header. After the header block closes (line 1057, the `</div>` ending the `mb-8 flex` container), add:

```tsx
        <p className="-mt-6 mb-6 text-right text-[11px] text-zinc-400">
          The share link contains your scenario (incomes, savings, names) — only share it with people
          you trust.
        </p>
```

- [ ] **Step 7: Verify build + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add app/Landing.tsx app/Simulator.tsx
git commit -m "fix(copy): honest scope, visa-gap row, larger savings cap, share-data note"
```

---

## Task 6: Display-currency toggle on results

Stop forcing AUD on the headline result for users who think in another currency. Add a small toggle (Destination / AUD / your currency) on the results screen.

**Files:**
- Modify: `app/Simulator.tsx` — add `resultCurrency` state, feed it into the `result` memo, render a toggle in `Results`.

**Interfaces:**
- Consumes: `simulate({..., displayCurrency})` (existing), `currencyA` (the user's home currency, existing state).
- Produces: no new exports — a `resultCurrency` state local to `Simulator`, passed into `Results` as `currencyOptions` + `currency` + `onCurrency`.

- [ ] **Step 1: Add result-currency state and wire it into the result memo**

In `app/Simulator.tsx`, add state near the other result-page state (after line 135, `const [horizon, setHorizon] = useState(5);`):

```tsx
  // Which currency the headline result is shown in (defaults to the destination's).
  const [resultCurrency, setResultCurrency] = useState<string | null>(null);
```

Change the `result` memo (lines 253-256) to honour the override, defaulting to the area currency:

```tsx
  const result = useMemo(
    () =>
      simulate({
        ...baseInput,
        area,
        displayCurrency: resultCurrency ?? area.currency,
        costOverrides,
        extraCosts,
      }),
    [baseInput, area, resultCurrency, costOverrides, extraCosts]
  );
```

- [ ] **Step 2: Reset overrides when the result currency changes**

The existing effect (lines 148-155) clears overrides on `[areaId, housing]`. Overrides are typed in the display currency, so add `resultCurrency` to that dependency list:

```tsx
  }, [areaId, housing, resultCurrency]);
```

- [ ] **Step 3: Pass currency controls into `Results`**

In the `Results` JSX props (around lines 403-444), add three props after `setHorizon={setHorizon}`:

```tsx
        currencyOptions={Array.from(new Set([area.currency, "AUD", currencyA]))}
        currency={resultCurrency ?? area.currency}
        onCurrency={(c) => setResultCurrency(c === area.currency ? null : c)}
```

- [ ] **Step 4: Accept the new props in `Results`**

In the `Results` function signature destructure (after `setHorizon,` at line 980) add:

```tsx
  currencyOptions,
  currency: displayCur,
  onCurrency,
```

And in its type block (after `setHorizon: (n: number) => void;` line 980) add:

```tsx
  currencyOptions: string[];
  currency: string;
  onCurrency: (c: string) => void;
```

- [ ] **Step 5: Render the toggle**

In `Results`, the header button row holds Share / Tweak / Restart (lines 1035-1056). Add a currency segmented control as the first child of that `flex items-center gap-2 text-sm` div (immediately after its opening tag at line 1035):

```tsx
            <div className="mr-1 flex rounded-lg border border-zinc-200 p-0.5">
              {currencyOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCurrency(c)}
                  className={`rounded-md px-2 py-1 text-xs font-semibold transition ${
                    displayCur === c ? "bg-[#b25c72] text-white" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
```

- [ ] **Step 6: Verify build + manual smoke**

Run: `npx tsc --noEmit && npm run dev`
Manual: run a scenario → results → click each currency chip → all headline numbers re-express, overrides reset cleanly, no NaN.
Stop the dev server when done.

- [ ] **Step 7: Commit**

```bash
git add app/Simulator.tsx
git commit -m "feat(results): display-currency toggle (destination / AUD / home)"
```

---

## Out of Scope — Future Plans

These are real but bigger; each deserves its own plan (and some are product decisions, not bugs):

- **Full per-destination visa matrix** with origin→dest waiver rules (EU↔EU, trans-Tasman beyond AU/NZ, etc.) and relationship-recognition flags (same-sex pathways differ by country — Maria's point). Builds on Task 1's table.
- **Destination-income mode** (Priya's point): let a mover enter expected post-move salary so Global South couples get a real path, not just "not yet."
- **FX-sensitivity view** (Hans/Tomás): a ±10% currency-swing scenario on the results for long visa waits.
- **Tone-density toggle** (Jake/Kenji): a "just the numbers" view that strips Pip/emoji for users who want a plain financial read.
- **Data coverage expansion**: lift the 19 single-city countries to 2–3 cities each so the suburb search isn't empty for them.
- **Server-side short share links** (Kenji): random-ID links via the existing Supabase backend instead of base64-in-URL.

---

## Self-Review

- **Spec coverage:** Visa phantom-fee (T1), AU finance constants (T2), AUD-anchored verdict (T3), leaderboard first-city (T4), overclaim copy + savings cap + share privacy + visa-gap surfacing (T5), AUD-only display (T6). The remaining persona criticals (income pathway, same-sex recognition, FX, tone, data depth) are explicitly deferred with reasons in "Out of Scope."
- **Placeholder scan:** No TBD/TODO; every code step shows full code; every test step shows assertions.
- **Type consistency:** `visaModeled` added in T1 to both `Relocation` and `SimResult`, consumed in T5; `representativeAreaFor` defined in T4 and used in the same task; `resultCurrency`/`currencyOptions`/`onCurrency` defined and consumed within T6; `FinanceProfile`/`fin` consistent across T2.
- **Note for executor:** line numbers reference the file state at planning time (2026-06-27); after earlier tasks edit a file, re-anchor by the surrounding code shown in each step rather than the raw line number.
```

