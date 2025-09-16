import { z } from "zod";
import raw from "@data/projects.json";
import type { Project } from "@lib/types";

const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  thumb: z.string().min(1),
  roles: z.array(z.string()).min(1),
  tools: z.array(z.string()).optional(),
  alt: z.string().optional(),
  credits: z.string().optional(),
  video: z.string().optional(),
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
});

const ProjectsSchema = z.array(ProjectSchema);

let cached: Project[] | null = null;

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
  cached = parsed.data as Project[];
  return cached;
}

export function getProjectSlugs(): string[] {
  return getProjects().map((p) => p.slug);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
