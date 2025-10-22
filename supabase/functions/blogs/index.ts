// Supabase Edge Function: blogs CRUD
// Deno runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BlogPayload {
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  content?: string | null;
  tags?: string[] | null;
  date: string; // ISO string
}

function normalizeBlogData(raw: Record<string, unknown>): BlogPayload {
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const arr = (v: unknown) =>
    Array.isArray(v)
      ? (v as unknown[])
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const tags = arr(raw.tags);

  const dateStr = String(raw.date || "");
  const isISO = !isNaN(Date.parse(dateStr));
  if (!isISO) throw new Error("Invalid date");

  return {
    title: String(raw.title || ""),
    slug: String(raw.slug || ""),
    excerpt: String(raw.excerpt || ""),
    cover: String(raw.cover || ""),
    content: text(raw.content),
    tags: tags.length > 0 ? (tags as string[]) : null,
    date: new Date(dateStr).toISOString(),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") || "" },
        },
      },
    );

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user ?? null;

    const contentType = req.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await req.json() : {};
    const action: string = body?.action || "";

    if (action === "list") {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ blogs: data || [] }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      });
    }

    // Mutations require auth (admin screens)
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 401,
      });
    }

    if (action === "delete") {
      const id = String(body?.id || "");
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing id" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        });
      }
      const { data, error, status } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id)
        .select("id")
        .single();

      if (error) {
        if (status === 406 || (error as { code?: string }).code === "PGRST116") {
          return new Response(JSON.stringify({ error: "Not found or no permission" }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 404,
          });
        }
        throw error;
      }

      return new Response(JSON.stringify({ id: data.id }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      });
    }

    if (action === "create" || action === "update") {
      const payload = normalizeBlogData(body?.data || {});

      // Slug uniqueness check
      const currentId = action === "update" ? String(body?.id || "") : "";
      const slugCheck = await supabase.from("blogs").select("id").eq("slug", payload.slug).limit(1);
      if (slugCheck.error) throw slugCheck.error;
      const exists = (slugCheck.data || []).find((r) => r.id !== currentId);
      if (exists) {
        return new Response(JSON.stringify({ error: "Slug already in use" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 409,
        });
      }

      if (action === "create") {
        const { data, error } = await supabase
          .from("blogs")
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ id: data.id }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 201,
        });
      } else {
        if (!currentId) {
          return new Response(JSON.stringify({ error: "Missing id for update" }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
            status: 400,
          });
        }
        const { data, error, status } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", currentId)
          .select("id")
          .single();
        if (error) {
          if (status === 406 || (error as { code?: string }).code === "PGRST116") {
            return new Response(JSON.stringify({ error: "Not found or no permission" }), {
              headers: { "Content-Type": "application/json", ...corsHeaders },
              status: 404,
            });
          }
          throw error;
        }
        return new Response(JSON.stringify({ id: data.id }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    });
  } catch (err) {
    console.error("[blogs] function error", err);
    const message = (err as { message?: string })?.message || String(err);
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
