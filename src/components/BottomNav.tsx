"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { destinations } from "@/data/destinations";
import { useI18n } from "@/i18n/I18nProvider";
import { useStore } from "@/lib/store";

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const store = useStore();

  const isMap = pathname.startsWith("/karte");
  const isDash = pathname.startsWith("/dashboard");
  const isDiscover = !isMap && !isDash;

  const surprise = () => {
    const pool = destinations.filter((d) => !store.isHidden(d.id));
    if (!pool.length) return;
    router.push(`/place/${pool[Math.floor(Math.random() * pool.length)].id}`);
  };

  const item = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors ${
      active ? "text-teal" : "text-inkfaint"
    }`;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-ground/90 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link href="/" className={`${item(isDiscover)} py-2`}>
        <span aria-hidden className="text-lg">🧭</span>
        {t("nav.discover")}
      </Link>
      <Link href="/karte" className={`${item(isMap)} py-2`}>
        <span aria-hidden className="text-lg">🗺️</span>
        {t("nav.map")}
      </Link>
      <Link href="/dashboard" className={`${item(isDash)} py-2`}>
        <span aria-hidden className="text-lg">🔖</span>
        {t("nav.dashboard")}
      </Link>
      <button onClick={surprise} className={`${item(false)} py-2`}>
        <span aria-hidden className="text-lg">🎲</span>
        {t("nav.surprise")}
      </button>
    </nav>
  );
}
