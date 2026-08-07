"use client";

import { useEffect } from "react";

/** Registriert den Service Worker (basePath-bewusst). Rendert nichts. */
export function ServiceWorker({ base }: { base: string }) {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const url = `${base}/sw.js`;
    navigator.serviceWorker.register(url, { scope: `${base}/` }).catch(() => {});
  }, [base]);
  return null;
}
