"use client";

import { useState } from "react";
import type { Destination } from "@/lib/types";
import { drawShareCard } from "@/lib/sharecard";
import { useI18n } from "@/i18n/I18nProvider";

export function ShareCardButton({ d, secret }: { d: Destination; secret: number }) {
  const { t, locale } = useI18n();
  const [preview, setPreview] = useState<string | null>(null);

  const generate = () => {
    const url = drawShareCard(d, secret, locale);
    if (url) setPreview(url);
  };

  const download = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = `urlaubscoach-${d.id}.png`;
    a.click();
  };

  return (
    <>
      <button
        onClick={generate}
        className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-teal transition-colors hover:bg-surface2"
      >
        🖼️ {t("share.button")}
      </button>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[90vh] flex-col gap-3 rounded-2xl bg-surface p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={d.name} className="max-h-[70vh] w-auto rounded-lg" />
            <div className="flex gap-2">
              <button
                onClick={download}
                className="flex-1 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                ⬇ {t("share.download")}
              </button>
              <button
                onClick={() => setPreview(null)}
                className="rounded-lg border border-line px-4 py-2 text-sm text-inksoft hover:bg-surface2"
              >
                {t("share.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
