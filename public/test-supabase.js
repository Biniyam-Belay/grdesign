console.log("Testing Supabase connection in browser...");

import { getBlogsFromSupabase } from "../lib/data/blogsSupabase.js";

getBlogsFromSupabase()
  .then((blogs) => {
    console.log("Supabase blogs result:", blogs);
    if (blogs && blogs.length > 0) {
      console.log("✅ Successfully fetched", blogs.length, "blogs from Supabase");
      console.log("First blog:", blogs[0]);
    } else {
      console.log("❌ No blogs returned from Supabase");
    }
  })
  .catch((error) => {
    console.error("❌ Error fetching from Supabase:", error);
  });
