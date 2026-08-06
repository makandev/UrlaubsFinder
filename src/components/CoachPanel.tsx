"use client";

import { useMemo } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { computeSecretScore } from "@/lib/scoring";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import type { DictKey } from "@/i18n/dictionaries";

export function CoachPanel() {
  const { t } = useI18n();
  const store = useStore();

  const savedCount = store.saved.length;
  const hasPlanned = store.saved.some((s) => s.status === "geplant");

  // aktuelle Stufe 0..3
  const stage = hasPlanned ? 3 : savedCount >= 3 ? 2 : savedCount >= 1 ? 1 : 0;

  const steps: DictKey[] = ["coach.s0", "coach.s1", "coach.s2", "coach.s3"];
  const nextKey = (`coach.next${stage}`) as DictKey;

  const topPick = useMemo(() => {
    if (!store.ready) return null;
    return destinations
      .filter((d) => !store.isHidden(d.id) && !store.isSaved(d.id))
      .map((d) => ({ d, secret: computeSecretScore(d, destinations) }))
      .sort((a, b) => b.secret - a.secret)[0];
  }, [store]);

  return (
    <div className="rise rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden className="text-lg">🧭</span>
        <h2 className="font-bold">{t("coach.title")}</h2>
      </div>

      {/* Stepper */}
      <div className="mb-3 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold ${
                i < stage
                  ? "bg-teal text-white"
                  : i === stage
                  ? "border-2 border-teal text-teal"
                  : "border border-line text-inkfaint"
              }`}
            >
              {i < stage ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < stage ? "bg-teal" : "bg-line"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="mb-3 grid grid-cols-4 gap-1 text-center text-[10px] text-inkfaint">
        {steps.map((s) => (
          <span key={s}>{t(s)}</span>
        ))}
      </div>

      {/* Nächster Schritt */}
      <p className="text-sm">
        <span className="font-semibold text-teal">{t("coach.next")}:</span>{" "}
        <span className="text-inksoft">{t(nextKey)}</span>
      </p>

      {stage <= 1 && topPick && (
        <Link
          href={`/place/${topPick.d.id}`}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-tealsoft px-3 py-2 text-sm font-semibold text-teal hover:bg-teal hover:text-white"
        >
          {topPick.d.countryEmoji} {topPick.d.name} · {t("card.secret")} {topPick.secret} →
        </Link>
      )}
    </div>
  );
}
