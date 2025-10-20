import { getProjectsFromSupabase } from "@lib/data/projectsSupabase";
import type { Project, ProjectType } from "@lib/types";

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

// All data now comes from Supabase - no hardcoded fallbacks
export async function getProjects(): Promise<Project[]> {
  if (cached) return cached;
  const projects = await getProjectsFromSupabase();
  if (!projects) {
    throw new Error("Failed to fetch projects from Supabase");
  }

  // Apply type inference to projects that don't have a type set
  const normalized = projects.map((p) => {
    if (!p.type) {
      const inferred = inferTypeFromRoles(p.roles ?? []);
      return inferred ? { ...p, type: inferred } : p;
    }
    return p;
  });

  cached = normalized as Project[];
  return cached;
}

// For backwards compatibility - now just calls getProjects()
export async function getProjectsAsync(): Promise<Project[]> {
  return await getProjects();
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}
