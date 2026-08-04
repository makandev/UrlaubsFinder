import type { Destination, TagKey } from "@/lib/types";

/**
 * Geheimtipp-Grad (0–100) = hohe Qualität × niedrige Bekanntheit × regionaler
 * Kontrast − Touri-Falle. Vereinfachte, transparente Fassung der in der
 * Strategie beschriebenen Methode.
 */
export function computeSecretScore(
  d: Destination,
  all: Destination[],
): number {
  const regionPop = all.filter((x) => x.region === d.region);
  const avgPop =
    regionPop.reduce((s, x) => s + x.popularity, 0) /
    Math.max(1, regionPop.length);

  const quality = d.quality / 100; // 0–1
  const unknown = (100 - d.popularity) / 100; // 0–1, invertiert
  // regionaler Kontrast: bekannter als der Schnitt = weniger geheim
  const contrast = clamp01(0.5 + (avgPop - d.popularity) / 100);

  const raw = 0.4 * quality + 0.4 * unknown + 0.2 * contrast;
  return Math.round(clamp01(raw) * 100);
}

/** Vorlieben-Profil (v1: einfache Regler, „gefaktes“ Lernen). */
export interface Prefs {
  budget: number; // 0 = günstig, 100 = egal/teuer ok
  warmth: number; // 0 = kühl, 100 = warm
  cityNature: number; // 0 = Stadt, 100 = Natur
  actionCalm: number; // 0 = Action, 100 = Ruhe
}

export const defaultPrefs: Prefs = {
  budget: 50,
  warmth: 50,
  cityNature: 50,
  actionCalm: 50,
};

/** Passt-zu-dir-Wert 0–100 aus den Reglern. */
export function computeMatch(d: Destination, p: Prefs): number {
  let score = 0;
  let weight = 0;

  // Budget: günstige Ziele belohnen, wenn Regler Richtung „günstig“ steht
  const priceScore = 1 - (d.priceLevel - 1) / 2; // 1 günstig … 0 teuer
  const budgetPull = 1 - p.budget / 100; // 1 = will günstig
  score += (1 - Math.abs(priceScore - budgetPull)) * 1.0;
  weight += 1.0;

  // Klima
  const warmScore = d.climate === "warm" ? 1 : d.climate === "mild" ? 0.5 : 0;
  score += (1 - Math.abs(warmScore - p.warmth / 100)) * 1.0;
  weight += 1.0;

  // Stadt ↔ Natur
  const natureScore = hasTag(d, "natur") || hasTag(d, "kueste") ? 1 : hasTag(d, "stadt") ? 0 : 0.5;
  score += (1 - Math.abs(natureScore - p.cityNature / 100)) * 1.0;
  weight += 1.0;

  // Action ↔ Ruhe
  const calmScore = hasTag(d, "ruhe") ? 1 : hasTag(d, "nachtleben") || hasTag(d, "aktiv") ? 0 : 0.5;
  score += (1 - Math.abs(calmScore - p.actionCalm / 100)) * 1.0;
  weight += 1.0;

  return Math.round((score / weight) * 100);
}

/** Implizites Lernen: Profil sanft zu (dir=+1) oder weg von (dir=-1) einem Ort schieben. */
export function nudgePrefs(p: Prefs, d: Destination, dir: 1 | -1): Prefs {
  const factor = 0.16;
  const targets = {
    budget: ((d.priceLevel - 1) / 2) * 100,
    warmth: d.climate === "warm" ? 100 : d.climate === "mild" ? 50 : 0,
    cityNature:
      hasTag(d, "natur") || hasTag(d, "kueste") ? 100 : hasTag(d, "stadt") ? 0 : 50,
    actionCalm: hasTag(d, "ruhe") ? 100 : hasTag(d, "nachtleben") || hasTag(d, "aktiv") ? 0 : 50,
  };
  const step = (cur: number, target: number) => {
    const moved = dir === 1 ? cur + (target - cur) * factor : cur - (target - cur) * factor;
    return Math.round(Math.max(0, Math.min(100, moved)));
  };
  return {
    budget: step(p.budget, targets.budget),
    warmth: step(p.warmth, targets.warmth),
    cityNature: step(p.cityNature, targets.cityNature),
    actionCalm: step(p.actionCalm, targets.actionCalm),
  };
}

function hasTag(d: Destination, t: TagKey): boolean {
  return d.tags.includes(t);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
