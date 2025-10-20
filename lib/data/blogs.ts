import { getBlogsFromSupabase } from "@lib/data/blogsSupabase";
import type { Blog } from "@lib/types";

let cached: Blog[] | null = null;

// All data now comes from Supabase - no hardcoded fallbacks
export async function getBlogs(): Promise<Blog[]> {
  if (cached) return cached;
  const blogs = await getBlogsFromSupabase();
  if (!blogs) {
    throw new Error("Failed to fetch blogs from Supabase");
  }
  cached = blogs;
  return cached;
}

// For backwards compatibility - now just calls getBlogs()
export async function getBlogsAsync(): Promise<Blog[]> {
  return await getBlogs();
}

export async function getBlogSlugs(): Promise<string[]> {
  const blogs = await getBlogs();
  return blogs.map((b) => b.slug);
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug);
}

/** Get a unique, sorted list of all tags across blogs */
export async function getAllBlogTags(): Promise<string[]> {
  const blogs = await getBlogs();
  const set = new Set<string>();
  const normalize = (t: string) => t.trim();
  for (const b of blogs) {
    b.tags?.forEach((t) => set.add(normalize(t)));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Normalize a tag for comparison */
function norm(tag: string): string {
  return tag.trim().toLowerCase();
}

export async function getBlogsByTag(tag: string): Promise<Blog[]> {
  const blogs = await getBlogs();
  const n = norm(tag);
  return blogs.filter((b) => b.tags?.some((t) => norm(t) === n));
}
