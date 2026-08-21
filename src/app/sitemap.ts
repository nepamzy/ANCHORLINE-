import type { MetadataRoute } from "next";
import { navigation, contactNav } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...navigation, contactNav];

  return routes.map((route) => ({
    url: `${siteUrl}${route.href}`,
    lastModified: new Date(),
  }));
}
