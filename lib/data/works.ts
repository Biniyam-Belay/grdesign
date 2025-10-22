import type { Work } from "@lib/types";
import { getWorksFromSupabase } from "./worksSupabase";

const fallbackWorks: Work[] = [];

export async function getWorksAsync(): Promise<Work[]> {
  const supabaseWorks = await getWorksFromSupabase();
  return supabaseWorks ?? fallbackWorks;
}

export async function getWorks(): Promise<Work[]> {
  return getWorksAsync();
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const works = await getWorksAsync();
  return works.find((w) => w.slug === slug) ?? null;
}

export async function getWorkSlugs(): Promise<string[]> {
  const works = await getWorksAsync();
  return works.map((w) => w.slug);
}
