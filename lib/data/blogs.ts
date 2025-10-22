import { getBlogsFromSupabase } from "@lib/data/blogsSupabase";
import type { Blog } from "@lib/types";

let cached: Blog[] | null = null;

// Function to clear the cache (useful after updates)
export function clearBlogsCache() {
  cached = null;
}

// All data now comes from Supabase - with fallbacks for build time
export async function getBlogs(): Promise<Blog[]> {
  if (cached) return cached;

  try {
    const blogs = await getBlogsFromSupabase();
    if (blogs) {
      cached = blogs;
      return cached;
    }
  } catch (error) {
    console.warn("Failed to fetch blogs from Supabase during build:", error);
  }

  // Fallback to empty array during build time if Supabase is not available
  cached = [];
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
