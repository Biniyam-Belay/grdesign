import type { Work } from "@lib/types";
import { createSupabaseClient } from "@lib/supabase/client";
import { getCachedData, CACHE_TIMES } from "@lib/cache";

export async function getWorksFromSupabase(): Promise<Work[] | null> {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase environment variables not available during build");
      return null;
    }

    return await getCachedData(
      "works:all",
      async () => {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("works")
          .select("*")
          .order("featured_order", { ascending: true });

        if (error) {
          console.warn("Supabase works error:", error.message);
          return null;
        }

        return (data ?? []) as Work[];
      },
      { ttl: CACHE_TIMES.PROJECTS },
    );
  } catch (err) {
    console.warn("Failed to fetch works from Supabase:", err);
    return null;
  }
}
