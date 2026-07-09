import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mascot from "../../Mascot";
import EmailCapture from "../../EmailCapture";
import ThemeToggle from "../../ThemeToggle";
import ReadProgress from "../ReadProgress";
import { getAllPosts, getPost, getPostSlugs, formatDate, type PostMeta } from "@/lib/blog";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { TAG_STYLE, TAG_FALLBACK } from "@/lib/tags";

// Pip signs every post off differently — picked by slug hash so it's stable
// per-post but varies across the journal.
const PIP_QUIPS = [
  "pip proofread this. pip found no errors. pip is a bird.",
  "no AI slop was harmed in the making of this post. pip supervised.",
  "this post was written in two timezones and one shared doc.",
  "pip flew 8,000km to fact-check this. metaphorically.",
  "if this helped, tell another long-distance couple. pip's marketing budget is seeds.",
];

function pipQuip(slug: string): string {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 997;
  return PIP_QUIPS[h % PIP_QUIPS.length];
}

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

  // Article + breadcrumb structured data — tells search engines who wrote
  // what, when, and where the post sits in the site (Journal → post).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date || undefined,
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        keywords: post.tags.join(", "),
        url: `${SITE_URL}/blog/${post.slug}`,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Journal", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: post.title,
            item: `${SITE_URL}/blog/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <main id="main" className="min-h-full bg-[#faf6f1] pb-20">
      <script
        type="application/ld+json"
        // Escape "<" so post titles can never close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ReadProgress />
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#efe8df] bg-white/90 px-5 py-3.5 backdrop-blur sm:px-14">
        <Link href="/" className="flex items-center gap-2" aria-label="Close the Distance home">
          <HeartGap stroke="#b25c72" />
          <span className="font-display text-lg font-semibold text-[#b25c72]">Close the Distance</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="hidden rounded-xl border border-[#ddd5cb] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#3f3a40] transition hover:bg-[#faf6f1] sm:inline-block"
          >
            ← All posts
          </Link>
          {/* the product CTA never leaves the reader's screen — the logo
              already covers "back home" on mobile */}
          <Link
            href="/calculator"
            className="rounded-xl bg-[#b25c72] px-4 py-2 text-[13.5px] font-semibold text-white transition hover:brightness-105"
          >
            Try the calculator →
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1020px] gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[200px_minmax(0,680px)] lg:justify-center">
        {/* ── Skip to section (desktop rail) ─────────────────── */}
        {post.headings.length > 1 && (
          <nav
            aria-label="Skip to section"
            className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a89aa2]">
              in this post
            </div>
            <div className="mt-3">
              {post.headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="toc-link">
                  {h.text}
                </a>
              ))}
            </div>
            <Link
              href="/calculator"
              className="mt-5 block rounded-xl bg-[#b25c72]/10 px-3 py-2.5 text-center text-[12px] font-semibold text-[#b25c72] transition hover:bg-[#b25c72]/15"
            >
              run your numbers →
            </Link>
          </nav>
        )}

        <article className="min-w-0">
        {/* ── Post header ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] font-medium text-[#9a8f96]">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>By {post.author}</span>
          {post.tags.map((t) => {
            const s = TAG_STYLE[t] ?? TAG_FALLBACK;
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

        {/* ── Jump to section (mobile) ──────────────────────── */}
        {post.headings.length > 1 && (
          <details className="mt-6 rounded-[14px] border border-[#ece5db] bg-white px-4 py-3 lg:hidden">
            <summary className="cursor-pointer text-[13px] font-semibold text-[#b25c72]">
              jump to a section
            </summary>
            <div className="mt-2 pb-1">
              {post.headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="toc-link">
                  {h.text}
                </a>
              ))}
            </div>
          </details>
        )}

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

        {/* ── Pip's sign-off ────────────────────────────────── */}
        <p className="mt-6 text-center text-[12px] italic text-[#a89aa2]">
          {pipQuip(post.slug)}
        </p>

        {/* ── Newsletter ────────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center rounded-[18px] border border-[#ece5db] bg-white p-6 text-center">
          <div className="font-display text-[18px] font-semibold text-[#2b2329]">
            liked this? there&rsquo;s more coming
          </div>
          <p className="mt-1 max-w-[380px] text-[13px] leading-relaxed text-[#7d727a]">
            new posts and, one day, the &ldquo;we did it&rdquo; email. no spam, ever.
          </p>
          <div className="mt-3 flex justify-center">
            <EmailCapture source="post-footer" buttonLabel="Join →" compact />
          </div>
        </div>

        {/* ── Keep reading ──────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#b25c72]">
              keep reading
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {related.map((p) => {
                const s = TAG_STYLE[p.tags[0]] ?? TAG_FALLBACK;
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
      </div>
    </main>
  );
}
