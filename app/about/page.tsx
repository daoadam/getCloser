import type { Metadata } from "next";
import Link from "next/link";
import Mascot from "../Mascot";
import EmailCapture from "../EmailCapture";
import ThemeToggle from "../ThemeToggle";
import { getIgPhotos } from "@/lib/ig";

// About — the two humans (and one bird) behind the site. The trust page:
// who we are, why this exists, and what we're building toward.

export const metadata: Metadata = {
  title: "About us · Close the Distance",
  description:
    "We're a long-distance couple (Adelaide ⇄ overseas) doing the exact thing this site is about: figuring out what it takes to finally live in the same place. This is who we are and why we built it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About us · Close the Distance",
    description:
      "A long-distance couple building the site we wished existed: honest notes and a free calculator for closing the distance.",
    type: "website",
  },
};

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

export default function AboutPage() {
  const photos = getIgPhotos();
  const tilts = [-2, 1.5, -1];

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
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
          >
            ← the journal
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[760px] px-5 py-12 sm:px-8">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="text-center">
          <div className="flex justify-center">
            <Mascot mood="wave" size={96} />
          </div>
          <h1 className="mt-4 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[48px]">
            Hi. We&rsquo;re the couple <em className="italic text-[#b25c72]">in</em> the long
            distance relationship.
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[16.5px] leading-relaxed text-[#6b6068]">
            One of us is in Adelaide. One of us isn&rsquo;t. This site is the thing we built while
            figuring out the question every long-distance couple eventually hits: <strong>when can
            we actually afford to live in the same place?</strong>
          </p>
        </div>

        {/* ── Photo strip ───────────────────────────────────── */}
        {photos.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-4">
            {photos.slice(0, 3).map((p, i) => (
              <figure
                key={p.src}
                className="rounded-[6px] border border-[#ece5db] bg-white p-2 pb-2.5 shadow-[0_6px_20px_-10px_rgba(43,35,41,0.3)]"
                style={{ transform: `rotate(${tilts[i % tilts.length]}deg)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.caption || "the two of us"}
                  className="aspect-square w-full rounded-[3px] object-cover"
                  loading="lazy"
                />
                <figcaption className="mt-1.5 text-center text-[10.5px] lowercase text-[#8a7f86]">
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* ── The story ─────────────────────────────────────── */}
        <div className="prose-blog mt-12">
          <h2>why this site exists</h2>
          <p>
            &ldquo;when we finally live together&rdquo; was a sentence we said for two years
            instead of making a plan. it felt romantic. it was also a way of not looking at the
            number.
          </p>
          <p>
            so we built the thing we couldn&rsquo;t find: a calculator that takes two people, two
            cities, two incomes, and gives back an honest answer — the cost, the timeline, the
            verdict. it&rsquo;s free, it doesn&rsquo;t need a sign-up to try, and every number in
            it is editable because your real quotes beat our estimates every time.
          </p>
          <p>
            the journal came after. turns out doing long distance generates a lot of opinions
            about co-op games, discord architecture, and which subscriptions deserve to live. we
            write it in the voice we actually talk in.
          </p>
          <h2>the cast</h2>
          <p>
            <strong>Adam</strong> — Adelaide side. builds the site, loses at overcooked, refuses
            to accept the lifetime co-op standings.
          </p>
          <p>
            <strong>her</strong> — other-timezone side. editorial oversight, superior gamer,
            appears in photos and vetoes anecdotes she deems &ldquo;too real for the
            internet.&rdquo;
          </p>
          <p>
            <strong>Pip</strong> — a lovebird. lovebirds pair-bond for life and pine when apart,
            which is the whole brief. flies between the two hearts in our logo. does not actually
            exist, which saves a fortune in seeds.
          </p>
          <h2>the honest bits</h2>
          <p>
            the calculator&rsquo;s figures are realistic starting points, not live market data —
            the methodology page explains exactly where every number comes from. nothing on this
            site is financial or immigration advice. we&rsquo;re not experts; we&rsquo;re just
            slightly ahead of you in the queue.
          </p>
        </div>

        {/* ── Email ─────────────────────────────────────────── */}
        <div className="mt-12 rounded-[20px] border border-[#b25c72]/20 bg-[#b25c72]/[0.06] p-7 text-center">
          <div className="font-display text-[22px] font-semibold">follow the journey</div>
          <p className="mx-auto mt-2 max-w-[400px] text-[14px] leading-relaxed text-[#6b6068]">
            when we publish something worth your time — and eventually, when we close the distance
            ourselves — you&rsquo;ll hear it here first.
          </p>
          <div className="mt-4 flex justify-center">
            <EmailCapture source="about" buttonLabel="Keep me posted →" />
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────── */}
        <div className="mt-8 text-center">
          <Link
            href="/calculator"
            className="inline-block rounded-2xl bg-[#b25c72] px-7 py-4 text-[16px] font-semibold text-white shadow-[0_10px_26px_-8px_rgba(178,92,114,0.75)] transition hover:brightness-105"
          >
            Run your own numbers →
          </Link>
          <p className="mt-2.5 text-[12.5px] text-[#a59ca2]">free · ~2 minutes · no judgement</p>
        </div>
      </div>
    </main>
  );
}
