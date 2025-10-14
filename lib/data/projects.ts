import { z } from "zod";
import raw from "@data/projects.json";
import type { Project, ProjectType } from "@lib/types";

const ProjectSchema = z.object({
  type: z.enum(["web-dev", "ui-ux", "branding", "social", "print"]).optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  thumb: z.string().min(1),
  roles: z.array(z.string()).min(1),
  tools: z.array(z.string()).optional(),
  alt: z.string().optional(),
  credits: z.string().optional(),
  video: z.string().optional(),
  mobileHeroSrc: z.string().optional(),
  gallery: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })).optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  approach: z.string().optional(),
  process: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
  outcome: z.string().optional(),
  deliverables: z.array(z.string()).optional(),
  year: z.union([z.string(), z.number()]).optional(),
  client: z.string().optional(),
  featuredAspect: z.enum(["square", "portrait45", "portrait916"]).optional(),
  featuredSrc: z.string().optional(),
  featuredAlt: z.string().optional(),
  featured: z.boolean().optional(),
});

const ProjectsSchema = z.array(ProjectSchema);

let cached: Project[] | null = null;

function inferTypeFromRoles(roles: string[]): ProjectType | undefined {
  const hay = roles.map((r) => r.toLowerCase());
  // web-dev
  if (hay.some((r) => /(web\s?dev|frontend|full\s?stack|developer|engineer)/.test(r)))
    return "web-dev";
  // ui-ux
  if (hay.some((r) => /(ui|ux|product\s?design|interaction|experience)/.test(r))) return "ui-ux";
  // branding
  if (hay.some((r) => /(brand|branding|identity|art\s?direction)/.test(r))) return "branding";
  // social
  if (hay.some((r) => /(social|content\s?design|campaign)/.test(r))) return "social";
  // print
  if (hay.some((r) => /(print|editorial|packaging)/.test(r))) return "print";
  return undefined;
}

export function getProjects(): Project[] {
  if (cached) return cached;
  const parsed = ProjectsSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => {
        const path = i.path.join(".");
        return `${path}: ${i.message}`;
      })
      .join("; ");
    throw new Error(`Invalid projects data: ${message}`);
  }
  const normalized = (parsed.data as Project[]).map((p) => {
    if (!p.type) {
      const inferred = inferTypeFromRoles(p.roles ?? []);
      return inferred ? { ...p, type: inferred } : p;
    }
    return p;
  });
  cached = normalized;
  return cached;
}

export function getProjectSlugs(): string[] {
  return getProjects().map((p) => p.slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
