import { useEffect, useState } from "react";
import { FALLBACK_RATES } from "./currency";

export { FALLBACK_RATES, CURRENCY_OPTIONS, convert, toAUD, fmt } from "./currency";

// Live AUD-base rates (keyless, CORS-friendly), with fallback while loading.
export function useRates() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/AUD")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.rates) {
          setRates(d.rates);
          setLive(true);
        }
      })
      .catch(() => {
        /* keep fallback rates */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { rates, live };
}
