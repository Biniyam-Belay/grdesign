import { z } from "zod";
import raw from "@data/blogs.json";
import type { Blog } from "@lib/types";

const BlogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  cover: z.string().min(1),
  date: z.string().min(1), // ISO string
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
});

const BlogsSchema = z.array(BlogSchema);

let cached: Blog[] | null = null;

export function getBlogs(): Blog[] {
  if (cached) return cached;
  const parsed = BlogsSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid blogs data: ${message}`);
  }
  // sort by date desc
  cached = [...(parsed.data as Blog[])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return cached;
}

export function getBlogSlugs(): string[] {
  return getBlogs().map((b) => b.slug);
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getBlogs().find((b) => b.slug === slug);
}

/** Get a unique, sorted list of all tags across blogs */
export function getAllBlogTags(): string[] {
  const set = new Set<string>();
  for (const b of getBlogs()) {
    b.tags?.forEach((t) => set.add(t));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Get blogs filtered by a given tag (case-sensitive match) */
export function getBlogsByTag(tag: string): Blog[] {
  return getBlogs().filter((b) => b.tags?.includes(tag));
}
