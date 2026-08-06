"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer className="mt-14 flex flex-col gap-2 border-t border-line pt-5 text-xs text-inkfaint">
      <p>{t("footer.note")}</p>
      <p>
        <Link href="/rechtliches" className="text-teal hover:underline">
          {locale === "de" ? "Rechtliches & Quellen" : "Legal & sources"}
        </Link>
        {" · "}
        {locale === "de" ? "Wetter: Open-Meteo · Karten: © OpenStreetMap" : "Weather: Open-Meteo · Maps: © OpenStreetMap"}
      </p>
    </footer>
  );
}
