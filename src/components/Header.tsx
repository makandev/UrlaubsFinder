"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const pathname = usePathname();
  const isDash = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ground/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span aria-hidden className="text-lg">🧭</span>
          <span>{t("app.name")}</span>
        </Link>

        <nav className="ml-4 flex items-center gap-1 text-sm">
          <Link
            href="/"
            className={`rounded-full px-3 py-1.5 transition-colors ${
              !isDash ? "bg-tealsoft text-teal font-semibold" : "text-inksoft hover:text-ink"
            }`}
          >
            {t("nav.discover")}
          </Link>
          <Link
            href="/dashboard"
            className={`rounded-full px-3 py-1.5 transition-colors ${
              isDash ? "bg-tealsoft text-teal font-semibold" : "text-inksoft hover:text-ink"
            }`}
          >
            {t("nav.dashboard")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border border-line text-xs font-semibold">
            {(["de", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1 transition-colors ${
                  locale === l ? "bg-teal text-white" : "text-inksoft hover:text-ink"
                }`}
                aria-pressed={locale === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
