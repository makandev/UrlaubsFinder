import type { Destination, Locale } from "@/lib/types";
import { getPerspectives } from "@/lib/perspectives";

/**
 * Regelbasierte Insider-Antwort aus den Ortsdaten.
 * KI-bereit: sobald ein Schlüssel konfiguriert ist, kann hier stattdessen ein
 * LLM (gegroundet auf dieselben Daten) antworten — siehe askInsider().
 */
export function localAnswer(
  d: Destination,
  question: string,
  secret: number,
  all: Destination[],
  locale: Locale,
): string {
  const q = question.toLowerCase();
  const persp = getPerspectives(d, all, secret, locale);
  const find = (needle: string) => persp.find((p) => p.title.toLowerCase().includes(needle));
  const de = locale === "de";

  const has = (...keys: string[]) => keys.some((k) => q.includes(k));

  if (has("wetter", "weather", "regen", "rain", "temperatur", "temperature")) {
    return de
      ? `Das aktuelle Wetter siehst du rechts live. ${find("beste")?.text ?? ""}`
      : `You can see live weather on the right. ${find("best")?.text ?? ""}`;
  }
  if (has("wann", "zeit", "monat", "when", "month", "season", "saison")) {
    return find(de ? "beste" : "best")?.text ?? "";
  }
  if (has("preis", "budget", "günstig", "cost", "cheap", "teuer", "expensive", "geld", "money")) {
    return find(de ? "budget" : "budget")?.text ?? "";
  }
  if (has("essen", "food", "eat", "restaurant", "café", "cafe", "kulinar")) {
    return (
      find(de ? "essen" : "food")?.text ??
      (de
        ? `${d.name} hat keine ausgewiesene Foodie-Szene in meinen Daten — such dir ein kleines, volles Lokal abseits des Hauptplatzes.`
        : `${d.name} isn't flagged as a foodie hotspot in my data — pick a small, busy spot off the main square.`)
    );
  }
  if (has("geheim", "secret", "touri", "crowd", "voll", "menschen", "busy")) {
    return find(de ? "geheim" : "hidden")?.text ?? "";
  }
  if (has("nähe", "nearby", "umgebung", "around", "ausflug", "combine", "kombin")) {
    return (
      find(de ? "nähe" : "nearby")?.text ??
      (de ? "In der Nähe habe ich gerade keinen zweiten Ort in den Daten." : "I don't have a second nearby place in the data right now.")
    );
  }
  if (has("foto", "photo", "instagram", "aussicht", "view", "sonnenauf", "sunrise")) {
    return find(de ? "foto" : "photo")?.text ?? "";
  }
  if (has("familie", "kind", "family", "kids")) {
    return de
      ? `${d.name} ist überschaubar und gut zu Fuß zu erkunden — für Familien angenehm. Plane ruhige Vormittage ein.`
      : `${d.name} is compact and walkable — pleasant for families. Plan calm mornings.`;
  }
  if (has("sicher", "safe", "safety", "gefähr", "danger")) {
    return de
      ? `Zu Sicherheit gebe ich keine verbindliche Auskunft — prüfe tagesaktuell die offiziellen Reisehinweise (Auswärtiges Amt) für ${d.country}.`
      : `I can't give binding safety advice — check official travel advisories for ${d.country} for the latest.`;
  }

  // Default: Beschreibung + eine passende Perspektive
  const extra = persp[Math.min(3, persp.length - 1)]?.text ?? "";
  return de
    ? `${d.desc.de} ${extra}`
    : `${d.desc.en} ${extra}`;
}

/**
 * KI-Anbindung (vorbereitet). Aktiv, sobald ein Schlüssel gesetzt ist.
 * Groundet auf dieselben Ortsdaten wie die regelbasierte Antwort.
 */
export async function askInsider(
  d: Destination,
  question: string,
  secret: number,
  all: Destination[],
  locale: Locale,
): Promise<string> {
  // TODO: Wenn NEXT_PUBLIC/Server-seitiger Schlüssel vorhanden → LLM-Aufruf,
  // gegroundet auf d + getPerspectives(...). Bis dahin regelbasiert:
  return localAnswer(d, question, secret, all, locale);
}
