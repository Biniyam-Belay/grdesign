import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import WorkForm from "../../components/WorkForm";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

interface EditWorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
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

  // Fetch the work using Edge Function
  const { data, error } = await supabase.functions.invoke("works", {
    body: { action: "list" },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error("Error fetching works:", error);
    notFound();
  }

  // Find the work by slug from the list
  const works = data?.works || [];
  const work = works.find((w: { slug: string }) => w.slug === slug);

  if (!work) {
    notFound();
  }

  return <WorkForm work={work} isEditing />;
}
