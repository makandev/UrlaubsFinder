"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import { computeSecretScore, computeMatch } from "@/lib/scoring";
import { getPerspectives } from "@/lib/perspectives";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import { SecretMeter } from "@/components/SecretMeter";
import { WeatherWidget } from "@/components/WeatherWidget";
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

  const questions =
    locale === "de"
      ? [
          `Wie ist das Wetter in ${d.name} im Oktober?`,
          `Wo esse ich in ${d.name} am besten?`,
          `Ist ${d.name} auch mit wenig Budget machbar?`,
          `Was ist der schönste versteckte Ort in ${d.name}?`,
        ]
      : [
          `What's the weather like in ${d.name} in October?`,
          `Where should I eat in ${d.name}?`,
          `Is ${d.name} doable on a small budget?`,
          `What's the most beautiful hidden spot in ${d.name}?`,
        ];

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

      <div
        className="flex h-48 items-end rounded-3xl p-5"
        style={{ backgroundImage: `linear-gradient(135deg, ${d.gradient[0]}, ${d.gradient[1]})` }}
      >
        <div>
          <p className="text-sm font-medium text-white/85">{d.countryEmoji} {d.country}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{d.name}</h1>
        </div>
      </div>

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

          <WeatherWidget lat={d.lat} lng={d.lng} />

          <div className="rounded-2xl border border-line bg-surface p-4">
            <h2 className="flex items-center gap-2 font-bold">
              <span aria-hidden>🧠</span> {t("detail.chat")}
            </h2>
            <p className="mt-1 text-xs text-inksoft">{t("detail.chatHint")}</p>
            <div className="mt-3 flex flex-col gap-2">
              {questions.map((q) => (
                <div
                  key={q}
                  className="rounded-lg border border-dashed border-line px-3 py-2 text-sm text-inksoft"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
