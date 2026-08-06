export type Locale = "de" | "en";

export type Climate = "warm" | "mild" | "kuehl";

export type TagKey =
  | "kueste"
  | "stadt"
  | "natur"
  | "kultur"
  | "foodie"
  | "nachtleben"
  | "ruhe"
  | "aktiv";

export type RegionKey =
  | "sued"
  | "west"
  | "mittel"
  | "ost"
  | "nord"
  | "balkan";

export interface Photo {
  src: string;
  srcset?: string;
  /** Low-Quality-Platzhalter als Data-URI für Blur-up */
  lqip?: string;
  alt?: string;
  credit?: string;
  license?: string;
  sourceUrl?: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryEmoji: string;
  region: RegionKey;
  lat: number;
  lng: number;
  gradient: [string, string];
  /** 0–100 — Beliebtheit (Proxy: Wikipedia-Seitenaufrufe, normiert) */
  popularity: number;
  /** 0–100 — Substanz/Qualität (Wikidata-Sprachen, Kultur, Natur) */
  quality: number;
  /** 1 = günstig, 2 = mittel, 3 = teuer */
  priceLevel: 1 | 2 | 3;
  /** relativer Tageskosten-Index (Anhaltspunkt in €) */
  costIndex: number;
  /** beste Reisemonate, 1–12 */
  bestMonths: number[];
  climate: Climate;
  tags: TagKey[];
  desc: { de: string; en: string };
  /** Echte Fotos (Build-Pipeline). Leer → Farbverlauf-Fallback. */
  photos?: Photo[];
}

export type PlaceStatus = "wunsch" | "geplant" | "gewesen";
