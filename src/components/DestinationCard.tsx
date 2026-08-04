"use client";

import Link from "next/link";
import type { Destination } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { SecretMeter } from "@/components/SecretMeter";
import type { DictKey } from "@/i18n/dictionaries";

export function DestinationCard({
  d,
  secret,
  match,
}: {
  d: Destination;
  secret: number;
  match?: number;
}) {
  const { t, locale } = useI18n();
  const store = useStore();
  const saved = store.isSaved(d.id);
  const profi = store.mode === "profi";

  const monthNames = t("months").split(",");
  const best = d.bestMonths.map((m) => monthNames[m - 1]).join(" · ");
  const priceLabel = t(`price.${d.priceLevel}` as DictKey);

  return (
    <article className="rise flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <Link href={`/place/${d.id}`} className="group relative block">
        <div
          className="flex h-36 items-end p-3"
          style={{
            backgroundImage: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})`,
          }}
        >
          <span className="rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {d.countryEmoji} {d.country}
          </span>
          <span className="ml-auto rounded-full bg-black/25 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {"€".repeat(d.priceLevel)}
            <span className="ml-1 opacity-80">{priceLabel}</span>
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <Link href={`/place/${d.id}`}>
            <h3 className="text-lg font-bold leading-tight tracking-tight hover:text-teal">
              {d.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm leading-snug text-inksoft">{d.desc[locale]}</p>
        </div>

        <div className="grid gap-2">
          <SecretMeter score={secret} label={t("card.secret")} />
          {typeof match === "number" && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-inkfaint">
                {t("card.match")}
              </span>
              <span className="font-semibold tabular-nums text-amber">{match}%</span>
            </div>
          )}
        </div>

        <p className="text-xs text-inkfaint">
          <span className="font-semibold text-inksoft">{t("card.bestTime")}:</span> {best}
        </p>

        {profi && (
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-inkfaint">
            <span className="rounded bg-surface2 px-1.5 py-0.5">{t("card.quality")} {d.quality}</span>
            <span className="rounded bg-surface2 px-1.5 py-0.5">{t("card.pop")} {d.popularity}</span>
            <span className="rounded bg-surface2 px-1.5 py-0.5">~{d.costIndex} €/T</span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <button
            onClick={() => store.save(d.id)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
              saved
                ? "bg-teal text-white"
                : "bg-tealsoft text-teal hover:bg-teal hover:text-white"
            }`}
          >
            {saved ? `✓ ${t("card.saved")}` : `♡ ${t("card.save")}`}
          </button>
          <button
            onClick={() => store.skip(d.id)}
            title={t("card.skip")}
            className="rounded-lg border border-line px-2.5 py-2 text-xs text-inksoft transition-colors hover:bg-surface2"
          >
            ⏭
          </button>
          <button
            onClick={() => store.hide(d.id)}
            title={t("card.hide")}
            className="rounded-lg border border-line px-2.5 py-2 text-xs text-inksoft transition-colors hover:bg-surface2"
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}
