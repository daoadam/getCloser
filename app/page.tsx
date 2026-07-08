import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "./Mascot";
import { getAllPosts, formatDate, type PostMeta } from "@/lib/blog";

// The homepage is the Journal — a server component that reads the Markdown
// posts at build time. Newest post gets the big featured card; the rest flow
// into a grid, with the calculator promo card mixed in like it's one of the
// posts. The calculator itself lives at /calculator.

export const metadata: Metadata = {
  title: "Close the Distance — a long-distance couple's journal & calculator",
  description:
    "Games, anime nights, money and the honest logistics of long distance — written by a couple actually doing it. Plus a free calculator to see when you can finally move in together.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Close the Distance",
    description:
      "Games, anime nights, money and honest logistics — an LDR journal by a couple actually doing it, with a free move-in calculator.",
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

// Each topic gets its own chip colour so the grid reads like a zine, not a ledger.
const TAG_STYLE: Record<string, { bg: string; fg: string }> = {
  money: { bg: "#e9f5ee", fg: "#1f6b46" },
  "real talk": { bg: "#efe9f3", fg: "#6d4a7c" },
  games: { bg: "#eef1fb", fg: "#4a5aa8" },
  streaming: { bg: "#fbeee6", fg: "#b0642e" },
  fun: { bg: "#fdf0f3", fg: "#b25c72" },
};

function TagChip({ tag }: { tag: string }) {
  const s = TAG_STYLE[tag] ?? { bg: "#f1ebe2", fg: "#6b6068" };
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-bold lowercase tracking-wide"
      style={{ background: s.bg, color: s.fg }}
    >
      {tag}
    </span>
  );
}

function PostMetaLine({ post }: { post: PostMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[12px] font-medium text-[#9a8f96]">
      <span>{formatDate(post.date)}</span>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min read</span>
      {post.tags.map((t) => (
        <TagChip key={t} tag={t} />
      ))}
    </div>
  );
}

// The newest post — full-width, with a big serif title and a rosy wash.
function FeaturedCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-[24px] border border-[#ece5db] bg-white p-7 transition hover:border-[#b25c72]/40 hover:shadow-[0_10px_36px_-14px_rgba(178,92,114,0.45)] sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 90% at 85% 0%, rgba(178,92,114,0.10), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#b25c72] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
          ✷ latest
        </div>
        <PostMetaLine post={post} />
        <h2 className="mt-3 max-w-[620px] font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.015em] text-[#2b2329] transition-colors group-hover:text-[#b25c72] sm:text-[38px]">
          {post.title}
        </h2>
        <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#6b6068]">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-block text-[14px] font-semibold text-[#b25c72]">
          Read it →
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post, tilt }: { post: PostMeta; tilt: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-[20px] border border-[#ece5db] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#b25c72]/40 hover:shadow-[0_8px_28px_-12px_rgba(178,92,114,0.4)] sm:p-7"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <PostMetaLine post={post} />
      <h2 className="mt-2.5 font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-[#2b2329] transition-colors group-hover:text-[#b25c72] sm:text-[23px]">
        {post.title}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#6b6068]">{post.excerpt}</p>
      <span className="mt-3 inline-block text-[13.5px] font-semibold text-[#b25c72]">
        Read more →
      </span>
    </Link>
  );
}

// The calculator, disguised as a post card and shuffled into the grid — the
// tool is part of the story, not a banner ad on top of it.
function CalculatorCard() {
  return (
    <Link
      href="/calculator"
      className="group flex flex-col justify-between rounded-[20px] border border-[#b25c72]/25 bg-[#b25c72] p-6 text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(178,92,114,0.8)] sm:p-7"
      style={{ transform: "rotate(0.4deg)" }}
    >
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
          the tool <span aria-hidden>🛠️</span>
        </div>
        <h2 className="mt-2.5 font-display text-[22px] font-semibold leading-tight sm:text-[24px]">
          Can you two actually afford to move in together?
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-white/85">
          The whole reason this site exists: put in your two cities and your two incomes, get the
          honest verdict — the cost, the timeline, the everything. Free, no sign-up.
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#b25c72] transition group-hover:gap-2.5">
        Run your numbers →
      </span>
    </Link>
  );
}

export default function HomeJournalPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  // Tiny alternating tilts make the grid feel hand-pinned, corkboard-style.
  const tilts = [-0.5, 0.45, -0.35, 0.5, -0.45, 0.35];

  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <Link href="/" className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">
            Close the Distance
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/guides"
            className="hidden text-[13.5px] font-medium text-[#6b6068] transition hover:text-[#b25c72] sm:inline"
          >
            Guides
          </Link>
          <Link
            href="/faq"
            className="hidden text-[13.5px] font-medium text-[#6b6068] transition hover:text-[#b25c72] sm:inline"
          >
            FAQ
          </Link>
          <Link
            href="/calculator"
            className="rounded-xl bg-[#b25c72] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:brightness-105"
          >
            Open the calculator →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-7">
          <Mascot mood="happy" size={96} className="shrink-0" />
          <div>
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              a journal about long distance — by two people doing it
            </div>
            <h1 className="mt-2.5 font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-[52px]">
              Same games, same shows,{" "}
              <em className="italic text-[#b25c72]">different timezones.</em>
            </h1>
            <p className="mt-3.5 max-w-[600px] text-[16px] leading-relaxed text-[#6b6068] sm:text-[17.5px]">
              Co-op date nights, anime rituals, which subscriptions earn their keep, and the honest
              money maths of finally moving in together. No "10 tips to feel connected 💕" listicles
              — just what actually works for us.
            </p>
          </div>
        </div>

        {/* ── Featured ──────────────────────────────────────── */}
        {featured ? (
          <div className="mt-10">
            <FeaturedCard post={featured} />
          </div>
        ) : (
          <p className="mt-10 text-[15px] text-[#6b6068]">No posts yet — check back soon.</p>
        )}

        {/* ── The rest + the tool card ──────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {rest.slice(0, 2).map((post, i) => (
            <PostCard key={post.slug} post={post} tilt={tilts[i % tilts.length]} />
          ))}
          <CalculatorCard />
          {rest.slice(2).map((post, i) => (
            <PostCard key={post.slug} post={post} tilt={tilts[(i + 2) % tilts.length]} />
          ))}
        </div>

        {/* ── Sign-off ──────────────────────────────────────── */}
        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <Mascot mood="wave" size={56} />
          <p className="max-w-[420px] text-[13.5px] leading-relaxed text-[#9a8f96]">
            Written from Adelaide and wherever she is. Pip flies between us. New posts whenever
            something's actually worth saying.
          </p>
          <div className="mt-2 flex gap-5 text-[12.5px] text-[#9a8f96]">
            <Link href="/methodology" className="hover:text-[#b25c72]">Methodology</Link>
            <Link href="/privacy" className="hover:text-[#b25c72]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#b25c72]">Terms</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
