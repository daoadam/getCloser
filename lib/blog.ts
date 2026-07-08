// Blog content loader — server-only. Reads authored Markdown posts from
// `content/blog/*.md`, parses their frontmatter with gray-matter, and renders
// the body to HTML with marked. Posts are trusted (authored in-repo), so the
// rendered HTML is injected directly on the post page.
//
// A post file looks like:
//
//   ---
//   title: "How we actually did the numbers on closing the distance"
//   date: "2026-07-01"
//   excerpt: "One short line that shows up in the index and previews."
//   author: "Adam"
//   ---
//
//   Markdown body starts here…

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  author: string;
  tags: string[]; // e.g. ["money"], ["games", "fun"] — rendered as chips
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

marked.setOptions({ gfm: true, breaks: false });

// ── Rich components via markdown conventions ────────────────────────────────
// Authors write plain markdown; a leading marker on a blockquote turns it into
// a designed component (styles live next to .prose-blog in globals.css):
//
//   > pip's take: …            → Pip speech bubble (default for any blockquote)
//   > 💸 money note            → green money callout
//   > ⚠️ real talk             → amber warning callout
//   > ❝ quotable line          → big Fraunces pull-quote
//   > 📊 $360 | = one flight   → big-stat block (value | label)
//   > 🐦 4/5 | verdict text    → Pip rating: a row of birds, filled to n of 5
//
// Images render as <figure> with the title text as a caption:
//   ![alt](/blog/pic.jpg "what we were playing")

// A tiny inline Pip (head + cheek + beak) for the speech bubbles — a
// lightweight echo of app/Mascot.tsx, kept as a string so the renderer can
// inline it without React.
const PIP_MINI = `<svg viewBox="0 0 48 48" width="34" height="34" aria-hidden="true"><circle cx="24" cy="26" r="18" fill="#e89aa6"/><path d="M10 22 C10 10 20 6 26 8 C24 12 24 14 26 16 C20 16 14 18 10 22 Z" fill="#d2748a"/><circle cx="30" cy="24" r="2.6" fill="#2b2329"/><circle cx="18" cy="29" r="4" fill="#f4adb8"/><path d="M36 26 q6 2 4 7 q-4 -1 -7 -4 Z" fill="#e9a23f"/></svg>`;

function stripOnce(html: string, marker: string): string {
  return html.replace(marker, "");
}

marked.use({
  renderer: {
    blockquote(token) {
      const raw = token.text.trim();
      const html = this.parser.parse(token.tokens);

      if (raw.startsWith("❝")) {
        return `<figure class="pullquote">${stripOnce(html, "❝").trim()}</figure>\n`;
      }
      if (raw.startsWith("📊")) {
        // "📊 value | label" — big number with a small explanation under it.
        const [value, ...label] = raw.replace("📊", "").split("|");
        return `<div class="statblock"><div class="statblock-value">${value.trim()}</div><div class="statblock-label">${label.join("|").trim()}</div></div>\n`;
      }
      if (raw.startsWith("🐦")) {
        // "🐦 4/5 | verdict" — n filled Pips out of 5, with a verdict line.
        const rest = raw.replace("🐦", "").trim();
        const match = rest.match(/^(\d(?:\.\d)?)\s*\/\s*5\s*(?:\|\s*([^]*))?$/);
        const score = match ? Math.max(0, Math.min(5, parseFloat(match[1]))) : 0;
        const label = match?.[2]?.trim() ?? rest;
        const birds = Array.from({ length: 5 })
          .map(
            (_, i) =>
              `<span class="pip-rating-bird${i < Math.round(score) ? " is-filled" : ""}">${PIP_MINI}</span>`
          )
          .join("");
        return `<div class="pip-rating"><span class="pip-rating-birds" role="img" aria-label="${score} out of 5">${birds}</span><span class="pip-rating-label">${label}</span></div>\n`;
      }
      if (raw.startsWith("💸")) {
        return `<aside class="pip-note pip-note--money">${stripOnce(html, "💸")}</aside>\n`;
      }
      if (raw.startsWith("⚠️")) {
        return `<aside class="pip-note pip-note--warn">${stripOnce(html, "⚠️")}</aside>\n`;
      }
      // Default blockquote = Pip has something to say.
      return `<aside class="pip-note"><span class="pip-note-bird">${PIP_MINI}</span><div class="pip-note-body">${html}</div></aside>\n`;
    },
    image(token) {
      const caption = token.title
        ? `<figcaption>${token.title}</figcaption>`
        : "";
      return `<figure class="prose-figure"><img src="${token.href}" alt="${token.text ?? ""}" loading="lazy" />${caption}</figure>`;
    },
  },
});

function readFile(slug: string): matter.GrayMatterFile<string> | null {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, "utf8"));
}

function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function toMeta(slug: string, parsed: matter.GrayMatterFile<string>): PostMeta {
  const data = parsed.data as Record<string, unknown>;
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    author: String(data.author ?? "Close the Distance"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: estimateReadingMinutes(parsed.content),
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

// Newest first — the index and any "latest" lists rely on this ordering.
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => {
      const parsed = readFile(slug);
      return parsed ? toMeta(slug, parsed) : null;
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const parsed = readFile(slug);
  if (!parsed) return null;
  return {
    ...toMeta(slug, parsed),
    html: marked.parse(parsed.content) as string,
  };
}

// "1 July 2026" — friendly, unambiguous, matches the editorial voice.
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
