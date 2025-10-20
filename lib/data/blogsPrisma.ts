import type { Blog } from "@lib/types";
import prisma from "@lib/db/prisma";

export async function getBlogsFromPrisma(): Promise<Blog[] | null> {
  const db = process.env.DATABASE_URL ? prisma : null;
  if (!db) return null;
  try {
    const rows = await db.blogs.findMany({
      select: {
        slug: true,
        title: true,
        excerpt: true,
        cover: true,
        date: true,
        tags: true,
        content: true,
      },
      orderBy: { date: "desc" },
    });
    return rows.map(
      (r) =>
        ({
          slug: r.slug,
          title: r.title,
          excerpt: r.excerpt,
          cover: r.cover,
          date: r.date.toISOString(),
          tags: r.tags ?? undefined,
          content: r.content ?? undefined,
        }) satisfies Blog,
    );
  } catch (e) {
    console.warn("Prisma blogs error:", (e as Error).message);
    return null;
  }
}
