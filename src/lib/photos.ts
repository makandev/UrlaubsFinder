import type { Photo } from "@/lib/types";
import photosData from "@/data/photos.json";

interface PhotoSet {
  hero?: Photo;
  gallery?: Photo[];
}

const map = photosData as Record<string, PhotoSet>;

/** Titelbild eines Ortes (aus der Foto-Pipeline). undefined → Verlauf-Fallback. */
export function heroPhoto(id: string): Photo | undefined {
  return map[id]?.hero;
}

/** Galeriebilder eines Ortes. */
export function galleryPhotos(id: string): Photo[] {
  const set = map[id];
  if (!set) return [];
  return [set.hero, ...(set.gallery ?? [])].filter(Boolean) as Photo[];
}
