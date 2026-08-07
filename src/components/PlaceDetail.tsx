"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import { computeSecretScore, computeMatch } from "@/lib/scoring";
import { getPerspectives } from "@/lib/perspectives";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { SecretMeter } from "@/components/SecretMeter";
import { SmartImage } from "@/components/SmartImage";
import { heroPhoto, galleryPhotos } from "@/lib/photos";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ShareCardButton } from "@/components/ShareCardButton";
import { ChatPanel } from "@/components/ChatPanel";
import type { DictKey } from "@/i18n/dictionaries";

export function PlaceDetail({ id }: { id: string }) {
  const { t, locale } = useI18n();
  const store = useStore();
  const [revealed, setRevealed] = useState(1);

  const d = useMemo(() => destinations.find((x) => x.id === id), [id]);
  const secret = useMemo(() => (d ? computeSecretScore(d, destinations) : 0), [d]);
  const match = useMemo(() => (d ? computeMatch(d, store.prefs) : 0), [d, store.prefs]);
  const perspectives = useMemo(
    () => (d ? getPerspectives(d, destinations, secret, locale) : []),
    [d, secret, locale],
  );

  if (!d) return null;

  const monthNames = t("months").split(",");
  const best = d.bestMonths.map((m) => monthNames[m - 1]).join(" · ");
  const saved = store.isSaved(d.id);

  const facts: [string, string][] = [
    [t("filter.region"), t(`region.${d.region}` as DictKey)],
    [t("filter.climate"), t(`climate.${d.climate}` as DictKey)],
    [t("card.bestTime"), best],
    ["€/Tag", `~${d.costIndex} €`],
    [t("card.secret"), String(secret)],
    [t("sort.popularity"), String(d.popularity)],
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-teal hover:underline">
        ← {t("detail.back")}
      </Link>

      {/* Immersiver Vollbild-Header */}
      <div className="relative overflow-hidden rounded-3xl">
        <SmartImage
          photo={heroPhoto(d.id)}
          gradient={d.gradient}
          alt={d.name}
          priority
          className="aspect-[16/10] sm:aspect-[21/9]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-sm font-medium text-white/85">{d.countryEmoji} {d.country}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
            {d.name}
          </h1>
          <span className="mt-2 inline-block rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
            💎 {t("card.secret")} {secret}
          </span>
        </div>
      </div>

      {/* Snap-Galerie (sobald echte Fotos vorhanden) */}
      {galleryPhotos(d.id).length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 snap-x">
          {galleryPhotos(d.id).slice(1).map((p, i) => (
            <div key={i} className="w-56 flex-none snap-start">
              <SmartImage photo={p} gradient={d.gradient} alt={`${d.name} ${i + 2}`} className="aspect-[4/3] rounded-xl" />
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <p className="text-lg text-inksoft">{d.desc[locale]}</p>

          {/* Warum passt das (Coach) */}
          <div className="rounded-2xl border border-line bg-tealsoft/60 p-4">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-wide text-teal">
              {t("detail.why")}
            </h2>
            <p className="text-sm text-ink">
              {t("card.match")}: <span className="font-bold text-amber">{match}%</span>{" "}
              — {d.tags.map((tag) => `#${tag}`).join(" ")}
            </p>
            <div className="mt-2">
              <SecretMeter score={secret} label={t("card.secret")} />
            </div>
          </div>

          {/* Facts */}
          <div>
            <h2 className="mb-2 text-sm font-mono uppercase tracking-wider text-inkfaint">
              {t("detail.facts")}
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-surface p-3">
                  <p className="text-xs text-inkfaint">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {perspectives.slice(0, revealed).map((p) => (
                <div key={p.title} className="rise rounded-xl border border-line bg-surface p-3">
                  <p className="mb-0.5 text-sm font-bold">
                    <span aria-hidden className="mr-1.5">{p.icon}</span>
                    {p.title}
                  </p>
                  <p className="text-sm text-inksoft">{p.text}</p>
                </div>
              ))}
            </div>

            {revealed < perspectives.length ? (
              <button
                onClick={() => setRevealed((r) => r + 1)}
                className="mt-3 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-teal hover:bg-surface2"
              >
                + {locale === "de" ? "Zeig mir mehr" : "Show me more"}
              </button>
            ) : (
              <p className="mt-3 text-xs text-inkfaint">
                {locale === "de"
                  ? "Noch mehr? Frag den Insider-Profi rechts."
                  : "Want even more? Ask the insider on the right."}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: actions + Ort-Chat placeholder */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                store.save(d.id);
                if (!saved) store.learn(d, 1);
              }}
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                saved ? "bg-teal text-white" : "bg-tealsoft text-teal hover:bg-teal hover:text-white"
              }`}
            >
              {saved ? `✓ ${t("card.saved")}` : `♡ ${t("card.save")}`}
            </button>
            <button
              onClick={() => store.skip(d.id)}
              title={t("card.skip")}
              className="rounded-lg border border-line px-3 py-2.5 text-sm text-inksoft hover:bg-surface2"
            >
              ⏭
            </button>
            <button
              onClick={() => {
                store.hide(d.id);
                store.learn(d, -1);
              }}
              title={t("card.hide")}
              className="rounded-lg border border-line px-3 py-2.5 text-sm text-inksoft hover:bg-surface2"
            >
              ✕
            </button>
          </div>

          <ShareCardButton d={d} secret={secret} />

          <WeatherWidget lat={d.lat} lng={d.lng} />

          <ChatPanel d={d} secret={secret} />
        </div>
      </div>
    </div>
  );
}
