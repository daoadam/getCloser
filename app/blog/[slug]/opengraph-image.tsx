import { ImageResponse } from "next/og";
import { getAllPosts, formatDate } from "@/lib/blog";
import { TAG_STYLE, TAG_FALLBACK } from "@/lib/tags";

// Per-post share card: tag-tinted like the post's hero band, title front and
// centre. Generated at build time alongside the page itself.

export const alt = "Close the Distance — journal post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  const title = post?.title ?? "Close the Distance";
  const tag = post?.tags[0];
  const s = (tag && TAG_STYLE[tag]) || TAG_FALLBACK;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(120deg, ${s.bg}, #fdfbf8 55%, ${s.bg})`,
          color: "#2b2329",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {tag && (
            <div
              style={{
                display: "flex",
                background: s.fg,
                color: "#ffffff",
                borderRadius: 999,
                padding: "8px 24px",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {tag}
            </div>
          )}
          <div style={{ fontSize: 28, fontWeight: 700, color: "#b25c72" }}>
            Close the Distance
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 700,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#6b6068",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {post?.date && <div>{formatDate(post.date)}</div>}
            {post && <div>· {post.readingMinutes} min read</div>}
          </div>
          <svg width="240" height="64" viewBox="0 0 240 64">
            <path
              d="M14 50 Q120 -14 226 50"
              fill="none"
              stroke={s.fg}
              strokeWidth="3"
              strokeDasharray="5 11"
              strokeLinecap="round"
            />
            <circle cx="14" cy="50" r="6" fill={s.fg} />
            <circle cx="226" cy="50" r="6" fill={s.fg} />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
