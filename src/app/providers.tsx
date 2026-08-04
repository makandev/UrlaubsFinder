"use client";

import { I18nProvider } from "@/i18n/I18nProvider";
import { StoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <StoreProvider>{children}</StoreProvider>
    </I18nProvider>
  );
}
