import type { MetadataRoute } from "next";
import { site } from "@/content/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.published
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/realizacje"] }
      : { userAgent: "*", disallow: "/" },
    ...(site.published ? { sitemap: `${site.website}/sitemap.xml` } : {}),
  };
}
