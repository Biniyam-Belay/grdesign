import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectForm from "../components/ProjectForm";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <ProjectForm />;
}
