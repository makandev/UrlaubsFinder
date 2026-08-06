import type { Destination, Locale } from "@/lib/types";

export interface Perspective {
  icon: string;
  title: string;
  text: string;
}

const MONTHS_DE = "Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember".split(",");
const MONTHS_EN = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");

function nearest(d: Destination, all: Destination[]): Destination | null {
  let best: Destination | null = null;
  let bestDist = Infinity;
  for (const x of all) {
    if (x.id === d.id) continue;
    const dist = (x.lat - d.lat) ** 2 + (x.lng - d.lng) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = x;
    }
  }
  return best;
}

const climateWord = (d: Destination, l: Locale) =>
  l === "de"
    ? d.climate === "warm" ? "warm" : d.climate === "mild" ? "mild" : "kühl"
    : d.climate === "warm" ? "warm" : d.climate === "mild" ? "mild" : "cool";

const priceWord = (d: Destination, l: Locale) =>
  l === "de"
    ? d.priceLevel === 1 ? "günstig" : d.priceLevel === 2 ? "mittleres Niveau" : "gehoben"
    : d.priceLevel === 1 ? "cheap" : d.priceLevel === 2 ? "mid-range" : "upscale";

/**
 * Erzeugt eine geordnete Liste konkreter Blickwinkel aus den Ortsdaten.
 * Jeder Punkt nennt ein überprüfbares Detail (Monat, Zahl, Nachbarort) — kein Blabla.
 */
export function getPerspectives(
  d: Destination,
  all: Destination[],
  secret: number,
  locale: Locale,
): Perspective[] {
  const M = locale === "de" ? MONTHS_DE : MONTHS_EN;
  const months = d.bestMonths.map((m) => M[m - 1]).join(", ");
  const first = M[d.bestMonths[0] - 1];
  const nb = nearest(d, all);
  const de = locale === "de";

  const list: Perspective[] = [];

  list.push({
    icon: "📅",
    title: de ? "Beste Reisezeit" : "Best time to go",
    text: de
      ? `Ideal in: ${months}. Im ${first} ist es typischerweise ${climateWord(d, locale)} und die großen Menschenmengen halten sich in Grenzen.`
      : `Ideal in: ${months}. Around ${first} it's typically ${climateWord(d, locale)} and the big crowds stay away.`,
  });

  list.push({
    icon: "💶",
    title: de ? "Budget" : "Budget",
    text: de
      ? `Rechne mit rund ${d.costIndex} € pro Tag und Person vor Ort (${priceWord(d, locale)}). Nebensaison drückt Anreise- und Unterkunftspreise spürbar.`
      : `Expect around €${d.costIndex} per day per person on the ground (${priceWord(d, locale)}). Off-season noticeably lowers travel and stay costs.`,
  });

  list.push({
    icon: "💎",
    title: de ? "Wie geheim ist es?" : "How hidden is it?",
    text: de
      ? `Geheimtipp-Grad ${secret}/100 (Bekanntheit ${d.popularity}/100). Je höher der Grad, desto eher hast du die schönen Ecken für dich.`
      : `Hidden-gem score ${secret}/100 (fame ${d.popularity}/100). The higher the score, the more the pretty corners are yours alone.`,
  });

  if (d.tags.includes("foodie")) {
    list.push({
      icon: "🍽️",
      title: de ? "Essen & Trinken" : "Food & drink",
      text: de
        ? `${d.name} gilt als kulinarischer Ort — such dir abseits des Hauptplatzes ein kleines, volles Lokal, in dem Einheimische sitzen.`
        : `${d.name} is known for its food — head one street back from the main square to a small, busy spot full of locals.`,
    });
  }

  if (d.tags.includes("natur") || d.tags.includes("aktiv")) {
    list.push({
      icon: "🥾",
      title: de ? "Draußen & Aktiv" : "Outdoors & active",
      text: de
        ? `Die Umgebung von ${d.name} lohnt einen halben Tag: Aussichtspunkte am frühen Morgen sind hier die beste Zeit für Licht und Ruhe.`
        : `The area around ${d.name} deserves half a day: early-morning viewpoints are the best time for light and quiet.`,
    });
  }

  list.push({
    icon: "🧭",
    title: de ? "Wie ein Local" : "Like a local",
    text: de
      ? `Fang früh an, plane nur einen festen Punkt pro Tag und lass dich zwischen den Gassen von ${d.name} treiben — das ist der Trick.`
      : `Start early, plan just one fixed thing per day and let yourself drift between the lanes of ${d.name} — that's the trick.`,
  });

  if (nb) {
    list.push({
      icon: "➡️",
      title: de ? "In der Nähe" : "Nearby",
      text: de
        ? `Ganz in der Nähe liegt ${nb.name} (${nb.countryEmoji} ${nb.country}) — lässt sich gut zu einer Runde kombinieren.`
        : `Close by is ${nb.name} (${nb.countryEmoji} ${nb.country}) — easy to combine into one trip.`,
    });
  }

  list.push({
    icon: "📸",
    title: de ? "Foto-Moment" : "Photo moment",
    text: de
      ? `Das beste Licht in ${d.name} gibt es kurz nach Sonnenaufgang und in der goldenen Stunde davor — dann ist es auch am leersten.`
      : `The best light in ${d.name} is just after sunrise and in the golden hour before sunset — also when it's emptiest.`,
  });

  return list;
}
