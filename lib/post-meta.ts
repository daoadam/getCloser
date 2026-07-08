// Client-safe blog types + helpers — no fs imports, so client components
// (FeedClient etc.) can use them. lib/blog.ts re-exports everything here.

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  author: string;
  tags: string[]; // e.g. ["money"], ["games", "fun"] — rendered as chips
  readingMinutes: number;
};

export type Heading = { id: string; text: string };

export type Post = PostMeta & { html: string; headings: Heading[] };

// "1 July 2026" — friendly, unambiguous, matches the editorial voice.
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
