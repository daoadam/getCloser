import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// /blog itself is a redirect to "/", so it's deliberately not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calculator`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date || undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...posts];
}
