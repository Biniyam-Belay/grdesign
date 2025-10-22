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
    redirect("/admin/login");
  }

  // Get session for authorization header
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
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

  const projects = (data?.projects as Project[]) || [];
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectForm project={project} isEditing />;
}
