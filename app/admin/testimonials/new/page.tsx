import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TestimonialForm from "../components/TestimonialForm";

export const metadata = {
  title: "New Testimonial - Admin",
};

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <TestimonialForm />;
}
