import type { MetadataRoute } from "next"

const BASE_URL = "https://footboard.fr"

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/",                      priority: 1.0, changeFrequency: "weekly" },
  { path: "/tactique",              priority: 0.8, changeFrequency: "weekly" },
  { path: "/tactique/animations",   priority: 0.7, changeFrequency: "monthly" },
  { path: "/tactique/analyse-video", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tactique/concepts",     priority: 0.5, changeFrequency: "monthly" },
  { path: "/cgu",                   priority: 0.2, changeFrequency: "yearly" },
  { path: "/confidentialite",       priority: 0.2, changeFrequency: "yearly" },
  { path: "/mentions-legales",      priority: 0.2, changeFrequency: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
