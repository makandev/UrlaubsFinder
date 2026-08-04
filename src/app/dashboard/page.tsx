"use client";

import Link from "next/link";
import { destinations } from "@/data/destinations";
import { computeSecretScore } from "@/lib/scoring";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import type { PlaceStatus } from "@/lib/types";

const byId = new Map(destinations.map((d) => [d.id, d]));
const STATUSES: PlaceStatus[] = ["wunsch", "geplant", "gewesen"];

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const store = useStore();

  const savedDests = store.saved
    .map((s) => ({ item: s, d: byId.get(s.id) }))
    .filter((x): x is { item: (typeof store.saved)[number]; d: NonNullable<typeof x.d> } => !!x.d)
    .sort((a, b) => b.item.savedAt - a.item.savedAt);

  const skippedDests = store.skipped
    .map((id) => byId.get(id))
    .filter((d): d is NonNullable<typeof d> => !!d);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{t("dash.title")}</h1>
        <p className="mt-1 text-inksoft">{t("dash.sub")}</p>
      </div>

      {!store.ready ? null : savedDests.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-8 text-center text-inksoft">
          {t("dash.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedDests.map(({ item, d }) => (
            <article
              key={d.id}
              className="rise flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
            >
              <div
                className="h-24"
                style={{ backgroundImage: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
              />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <Link href={`/place/${d.id}`}>
                    <h3 className="font-bold leading-tight hover:text-teal">{d.name}</h3>
                  </Link>
                  <p className="text-xs text-inkfaint">{d.countryEmoji} {d.country}</p>
                </div>
                <p className="text-sm text-inksoft">{d.desc[locale]}</p>

                <div className="mt-auto flex flex-wrap gap-1">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => store.setStatus(d.id, s)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        item.status === s
                          ? "bg-teal text-white"
                          : "border border-line text-inksoft hover:bg-surface2"
                      }`}
                    >
                      {t(`status.${s}`)}
                    </button>
                  ))}
                  <button
                    onClick={() => store.remove(d.id)}
                    title={t("card.hide")}
                    className="ml-auto rounded-full border border-line px-2 py-1 text-xs text-inksoft hover:bg-surface2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Compare */}
      {savedDests.length >= 2 && (
        <div>
          <h2 className="mb-2 text-sm font-mono uppercase tracking-wider text-inkfaint">
            {t("compare.title")}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="p-3 text-left font-medium text-inkfaint"> </th>
                  {savedDests.map(({ d }) => (
                    <th key={d.id} className="p-3 text-left font-bold">
                      {d.countryEmoji} {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  [t("card.secret"), (d: typeof savedDests[number]["d"]) => String(computeSecretScore(d, destinations))],
                  [t("filter.climate"), (d) => t(`climate.${d.climate}` as never)],
                  ["Preis", (d) => "€".repeat(d.priceLevel)],
                  ["€/Tag", (d) => `~${d.costIndex} €`],
                  [t("card.bestTime"), (d) => d.bestMonths.map((m) => t("months").split(",")[m - 1]).join(" · ")],
                ] as [string, (d: typeof savedDests[number]["d"]) => string][]).map(([label, render]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <td className="p-3 font-medium text-inksoft">{label}</td>
                    {savedDests.map(({ d }) => (
                      <td key={d.id} className="p-3 tabular-nums">{render(d)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skipped pile */}
      <div>
        <h2 className="mb-2 text-sm font-mono uppercase tracking-wider text-inkfaint">
          {t("dash.skipped")}
        </h2>
        {skippedDests.length === 0 ? (
          <p className="text-sm text-inksoft">{t("dash.skippedEmpty")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skippedDests.map((d) => (
              <button
                key={d.id}
                onClick={() => store.unskip(d.id)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-inksoft transition-colors hover:bg-surface2"
                title="↩"
              >
                <span>{d.countryEmoji}</span>
                <span className="font-medium text-ink">{d.name}</span>
                <span className="text-inkfaint">↩</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
