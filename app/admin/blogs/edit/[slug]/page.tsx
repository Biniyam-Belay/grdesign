import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import BlogForm from "../../components/BlogForm";
import type { Blog } from "@/lib/types";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

interface EditBlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
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

  // Fetch the blog using Edge Function
  const { data, error } = await supabase.functions.invoke("blogs", {
    body: { action: "list" },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error("Error fetching blogs:", error);
    notFound();
  }

  // Find the blog by slug from the list
  const blogs = data?.blogs || [];
  const blog = blogs.find((b: Blog) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  return <BlogForm blog={blog} isEditing />;
}
