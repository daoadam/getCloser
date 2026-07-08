import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "../Mascot";
import { getAllPosts, formatDate } from "@/lib/blog";

// The journal index. A server component — it reads the Markdown posts at build
// time and lists them. Links are plain <Link>s (no client router needed).

export const metadata: Metadata = {
  title: "The Journal — closing the distance, honestly · GetCloser",
  description:
    "Notes from a real long-distance couple on the money, the visas, and the logistics of finally living together — plus a free tool to run your own numbers.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Journal · GetCloser",
    description:
      "Honest notes on the money and logistics of closing the distance in a long-distance relationship.",
    type: "website",
  },
};

// Wordmark glyph — the heart-with-a-gap, matching the rest of the site.
function HeartGap({ stroke = "currentColor" }: { stroke?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 21s7-4.35 9.5-8.5C23.5 9 21.5 5 18 5c-2 0-3.2 1.2-4 2.3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <Link href="/" className="flex items-center gap-2" aria-label="GetCloser home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">GetCloser</span>
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          ← Back to the calculator
        </Link>
      </div>

      <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8 sm:py-12">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:gap-6">
          <Mascot mood="happy" size={84} className="shrink-0" />
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              The Journal
            </div>
            <h1 className="mt-2.5 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[46px]">
              Closing the distance, honestly
            </h1>
            <p className="mt-3.5 max-w-[560px] text-[16px] leading-relaxed text-[#6b6068] sm:text-[18px]">
              Notes from a real long-distance couple on the money, the visas, and the logistics of
              finally living together.
            </p>
          </div>
        </div>

        {/* ── Post list ─────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-4">
          {posts.length === 0 && (
            <p className="text-[15px] text-[#6b6068]">No posts yet — check back soon.</p>
          )}
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[18px] border border-[#ece5db] bg-white p-6 transition hover:border-[#b25c72]/40 hover:shadow-[0_6px_24px_-12px_rgba(178,92,114,0.35)] sm:p-7"
            >
              <div className="flex items-center gap-2.5 text-[12px] font-medium text-[#9a8f96]">
                <span>{formatDate(post.date)}</span>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="mt-2 font-display text-[22px] font-semibold leading-tight tracking-[-0.01em] text-[#2b2329] transition-colors group-hover:text-[#b25c72] sm:text-[25px]">
                {post.title}
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b6068]">{post.excerpt}</p>
              <span className="mt-3 inline-block text-[13.5px] font-semibold text-[#b25c72]">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
