import { NextResponse } from "next/server";
import { getBlogs } from "@lib/data/blogs";

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.binidoes.tech";
  const items = getBlogs()
    .map(
      (b) => `
      <item>
        <title>${escape(b.title)}</title>
        <link>${base}/blog/${b.slug}</link>
        <guid>${base}/blog/${b.slug}</guid>
        <pubDate>${new Date(b.date).toUTCString()}</pubDate>
        <description>${escape(b.excerpt)}</description>
      </item>
    `,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Bini Blog</title>
      <link>${base}/blog</link>
      <description>Thoughts on design, motion, and building for the web.</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
