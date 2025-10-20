#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadEnvLocal() {
  const p = new URL("../.env.local", import.meta.url);
  try {
    const filePath = p.pathname;
    if (!existsSync(filePath)) return;
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if (val.startsWith("\"") && val.endsWith("\"")) val = val.slice(1, -1);
      if (val.startsWith("' ") && val.endsWith("'")) val = val.slice(1, -1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

const prisma = new PrismaClient();

async function seedBlogs() {
  const raw = await readFile(new URL("../data/blogs.json", import.meta.url), "utf-8");
  const blogs = JSON.parse(raw);
  for (const b of blogs) {
    await prisma.blogs.upsert({
      where: { slug: b.slug },
      create: {
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        cover: b.cover,
        date: new Date(b.date),
        tags: b.tags ?? [],
        content: b.content ?? null,
      },
      update: {
        title: b.title,
        excerpt: b.excerpt,
        cover: b.cover,
        date: new Date(b.date),
        tags: b.tags ?? [],
        content: b.content ?? null,
      },
    });
  }
}

async function seedProjects() {
  const raw = await readFile(new URL("../data/projects.json", import.meta.url), "utf-8");
  const projects = JSON.parse(raw);
  for (const p of projects) {
    await prisma.projects.upsert({
      where: { slug: p.slug },
      create: {
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
      },
      update: {
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
      },
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL. Set it in .env.local or environment and retry.");
    process.exit(1);
  }
  await seedBlogs();
  await seedProjects();
  console.log("Prisma seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
