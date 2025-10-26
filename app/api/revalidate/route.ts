import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify authorization token
    const authHeader = request.headers.get("authorization");
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    // If secret is configured, require it
    if (revalidateSecret) {
      if (!authHeader || authHeader !== `Bearer ${revalidateSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    // Note: If no secret is set, endpoint works without auth (backward compatible)
    // Set REVALIDATE_SECRET in .env.local for production

    const body = await request.json();
    const { path, type } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Revalidate the specified path
    revalidatePath(path, type || "page");

    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
