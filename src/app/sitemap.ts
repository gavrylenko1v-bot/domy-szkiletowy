import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { publishedHouses } from "@/content/houses";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.published) return [];
  return [
    "",
    "/projekty",
    "/technologia",
    "/o-nas",
    "/kontakt",
    "/faq",
    "/polityka-prywatnosci",
    "/polityka-cookies",
    ...publishedHouses.map((h) => `/projekty/${h.slug}`),
  ].map((path) => ({
    url: `${site.website}${path}`,
    changeFrequency: path === "/projekty" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path === "/projekty" ? 0.9 : 0.6,
  }));
}
