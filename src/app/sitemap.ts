import { profile } from '@/content/profile';
import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/caseStudies";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteUrl;
  return [
    "",
    "/work",
    "/reading",
    "/playground",
    "/escape",
    "/rpsls",
    ...caseStudies.map((s) => `/work/${s.slug}`),
  ].map((path) => ({
    url: base + path,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.startsWith("/work") ? 0.8 : 0.4,
  }));
}
