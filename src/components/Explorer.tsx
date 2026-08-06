"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { computeSecretScore, computeMatch } from "@/lib/scoring";
import type { Climate, RegionKey } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { DestinationCard } from "@/components/DestinationCard";
import { PrefsPanel } from "@/components/PrefsPanel";
import { CoachPanel } from "@/components/CoachPanel";
import type { DictKey } from "@/i18n/dictionaries";

type Tab = "discover" | "popular" | "bargains" | "secret";
type SortKey = "secret" | "match" | "price" | "popularity" | "az";

const TABS: { key: Tab; label: DictKey; sort: SortKey }[] = [
  { key: "discover", label: "tab.discover", sort: "secret" },
  { key: "popular", label: "tab.popular", sort: "popularity" },
  { key: "bargains", label: "tab.bargains", sort: "price" },
  { key: "secret", label: "tab.secret", sort: "secret" },
];

const REGIONS: RegionKey[] = ["sued", "west", "mittel", "ost", "nord", "balkan"];
const CLIMATES: Climate[] = ["warm", "mild", "kuehl"];

export function Explorer() {
  const { t } = useI18n();
  const store = useStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("discover");
  const [sort, setSort] = useState<SortKey>("secret");
  const [region, setRegion] = useState<RegionKey | "all">("all");
  const [climate, setClimate] = useState<Climate | "all">("all");

  const scored = useMemo(
    () =>
      destinations.map((d) => ({
        d,
        secret: computeSecretScore(d, destinations),
        match: computeMatch(d, store.prefs),
      })),
    [store.prefs],
  );

  const list = useMemo(() => {
    let items = scored.filter(
      ({ d }) => !store.isHidden(d.id) && !store.isSkipped(d.id),
    );

    if (region !== "all") items = items.filter(({ d }) => d.region === region);
    if (climate !== "all") items = items.filter(({ d }) => d.climate === climate);
    if (tab === "secret") items = items.filter(({ secret }) => secret >= 55);
    if (tab === "bargains") items = items.filter(({ d }) => d.priceLevel <= 2);

    const by = [...items];
    switch (sort) {
      case "secret": by.sort((a, b) => b.secret - a.secret); break;
      case "match": by.sort((a, b) => b.match - a.match); break;
      case "popularity": by.sort((a, b) => b.d.popularity - a.d.popularity); break;
      case "price":
        by.sort((a, b) => a.d.priceLevel - b.d.priceLevel || a.d.costIndex - b.d.costIndex);
        break;
      case "az": by.sort((a, b) => a.d.name.localeCompare(b.d.name)); break;
    }
    return by;
  }, [scored, region, climate, tab, sort, store]);

  const changeTab = (nt: Tab) => {
    setTab(nt);
    setSort(TABS.find((x) => x.key === nt)!.sort);
  };

  const surprise = () => {
    const pool = destinations.filter((d) => !store.isHidden(d.id));
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/place/${pick.id}`);
  };

  return (
    <div className="flex flex-col gap-5">
      <CoachPanel />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {TABS.map((x) => (
          <button
            key={x.key}
            onClick={() => changeTab(x.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === x.key
                ? "bg-teal text-white"
                : "border border-line text-inksoft hover:bg-surface2"
            }`}
          >
            {t(x.label)}
          </button>
        ))}
        <button
          onClick={surprise}
          className="ml-auto rounded-full border border-dashed border-line px-4 py-2 text-sm font-semibold text-amber transition-colors hover:bg-surface2"
        >
          {t("explore.surprise")}
        </button>
      </div>

      <PrefsPanel onApply={() => setSort("match")} />

      {/* Filter/Sort bar */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Select
          label={t("sort.label")}
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={[
            ["secret", t("sort.secret")],
            ["match", t("sort.match")],
            ["price", t("sort.price")],
            ["popularity", t("sort.popularity")],
            ["az", t("sort.az")],
          ]}
        />
        <Select
          label={t("filter.region")}
          value={region}
          onChange={(v) => setRegion(v as RegionKey | "all")}
          options={[
            ["all", t("filter.allRegions")],
            ...REGIONS.map((r) => [r, t(`region.${r}` as DictKey)] as [string, string]),
          ]}
        />
        <Select
          label={t("filter.climate")}
          value={climate}
          onChange={(v) => setClimate(v as Climate | "all")}
          options={[
            ["all", t("filter.allClimates")],
            ...CLIMATES.map((c) => [c, t(`climate.${c}` as DictKey)] as [string, string]),
          ]}
        />
        {(region !== "all" || climate !== "all") && (
          <button
            onClick={() => { setRegion("all"); setClimate("all"); }}
            className="rounded-full border border-line px-3 py-1.5 text-inksoft hover:bg-surface2"
          >
            ✕ {t("filter.reset")}
          </button>
        )}
        <span className="ml-auto font-mono text-xs text-inkfaint">{list.length}</span>
      </div>

      {/* Grid */}
      {list.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-inksoft">
          {t("empty.discover")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ d, secret, match }) => (
            <DestinationCard
              key={d.id}
              d={d}
              secret={secret}
              match={sort === "match" ? match : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
      <span className="text-xs font-medium text-inkfaint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-semibold text-ink outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
