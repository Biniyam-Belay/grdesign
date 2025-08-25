import { getProjectSlugs } from "@lib/data/projects";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const routes = ["", "/work"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date(),
  }));
  const projectRoutes = getProjectSlugs().map((slug) => ({
    url: `${base}/work/${slug}`,
    lastModified: new Date(),
  }));
  return [...routes, ...projectRoutes];
}
