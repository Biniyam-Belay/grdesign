import type { Blog } from "@lib/types";
import { createSupabaseClient } from "@lib/supabase/client";
import { getCachedData, CACHE_TIMES } from "@lib/cache";

export async function getBlogsFromSupabase(): Promise<Blog[] | null> {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not available during build");
      return null;
    }

    return await getCachedData(
      "blogs:all",
      async () => {
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
      },
      { ttl: CACHE_TIMES.BLOGS },
    );
  } catch (err) {
    console.warn("Failed to fetch blogs from Supabase:", err);
    return null;
  }
}
