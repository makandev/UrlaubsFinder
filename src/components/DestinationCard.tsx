"use client";

import Link from "next/link";
import type { Destination } from "@/lib/types";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { SmartImage } from "@/components/SmartImage";
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
  const priceLabel = t(`price.${d.priceLevel}` as DictKey);

  return (
    <article className="rise group relative overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <Link href={`/place/${d.id}`} className="block">
        <div className="relative">
          <SmartImage
            photo={d.photos?.[0]}
            gradient={d.gradient}
            alt={d.name}
            sizes="(max-width: 640px) 50vw, 33vw"
            className="aspect-[4/5]"
          />
          {/* Scrim für Textlesbarkeit */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />

          {/* Oben: Land + Preis */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {d.countryEmoji} {d.country}
            </span>
            <span className="rounded-full bg-black/35 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {"€".repeat(d.priceLevel)}
            </span>
          </div>

          {/* Unten: Score-Pillen + Name + Kurztext */}
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-teal px-2 py-0.5 text-[11px] font-bold tabular-nums text-white">
                💎 {secret}
              </span>
              {typeof match === "number" && (
                <span className="rounded-full bg-amber px-2 py-0.5 text-[11px] font-bold tabular-nums text-white">
                  {match}%
                </span>
              )}
              {profi && (
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
                  {priceLabel} · ~{d.costIndex}€
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold leading-tight tracking-tight drop-shadow-sm">
              {d.name}
            </h3>
            <p className="line-clamp-2 text-xs leading-snug text-white/85">
              {d.desc[locale]}
            </p>
          </div>
        </div>
      </Link>

      {/* Aktionen — Glas-Buttons oben rechts, außerhalb des Links */}
      <div className="absolute right-2 top-11 flex flex-col gap-1.5">
        <ActionBtn
          onClick={() => {
            store.save(d.id);
            if (!saved) store.learn(d, 1);
          }}
          active={saved}
          label={saved ? t("card.saved") : t("card.save")}
        >
          {saved ? "♥" : "♡"}
        </ActionBtn>
        <ActionBtn onClick={() => store.skip(d.id)} label={t("card.skip")}>
          ⏭
        </ActionBtn>
        <ActionBtn
          onClick={() => {
            store.hide(d.id);
            store.learn(d, -1);
          }}
          label={t("card.hide")}
        >
          ✕
        </ActionBtn>
      </div>
    </article>
  );
}

function ActionBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full text-sm backdrop-blur-sm transition-transform active:scale-90 ${
        active
          ? "bg-teal text-white"
          : "bg-black/35 text-white hover:bg-black/55"
      }`}
    >
      {children}
    </button>
  );
}
