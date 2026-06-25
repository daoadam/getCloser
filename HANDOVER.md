# Handover: GetCloser

GetCloser is a Next.js app that answers one question for long-distance couples:
**"can we afford to close the distance and move in together?"** It's a wizard →
results dashboard that models the full financial picture of moving in — anywhere
in the world — and reacts with a mascot (Pip, a lovebird).

**Stack:** Next.js 16 (App Router, Turbopack), React, Tailwind v4, TypeScript,
Mapbox GL (native layers), Supabase (optional lead capture), live FX via
open.er-api.com. Fonts: Fraunces (display) + Geist (UI).

## Architecture

- `lib/areas.ts` — 191 cities / 47 countries. `Area` = {city, region, country,
  currency, weeklyRent2br, medianHouse (local currency), colIndex, lat, lng}.
  Helpers: `getArea`, `AREAS_BY_COUNTRY`, `DESTINATION_COUNTRIES`,
  `areasByRegion`, `areaState`.
- `lib/countries.ts` — ~50 countries (code, name, flag, region, currency),
  `AU_STATES`, `getCountry`.
- `lib/currency.ts` — `FALLBACK_RATES`, `convert`, `toAUD`, `fmt(n, currency)`
  (pure, no React).
- `lib/rates.ts` — `useRates()` hook (live AUD-base rates) + re-exports.
- `lib/calc.ts` — `simulate(SimInput): SimResult`. Currency-aware: computes in
  AUD internally, converts to `displayCurrency`. Owns `relocationFor`
  (visa/flights), mortgage/stamp/visa constants, cost lines (+ overrides +
  custom extras), the move-in upfront, and the future projection.
- `app/Simulator.tsx` — main component: welcome + 5 wizard steps + `Results`.
- `app/MapPicker.tsx` — native Mapbox clustering map (price labels + cluster
  bubbles as GPU layers).
- `app/Mascot.tsx` — Pip, SVG, 4 moods (wave/happy/think/worry).
- `globals.css` — palette + mascot/pin animations.

**Signature elements:** Pip the lovebird + the "flight path" progress bar (Pip
flies heart→heart as you advance).

## Use cases (current quality)

| Use case | Rating | Notes |
|----------|--------|-------|
| Same-city couple, renting | 9 | Core path, solid. |
| International relocation | 8 | Distinctive value; visa model is indicative, not per-country-pair accurate. |
| Rent vs Buy | 7.5 | Mortgage/stamp constants are AU-derived, applied globally. |
| Global destinations | 7.5 | Engine strong; **city data is indicative**, not sourced/live. |
| City comparison | 8 | AUD-normalised so it's comparable. |
| What-if editing on results | 9 | Live, flows through to verdict/timeline. |
| Multi-currency income | 8.5 | Country-driven, overridable, live FX. |
| Save / email plan | 6 | Stores to Supabase if configured; no email is actually sent. |

## Known limitations

- **City prices are indicative figures**, internally consistent but not sourced
  or live. Clearly labelled in the UI.
- **Visa / stamp duty / mortgage** are rough global constants, labelled "not
  financial or immigration advice."
- **No automated tests** beyond `lib/calc` unit tests.
- `Simulator.tsx` is large; further component extraction is welcome.

## Run / verify

- `npm run dev` → wizard at `/`.
- `.env.local` holds `NEXT_PUBLIC_MAPBOX_TOKEN` + `NEXT_PUBLIC_MAPBOX_STYLE`
  (gitignored). Supabase keys are optional.
- `npm run build` is the gate. `npm test` runs the calc unit tests.
