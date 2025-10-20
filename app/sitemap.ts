import { getProjectSlugs } from "@lib/data/projects";
import { getAllBlogTags, getBlogSlugs } from "@lib/data/blogs";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wwww.binidoes.tech";
  const routes = ["", "/work", "/blog", "/blog/rss"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
  }));
  const projectRoutes = (await getProjectSlugs()).map((slug) => ({
    url: `${base}/work/${slug}`,
    lastModified: new Date(),
  }));
  const blogRoutes = (await getBlogSlugs()).map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
  }));
  const tagRoutes = (await getAllBlogTags()).map((tag) => ({
    url: `${base}/blog/tag/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
  }));
  return [...routes, ...projectRoutes, ...blogRoutes, ...tagRoutes];
}
