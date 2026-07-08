"use client";

// The journal feed — client side so readers can search and filter by tag.
// Receives the (build-time) post list from the server page; filtering is
// instant. GSAP handles both the initial scroll-in reveals and a quick
// stagger when the filter changes.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CoverArt from "./CoverArt";
import { formatDate, type PostMeta } from "@/lib/post-meta";
import { TAG_STYLE, TAG_FALLBACK } from "@/lib/tags";

function TagChip({ tag }: { tag: string }) {
  const s = TAG_STYLE[tag] ?? TAG_FALLBACK;
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
      <div className="relative grid gap-6 sm:grid-cols-[1fr_230px] sm:items-center">
        <div>
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
        <CoverArt post={post} height={190} pip={72} className="hidden sm:flex" />
      </div>
    </Link>
  );
}

function PostCard({ post, tilt }: { post: PostMeta; tilt: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block h-full rounded-[20px] border border-[#ece5db] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#b25c72]/40 hover:shadow-[0_8px_28px_-12px_rgba(178,92,114,0.4)] sm:p-7"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* the corkboard pin */}
      <span
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#b25c72] shadow-[0_2px_4px_rgba(43,35,41,0.35)]"
      />
      <CoverArt post={post} className="mb-4" />
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

// The calculator, disguised as a post card and shuffled into the grid.
function CalculatorCard() {
  return (
    <Link
      href="/calculator"
      className="group flex h-full flex-col justify-between rounded-[20px] border border-[#b25c72]/25 bg-[#b25c72] p-6 text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-12px_rgba(178,92,114,0.8)] sm:p-7"
      style={{ transform: "rotate(0.4deg)" }}
    >
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.2 1.2 4 2.3"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 21s7-4.35 9.5-8.5C23.5 9 21.5 5 18 5c-2 0-3.2 1.2-4 2.3"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          the tool
        </div>
        <h2 className="mt-2.5 font-display text-[22px] font-semibold leading-tight sm:text-[24px]">
          Can you two actually afford to move in together?
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-white/85">
          The whole reason this site exists: put in your two cities and your two incomes, get the
          honest verdict — the cost, the timeline, the everything. Free to try.
        </p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#b25c72] transition group-hover:gap-2.5">
        Run your numbers →
      </span>
    </Link>
  );
}

export default function FeedClient({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const allTags = useMemo(() => {
    const seen = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => seen.set(t, (seen.get(t) ?? 0) + 1)));
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [posts]);

  const filtering = query.trim().length > 0 || activeTag !== null;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
      );
    });
  }, [posts, query, activeTag]);

  const featured = filtering ? null : filtered[0];
  const gridPosts = filtering ? filtered : filtered.slice(1);
  const tilts = [-1.2, 1.05, -0.9, 1.2, -1.05, 0.9];

  // Initial load: scroll-in reveals. Filter changes: quick stagger pop.
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const els = gridRef.current.querySelectorAll<HTMLElement>("[data-card]");

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (firstRender.current) {
        els.forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 26, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              delay: (i % 2) * 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });
      } else {
        gsap.fromTo(
          els,
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" }
        );
      }
    });
    firstRender.current = false;
    return () => mm.revert();
  }, [query, activeTag]);

  return (
    <div>
      {/* ── Search + tag filter ───────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-[14px] border border-[#ddd5cb] bg-white px-4 py-2.5 transition focus-within:border-[#b25c72]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="#b0a8ae" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="#b0a8ae" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search the journal…"
            aria-label="Search posts"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#a59ca2]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTag(null)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] transition ${
              activeTag === null
                ? "bg-[#b25c72] font-semibold text-white"
                : "border border-[#ece5db] bg-white font-medium text-[#6b6068]"
            }`}
          >
            all
          </button>
          {allTags.map((t) => {
            const s = TAG_STYLE[t] ?? TAG_FALLBACK;
            const on = activeTag === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTag(on ? null : t)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[12.5px] lowercase transition ${
                  on ? "font-bold" : "border border-[#ece5db] bg-white font-medium text-[#6b6068]"
                }`}
                style={on ? { background: s.bg, color: s.fg } : undefined}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={gridRef}>
        {/* ── Featured (only when not filtering) ────────────── */}
        {featured && (
          <div data-card>
            <FeaturedCard post={featured} />
          </div>
        )}

        {/* ── Grid ──────────────────────────────────────────── */}
        <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${featured ? "mt-6" : ""}`}>
          {gridPosts.slice(0, 2).map((post, i) => (
            <div key={post.slug} data-card className="h-full">
              <PostCard post={post} tilt={tilts[i % tilts.length]} />
            </div>
          ))}
          {!filtering && (
            <div data-card className="h-full">
              <CalculatorCard />
            </div>
          )}
          {gridPosts.slice(2).map((post, i) => (
            <div key={post.slug} data-card className="h-full">
              <PostCard post={post} tilt={tilts[(i + 2) % tilts.length]} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-[#ddd0c1] bg-white/60 p-10 text-center">
            <p className="text-[15px] text-[#6b6068]">
              nothing matches that yet — pip looked twice. try another word, or{" "}
              <button
                onClick={() => {
                  setQuery("");
                  setActiveTag(null);
                }}
                className="font-semibold text-[#b25c72] underline"
              >
                clear the filters
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
