"use client";

import { EuropeMap } from "@/components/EuropeMap";
import { useI18n } from "@/i18n/I18nProvider";

export default function MapPage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{t("map.title")}</h1>
        <p className="mt-1 text-inksoft">{t("map.sub")}</p>
      </div>
      <EuropeMap />
    </div>
  );
}
