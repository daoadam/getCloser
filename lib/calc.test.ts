import { describe, expect, it } from "vitest";
import { getArea } from "./areas";
import { relocationFor, simulate, SimInput } from "./calc";

// Deterministic rates so currency maths is predictable in tests.
const rates = { AUD: 1, USD: 0.5, GBP: 0.5, EUR: 0.6, JPY: 100, NZD: 1.1 };

const adelaide = getArea("au-adl-prospect")!; // AUD
const tokyo = getArea("jp-tokyo-shibuya")!; // JPY
const auckland = getArea("nz-akl-cbd")!; // NZD

function base(overrides: Partial<SimInput> = {}): SimInput {
  return {
    incomeA: 4000,
    incomeB: 3000,
    area: adelaide,
    housing: "rent",
    lifestyle: "comfortable",
    kids: 0,
    savings: 5000,
    monthlyDebts: 0,
    locationA: { country: "AU", state: "SA" },
    locationB: { country: "AU", state: "SA" },
    transitionMonths: 0,
    visitsPerYear: 0,
    emergencyMonths: 0,
    petRelocation: 0,
    transferFeePct: 0,
    displayCurrency: "AUD",
    rates,
    ...overrides,
  };
}

const total = (r: ReturnType<typeof simulate>) => r.costs.reduce((s, c) => s + c.amount, 0);

describe("relocationFor", () => {
  it("same AU state is a local move with no visa", () => {
    const r = relocationFor({ country: "AU", state: "SA" }, "AU", "SA");
    expect(r.relocates).toBe(false);
    expect(r.visa).toBe(0);
    expect(r.international).toBe(false);
  });

  it("interstate AU move has a cost but no visa", () => {
    const r = relocationFor({ country: "AU", state: "VIC" }, "AU", "SA");
    expect(r.relocates).toBe(true);
    expect(r.move).toBeGreaterThan(0);
    expect(r.visa).toBe(0);
  });

  it("a different country needs a partner visa", () => {
    const r = relocationFor({ country: "GB", state: "" }, "AU", "SA");
    expect(r.international).toBe(true);
    expect(r.visa).toBeGreaterThan(0);
    expect(r.visaMonths).toBeGreaterThan(0);
  });

  it("AU <-> NZ is reciprocal — no visa", () => {
    expect(relocationFor({ country: "AU", state: "SA" }, "NZ", "").visa).toBe(0);
    expect(relocationFor({ country: "NZ", state: "" }, "AU", "SA").visa).toBe(0);
  });
});

describe("simulate — money", () => {
  it("leftover is income minus the cost lines", () => {
    const r = simulate(base());
    expect(r.currency).toBe("AUD");
    expect(r.combinedIncome).toBe(7000);
    expect(r.totalCosts).toBe(total(r));
    expect(r.leftover).toBe(r.combinedIncome - r.totalCosts);
  });

  it("rent line is the weekly figure annualised to a month", () => {
    const r = simulate(base());
    const rent = r.costs.find((c) => c.key === "rent");
    expect(rent?.amount).toBe(Math.round(adelaide.weeklyRent2br * (52 / 12))); // 2427
  });

  it("two locals in the same state — no relocation or visa", () => {
    const r = simulate(base());
    expect(r.moveCost).toBe(0);
    expect(r.visaCost).toBe(0);
    expect(r.international).toBe(false);
  });

  it("an overseas partner adds the partner-visa cost", () => {
    const r = simulate(base({ locationB: { country: "GB", state: "" } }));
    expect(r.international).toBe(true);
    expect(r.visaCost).toBe(10000); // PARTNER_VISA, in AUD
  });
});

describe("simulate — currency conversion", () => {
  it("a Tokyo destination is computed in yen", () => {
    const r = simulate(base({ area: tokyo, displayCurrency: tokyo.currency }));
    expect(r.currency).toBe("JPY");
    // 7000 AUD * 100 JPY/AUD
    expect(r.combinedIncome).toBe(700000);
    const rent = r.costs.find((c) => c.key === "rent");
    expect(rent?.amount).toBe(Math.round(tokyo.weeklyRent2br * (52 / 12))); // local, no conversion
  });

  it("an Auckland move from AU has no visa cost", () => {
    const r = simulate(
      base({
        area: auckland,
        displayCurrency: auckland.currency,
        locationA: { country: "AU", state: "SA" },
        locationB: { country: "NZ", state: "" },
      })
    );
    expect(r.currency).toBe("NZD");
    expect(r.visaCost).toBe(0);
  });
});

describe("simulate — edits & extras", () => {
  it("a cost override changes the total and leftover", () => {
    const r0 = simulate(base());
    const r1 = simulate(base({ costOverrides: { rent: 5000 } }));
    const rent0 = r0.costs.find((c) => c.key === "rent")!.amount;
    expect(r1.costs.find((c) => c.key === "rent")?.amount).toBe(5000);
    expect(r1.totalCosts).toBe(r0.totalCosts - rent0 + 5000);
    expect(r1.leftover).toBe(r1.combinedIncome - r1.totalCosts);
  });

  it("a custom extra cost is appended", () => {
    const r = simulate(base({ extraCosts: [{ id: "x1", label: "Pets", amount: 200 }] }));
    const pets = r.costs.find((c) => c.custom && c.label === "Pets");
    expect(pets?.amount).toBe(200);
  });

  it("the emergency buffer adds months of costs to the upfront", () => {
    const r0 = simulate(base());
    const r1 = simulate(base({ emergencyMonths: 3 }));
    expect(r1.emergencyCost).toBe(3 * r0.totalCosts);
    expect(r1.upfront).toBe(r0.upfront + r1.emergencyCost);
  });
});

describe("simulate — rent vs buy", () => {
  it("buying uses a 20% deposit and a mortgage", () => {
    const r = simulate(base({ housing: "buy" }));
    expect(r.housing).toBe("buy");
    expect(r.deposit).toBe(Math.round(adelaide.medianHouse * 0.2));
    expect(r.monthlyMortgage).toBeGreaterThan(0);
    expect(r.setupCost).toBeGreaterThan(r.deposit); // deposit + stamp + fees
  });
});
