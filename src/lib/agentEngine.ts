import type { Destination, Locale } from "@/lib/types";
import { getPerspectives } from "@/lib/perspectives";

/**
 * Agentischer Chat (Stufe 0): eine Frage löst MEHRERE Aktionen aus.
 * Die Engine plant eine Folge typisierter Blöcke (Text, Fotos, Fakten,
 * Geheimtipp, Live-Wetter, Orte in der Nähe, Links & Videos) und protokolliert
 * die "Werkzeuge", die sie dafür benutzt. Rein aus den Ortsdaten, kostenlos,
 * offline. KI-bereit: derselbe Plan lässt sich später von einem LLM füllen.
 */

export type Block =
  | { kind: "text"; icon?: string; title?: string; text: string }
  | { kind: "secret"; text: string }
  | { kind: "gallery" }
  | { kind: "weather" }
  | { kind: "facts"; items: [string, string][] }
  | { kind: "related"; ids: string[] }
  | { kind: "links"; items: { label: string; href: string; icon: string }[] };

export interface AgentReply {
  intro: string;
  /** kurze Werkzeug-Schritte, die im UI als erledigt angezeigt werden */
  steps: string[];
  blocks: Block[];
}

const de = (l: Locale) => l === "de";

function nearestIds(d: Destination, all: Destination[], n: number): string[] {
  return all
    .filter((x) => x.id !== d.id)
    .map((x) => ({ id: x.id, dist: (x.lat - d.lat) ** 2 + (x.lng - d.lng) ** 2 }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map((x) => x.id);
}

function factItems(d: Destination, secret: number, locale: Locale): [string, string][] {
  const L = de(locale);
  return [
    [L ? "€/Tag" : "€/day", `~${d.costIndex} €`],
    [L ? "Geheimtipp-Grad" : "Hidden-gem score", `${secret}/100`],
    [L ? "Bekanntheit" : "Fame", `${d.popularity}/100`],
    [L ? "Preisniveau" : "Price level", "€".repeat(d.priceLevel)],
  ];
}

function linkItems(d: Destination, locale: Locale, wikiUrl?: string): Block {
  const L = de(locale);
  const q = encodeURIComponent(`${d.name} ${d.country}`);
  const wiki = wikiUrl || `https://${locale}.wikipedia.org/wiki/${encodeURIComponent(d.name)}`;
  return {
    kind: "links",
    items: [
      { icon: "📖", label: "Wikipedia", href: wiki },
      { icon: "🗺️", label: L ? "Auf der Karte" : "On the map", href: `https://www.google.com/maps/search/?api=1&query=${d.lat}%2C${d.lng}` },
      { icon: "🎬", label: L ? "Videos ansehen" : "Watch videos", href: `https://www.youtube.com/results?search_query=${q}%20travel` },
      { icon: "🖼️", label: L ? "Mehr Fotos" : "More photos", href: `https://www.google.com/search?tbm=isch&q=${q}` },
    ],
  };
}

/** Baut die agentische Antwort für eine Frage. `wikiUrl` optional aus photos.json. */
export function planReply(
  d: Destination,
  question: string,
  secret: number,
  all: Destination[],
  locale: Locale,
  wikiUrl?: string,
): AgentReply {
  const L = de(locale);
  const q = question.toLowerCase();
  const persp = getPerspectives(d, all, secret, locale);
  const find = (needle: string) => persp.find((p) => p.title.toLowerCase().includes(needle));
  const has = (...keys: string[]) => keys.some((k) => q.includes(k));

  const S = {
    insider: L ? "🧭 Insider-Wissen gesammelt" : "🧭 Gathered insider knowledge",
    photos: L ? "🖼️ Fotos geladen" : "🖼️ Loaded photos",
    facts: L ? "📊 Fakten geprüft" : "📊 Checked the facts",
    secret: L ? "💎 Geheimtipp eingeordnet" : "💎 Assessed the hidden-gem angle",
    weather: L ? "🌤️ Live-Wetter geholt" : "🌤️ Fetched live weather",
    nearby: L ? "🧭 Umgebung durchsucht" : "🧭 Scanned the surroundings",
    links: L ? "🔗 Links & Videos zusammengestellt" : "🔗 Compiled links & videos",
    budget: L ? "💶 Budget berechnet" : "💶 Estimated the budget",
    food: L ? "🍽️ Foodie-Tipp gesucht" : "🍽️ Looked up a foodie tip",
  };

  // Fokussierte Absichten
  if (has("wetter", "weather", "regen", "rain", "temperatur", "temperature", "wann", "zeit", "monat", "when", "month", "season", "saison")) {
    return {
      intro: L ? `Wetter & beste Reisezeit für ${d.name}:` : `Weather & best time for ${d.name}:`,
      steps: [S.weather, S.insider],
      blocks: [
        { kind: "weather" },
        { kind: "text", icon: "📅", title: find(L ? "beste" : "best")?.title, text: find(L ? "beste" : "best")?.text ?? "" },
      ],
    };
  }
  if (has("preis", "budget", "günstig", "cost", "cheap", "teuer", "expensive", "geld", "money")) {
    return {
      intro: L ? `So planst du ${d.name} mit Budget:` : `Planning ${d.name} on a budget:`,
      steps: [S.budget, S.facts],
      blocks: [
        { kind: "text", icon: "💶", title: find("budget")?.title, text: find("budget")?.text ?? "" },
        { kind: "facts", items: factItems(d, secret, locale) },
      ],
    };
  }
  if (has("essen", "food", "eat", "restaurant", "café", "cafe", "kulinar")) {
    const food = find(L ? "essen" : "food")?.text ??
      (L
        ? `${d.name} ist in meinen Daten keine ausgewiesene Foodie-Stadt — such dir eine Straße hinter dem Hauptplatz ein kleines, volles Lokal.`
        : `${d.name} isn't flagged as a foodie city in my data — head one street behind the main square for a small, busy spot.`);
    return { intro: L ? `Essen in ${d.name}:` : `Eating in ${d.name}:`, steps: [S.food], blocks: [{ kind: "text", icon: "🍽️", text: food }] };
  }
  if (has("geheim", "secret", "touri", "crowd", "voll", "menschen", "busy", "ruhe", "quiet")) {
    return {
      intro: L ? `Wie geheim ${d.name} wirklich ist:` : `How hidden ${d.name} really is:`,
      steps: [S.secret, S.facts],
      blocks: [
        { kind: "secret", text: find(L ? "geheim" : "hidden")?.text ?? "" },
        { kind: "facts", items: factItems(d, secret, locale) },
      ],
    };
  }
  if (has("nähe", "nearby", "umgebung", "around", "ausflug", "combine", "kombin")) {
    return {
      intro: L ? `In der Nähe von ${d.name}:` : `Near ${d.name}:`,
      steps: [S.nearby],
      blocks: [
        { kind: "related", ids: nearestIds(d, all, 3) },
        { kind: "text", icon: "➡️", text: find(L ? "nähe" : "nearby")?.text ?? "" },
      ],
    };
  }
  if (has("foto", "photo", "bild", "instagram", "aussicht", "view", "video", "link", "sonnenauf", "sunrise")) {
    return {
      intro: L ? `Bilder, Videos & Links zu ${d.name}:` : `Photos, videos & links for ${d.name}:`,
      steps: [S.photos, S.links],
      blocks: [
        { kind: "gallery" },
        { kind: "text", icon: "📸", text: find(L ? "foto" : "photo")?.text ?? "" },
        linkItems(d, locale, wikiUrl),
      ],
    };
  }

  // Voller agentischer Rundumschlag (Standard, "alles", "überrasch", "insider" …)
  return {
    intro: L
      ? `Alles Wichtige zu ${d.name} — ich hole Fotos, Fakten, Geheimtipp, Wetter, Nachbarorte und Links auf einmal:`
      : `Everything about ${d.name} — pulling photos, facts, the hidden-gem angle, weather, neighbours and links at once:`,
    steps: [S.insider, S.photos, S.facts, S.secret, S.weather, S.nearby, S.links],
    blocks: [
      { kind: "text", text: L ? d.desc.de : d.desc.en },
      { kind: "gallery" },
      { kind: "facts", items: factItems(d, secret, locale) },
      { kind: "secret", text: find(L ? "geheim" : "hidden")?.text ?? "" },
      { kind: "text", icon: "📅", title: find(L ? "beste" : "best")?.title, text: find(L ? "beste" : "best")?.text ?? "" },
      { kind: "weather" },
      { kind: "related", ids: nearestIds(d, all, 3) },
      linkItems(d, locale, wikiUrl),
    ],
  };
}
