"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";
import type { Prefs } from "@/lib/scoring";
import type { DictKey } from "@/i18n/dictionaries";

export function PrefsPanel({ onApply }: { onApply: () => void }) {
  const { t } = useI18n();
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<Prefs>(store.prefs);

  const sliders: { key: keyof Prefs; label: DictKey }[] = [
    { key: "budget", label: "prefs.budget" },
    { key: "warmth", label: "prefs.warmth" },
    { key: "cityNature", label: "prefs.cityNature" },
    { key: "actionCalm", label: "prefs.actionCalm" },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span aria-hidden>🎚️</span>
        <span className="font-semibold">{t("prefs.title")}</span>
        <span className="ml-auto text-inkfaint">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-line px-4 pb-4 pt-3">
          <p className="mb-3 text-sm text-inksoft">{t("prefs.hint")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {sliders.map(({ key, label }) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-medium text-inkfaint">
                  {t(label)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={local[key]}
                  onChange={(e) =>
                    setLocal((p) => ({ ...p, [key]: Number(e.target.value) }))
                  }
                  className="w-full"
                />
              </label>
            ))}
          </div>
          <button
            onClick={() => {
              store.setPrefs(local);
              onApply();
            }}
            className="mt-4 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("prefs.apply")}
          </button>
        </div>
      )}
    </div>
  );
}
