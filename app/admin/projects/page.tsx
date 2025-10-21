import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectManagement from "./components/ProjectManagement";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <ProjectManagement />;
}
