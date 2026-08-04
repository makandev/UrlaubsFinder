"use client";

import { useEffect, useState } from "react";
import { fetchWeather, weatherInfo, type WeatherNow } from "@/lib/weather";
import { useI18n } from "@/i18n/I18nProvider";

type State = { status: "loading" | "ok" | "fail"; data?: WeatherNow };

export function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const { locale } = useI18n();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    let alive = true;
    fetchWeather(lat, lng, ctrl.signal)
      .then((data) => {
        if (!alive) return;
        setState(data ? { status: "ok", data } : { status: "fail" });
      })
      .catch(() => alive && setState({ status: "fail" }));
    return () => {
      alive = false;
      ctrl.abort();
    };
  }, [lat, lng]);

  if (state.status === "fail") return null;

  const label = locale === "de" ? "Wetter jetzt" : "Weather now";

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <p className="text-xs text-inkfaint">{label}</p>
      {state.status === "loading" || !state.data ? (
        <div className="mt-1 h-6 w-24 animate-pulse rounded bg-surface2" />
      ) : (
        (() => {
          const w = weatherInfo(state.data.code, locale);
          return (
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">{state.data.temp}°</span>
              <span aria-hidden className="text-lg">{w.emoji}</span>
              <span className="text-sm text-inksoft">{w.label}</span>
              <span className="ml-auto text-xs tabular-nums text-inkfaint">
                {state.data.todayMax}° / {state.data.todayMin}°
              </span>
            </div>
          );
        })()
      )}
    </div>
  );
}
