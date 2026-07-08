// Canonical site origin — single source of truth for absolute URLs in the
// sitemap, robots.txt, metadataBase and structured data. Override with
// NEXT_PUBLIC_SITE_URL for previews/staging.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://closethedistance.blog";

export const SITE_NAME = "Close the Distance";
