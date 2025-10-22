// Supabase Edge Function: works CRUD
// Deno runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkPayload {
  title: string;
  slug: string;
  description?: string | null;
  image: string;
  aspect_ratio?: string | null;
  link?: string | null;
  featured_order?: number | null;
}

function normalizeWorkData(raw: Record<string, unknown>): WorkPayload {
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const num = (v: unknown) => (typeof v === "number" ? v : null);

  return {
    title: String(raw.title || ""),
    slug: String(raw.slug || ""),
    description: text(raw.description),
    image: String(raw.image || ""),
    aspect_ratio: text(raw.aspect_ratio) || "square",
    link: text(raw.link),
    featured_order: num(raw.featured_order) ?? 0,
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
        .from("works")
        .select("*")
        .order("featured_order", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ works: data || [] }), {
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
        .from("works")
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
      const payload = normalizeWorkData(body?.data || {});

      // Slug uniqueness check
      const currentId = action === "update" ? String(body?.id || "") : "";
      const slugCheck = await supabase.from("works").select("id").eq("slug", payload.slug).limit(1);
      if (slugCheck.error) throw slugCheck.error;
      const exists = (slugCheck.data || []).find((r: { id: string }) => r.id !== currentId);
      if (exists) {
        return new Response(JSON.stringify({ error: "Slug already in use" }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 409,
        });
      }

      if (action === "create") {
        const { data, error } = await supabase
          .from("works")
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
          .from("works")
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
    console.error("[works] function error", err);
    const message = (err as { message?: string })?.message || String(err);
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
