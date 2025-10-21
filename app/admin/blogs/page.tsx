import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogManagement from "./components/BlogManagement";

export default async function BlogsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <BlogManagement />;
}
