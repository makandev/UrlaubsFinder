"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-14 border-t border-line pt-5 text-xs text-inkfaint">
      {t("footer.note")}
    </footer>
  );
}
