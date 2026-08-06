"use client";

import { useState } from "react";
import type { Photo } from "@/lib/types";

/**
 * Bild-Träger mit Blur-up. Zeigt echtes Foto sobald vorhanden, sonst den
 * Marken-Farbverlauf als Fallback (bis die Foto-Pipeline gelaufen ist).
 */
export function SmartImage({
  photo,
  gradient,
  alt,
  sizes,
  priority,
  className,
}: {
  photo?: Photo;
  gradient: [string, string];
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  const bg = photo?.lqip
    ? `url(${photo.lqip}) center/cover`
    : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ background: bg }}
    >
      {photo?.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.src}
          srcSet={photo.srcset}
          sizes={sizes}
          alt={alt}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
