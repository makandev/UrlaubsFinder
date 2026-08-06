import type { Locale } from "@/lib/types";

export interface WeatherNow {
  temp: number;
  code: number;
  todayMax: number;
  todayMin: number;
}

/** WMO-Wettercode → Symbol + Text. */
export function weatherInfo(code: number, locale: Locale): { emoji: string; label: string } {
  const map: Record<string, { emoji: string; de: string; en: string }> = {
    clear: { emoji: "☀️", de: "klar", en: "clear" },
    partly: { emoji: "⛅", de: "teils bewölkt", en: "partly cloudy" },
    cloudy: { emoji: "☁️", de: "bewölkt", en: "cloudy" },
    fog: { emoji: "🌫️", de: "neblig", en: "fog" },
    drizzle: { emoji: "🌦️", de: "Nieselregen", en: "drizzle" },
    rain: { emoji: "🌧️", de: "Regen", en: "rain" },
    snow: { emoji: "❄️", de: "Schnee", en: "snow" },
    showers: { emoji: "🌦️", de: "Schauer", en: "showers" },
    thunder: { emoji: "⛈️", de: "Gewitter", en: "thunderstorm" },
  };
  let key: keyof typeof map | string = "cloudy";
  if (code === 0) key = "clear";
  else if (code <= 3) key = "partly";
  else if (code <= 48) key = "fog";
  else if (code <= 57) key = "drizzle";
  else if (code <= 67) key = "rain";
  else if (code <= 77) key = "snow";
  else if (code <= 82) key = "showers";
  else if (code <= 86) key = "snow";
  else key = "thunder";
  const e = map[key] ?? map.cloudy;
  return { emoji: e.emoji, label: locale === "de" ? e.de : e.en };
}

export async function fetchWeather(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<WeatherNow | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.current) return null;
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weather_code ?? 3,
    todayMax: Math.round(data.daily?.temperature_2m_max?.[0] ?? data.current.temperature_2m),
    todayMin: Math.round(data.daily?.temperature_2m_min?.[0] ?? data.current.temperature_2m),
  };
}
