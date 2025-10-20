import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import BlogForm from "../../components/BlogForm";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch the blog post
  const { data: blog, error } = await supabase.from("blogs").select("*").eq("id", id).single();

  if (error || !blog) {
    notFound();
  }

  return <BlogForm blog={blog} isEditing />;
}
