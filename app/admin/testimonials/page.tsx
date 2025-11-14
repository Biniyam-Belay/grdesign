import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TestimonialManagement from "./components/TestimonialManagement";

export const metadata = {
  title: "Testimonials - Admin",
  description: "Manage homepage testimonials",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <TestimonialManagement />;
}
