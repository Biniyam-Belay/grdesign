import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WorkForm from "../components/WorkForm";

export const metadata = {
  title: "Add Work - Admin",
  description: "Add a new featured work",
};

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <WorkForm />;
}
