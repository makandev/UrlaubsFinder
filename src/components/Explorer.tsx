"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { computeSecretScore, computeMatch } from "@/lib/scoring";
import type { TagKey } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { DestinationCard } from "@/components/DestinationCard";
import { PrefsPanel } from "@/components/PrefsPanel";
import { CoachPanel } from "@/components/CoachPanel";
import { FilterSheet, emptyFilters, activeFilterCount, type Filters } from "@/components/FilterSheet";
import { Collections } from "@/components/Collections";
import type { DictKey } from "@/i18n/dictionaries";

const PAGE = 12;

type Tab = "discover" | "popular" | "bargains" | "secret";
type SortKey = "secret" | "match" | "price" | "popularity" | "az";

const TABS: { key: Tab; label: DictKey; sort: SortKey }[] = [
  { key: "discover", label: "tab.discover", sort: "secret" },
  { key: "popular", label: "tab.popular", sort: "popularity" },
  { key: "bargains", label: "tab.bargains", sort: "price" },
  { key: "secret", label: "tab.secret", sort: "secret" },
];

const QUICK_TAGS: TagKey[] = ["kueste", "stadt", "natur", "kultur", "foodie", "ruhe"];

export function Explorer() {
  const { t } = useI18n();
  const store = useStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("discover");
  const [sort, setSort] = useState<SortKey>("secret");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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
    let items = scored.filter(({ d }) => !store.isHidden(d.id) && !store.isSkipped(d.id));

    if (tab === "secret") items = items.filter(({ secret }) => secret >= 55);
    if (tab === "bargains") items = items.filter(({ d }) => d.priceLevel <= 2);

    const f = filters;
    if (f.tags.length) items = items.filter(({ d }) => f.tags.some((tg) => d.tags.includes(tg)));
    if (f.region !== "all") items = items.filter(({ d }) => d.region === f.region);
    if (f.climate !== "all") items = items.filter(({ d }) => d.climate === f.climate);
    items = items.filter(({ d }) => d.priceLevel <= f.priceMax);
    if (f.secretMin > 0) items = items.filter(({ secret }) => secret >= f.secretMin);
    if (f.months.length) items = items.filter(({ d }) => f.months.some((m) => d.bestMonths.includes(m)));

    const by = [...items];
    switch (sort) {
      case "secret": by.sort((a, b) => b.secret - a.secret); break;
      case "match": by.sort((a, b) => b.match - a.match); break;
      case "popularity": by.sort((a, b) => b.d.popularity - a.d.popularity); break;
      case "price": by.sort((a, b) => a.d.priceLevel - b.d.priceLevel || a.d.costIndex - b.d.costIndex); break;
      case "az": by.sort((a, b) => a.d.name.localeCompare(b.d.name)); break;
    }
    return by;
  }, [scored, filters, tab, sort, store]);

  const changeTab = (nt: Tab) => {
    setTab(nt);
    setSort(TABS.find((x) => x.key === nt)!.sort);
  };

  const surprise = () => {
    const pool = destinations.filter((d) => !store.isHidden(d.id));
    if (!pool.length) return;
    router.push(`/place/${pool[Math.floor(Math.random() * pool.length)].id}`);
  };

  const toggleTag = (tag: TagKey) =>
    setFilters((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((x) => x !== tag) : [...f.tags, tag],
    }));

  const activeCount = activeFilterCount(filters);

  const visible = list.slice(0, page * PAGE);
  const hasMore = visible.length < list.length;
  const showRails = tab === "discover" && activeCount === 0;

  // Seitenzahl zurücksetzen, wenn sich die Liste ändert
  useEffect(() => {
    setPage(1);
  }, [filters, tab, sort, store.prefs]);

  // Infinite Scroll
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, list.length]);

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
              tab === x.key ? "bg-teal text-white" : "border border-line text-inksoft hover:bg-surface2"
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

      {/* Filter-Chip-Reihe (scrollbar) */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-none items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold hover:bg-surface2"
        >
          <span aria-hidden>⚙️</span> {t("filter.title")}
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
        {QUICK_TAGS.map((tag) => {
          const active = filters.tags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`flex-none rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-teal text-white" : "border border-line text-inksoft hover:bg-surface2"
              }`}
            >
              {t(`tag.${tag}` as DictKey)}
            </button>
          );
        })}
      </div>

      {/* Sort + Zähler */}
      <div className="flex items-center gap-2 text-sm">
        <label className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
          <span className="text-xs font-medium text-inkfaint">{t("sort.label")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent text-sm font-semibold text-ink outline-none"
          >
            <option value="secret">{t("sort.secret")}</option>
            <option value="match">{t("sort.match")}</option>
            <option value="price">{t("sort.price")}</option>
            <option value="popularity">{t("sort.popularity")}</option>
            <option value="az">{t("sort.az")}</option>
          </select>
        </label>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(emptyFilters)}
            className="rounded-full border border-line px-3 py-1.5 text-inksoft hover:bg-surface2"
          >
            ✕ {t("filter.reset")}
          </button>
        )}
        <span className="ml-auto font-mono text-xs text-inkfaint">{list.length}</span>
      </div>

      {/* Kollektions-Rails (nur Entdecken, ohne aktive Filter) */}
      {showRails && <Collections />}

      {/* Grid */}
      {list.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-inksoft">
          {t("empty.discover")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {visible.map(({ d, secret, match }) => (
              <DestinationCard key={d.id} d={d} secret={secret} match={sort === "match" ? match : undefined} />
            ))}
            {hasMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`sk-${i}`} className="aspect-[4/5] animate-pulse rounded-2xl border border-line bg-surface2" />
              ))}
          </div>
          {hasMore && <div ref={sentinelRef} className="h-4" />}
        </>
      )}

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        setFilters={setFilters}
        count={list.length}
        onReset={() => setFilters(emptyFilters)}
      />
    </div>
  );
}
