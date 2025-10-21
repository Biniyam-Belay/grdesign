import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogForm from "../components/BlogForm";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <BlogForm />;
}
