import { getBlogsFromSupabase } from "./lib/data/blogsSupabase.js";

async function test() {
  try {
    console.log("Testing Supabase blogs fetcher...");
    const blogs = await getBlogsFromSupabase();
    console.log("Blogs from Supabase fetcher:", blogs?.length || 0, "items");
    if (blogs && blogs.length > 0) {
      console.log("First blog title:", blogs[0].title);
      console.log("First blog slug:", blogs[0].slug);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
