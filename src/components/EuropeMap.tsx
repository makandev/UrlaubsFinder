"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { computeSecretScore } from "@/lib/scoring";
import { useStore } from "@/lib/store";

const W = 800;
const H = 620;
const PAD = 40;

export function EuropeMap() {
  const router = useRouter();
  const store = useStore();
  const [hover, setHover] = useState<string | null>(null);

  const { pts, minLng, maxLng, minLat, maxLat } = useMemo(() => {
    const lngs = destinations.map((d) => d.lng);
    const lats = destinations.map((d) => d.lat);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const pts = destinations.map((d) => {
      const x = PAD + ((d.lng - minLng) / (maxLng - minLng)) * (W - 2 * PAD);
      const y = PAD + ((maxLat - d.lat) / (maxLat - minLat)) * (H - 2 * PAD);
      return { d, x, y, secret: computeSecretScore(d, destinations) };
    });
    return { pts, minLng, maxLng, minLat, maxLat };
  }, []);

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[560px]" role="img" aria-label="Karte europäischer Ziele">
        {/* subtle grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgb(var(--line))" strokeWidth="0.5" opacity="0.5" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#grid)" />

        {pts.map(({ d, x, y, secret }) => {
          const saved = store.isSaved(d.id);
          const hidden = store.isHidden(d.id);
          if (hidden) return null;
          const r = 5 + (secret / 100) * 7;
          const isHover = hover === d.id;
          return (
            <g
              key={d.id}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(d.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/place/${d.id}`)}
            >
              {saved && <circle r={r + 4} fill="none" stroke="rgb(var(--amber))" strokeWidth="2" />}
              <circle
                r={isHover ? r + 2 : r}
                fill="rgb(var(--teal))"
                fillOpacity={0.35 + (secret / 100) * 0.55}
                stroke="rgb(var(--teal))"
                strokeWidth="1.5"
              />
              {isHover && (
                <g transform={`translate(0 ${-r - 8})`}>
                  <text textAnchor="middle" className="fill-ink" fontSize="13" fontWeight="700">
                    {d.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
