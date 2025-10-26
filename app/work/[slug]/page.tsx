// app/work/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectsAsync } from "@lib/data/projects";
import ClientProject from "./ClientProject";

// Enable static generation with revalidation
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamicParams = true; // Allow new slugs at runtime

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  // Generate paths for all projects (both featured and non-featured)
  const projects = await getProjectsAsync();
  const slugs = projects.map((p) => p.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params; // ✅ await params
  const all = await getProjectsAsync();
  const project = all.find((p) => p.slug === slug);

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
  const all = await getProjectsAsync();
  const project = all.find((p) => p.slug === slug);
  if (!project) notFound();

  // Use all projects for navigation (both featured and non-featured)
  const list = all;
  const idx = list.findIndex((p) => p.slug === project.slug);

  const prev = idx > 0 ? { slug: list[idx - 1]!.slug, title: list[idx - 1]!.title } : undefined;

  const next =
    idx >= 0 && idx < list.length - 1
      ? { slug: list[idx + 1]!.slug, title: list[idx + 1]!.title }
      : undefined;

  return <ClientProject project={project} prev={prev} next={next} />;
}
