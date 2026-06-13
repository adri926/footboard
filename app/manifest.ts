import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Footboard",
    short_name: "Footboard",
    description: "Gérez votre club, préparez vos matchs et créez des situations tactiques.",
    start_url: "/",
    display: "standalone",
    background_color: "#181812",
    theme_color: "#181812",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png" },
    ],
  }
}
