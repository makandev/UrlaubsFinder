"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="mb-6">
      <h1 className="max-w-2xl text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
        {t("hero.title")}
      </h1>
      <p className="mt-3 max-w-xl text-inksoft">{t("hero.sub")}</p>
    </section>
  );
}
