// Supabase Edge Function: projects CRUD
// Deno runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProjectPayload {
  title: string;
  slug: string;
  excerpt: string;
  thumb: string;
  video?: string | null;
  roles: string[];
  tools?: string[] | null;
  type: string;
  featured?: boolean;
  alt?: string | null;
  credits?: string | null;
  problem?: string | null;
  solution?: string | null;
  approach?: string | null;
  outcome?: string | null;
  year?: string | null;
  client?: string | null;
  highlights?: string[] | null;
  deliverables?: string[] | null;
  process?: unknown | null;
}

function normalizeProjectData(raw: Record<string, unknown>): ProjectPayload {
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const arr = (v: unknown) =>
    Array.isArray(v)
      ? (v as unknown[])
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  const bool = (v: unknown) => Boolean(v);

  const roles = arr(raw.roles);
  if (roles.length === 0) throw new Error("roles is required and must contain at least one item");

  let process: unknown = null;
  if (typeof raw.process === "string" && raw.process.trim()) {
    try {
      process = JSON.parse(String(raw.process));
    } catch {
      process = null;
    }
  } else if (raw.process && typeof raw.process === "object") {
    process = raw.process;
  }

  const tools = arr(raw.tools);

  return {
    title: String(raw.title || ""),
    slug: String(raw.slug || ""),
    excerpt: String(raw.excerpt || ""),
    thumb: String(raw.thumb || ""),
    video: text(raw.video),
    roles,
    tools: tools.length > 0 ? tools : null,
    type: String(raw.type || "web-dev"),
    featured: bool(raw.featured),
    alt: text(raw.alt),
    credits: text(raw.credits),
    problem: text(raw.problem),
    solution: text(raw.solution),
    approach: text(raw.approach),
    outcome: text(raw.outcome),
    year: text(raw.year),
    client: text(raw.client),
    highlights: arr(raw.highlights).length > 0 ? (arr(raw.highlights) as string[]) : null,
    deliverables: arr(raw.deliverables).length > 0 ? (arr(raw.deliverables) as string[]) : null,
    process: process ?? null,
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

    // List projects (requires auth since called from admin)
    if (action === "list") {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("title", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ projects: data || [] }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      });
    }

    // All actions below require a logged-in user
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
        .from("projects")
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
      const payload = normalizeProjectData(body?.data || {});

      // Slug uniqueness check
      const currentId = action === "update" ? String(body?.id || "") : "";
      const slugCheck = await supabase
        .from("projects")
        .select("id")
        .eq("slug", payload.slug)
        .limit(1);
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
          .from("projects")
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
          .from("projects")
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
    console.error("[projects] function error", err);
    const message = (err as { message?: string })?.message || String(err);
    return new Response(JSON.stringify({ error: message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
