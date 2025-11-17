import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectManagement from "./components/ProjectManagement";

export const metadata = {
  title: "Projects Management - Admin",
  description: "Manage projects",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <ProjectManagement />;
}
