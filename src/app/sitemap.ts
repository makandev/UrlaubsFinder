import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/karte`, priority: 0.6 },
  ];
  const places = destinations.map((d) => ({
    url: `${SITE_URL}/place/${d.id}`,
    priority: 0.8,
  }));
  return [...base, ...places];
}
