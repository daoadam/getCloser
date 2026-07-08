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
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

marked.setOptions({ gfm: true, breaks: false });

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
