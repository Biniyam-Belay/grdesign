import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BatchWorkForm from "../components/BatchWorkForm";

export const metadata = {
  title: "Add Works in Batch - Admin",
  description: "Add multiple featured works at once",
};

export const dynamic = "force-dynamic";

export default async function BatchNewWorkPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <BatchWorkForm />;
}
