import type { Blog } from "@lib/types";
import { createSupabaseClient } from "@lib/supabase/client";

export async function getBlogsFromSupabase(): Promise<Blog[] | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("id,slug,title,excerpt,cover,date,tags,content,created_at,updated_at")
      .order("date", { ascending: false });

    if (error) {
      console.warn("Supabase blogs error:", error.message);
      return null;
    }

    return (data ?? []) as Blog[];
  } catch (err) {
    console.warn("Failed to fetch blogs from Supabase:", err);
    return null;
  }
}
