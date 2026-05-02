import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ProjectForm from "../../components/ProjectForm";
import { Project } from "@/lib/types";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/studio/login");
  }

  // Get session for authorization header
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/studio/login");
  }

  // Fetch the project using Edge Function
  const { data, error } = await supabase.functions.invoke("projects", {
    body: { action: "list" },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error("Error fetching projects:", error);
    notFound();
  }

  const projectsDb = data?.projects || [];
  const projectDb = projectsDb.find(
    (p: { slug: string; [key: string]: unknown }) => p.slug === slug,
  );

  if (!projectDb) {
    notFound();
  }

  // Map from DB columns to Project object structure
  const mappedProject: Project = {
    id: projectDb.id,
    type: projectDb.type,
    slug: projectDb.slug,
    title: projectDb.title,
    excerpt: projectDb.excerpt,
    thumb: projectDb.thumb,
    video: projectDb.video,
    roles: projectDb.roles || [],
    tools: projectDb.tools || [],
    alt: projectDb.alt,
    credits: projectDb.credits,
    gallery: projectDb.gallery,
    mobileHeroSrc: projectDb.mobile_hero_src,
    problem: projectDb.problem,
    solution: projectDb.solution,
    highlights: projectDb.highlights,
    approach: projectDb.approach,
    process: projectDb.process,
    outcome: projectDb.outcome,
    deliverables: projectDb.deliverables,
    year: projectDb.year,
    client: projectDb.client,
  };

  return <ProjectForm project={mappedProject} isEditing allProjects={projectsDb} />;
}
