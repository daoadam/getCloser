// Real countries, grouped by distance-from-Australia region (drives flight &
// move cost) with each country's home currency (drives income conversion).
export type CountryRegion = "oceania" | "asia" | "europe" | "americas" | "africa-me";

export type Country = {
  code: string; // ISO-3166 alpha-2
  name: string;
  flag: string;
  region: CountryRegion;
  currency: string; // ISO-4217
};

export const REGION_LABEL: Record<CountryRegion, string> = {
  oceania: "Oceania",
  asia: "Asia",
  europe: "Europe",
  americas: "Americas",
  "africa-me": "Africa & Middle East",
};

export const COUNTRIES: Country[] = [
  // Oceania
  { code: "AU", name: "Australia", flag: "🇦🇺", region: "oceania", currency: "AUD" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", region: "oceania", currency: "NZD" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯", region: "oceania", currency: "FJD" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬", region: "oceania", currency: "PGK" },
  // Asia
  { code: "JP", name: "Japan", flag: "🇯🇵", region: "asia", currency: "JPY" },
  { code: "CN", name: "China", flag: "🇨🇳", region: "asia", currency: "CNY" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", region: "asia", currency: "KRW" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", region: "asia", currency: "SGD" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", region: "asia", currency: "MYR" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", region: "asia", currency: "THB" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", region: "asia", currency: "IDR" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", region: "asia", currency: "PHP" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", region: "asia", currency: "VND" },
  { code: "IN", name: "India", flag: "🇮🇳", region: "asia", currency: "INR" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", region: "asia", currency: "HKD" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", region: "asia", currency: "TWD" },
  // Europe
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", region: "europe", currency: "GBP" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", region: "europe", currency: "EUR" },
  { code: "FR", name: "France", flag: "🇫🇷", region: "europe", currency: "EUR" },
  { code: "DE", name: "Germany", flag: "🇩🇪", region: "europe", currency: "EUR" },
  { code: "ES", name: "Spain", flag: "🇪🇸", region: "europe", currency: "EUR" },
  { code: "IT", name: "Italy", flag: "🇮🇹", region: "europe", currency: "EUR" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", region: "europe", currency: "EUR" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", region: "europe", currency: "EUR" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", region: "europe", currency: "SEK" },
  { code: "NO", name: "Norway", flag: "🇳🇴", region: "europe", currency: "NOK" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", region: "europe", currency: "DKK" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", region: "europe", currency: "CHF" },
  { code: "PL", name: "Poland", flag: "🇵🇱", region: "europe", currency: "PLN" },
  { code: "CZ", name: "Czechia", flag: "🇨🇿", region: "europe", currency: "CZK" },
  // Americas
  { code: "US", name: "United States", flag: "🇺🇸", region: "americas", currency: "USD" },
  { code: "CA", name: "Canada", flag: "🇨🇦", region: "americas", currency: "CAD" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", region: "americas", currency: "MXN" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", region: "americas", currency: "BRL" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", region: "americas", currency: "ARS" },
  { code: "CL", name: "Chile", flag: "🇨🇱", region: "americas", currency: "CLP" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", region: "americas", currency: "COP" },
  { code: "PE", name: "Peru", flag: "🇵🇪", region: "americas", currency: "PEN" },
  // Africa & Middle East
  { code: "AE", name: "UAE", flag: "🇦🇪", region: "africa-me", currency: "AED" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", region: "africa-me", currency: "SAR" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", region: "africa-me", currency: "QAR" },
  { code: "IL", name: "Israel", flag: "🇮🇱", region: "africa-me", currency: "ILS" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷", region: "africa-me", currency: "TRY" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", region: "africa-me", currency: "ZAR" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", region: "africa-me", currency: "EGP" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", region: "africa-me", currency: "NGN" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", region: "africa-me", currency: "KES" },
];

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function getCountry(code: string): Country | undefined {
  return BY_CODE.get(code);
}

export const COUNTRIES_BY_REGION: Record<CountryRegion, Country[]> = COUNTRIES.reduce(
  (acc, c) => {
    (acc[c.region] ??= []).push(c);
    return acc;
  },
  {} as Record<CountryRegion, Country[]>
);

// Australian states/territories — shown when someone picks Australia.
export const AU_STATES = ["SA", "VIC", "NSW", "QLD", "WA", "ACT", "TAS", "NT"];
