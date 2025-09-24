// app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs, getProjects } from "@lib/data/projects";
import ClientProject from "./ClientProject";

export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  // Only generate paths for non-featured projects as featured items are only for decoration
  const projects = await getProjects().filter((p) => !p.featured);
  const slugs = projects.map((p) => p.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params; // ✅ await params
  const project = await getProjectBySlug(slug);

  const title = project ? `${project.title} - Work` : "Project - Work";
  const description = project?.excerpt ?? "Project case study";

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params; // ✅ await params
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Get real projects, excluding featured items which are only for decoration
  const list = await getProjects().filter((p) => !p.featured);
  const idx = list.findIndex((p) => p.slug === project.slug);

  const prev = idx > 0 ? { slug: list[idx - 1]!.slug, title: list[idx - 1]!.title } : undefined;

  const next =
    idx >= 0 && idx < list.length - 1
      ? { slug: list[idx + 1]!.slug, title: list[idx + 1]!.title }
      : undefined;

  return <ClientProject project={project} prev={prev} next={next} />;
}
