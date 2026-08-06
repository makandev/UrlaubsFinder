"use client";

import { useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

const KEY = "uc.store.v1";

export function DataControls() {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const raw = window.localStorage.getItem(KEY) ?? "{}";
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "urlaubscoach-daten.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed && typeof parsed === "object") {
          window.localStorage.setItem(KEY, JSON.stringify(parsed));
          window.location.reload();
        }
      } catch {
        /* ignore invalid file */
      }
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (!window.confirm(t("data.resetConfirm"))) return;
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem("uc.onboarded");
    window.location.reload();
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-1 text-sm font-mono uppercase tracking-wider text-inkfaint">
        {t("data.title")}
      </h2>
      <p className="mb-3 text-sm text-inksoft">{t("data.note")}</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={exportData}
          className="rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-surface2"
        >
          {t("data.export")}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-surface2"
        >
          {t("data.import")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importData(f);
          }}
        />
        <button
          onClick={reset}
          className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-inksoft hover:bg-surface2"
        >
          {t("data.reset")}
        </button>
      </div>
    </div>
  );
}
