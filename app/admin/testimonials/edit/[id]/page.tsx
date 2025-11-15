import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import TestimonialForm from "../../components/TestimonialForm";

export const metadata = {
  title: "Edit Testimonial - Admin",
};

export const dynamic = "force-dynamic";

interface EditTestimonialPageProps {
  params: {
    id: string;
  };
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const { id } = params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !testimonial) {
    notFound();
  }

  return <TestimonialForm testimonial={testimonial} isEditing />;
}
