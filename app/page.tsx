import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "./Mascot";
import { getAllPosts, formatDate, type PostMeta } from "@/lib/blog";
import { getIgPhotos, type IgPhoto } from "@/lib/ig";

// The homepage is the Journal — a server component that reads the Markdown
// posts at build time. Newest post gets the big featured card; the rest flow
// into a grid, with the calculator promo card mixed in like it's one of the
// posts. The calculator itself lives at /calculator.
//
// The right-hand column is the "ad rail" — a parody of the ad-stuffed sidebar
// every old blog has, except every "ad" is ours: the calculator sold like a
// scammy banner, and polaroids of the two of us as the sponsored content.
// Photos auto-load from public/ig (see lib/ig.ts).

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
    <div className="flex flex-wrap items-center gap-2.5 text-[12px] font-medium text-[#7d727a]">
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
      className="group relative rounded-[20px] border border-[#ece5db] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#b25c72]/40 hover:shadow-[0_8px_28px_-12px_rgba(178,92,114,0.4)] sm:p-7"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* the corkboard pin */}
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#b25c72] shadow-[0_2px_4px_rgba(43,35,41,0.35)]"
      />
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
          <HeartGap stroke="rgba(255,255,255,0.8)" /> the tool
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

/* ── The parody ad rail ─────────────────────────────────────── */

// The calculator, sold like the worst banner ad of 2009 — on purpose.
function CalculatorFakeAd() {
  return (
    <Link
      href="/calculator"
      className="group block overflow-hidden rounded-[16px] border-2 border-dashed border-[#b25c72]/50 bg-white p-5 text-center transition hover:border-[#b25c72] hover:shadow-[0_8px_28px_-12px_rgba(178,92,114,0.5)]"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89aa2]">
        advertisement*
      </div>
      <div className="mt-2 font-display text-[19px] font-semibold leading-snug text-[#b25c72]">
        COUPLES IN YOUR AREA are moving in together with this ONE FREE CALCULATOR
      </div>
      <div className="mt-2 text-[12px] leading-relaxed text-[#6b6068]">
        landlords HATE it. distance FEARS it. your savings account is CURIOUS about it.
      </div>
      <span className="mt-3 inline-block rounded-xl bg-[#b25c72] px-4 py-2 text-[12.5px] font-bold text-white transition group-hover:brightness-105">
        CLICK NOW (it&rsquo;s genuinely free) →
      </span>
      <div className="mt-2.5 text-[10px] italic text-[#a89aa2]">
        *it&rsquo;s our own tool. this is the only ad format we&rsquo;ll ever run.
      </div>
    </Link>
  );
}

// Polaroid-style photo from public/ig — filename becomes the caption.
function Polaroid({ photo, tilt }: { photo: IgPhoto; tilt: number }) {
  return (
    <figure
      className="rounded-[6px] border border-[#ece5db] bg-white p-2.5 pb-3 shadow-[0_4px_16px_-8px_rgba(43,35,41,0.25)]"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local build-time
          assets of unknown dimensions; the polaroid frame fixes the size */}
      <img
        src={photo.src}
        alt={photo.caption || "the two of us"}
        className="aspect-square w-full rounded-[3px] object-cover"
        loading="lazy"
      />
      {photo.caption && (
        <figcaption className="mt-2 text-center text-[11.5px] lowercase text-[#8a7f86]">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

// The whole rail: fake ad up top, then "us" polaroids, then the honest gag.
function AdRail({ photos }: { photos: IgPhoto[] }) {
  const tilts = [-1.6, 1.2, -0.8, 1.6, -1.2, 0.9];
  return (
    <aside
      className="flex flex-col gap-5 lg:sticky lg:top-[72px] lg:self-start"
      aria-label="Our own ads — a parody sidebar"
    >
      {/* on mobile the fake ad renders inline near the top of the feed instead */}
      <div className="hidden lg:block">
        <CalculatorFakeAd />
      </div>

      <div className="rounded-[16px] border border-[#ece5db] bg-white p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89aa2]">
          sponsored by: us
        </div>
        <div className="mt-1 font-display text-[16px] font-semibold text-[#2b2329]">
          the long distance in question
        </div>
        <div className="mt-3 flex flex-col gap-4">
          {photos.length > 0 ? (
            photos.map((p, i) => <Polaroid key={p.src} photo={p} tilt={tilts[i % tilts.length]} />)
          ) : (
            <figure
              className="rounded-[6px] border border-[#ece5db] bg-white p-2.5 pb-3 shadow-[0_4px_16px_-8px_rgba(43,35,41,0.25)]"
              style={{ transform: "rotate(-1.4deg)" }}
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-[3px] bg-[#fdf0f3]">
                <Mascot mood="happy" size={92} />
              </div>
              <figcaption className="mt-2 text-center text-[11.5px] lowercase text-[#7d727a]">
                us, artist&rsquo;s impression (real pics soon)
              </figcaption>
            </figure>
          )}
        </div>
      </div>

      <div className="rounded-[16px] border border-[#ece5db] bg-white p-5 text-center">
        <Mascot mood="think" size={52} className="mx-auto" />
        <div className="mt-2 text-[12.5px] font-semibold text-[#2b2329]">your ad here?</div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-[#7d727a]">
          no. this space belongs to pip. we don&rsquo;t sell ads — the calculator is free and the
          journal is the marketing. that&rsquo;s the whole business model.
        </p>
      </div>
    </aside>
  );
}

export default function HomeJournalPage() {
  const posts = getAllPosts();
  const photos = getIgPhotos();
  const [featured, ...rest] = posts;
  // Alternating tilts make the grid feel hand-pinned, corkboard-style.
  const tilts = [-1.2, 1.05, -0.9, 1.2, -1.05, 0.9];

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

      <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 sm:py-14">
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
              money maths of finally moving in together. No &ldquo;10 tips to feel connected 💕&rdquo;
              listicles — just what actually works for us.
            </p>

            {/* the distance itself — Adelaide to her, dashed arc in flight */}
            <div className="mt-5 flex items-center gap-3" aria-hidden>
              <svg viewBox="0 0 260 44" className="w-[260px]">
                <path
                  d="M10 36 Q130 -12 250 36"
                  fill="none"
                  stroke="#b25c72"
                  strokeWidth="1.8"
                  strokeDasharray="3 7"
                  strokeLinecap="round"
                  className="flightline"
                />
                <circle cx="10" cy="36" r="3.5" fill="#b25c72" />
                <circle cx="250" cy="36" r="3.5" fill="#b25c72" />
                <text x="10" y="30" fontSize="9" fill="#7d727a" fontWeight="600">adelaide</text>
                <text x="250" y="30" fontSize="9" fill="#7d727a" fontWeight="600" textAnchor="end">her ♥</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── Content + ad rail ─────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_270px]">
          <div>
            {/* ── Featured ──────────────────────────────────── */}
            {featured ? (
              <FeaturedCard post={featured} />
            ) : (
              <p className="text-[15px] text-[#6b6068]">No posts yet — check back soon.</p>
            )}

            {/* mobile-only: the fake ad lives in the feed, where it's seen */}
            <div className="mt-5 lg:hidden">
              <CalculatorFakeAd />
            </div>

            {/* ── The rest + the tool card ──────────────────── */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {rest.slice(0, 2).map((post, i) => (
                <PostCard key={post.slug} post={post} tilt={tilts[i % tilts.length]} />
              ))}
              <CalculatorCard />
              {rest.slice(2).map((post, i) => (
                <PostCard key={post.slug} post={post} tilt={tilts[(i + 2) % tilts.length]} />
              ))}
            </div>
          </div>

          <AdRail photos={photos} />
        </div>

        {/* ── Sign-off ──────────────────────────────────────── */}
        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <Mascot mood="wave" size={56} />
          <p className="max-w-[420px] text-[13.5px] leading-relaxed text-[#7d727a]">
            Written from Adelaide and wherever she is. Pip flies between us. New posts whenever
            something&rsquo;s actually worth saying.
          </p>
          <div className="mt-2 flex gap-5 text-[12.5px] text-[#7d727a]">
            <Link href="/methodology" className="hover:text-[#b25c72]">Methodology</Link>
            <Link href="/privacy" className="hover:text-[#b25c72]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#b25c72]">Terms</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
