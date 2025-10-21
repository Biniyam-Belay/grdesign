import type { Project } from "@lib/types";
import { createSupabaseClient } from "@lib/supabase/client";

type DbProject = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  thumb: string;
  video?: string | null;
  roles: string[];
  tools?: string[] | null;
  alt?: string | null;
  credits?: string | null;
  gallery?: { src: string; alt: string }[] | null;
  mobile_hero_src?: string | null;
  problem?: string | null;
  solution?: string | null;
  highlights?: string[] | null;
  approach?: string | null;
  process?: { title: string; body: string }[] | null;
  outcome?: string | null;
  deliverables?: string[] | null;
  year?: string | null;
  client?: string | null;
  featured_aspect?: string | null;
  featured_src?: string | null;
  featured_alt?: string | null;
  featured?: boolean | null;
  type?: Project["type"] | null;
};

function mapDbProject(p: DbProject): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    thumb: p.thumb,
    video: p.video ?? undefined,
    roles: p.roles ?? [],
    tools: p.tools ?? undefined,
    alt: p.alt ?? undefined,
    credits: p.credits ?? undefined,
    gallery: p.gallery ?? undefined,
    mobileHeroSrc: p.mobile_hero_src ?? undefined,
    problem: p.problem ?? undefined,
    solution: p.solution ?? undefined,
    highlights: p.highlights ?? undefined,
    approach: p.approach ?? undefined,
    process: p.process ?? undefined,
    outcome: p.outcome ?? undefined,
    deliverables: p.deliverables ?? undefined,
    year: p.year ?? undefined,
    client: p.client ?? undefined,
    featuredAspect: (p.featured_aspect as Project["featuredAspect"]) ?? undefined,
    featuredSrc: p.featured_src ?? undefined,
    featuredAlt: p.featured_alt ?? undefined,
    featured: Boolean(p.featured ?? false),
    type: p.type ?? undefined,
  };
}

export async function getProjectsFromSupabase(): Promise<Project[] | null> {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not available during build");
      return null;
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      console.warn("Supabase projects error:", error.message);
      return null;
    }

    const rows = (data ?? []) as DbProject[];
    return rows.map(mapDbProject);
  } catch (err) {
    console.warn("Failed to fetch projects from Supabase:", err);
    return null;
  }
}
