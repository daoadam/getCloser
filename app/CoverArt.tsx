// Generated cover art for post cards — a tag-tinted gradient with the dashed
// flight path and Pip, echoing the hero band on the post page. Deterministic
// per slug (tilt/side vary) so the grid doesn't look stamped from one mould.
// Replace with real imagery later by giving posts a `cover` frontmatter and
// swapping this out per-post.

import Mascot, { type Mood } from "./Mascot";
import { TAG_STYLE, TAG_FALLBACK } from "@/lib/tags";
import type { PostMeta } from "@/lib/blog";

const TAG_MOOD: Record<string, Mood> = {
  games: "happy",
  fun: "wave",
  money: "think",
  "real talk": "think",
  streaming: "happy",
  guides: "think",
};

export default function CoverArt({
  post,
  height = 116,
  pip = 54,
  className = "",
}: {
  post: PostMeta;
  height?: number;
  pip?: number;
  className?: string;
}) {
  const tag = post.tags[0] ?? "";
  const s = TAG_STYLE[tag] ?? TAG_FALLBACK;
  // Small deterministic variation so covers differ card to card.
  let h = 0;
  for (const c of post.slug) h = (h * 31 + c.charCodeAt(0)) % 9973;
  const flip = h % 2 === 0;
  const mood = TAG_MOOD[tag] ?? "happy";

  return (
    <div
      aria-hidden
      className={`relative flex items-center justify-center overflow-hidden rounded-[14px] border border-[#ece5db] ${className}`}
      style={{
        height,
        background: `linear-gradient(${flip ? "120deg" : "240deg"}, ${s.bg}, #fdfbf8 55%, ${s.bg})`,
      }}
    >
      {/* watermark tag word, oversized Fraunces italic */}
      <span
        className="font-display pointer-events-none absolute select-none italic lowercase"
        style={{
          fontSize: height * 0.62,
          color: s.fg,
          opacity: 0.12,
          right: flip ? -8 : undefined,
          left: flip ? undefined : -8,
          bottom: -height * 0.18,
          whiteSpace: "nowrap",
        }}
      >
        {tag || "journal"}
      </span>
      {/* the flight path */}
      <svg viewBox="0 0 320 80" className="absolute inset-x-0 mx-auto w-[280px] opacity-50">
        <path
          d={flip ? "M20 62 Q160 -14 300 62" : "M20 58 Q160 96 300 18"}
          fill="none"
          stroke={s.fg}
          strokeWidth="2"
          strokeDasharray="3 8"
          strokeLinecap="round"
          className="flightline"
        />
        <circle cx="20" cy={flip ? 62 : 58} r="4" fill={s.fg} />
        <circle cx="300" cy={flip ? 62 : 18} r="4" fill={s.fg} />
      </svg>
      <Mascot mood={mood} size={pip} animate={false} className="relative" />
    </div>
  );
}
