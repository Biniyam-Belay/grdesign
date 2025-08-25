import { getProjectBySlug, getProjectSlugs, getProjects } from "@lib/data/projects";
import ClientProject from "./ClientProject";

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  return {
    title: project ? `${project.title} — Work` : "Project — Work",
    description: project?.excerpt ?? "Project case study",
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return null;
  const list = getProjects();
  const idx = list.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? { slug: list[idx - 1].slug, title: list[idx - 1].title } : undefined;
  const next =
    idx < list.length - 1 ? { slug: list[idx + 1].slug, title: list[idx + 1].title } : undefined;
  return <ClientProject project={project} prev={prev} next={next} />;
}
