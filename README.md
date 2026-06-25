# GetCloser

**A single-screen simulator that tells a couple living apart if, and where, they can afford to move in together.**

Built for Australian domestic long-distance couples. Drag your real numbers and instantly see what closing the gap costs — the verdict, the monthly money, the upfront cost to actually move in, and a teased glimpse of the future.

## Why this and not another couples app

Most "LDR apps" sell emotional connection (daily questions, countdown widgets) — the thing couples already get for free. GetCloser owns the **logistics layer** nobody builds: the money-and-location decision of actually moving in. It's a *flow-market* tool (like TurboTax) — used hard at one life moment, found via search, not a daily-engagement app.

Scope is deliberately tight:
- **Hook (built):** combined money + area prices + "can you afford to move in, and where" verdict.
- **Dream (teased only):** 5/10-year picture, buying a place, kids.
- **Out of scope:** international visas, login, social features.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Tailwind CSS v4**
- **Supabase** — optional lead capture (`save / email my plan`)

The simulator runs **fully client-side** with no backend required. Supabase only powers saving scenarios + email capture, and degrades gracefully when unconfigured.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Copy `.env.local.example` → `.env.local` and fill in the URL + anon key.

## Code map

| File | Purpose |
|------|---------|
| `lib/areas.ts` | Indicative AU rent + cost-of-living dataset (Adelaide suburb-level + capitals) |
| `lib/calc.ts` | The simulation math — costs, leftover, upfront, verdict, future preview |
| `app/Simulator.tsx` | The one-screen interactive UI |
| `lib/supabase/client.ts` | Optional browser Supabase client |
| `supabase/schema.sql` | `scenarios` lead-capture table + RLS |

## Notes

Cost figures are indicative Australian medians for a two-bedroom place — a starting point for the conversation, not financial advice. Replace with live data (e.g. SQM Research / CoreLogic feeds) before going to market.
