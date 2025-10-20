#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || (!SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_ANON_KEY)) {
  console.error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Warning: Seeding without SUPABASE_SERVICE_ROLE_KEY may fail due to RLS. Using anon key.");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, { auth: { persistSession: false } });

async function seedBlogs() {
  const raw = await readFile(new URL("../data/blogs.json", import.meta.url), "utf-8");
  const blogs = JSON.parse(raw);
  for (const b of blogs) {
    const { error } = await supabase.from("blogs").upsert({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      cover: b.cover,
      date: b.date,
      tags: b.tags ?? [],
      content: b.content ?? null,
    }, { onConflict: "slug", ignoreDuplicates: false });
    if (error) console.error("Blog upsert error", b.slug, error.message);
    else console.log("✅ Blog seeded:", b.title);
  }
}

async function seedProjects() {
  const raw = await readFile(new URL("../data/projects.json", import.meta.url), "utf-8");
  const projects = JSON.parse(raw);
  
  // First, clear existing projects
  await supabase.from("projects").delete().neq('id', 'placeholder');
  
  for (const p of projects) {
    const { error } = await supabase.from("projects").insert({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      thumb: p.thumb,
      video: p.video ?? null,
      roles: p.roles ?? [],
      tools: p.tools ?? [],
      alt: p.alt ?? null,
      credits: p.credits ?? null,
      gallery: p.gallery ?? null,
      mobile_hero_src: p.mobileHeroSrc ?? null,
      problem: p.problem ?? null,
      solution: p.solution ?? null,
      highlights: p.highlights ?? [],
      approach: p.approach ?? null,
      process: p.process ?? null,
      outcome: p.outcome ?? null,
      deliverables: p.deliverables ?? [],
      year: p.year ? String(p.year) : null,
      client: p.client ?? null,
      featured_aspect: p.featuredAspect ?? null,
      featured_src: p.featuredSrc ?? null,
      featured_alt: p.featuredAlt ?? null,
      featured: p.featured ?? false,
      type: p.type ?? null,
    });
    if (error) console.error("Project insert error", p.slug, error.message);
    else console.log("✅ Project seeded:", p.title);
  }
}

(async () => {
  await seedBlogs();
  await seedProjects();
  console.log("Seed complete");
})();
