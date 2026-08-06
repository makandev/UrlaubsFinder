"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Climate, RegionKey, TagKey } from "@/lib/types";
import type { DictKey } from "@/i18n/dictionaries";

export interface Filters {
  tags: TagKey[];
  region: RegionKey | "all";
  climate: Climate | "all";
  priceMax: number; // 1..3
  secretMin: number; // 0..100
  months: number[]; // leer = alle
}

export const emptyFilters: Filters = {
  tags: [],
  region: "all",
  climate: "all",
  priceMax: 3,
  secretMin: 0,
  months: [],
};

export function activeFilterCount(f: Filters): number {
  return (
    f.tags.length +
    (f.region !== "all" ? 1 : 0) +
    (f.climate !== "all" ? 1 : 0) +
    (f.priceMax < 3 ? 1 : 0) +
    (f.secretMin > 0 ? 1 : 0) +
    (f.months.length ? 1 : 0)
  );
}

const TAGS: TagKey[] = ["kueste", "stadt", "natur", "kultur", "foodie", "nachtleben", "ruhe", "aktiv"];
const REGIONS: RegionKey[] = ["sued", "west", "mittel", "ost", "nord", "balkan"];
const CLIMATES: Climate[] = ["warm", "mild", "kuehl"];

export function FilterSheet({
  open,
  onClose,
  filters,
  setFilters,
  count,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  count: number;
  onReset: () => void;
}) {
  const { t } = useI18n();
  const months = t("months").split(",");

  const toggleTag = (tag: TagKey) =>
    setFilters({
      ...filters,
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((x) => x !== tag)
        : [...filters.tags, tag],
    });

  const toggleMonth = (m: number) =>
    setFilters({
      ...filters,
      months: filters.months.includes(m)
        ? filters.months.filter((x) => x !== m)
        : [...filters.months, m],
    });

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-teal text-white" : "border border-line text-inksoft hover:bg-surface2"
    }`;

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-surface transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 84px)" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-5 pb-2 pt-3">
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-line" />
        </div>

        <div className="flex flex-col gap-6 px-5">
          <Group label={t("filter.vibe")}>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button key={tag} onClick={() => toggleTag(tag)} className={chip(filters.tags.includes(tag))}>
                  {t(`tag.${tag}` as DictKey)}
                </button>
              ))}
            </div>
          </Group>

          <Group label={t("filter.region")}>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilters({ ...filters, region: "all" })} className={chip(filters.region === "all")}>
                {t("filter.allRegions")}
              </button>
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setFilters({ ...filters, region: r })} className={chip(filters.region === r)}>
                  {t(`region.${r}` as DictKey)}
                </button>
              ))}
            </div>
          </Group>

          <Group label={t("filter.climate")}>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilters({ ...filters, climate: "all" })} className={chip(filters.climate === "all")}>
                {t("filter.allClimates")}
              </button>
              {CLIMATES.map((c) => (
                <button key={c} onClick={() => setFilters({ ...filters, climate: c })} className={chip(filters.climate === c)}>
                  {t(`climate.${c}` as DictKey)}
                </button>
              ))}
            </div>
          </Group>

          <Group label={t("filter.budget")}>
            <div className="flex gap-2">
              {[1, 2, 3].map((p) => (
                <button key={p} onClick={() => setFilters({ ...filters, priceMax: p })} className={chip(filters.priceMax === p)}>
                  {"€".repeat(p)}{p < 3 ? " –" : ""}
                </button>
              ))}
            </div>
          </Group>

          <Group label={`${t("filter.secretMin")}: ${filters.secretMin}`}>
            <input
              type="range" min={0} max={90} step={5} value={filters.secretMin}
              onChange={(e) => setFilters({ ...filters, secretMin: Number(e.target.value) })}
              className="w-full"
            />
          </Group>

          <Group label={t("filter.months")}>
            <div className="flex flex-wrap gap-1.5">
              {months.map((m, i) => (
                <button key={m} onClick={() => toggleMonth(i + 1)} className={chip(filters.months.includes(i + 1))}>
                  {m}
                </button>
              ))}
            </div>
          </Group>
        </div>

        {/* Sticky footer */}
        <div
          className="fixed inset-x-0 bottom-0 flex items-center gap-2 border-t border-line bg-surface px-5 py-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <button onClick={onReset} className="rounded-lg border border-line px-4 py-2.5 text-sm text-inksoft hover:bg-surface2">
            {t("filter.reset")}
          </button>
          <button onClick={onClose} className="flex-1 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            {count} {t("filter.show")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold">{label}</p>
      {children}
    </div>
  );
}
