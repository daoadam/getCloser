import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "./Mascot";
import FeedClient from "./FeedClient";
import EmailCapture from "./EmailCapture";
import ThemeToggle from "./ThemeToggle";
import { getAllPosts } from "@/lib/blog";
import { getIgPhotos, type IgPhoto } from "@/lib/ig";

// The homepage is the Journal — a server component that reads the Markdown
// posts at build time and hands them to FeedClient for searchable, taggable,
// GSAP-animated browsing. The calculator itself lives at /calculator.
//
// The right-hand column is the "ad rail" — a parody of the ad-stuffed sidebar
// every old blog has, except every "ad" is ours: the calculator sold like a
// scammy banner, polaroids of the two of us, and the newsletter.
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

// The whole rail: fake ad, "us" polaroids, the newsletter, the honest gag.
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
        <Link
          href="/about"
          className="mt-3 block text-center text-[12px] font-semibold text-[#b25c72] hover:underline"
        >
          who are these people? →
        </Link>
      </div>

      {/* the newsletter — the one "ad" that's a genuine ask */}
      <div className="rounded-[16px] border border-[#ece5db] bg-white p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a89aa2]">
          the newsletter
        </div>
        <div className="mt-1 font-display text-[16px] font-semibold text-[#2b2329]">
          hear it when we close the distance
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#7d727a]">
          new posts, and eventually the big one. no spam, ever.
        </p>
        <div className="mt-3">
          <EmailCapture source="homepage-rail" buttonLabel="Join →" compact />
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

  return (
    <main id="main" className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <Link href="/" className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">
            Close the Distance
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/about"
            className="hidden text-[13.5px] font-medium text-[#6b6068] transition hover:text-[#b25c72] sm:inline"
          >
            About us
          </Link>
          <ThemeToggle />
          <Link
            href="/calculator"
            className="rounded-xl bg-[#b25c72] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:brightness-105"
          >
            Open the calculator →
          </Link>
        </div>
      </div>

      {/* ── The love ticker ─────────────────────────────────── */}
      <div className="ticker border-b border-[#efe8df] bg-[#2b2329] py-2 text-[11.5px] font-semibold tracking-wide text-[#f3c9d4]">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <span key={n} aria-hidden={n === 1}>
              {[
                "written 8,000km apart",
                "pip approves this journal",
                "no ads except our own",
                "co-op date night is real date night",
                "the call stays open",
                "closing the distance, eventually",
                "your timezone maths is valid",
              ].map((t) => (
                <span key={t} className="mx-5 inline-flex items-center gap-5">
                  {t} <span className="text-[#b25c72]">♥</span>
                </span>
              ))}
            </span>
          ))}
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
            {/* mobile-only: the fake ad lives in the feed, where it's seen */}
            <div className="mb-5 lg:hidden">
              <CalculatorFakeAd />
            </div>
            <FeedClient posts={posts} />
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
            <Link href="/about" className="hover:text-[#b25c72]">About</Link>
            <Link href="/methodology" className="hover:text-[#b25c72]">Methodology</Link>
            <Link href="/privacy" className="hover:text-[#b25c72]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#b25c72]">Terms</Link>
            <a href="/feed.xml" className="hover:text-[#b25c72]">RSS</a>
          </div>
        </div>
      </div>
    </main>
  );
}
