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
}

export type PlaceStatus = "wunsch" | "geplant" | "gewesen";
