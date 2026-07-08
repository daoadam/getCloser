import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mascot from "../../Mascot";
import { getAllPosts, getPost, getPostSlugs, formatDate, type PostMeta } from "@/lib/blog";

// A single journal post. Server component: reads and renders the Markdown at
// build time, one static page per slug. `params` is a Promise in this version
// of Next — it must be awaited.

// Prerender every post at build time.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found · Close the Distance" };
  return {
    title: `${post.title} · Close the Distance`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date || undefined,
      authors: [post.author],
    },
  };
}

// Topic chip colours — kept in lockstep with the homepage grid.
const TAG_STYLE: Record<string, { bg: string; fg: string }> = {
  money: { bg: "#e9f5ee", fg: "#1f6b46" },
  "real talk": { bg: "#efe9f3", fg: "#6d4a7c" },
  games: { bg: "#eef1fb", fg: "#4a5aa8" },
  streaming: { bg: "#fbeee6", fg: "#b0642e" },
  fun: { bg: "#fdf0f3", fg: "#b25c72" },
};

// Every post gets a hero band tinted by its first tag — Pip mid-flight over a
// soft gradient — so no article ever opens as a bare wall of text.
function PostHero({ post }: { post: PostMeta }) {
  const s = TAG_STYLE[post.tags[0]] ?? { bg: "#fdf0f3", fg: "#b25c72" };
  return (
    <div
      className="relative mt-7 flex items-center justify-center overflow-hidden rounded-[20px] border border-[#ece5db] py-9"
      style={{
        background: `linear-gradient(120deg, ${s.bg}, #fdfbf8 60%, ${s.bg})`,
      }}
      aria-hidden
    >
      {/* the flight path — same dashed-arc language as the calculator */}
      <svg
        viewBox="0 0 320 80"
        className="absolute inset-x-0 mx-auto w-[320px] opacity-60"
      >
        <path
          d="M20 62 Q160 -14 300 62"
          fill="none"
          stroke={s.fg}
          strokeWidth="2"
          strokeDasharray="3 8"
          strokeLinecap="round"
          className="flightline"
        />
        <circle cx="20" cy="62" r="4" fill={s.fg} />
        <circle cx="300" cy="62" r="4" fill={s.fg} />
      </svg>
      <Mascot mood="happy" size={74} className="relative" />
    </div>
  );
}

// Two more posts, picked by tag overlap (falling back to recency) — the page
// shouldn't be a dead end.
function relatedPosts(current: PostMeta): PostMeta[] {
  return getAllPosts()
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ post }) => post);
}

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = relatedPosts(post);

  return (
    <main className="min-h-full bg-[#faf6f1] pb-20">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <Link href="/" className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">Close the Distance</span>
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1]"
        >
          ← All posts
        </Link>
      </div>

      <article className="mx-auto max-w-[680px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ── Post header ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] font-medium text-[#9a8f96]">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>By {post.author}</span>
          {post.tags.map((t) => {
            const s = TAG_STYLE[t] ?? { bg: "#f1ebe2", fg: "#6b6068" };
            return (
              <span
                key={t}
                className="rounded-full px-2.5 py-1 text-[11px] font-bold lowercase tracking-wide"
                style={{ background: s.bg, color: s.fg }}
              >
                {t}
              </span>
            );
          })}
        </div>
        <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[42px]">
          {post.title}
        </h1>

        {/* ── Hero band ─────────────────────────────────────── */}
        <PostHero post={post} />

        {/* ── Body ──────────────────────────────────────────── */}
        <div
          className="prose-blog mt-8"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* ── Call to action into the simulator ─────────────── */}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-[20px] border border-[#b25c72]/20 bg-[#b25c72]/[0.06] p-6 sm:flex-row sm:items-center sm:gap-5 sm:p-7">
          <Mascot mood="wave" size={68} className="shrink-0" />
          <div className="flex-1">
            <div className="font-display text-[19px] font-semibold text-[#2b2329]">
              Now run your own numbers
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[#6b6068]">
              See exactly what closing the distance would cost the two of you — free, about two
              minutes.
            </p>
          </div>
          <Link
            href="/calculator?start=1"
            className="rounded-xl bg-[#b25c72] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-105"
          >
            Start the calculator →
          </Link>
        </div>

        {/* ── Keep reading ──────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              keep reading
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((p) => {
                const s = TAG_STYLE[p.tags[0]] ?? { bg: "#f1ebe2", fg: "#6b6068" };
                return (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group rounded-[18px] border border-[#ece5db] bg-white p-5 transition hover:border-[#b25c72]/40 hover:shadow-[0_6px_24px_-12px_rgba(178,92,114,0.35)]"
                  >
                    <div className="flex items-center gap-2 text-[11.5px] font-medium text-[#7d727a]">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10.5px] font-bold lowercase"
                        style={{ background: s.bg, color: s.fg }}
                      >
                        {p.tags[0] ?? "journal"}
                      </span>
                      <span>{p.readingMinutes} min read</span>
                    </div>
                    <div className="mt-2 font-display text-[17.5px] font-semibold leading-snug text-[#2b2329] transition-colors group-hover:text-[#b25c72]">
                      {p.title}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
