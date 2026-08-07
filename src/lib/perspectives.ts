import type { Destination, Locale } from "@/lib/types";

export interface Perspective {
  icon: string;
  title: string;
  text: string;
}

const MONTHS_DE = "Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember".split(",");
const MONTHS_EN = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");

function nearestN(d: Destination, all: Destination[], n: number): Destination[] {
  return all
    .filter((x) => x.id !== d.id)
    .map((x) => ({ x, dist: (x.lat - d.lat) ** 2 + (x.lng - d.lng) ** 2 }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map((e) => e.x);
}

function nearest(d: Destination, all: Destination[]): Destination | null {
  return nearestN(d, all, 1)[0] ?? null;
}

const TAG_TIP: Record<string, { de: string; en: string }> = {
  kueste: { de: "Geh früh an die Küste — vor 10 Uhr gehören dir Strand und Promenade fast allein.", en: "Hit the coast early — before 10am the beach and promenade are almost yours alone." },
  stadt: { de: "Verlauf dich bewusst in der Altstadt: eine Gasse hinter der Hauptstraße wird alles ruhiger und ehrlicher.", en: "Get lost in the old town on purpose: one lane behind the main street everything turns quieter and more honest." },
  natur: { de: "Nimm feste Schuhe mit — die besten Aussichtspunkte liegen einen kurzen Fußmarsch abseits der Parkplätze.", en: "Bring proper shoes — the best viewpoints sit a short walk beyond the car parks." },
  kultur: { de: "Frag im kleinsten Museum nach dem Lieblingsstück der Aufsicht — so findest du die Geschichten hinter den Fassaden.", en: "In the smallest museum, ask the attendant for their favourite piece — that's how you find the stories behind the facades." },
  foodie: { de: "Iss dort, wo die Speisekarte kurz und nur in der Landessprache ist — das ist fast immer das bessere Zeichen.", en: "Eat where the menu is short and only in the local language — almost always the better sign." },
  nachtleben: { de: "Das Nachtleben startet hier später als du denkst — vor 22 Uhr wirkt vieles leer, danach füllt es sich.", en: "Nightlife starts later than you'd think — before 10pm places look empty, then they fill up." },
  ruhe: { de: "Plane einen ganzen Tag ohne Programm ein — genau dafür ist dieser Ort gemacht.", en: "Block one whole day with no plan — that's exactly what this place is made for." },
  aktiv: { de: "Starte Touren im Morgengrauen: kühler, leerer und das Licht ist unschlagbar.", en: "Start any tour at dawn: cooler, emptier and the light is unbeatable." },
};

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

  // Unterschätzt? — echter Abstand zwischen Substanz und Bekanntheit
  const gap = d.quality - d.popularity;
  list.push({
    icon: "🕵️",
    title: de ? "Unterschätzt?" : "Underrated?",
    text:
      gap >= 25
        ? de
          ? `Deutlich unterschätzt: Substanz ${d.quality}/100, aber nur ${d.popularity}/100 Bekanntheit — viel Qualität, wenig Andrang.`
          : `Clearly underrated: substance ${d.quality}/100 but only ${d.popularity}/100 fame — lots of quality, few crowds.`
        : gap >= 10
        ? de
          ? `Solide unterschätzt: ${d.quality}/100 Substanz gegen ${d.popularity}/100 Bekanntheit — der Ort gibt mehr her, als sein Ruf verspricht.`
          : `Nicely underrated: ${d.quality}/100 substance vs ${d.popularity}/100 fame — it delivers more than its reputation suggests.`
        : de
        ? `Fair bewertet: Substanz ${d.quality}/100, Bekanntheit ${d.popularity}/100 — kein Geheimnis, aber zu Recht beliebt.`
        : `Fairly rated: substance ${d.quality}/100, fame ${d.popularity}/100 — no secret, but popular for good reason.`,
  });

  // Konkrete Aktivität aus dem wichtigsten Tag
  const primary = d.tags[0];
  const tip = primary && TAG_TIP[primary];
  if (tip) {
    list.push({ icon: "✨", title: de ? "Insider-Move" : "Insider move", text: de ? tip.de : tip.en });
  }

  if (nb) {
    list.push({
      icon: "➡️",
      title: de ? "In der Nähe" : "Nearby",
      text: de
        ? `Ganz in der Nähe liegt ${nb.name} (${nb.countryEmoji} ${nb.country}) — lässt sich gut zu einer Runde kombinieren.`
        : `Close by is ${nb.name} (${nb.countryEmoji} ${nb.country}) — easy to combine into one trip.`,
    });
  }

  // Route-Idee aus den zwei nächsten Orten
  const route = nearestN(d, all, 2);
  if (route.length === 2) {
    list.push({
      icon: "🧳",
      title: de ? "Route-Idee" : "Route idea",
      text: de
        ? `Als Rundreise: ${d.name} → ${route[0].name} → ${route[1].name}. Drei Stationen, die geografisch gut zusammenpassen.`
        : `As a loop: ${d.name} → ${route[0].name} → ${route[1].name}. Three stops that fit together geographically.`,
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
