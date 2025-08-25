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
  gallery: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })).optional(),
});

const ProjectsSchema = z.array(ProjectSchema);

let cached: Project[] | null = null;

export function getProjects(): Project[] {
  if (cached) return cached;
  const parsed = ProjectsSchema.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map(
        (i: { path: (string | number)[]; message: string }) => `${i.path.join(".")}: ${i.message}`,
      )
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
