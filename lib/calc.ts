import { Area, areaState } from "./areas";
import { CountryRegion, getCountry } from "./countries";
import { convert } from "./currency";

export { fmt } from "./currency";

export type Lifestyle = "frugal" | "comfortable" | "relaxed";

export type Housing = "rent" | "buy";

// Where a person currently lives. country = ISO-2; state is only meaningful
// when country === "AU" (so we can tell a same-city move from interstate).
export type Location = { country: string; state: string };

export type Relocation = {
  move: number; // one-off flights + shipping for this person
  flight: number; // round-trip visit flight while still apart
  visa: number; // AU partner-visa pathway cost, 0 if none needed
  visaMonths: number; // typical processing time before settling, 0 if none
  international: boolean;
  relocates: boolean; // does this person actually have to move?
};

// One-off move cost by how far from Australia the person is coming.
const REGION_RELO: Record<CountryRegion, { move: number; flight: number }> = {
  oceania: { move: 1300, flight: 600 },
  asia: { move: 1800, flight: 900 },
  europe: { move: 2600, flight: 1800 },
  americas: { move: 2600, flight: 1800 },
  "africa-me": { move: 2800, flight: 2000 },
};

// AU partner visa (subclass 820/801 or 309/100) is ~$9,095 in application fees
// plus health/police/biometrics — call it ~$10k all-in, roughly flat by origin.
const PARTNER_VISA = 10000;
const PARTNER_VISA_MONTHS = 18;

// What it takes for someone in `loc` to land at the destination (in AUD).
export function relocationFor(loc: Location, destCountry: string, destState: string): Relocation {
  // Same country as the destination — a domestic move, no visa.
  if (loc.country === destCountry) {
    // Australia has state granularity, so we can tell local from interstate.
    if (loc.country === "AU") {
      const sameState = loc.state === destState;
      return {
        move: sameState ? 0 : 800,
        flight: sameState ? 0 : 350,
        visa: 0,
        visaMonths: 0,
        international: false,
        relocates: !sameState,
      };
    }
    // Elsewhere we assume they're already local to the destination.
    return { move: 0, flight: 0, visa: 0, visaMonths: 0, international: false, relocates: false };
  }

  // Different country — an international move. Flights scale with the mover's
  // region (indicative). Australia & NZ have reciprocal rights (no partner visa).
  const country = getCountry(loc.country);
  const base = country ? REGION_RELO[country.region] : REGION_RELO.europe;
  const reciprocal =
    (loc.country === "AU" || loc.country === "NZ") && (destCountry === "AU" || destCountry === "NZ");
  return {
    move: base.move,
    flight: base.flight,
    visa: reciprocal ? 0 : PARTNER_VISA,
    visaMonths: reciprocal ? 0 : PARTNER_VISA_MONTHS,
    international: true,
    relocates: true,
  };
}

export type SimInput = {
  // After-tax take-home pay, per person, per month.
  incomeA: number;
  incomeB: number;
  area: Area;
  housing: Housing; // rent the first place, or buy it
  lifestyle: Lifestyle;
  kids: number; // 0..3 — children you'd plan to raise together
  savings: number; // combined cash you have toward the move today
  monthlyDebts: number; // combined loan / card / HECS repayments per month
  locationA: Location; // where you currently live
  locationB: Location; // where your partner currently lives
  transitionMonths: number; // months the relocating partner(s) earn nothing after landing
  visitsPerYear: number; // times you fly to see each other while still apart
  // Optional one-offs (0 = off). Emergency buffer is in months of total costs;
  // pet relocation is an AUD amount; transfer fee is a % of savings moved abroad.
  emergencyMonths: number;
  petRelocation: number;
  transferFeePct: number;
  // The couple already holds the right to live at the destination
  // (citizenship, PR, free movement) — zeroes visa cost and wait.
  visaWaived?: boolean;
  // Incomes/savings/debts are passed in AUD; the result is computed and shown
  // in displayCurrency (usually the destination's currency).
  displayCurrency: string;
  rates: Record<string, number>;
  // Per-line edits the user typed on the results page, in displayCurrency.
  costOverrides?: Record<string, number>;
  // Extra cost lines the user added (pets, family support, …), in displayCurrency.
  extraCosts?: { id: string; label: string; amount: number }[];
};

export type CostLine = { key: string; label: string; amount: number; hint?: string; custom?: boolean };

export type Milestone = { years: number; saved: number; depositPct: number };

export type SimResult = {
  combinedIncome: number;
  currency: string; // currency everything in this result is expressed in
  housing: Housing;
  rent: number;
  monthlyMortgage: number; // P&I repayment if buying, 0 if renting
  deposit: number; // 20% deposit (buy) — also the rent-mode savings goal
  stampDuty: number; // stamp duty + conveyancing if buying, 0 if renting
  costs: CostLine[];
  totalCosts: number;
  leftover: number;
  // Cost to actually move in.
  upfront: number; // everything you need behind you before you're safely together
  setupCost: number; // bond+setup (rent) OR deposit+stamp+fees (buy)
  relocationCost: number; // flights/shipping + visa
  moveCost: number; // flights/shipping only
  visaCost: number; // partner-visa pathway, 0 if none
  visaMonths: number; // typical visa processing time, 0 if none
  visitCost: number; // flights to see each other while apart
  transitionBuffer: number; // income to cover while the mover has no job yet
  emergencyCost: number; // optional safety buffer (months of costs), 0 if off
  petRelocationCost: number; // optional one-off pet move, 0 if off
  transferCost: number; // optional fee to move savings abroad, 0 if off
  apartMonths: number; // how long you're realistically still apart
  international: boolean;
  savings: number;
  gap: number; // upfront still to save after applying current savings
  monthsToMoveIn: number | null; // null = can't currently save toward it
  gatedBy: "money" | "visa" | null; // what's holding the move back
  verdict: "comfortable" | "tight" | "not-yet";
  // Future projection.
  depositTarget: number; // 20% of median house
  yearsToDeposit: number | null; // null = surplus won't build a deposit here
  milestones: Milestone[]; // savings at 1 / 5 / 10 years
};

const WEEKS_PER_MONTH = 52 / 12;

// Base monthly costs for a couple sharing, at colIndex 1.0.
const BASE = {
  utilities: 320, // power, water, internet, phone
  health: 250, // insurance, medical, fitness
  transport: 400, // fuel/public transport for two
};

const GROCERIES: Record<Lifestyle, number> = {
  frugal: 700,
  comfortable: 950,
  relaxed: 1200,
};

const DISCRETIONARY: Record<Lifestyle, number> = {
  frugal: 300,
  comfortable: 750,
  relaxed: 1300,
};

// Indicative all-in monthly cost of raising one child in AU (food, care,
// activities, after typical subsidies). Scaled by area cost of living.
const KID_MONTHLY = 1300;

// Streaming, music, gym, app & phone subscriptions for two (roughly global).
const SUBSCRIPTIONS = 120;

// Buying assumptions (indicative AU). Rates and stamp duty vary by lender and
// state; first-home-buyer concessions can cut stamp duty a lot — kept simple
// and on the conservative side so the number doesn't flatter.
const DEPOSIT_PCT = 0.2;
const MORTGAGE_RATE = 0.06; // variable home-loan rate, p.a.
const MORTGAGE_YEARS = 30;
const STAMP_DUTY_PCT = 0.04; // rough average across states
const CONVEYANCING = 2500; // legals + inspections + loan setup
const RATES_YEARLY = 2000; // council rates
const HOME_INSURANCE_YEARLY = 1500; // building insurance
const MAINTENANCE_PCT = 0.01; // of home value, per year

const HORIZONS = [1, 5, 10];

// Standard amortised repayment.
function monthlyMortgage(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

// Principal paid off (i.e. equity gained beyond the deposit) after `afterYears`.
function principalPaid(principal: number, annualRate: number, years: number, afterYears: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  const m = Math.min(afterYears * 12, n);
  const M = monthlyMortgage(principal, annualRate, years);
  if (r === 0) return M * m;
  const balance = principal * Math.pow(1 + r, m) - M * ((Math.pow(1 + r, m) - 1) / r);
  return principal - balance;
}

export function simulate(input: SimInput): SimResult {
  const { incomeA, incomeB, area, housing, lifestyle, kids, savings, monthlyDebts, locationA, locationB } = input;
  const { transitionMonths, visitsPerYear, displayCurrency, rates } = input;
  const { colIndex } = area;
  const buying = housing === "buy";

  // Conversion helpers: AUD→display (for AUD-defined constants/incomes) and
  // area-local→display (for rents/prices already in the area's own currency).
  const a2d = (x: number) => convert(x, "AUD", displayCurrency, rates);
  const l2d = (x: number) => convert(x, area.currency, displayCurrency, rates);

  const combinedIncome = a2d(incomeA) + a2d(incomeB);
  const rent = l2d(Math.round(area.weeklyRent2br * WEEKS_PER_MONTH));

  // Ownership numbers, in display currency (median price is area-local).
  const medianHouse = l2d(area.medianHouse);
  const deposit = Math.round(medianHouse * DEPOSIT_PCT);
  const loan = medianHouse - deposit;
  const monthlyMortgageAmt = Math.round(monthlyMortgage(loan, MORTGAGE_RATE, MORTGAGE_YEARS));
  const ownershipExtras = Math.round(
    (a2d(RATES_YEARLY) + a2d(HOME_INSURANCE_YEARLY) + medianHouse * MAINTENANCE_PCT) / 12
  );
  const stampDuty = buying ? Math.round(medianHouse * STAMP_DUTY_PCT) : 0;

  // Build each line, letting a user override on the results page win.
  const ov = input.costOverrides ?? {};
  const mk = (key: string, label: string, amount: number, hint?: string): CostLine => ({
    key,
    label,
    hint,
    amount: Number.isFinite(ov[key]) ? Math.round(ov[key]) : amount,
  });

  const housingLines: CostLine[] = buying
    ? [
        mk("mortgage", "Mortgage (shared)", monthlyMortgageAmt, `${(MORTGAGE_RATE * 100).toFixed(1)}% over ${MORTGAGE_YEARS}yr`),
        mk("ownership", "Rates, insurance & upkeep", ownershipExtras, "owning's hidden costs"),
      ]
    : [mk("rent", "Rent (shared)", rent, `${area.city}, ~${area.weeklyRent2br}/wk local`)];

  const costs: CostLine[] = [
    ...housingLines,
    mk("utilities", "Utilities & internet", a2d(Math.round(BASE.utilities * colIndex))),
    mk("groceries", "Groceries", a2d(Math.round(GROCERIES[lifestyle] * colIndex))),
    mk("transport", "Transport", a2d(Math.round(BASE.transport * colIndex))),
    mk("health", "Health & insurance", a2d(Math.round(BASE.health * colIndex))),
    mk("subs", "Subscriptions & memberships", a2d(SUBSCRIPTIONS), "streaming, gym, phone"),
    mk("lifestyle", "Lifestyle & going out", a2d(Math.round(DISCRETIONARY[lifestyle] * colIndex))),
  ];

  if (kids > 0) {
    costs.push(mk("kids", `Children (${kids})`, a2d(Math.round(KID_MONTHLY * kids * colIndex)), "food, care & activities"));
  }

  if (monthlyDebts > 0) {
    costs.push(mk("debts", "Debt repayments", a2d(Math.round(monthlyDebts)), "loans, cards, HECS"));
  }

  // Anything the couple added themselves — pets, family support, hobbies…
  for (const e of input.extraCosts ?? []) {
    if (!e.label.trim() && !e.amount) continue;
    costs.push({ key: e.id, label: e.label.trim() || "Custom", amount: Math.round(e.amount) || 0, custom: true });
  }

  const totalCosts = costs.reduce((s, c) => s + c.amount, 0);
  const leftover = combinedIncome - totalCosts;

  // What it costs to actually move in. Renting = bond + setup; buying = the
  // deposit + stamp duty + fees, which is a vastly bigger wall.
  const setupCost = buying
    ? deposit + stampDuty + a2d(CONVEYANCING)
    : l2d(Math.round(area.weeklyRent2br * 6)) + a2d(1500); // bond (4wk) + 2wk advance + setup buffer
  const destState = areaState(area);
  let relocA = relocationFor(locationA, area.country, destState);
  let relocB = relocationFor(locationB, area.country, destState);
  if (input.visaWaived) {
    relocA = { ...relocA, visa: 0, visaMonths: 0 };
    relocB = { ...relocB, visa: 0, visaMonths: 0 };
  }
  const moveCost = a2d(relocA.move + relocB.move);
  const visaCost = a2d(relocA.visa + relocB.visa);
  const relocationCost = moveCost + visaCost;
  // Visas process in parallel, so the longer one gates the move.
  const visaMonths = Math.max(relocA.visaMonths, relocB.visaMonths);
  const international = relocA.international || relocB.international;

  // While you're still apart, you fly to see each other. Tie the apart-period
  // to the visa wait if there is one, otherwise a typical ~12-month saving run.
  const flightPerVisit = Math.max(relocA.flight, relocB.flight);
  const apartMonths = visaMonths > 0 ? visaMonths : flightPerVisit > 0 ? 12 : 0;
  const visitCost = a2d(Math.round(visitsPerYear * (apartMonths / 12) * flightPerVisit));

  // After landing, a relocating partner often earns nothing for a while
  // (job hunt, visa work-rights). Cover their missing income — or at least
  // their half of the monthly costs, so a low/no-income mover still gets a
  // real runway instead of a $0 buffer.
  const moverCover = (income: number) => Math.max(a2d(income), totalCosts / 2);
  const transitionBuffer = Math.round(
    ((relocA.relocates ? moverCover(incomeA) : 0) +
      (relocB.relocates ? moverCover(incomeB) : 0)) *
      transitionMonths
  );

  const savingsD = a2d(savings);

  // Optional one-offs the couple switched on (all 0 when off).
  const { emergencyMonths, petRelocation, transferFeePct } = input;
  const emergencyCost = emergencyMonths > 0 ? Math.round(emergencyMonths * totalCosts) : 0;
  const petRelocationCost = petRelocation > 0 ? a2d(petRelocation) : 0;
  const transferCost = transferFeePct > 0 ? a2d(Math.round(savings * (transferFeePct / 100))) : 0;

  const upfront =
    setupCost + relocationCost + visitCost + transitionBuffer + emergencyCost + petRelocationCost + transferCost;

  const gap = Math.max(upfront - savingsD, 0);
  const monthlySave = Math.max(leftover, 0);
  // Months to save the remaining gap (0 if savings already cover it).
  const saveMonths = gap === 0 ? 0 : monthlySave > 0 ? Math.ceil(gap / monthlySave) : null;

  // A move can be gated by money OR by the visa timeline, whichever is longer.
  let monthsToMoveIn: number | null;
  let gatedBy: SimResult["gatedBy"];
  if (saveMonths === null) {
    monthsToMoveIn = null;
    gatedBy = "money";
  } else {
    monthsToMoveIn = Math.max(saveMonths, visaMonths);
    gatedBy = visaMonths > saveMonths ? "visa" : "money";
  }

  let verdict: SimResult["verdict"];
  if (leftover >= a2d(1500)) verdict = "comfortable";
  else if (leftover >= a2d(300)) verdict = "tight";
  else verdict = "not-yet";

  // Future projection (linear — before any price growth, kept honest).
  const depositTarget = deposit; // 20% of median house

  let yearsToDeposit: number | null;
  let milestones: Milestone[];

  if (buying) {
    // You already own once you've moved in. The future is equity: your deposit
    // plus the loan principal you pay down (no assumed price growth).
    yearsToDeposit = monthsToMoveIn === null ? null : monthsToMoveIn / 12;
    milestones = HORIZONS.map((years) => {
      const equity = deposit + principalPaid(loan, MORTGAGE_RATE, MORTGAGE_YEARS, years);
      return {
        years,
        saved: Math.round(equity),
        depositPct: medianHouse > 0 ? Math.min(equity / medianHouse, 1) : 0,
      };
    });
  } else {
    // Renting: the surplus builds toward a future deposit — but the upfront
    // wall gets paid first. netToday goes negative while the gap is unsaved,
    // so early milestones don't count money that's already spoken for.
    const netToday = savingsD - upfront;
    yearsToDeposit =
      netToday >= depositTarget
        ? 0
        : monthlySave > 0
          ? (depositTarget - netToday) / (monthlySave * 12)
          : null;
    milestones = HORIZONS.map((years) => {
      const saved = Math.max(0, netToday + monthlySave * 12 * years);
      return {
        years,
        saved,
        depositPct: depositTarget > 0 ? Math.min(saved / depositTarget, 1) : 0,
      };
    });
  }

  return {
    combinedIncome,
    currency: displayCurrency,
    housing,
    rent,
    monthlyMortgage: buying ? monthlyMortgageAmt : 0,
    deposit,
    stampDuty,
    costs,
    totalCosts,
    leftover,
    upfront,
    setupCost,
    relocationCost,
    moveCost,
    visaCost,
    visaMonths,
    visitCost,
    transitionBuffer,
    emergencyCost,
    petRelocationCost,
    transferCost,
    apartMonths,
    international,
    savings: savingsD,
    gap,
    monthsToMoveIn,
    gatedBy,
    verdict,
    depositTarget,
    yearsToDeposit,
    milestones,
  };
}
