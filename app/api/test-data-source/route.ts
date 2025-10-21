import { getBlogsAsync } from "@/lib/data/blogs";
import { getProjectsAsync } from "@/lib/data/projects";

export async function GET() {
  try {
    console.log("🔍 Testing data sources...");

    const blogs = await getBlogsAsync();
    const projects = await getProjectsAsync();

    // Check if data has database IDs (Supabase) vs local IDs
    const hasDbIds = blogs[0]?.id?.includes("-") || false;
    const dataSource = hasDbIds ? "Supabase Database" : "Local JSON Files";

    const result = {
      dataSource,
      blogCount: blogs.length,
      projectCount: projects.length,
      sampleBlogTitle: blogs[0]?.title,
      sampleBlogId: blogs[0]?.id,
      sampleProjectTitle: projects[0]?.title,
      sampleProjectId: projects[0]?.id,
    };

    console.log("📊 Data source test result:", result);

    return Response.json(result);
  } catch (error) {
    console.error("❌ Data source test error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
