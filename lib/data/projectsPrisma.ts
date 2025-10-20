import type { Project } from "@lib/types";
import prisma from "@lib/db/prisma";
// No direct Prisma JSON types to avoid version coupling; use unknown and narrow

export async function getProjectsFromPrisma(): Promise<Project[] | null> {
  const db = process.env.DATABASE_URL ? prisma : null;
  if (!db) return null;
  try {
    type Row = {
      slug: string;
      title: string;
      excerpt: string;
      thumb: string;
      video: string | null;
      roles: string[];
      tools: string[] | null;
      alt: string | null;
      credits: string | null;
      gallery: unknown | null;
      mobile_hero_src: string | null;
      problem: string | null;
      solution: string | null;
      highlights: string[] | null;
      approach: string | null;
      process: unknown | null;
      outcome: string | null;
      deliverables: string[] | null;
      year: string | null;
      client: string | null;
      featured_aspect: string | null;
      featured_src: string | null;
      featured_alt: string | null;
      featured: boolean | null;
      type: string | null;
    };

    const rows = (await db.projects.findMany({
      select: {
        slug: true,
        title: true,
        excerpt: true,
        thumb: true,
        video: true,
        roles: true,
        tools: true,
        alt: true,
        credits: true,
        gallery: true,
        mobile_hero_src: true,
        problem: true,
        solution: true,
        highlights: true,
        approach: true,
        process: true,
        outcome: true,
        deliverables: true,
        year: true,
        client: true,
        featured_aspect: true,
        featured_src: true,
        featured_alt: true,
        featured: true,
        type: true,
      },
      orderBy: { title: "asc" },
    })) as unknown as Row[];

    const fromJsonArray = <T>(val: unknown | null | undefined): T[] | undefined => {
      if (Array.isArray(val)) return val as T[];
      return undefined;
    };

    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      thumb: p.thumb,
      video: p.video ?? undefined,
      roles: p.roles ?? [],
      tools: p.tools ?? undefined,
      alt: p.alt ?? undefined,
      credits: p.credits ?? undefined,
      gallery: fromJsonArray<{ src: string; alt: string }>(p.gallery),
      mobileHeroSrc: p.mobile_hero_src ?? undefined,
      problem: p.problem ?? undefined,
      solution: p.solution ?? undefined,
      highlights: p.highlights ?? undefined,
      approach: p.approach ?? undefined,
      process: fromJsonArray<{ title: string; body: string }>(p.process),
      outcome: p.outcome ?? undefined,
      deliverables: p.deliverables ?? undefined,
      year: p.year ?? undefined,
      client: p.client ?? undefined,
      featuredAspect: (p.featured_aspect as Project["featuredAspect"]) ?? undefined,
      featuredSrc: p.featured_src ?? undefined,
      featuredAlt: p.featured_alt ?? undefined,
      featured: Boolean(p.featured ?? false),
      type: (p.type as Project["type"]) ?? undefined,
    }));
  } catch (e) {
    console.warn("Prisma projects error:", (e as Error).message);
    return null;
  }
}
