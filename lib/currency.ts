// Pure currency helpers (no React) — shared by the calc and the rates hook.

// Indicative fallback: 1 AUD = X of currency. Used only if the live fetch fails;
// the live endpoint covers every currency, this just avoids a wrong flash.
export const FALLBACK_RATES: Record<string, number> = {
  AUD: 1,
  USD: 0.66,
  GBP: 0.52,
  EUR: 0.61,
  NZD: 1.09,
  CAD: 0.9,
  SGD: 0.88,
  INR: 55,
  PHP: 37,
  JPY: 98,
  FJD: 1.48,
  PGK: 2.5,
  CNY: 4.7,
  KRW: 880,
  MYR: 3.0,
  THB: 23,
  IDR: 10500,
  VND: 16500,
  HKD: 5.1,
  TWD: 21,
  SEK: 7.0,
  NOK: 7.2,
  DKK: 4.5,
  CHF: 0.58,
  PLN: 2.6,
  CZK: 15,
  MXN: 12,
  BRL: 3.6,
  ARS: 600,
  CLP: 620,
  COP: 2700,
  PEN: 2.5,
  AED: 2.4,
  SAR: 2.5,
  QAR: 2.4,
  ILS: 2.4,
  TRY: 22,
  ZAR: 12,
  EGP: 32,
  NGN: 1000,
  KES: 85,
};

// Currency codes the income picker offers (everything we hold a fallback for).
export const CURRENCY_OPTIONS = Object.keys(FALLBACK_RATES).sort();

// Convert between any two currencies via the AUD-base rate table
// (rate[code] = how many of `code` one AUD buys).
export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (from === to) return Math.round(amount);
  const rFrom = rates[from] ?? FALLBACK_RATES[from] ?? 1;
  const rTo = rates[to] ?? FALLBACK_RATES[to] ?? 1;
  return Math.round((amount / rFrom) * rTo);
}

// Convert a local-currency amount into AUD.
export function toAUD(amount: number, code: string, rates: Record<string, number>): number {
  return convert(amount, code, "AUD", rates);
}

// Format money in any currency (symbol comes from the currency code).
export const fmt = (n: number, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 0 }).format(n || 0);
