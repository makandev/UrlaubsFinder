"use client";

import { useMemo } from "react";
import { destinations } from "@/data/destinations";
import { computeSecretScore } from "@/lib/scoring";
import type { Destination } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { DestinationCard } from "@/components/DestinationCard";
import type { DictKey } from "@/i18n/dictionaries";

interface Collection {
  id: string;
  title: DictKey;
  pick: (d: Destination, secret: number) => boolean;
}

const COLLECTIONS: Collection[] = [
  { id: "secret", title: "col.secret", pick: (_d, s) => s >= 70 },
  { id: "coast", title: "col.coast", pick: (d, s) => d.tags.includes("kueste") && s >= 55 },
  { id: "cheapwarm", title: "col.cheapwarm", pick: (d) => d.priceLevel === 1 && d.climate === "warm" },
  { id: "mountain", title: "col.mountain", pick: (d) => (d.tags.includes("natur") || d.tags.includes("aktiv")) && d.climate !== "warm" },
  { id: "cityculture", title: "col.cityculture", pick: (d) => d.tags.includes("stadt") && d.tags.includes("kultur") },
];

export function Collections() {
  const { t } = useI18n();
  const store = useStore();

  const scored = useMemo(
    () =>
      destinations
        .filter((d) => !store.isHidden(d.id))
        .map((d) => ({ d, secret: computeSecretScore(d, destinations) })),
    [store],
  );

  const rails = useMemo(
    () =>
      COLLECTIONS.map((c) => ({
        c,
        items: scored
          .filter(({ d, secret }) => c.pick(d, secret))
          .sort((a, b) => b.secret - a.secret)
          .slice(0, 10),
      })).filter((r) => r.items.length >= 3),
    [scored],
  );

  if (!rails.length) return null;

  return (
    <div className="flex flex-col gap-5">
      {rails.map(({ c, items }) => (
        <section key={c.id}>
          <h2 className="mb-2 text-base font-bold tracking-tight">{t(c.title)}</h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x">
            {items.map(({ d, secret }) => (
              <div key={d.id} className="w-40 flex-none snap-start sm:w-48">
                <DestinationCard d={d} secret={secret} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
