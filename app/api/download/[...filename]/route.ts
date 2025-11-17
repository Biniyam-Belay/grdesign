import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const pathname = req.nextUrl.pathname;
  const filename = pathname.replace("/api/download/", "");

  if (!filename) {
    return new NextResponse("Filename is required", { status: 400 });
  }

  const { data, error } = await supabase.storage.from("docs").createSignedUrl(filename, 60); // 60 seconds expiration

  if (error) {
    return new NextResponse(`Error creating signed URL: ${error.message}`, {
      status: 500,
    });
  }

  return NextResponse.redirect(data.signedUrl);
}
