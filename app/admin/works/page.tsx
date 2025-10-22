import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WorkManagement from "./components/WorkManagement";

export const metadata = {
  title: "Works Management - Admin",
  description: "Manage featured works",
};

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <WorkManagement />;
}
