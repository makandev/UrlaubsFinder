// Holt zu jedem Ziel ein Titelfoto von Wikipedia/Wikimedia Commons (frei, CC)
// und schreibt src/data/photos.json. Läuft in GitHub Actions (offenes Netz),
// NICHT in der eingeschränkten Build-Sandbox.
//
// Ausführen: node scripts/fetch-photos.mjs
import { readFileSync, writeFileSync } from "node:fs";

const UA = "FernwehAtlas/1.0 (https://github.com/makandev/UrlaubsFinder; photos pipeline)";
const OUT = "src/data/photos.json";
const WIDTH = 1024;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readPlaces() {
  const src = readFileSync("src/data/destinations.ts", "utf8");
  const re = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], name: m[2] });
  return out;
}

const cleanName = (name) => name.replace(/\s*\(.*?\)\s*/g, "").trim();

function biggerThumb(url) {
  // .../thumb/x/xy/File.ext/NNNpx-File.ext  →  /WIDTHpx-File.ext
  return url.replace(/\/\d+px-([^/]+)$/, `/${WIDTH}px-$1`);
}

function fileTitleFromThumb(url) {
  const m = url.match(/\/thumb\/[^/]+\/[^/]+\/([^/]+)\/\d+px-/);
  return m ? decodeURIComponent(m[1]) : null;
}

const stripHtml = (s) => (s || "").replace(/<[^>]+>/g, "").trim();

const GALLERY_MAX = 4; // zusätzliche Bilder pro Ort (neben dem Hero)
// Wappen/Flaggen/Karten/Icons in vielen Sprachen aussortieren — die deutsche
// Wikipedia liefert als Artikelbild oft das Wappen statt eines echten Fotos.
const SKIP_FILE =
  /(\.svg$)|flag|flagge|drapeau|bandera|bandiera|wappen|coat[_ ]?of[_ ]?arms|stemma|blason|armoiries|escudo|brasao|bras[aã]o|grb|herb|vaakuna|emblem|siegel|\bseal\b|locator|location|\bmap\b|karte|mapa|carte|mappa|position|orthographic|logo|icon|symbol|panorama_of_the_world|blank|edit-|commons-logo/i;
// Nur echte Rasterfotos als Hero/Galerie zulassen
const PHOTO_EXT = /\.(jpe?g|png)\b/i;

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function commonsCredit(fileTitle) {
  try {
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*` +
      `&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent("File:" + fileTitle)}`;
    const data = await getJson(url);
    const pages = data?.query?.pages || {};
    const page = Object.values(pages)[0];
    const meta = page?.imageinfo?.[0]?.extmetadata || {};
    return {
      author: stripHtml(meta.Artist?.value) || "Wikimedia Commons",
      license: stripHtml(meta.LicenseShortName?.value) || "",
    };
  } catch {
    return { author: "Wikimedia Commons", license: "" };
  }
}

// Baut aus einem beliebigen Wikimedia-Thumb-URL ein Foto-Objekt inkl. Credit.
async function photoFromThumb(rawUrl, alt, sourceUrl) {
  rawUrl = rawUrl.split("?")[0]; // Tracking-Query (utm_*) entfernen
  const src = biggerThumb(rawUrl);
  const fileTitle = fileTitleFromThumb(rawUrl);
  let credit = { author: "Wikimedia Commons", license: "" };
  if (fileTitle) credit = await commonsCredit(fileTitle);
  return { src, alt, sourceUrl, credit: credit.author, license: credit.license, fileTitle };
}

// Kandidaten-Fotos aus der Media-Liste des Artikels (in Artikelreihenfolge).
// Wappen/Karten/SVGs sind rausgefiltert — der erste Treffer ist i.d.R. das
// Titelfoto oben im Artikel, nicht das Infobox-Wappen.
async function mediaCandidates(title, place, sourceUrl) {
  const url = `https://de.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
  const data = await getJson(url);
  const items = (data?.items || []).filter(
    (it) => it.type === "image" && Array.isArray(it.srcset) && it.srcset[0]?.src,
  );
  const out = [];
  const seen = new Set();
  for (const it of items) {
    const fileName = (it.title || "").replace(/^File:/i, "");
    if (!fileName || seen.has(fileName)) continue;
    if (SKIP_FILE.test(fileName) || !PHOTO_EXT.test(fileName)) continue;
    let thumb = it.srcset[0].src;
    if (thumb.startsWith("//")) thumb = "https:" + thumb;
    if (!/\/thumb\//.test(thumb) || !/\/\d+px-[^/]+$/.test(thumb)) continue;
    seen.add(fileName);
    out.push({ fileName, thumb });
    if (out.length >= GALLERY_MAX + 1) break; // Hero + Galerie
  }
  return out;
}

// Fallback: Artikelbild aus der Summary (nur wenn es KEIN Wappen/Karte ist).
async function summaryHero(title, place, sourceUrl) {
  const s = await getJson(
    `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  const raw = s?.originalimage?.source || s?.thumbnail?.source;
  if (!raw) return null;
  const file = fileTitleFromThumb(raw) || raw.split("/").pop() || "";
  if (SKIP_FILE.test(file) || !PHOTO_EXT.test(file)) return null; // Wappen o.ä. → ablehnen
  const isThumb = /\/thumb\//.test(raw) && /\/\d+px-[^/]+$/.test(raw);
  if (!isThumb) return { src: raw, alt: `${place.name} — ${title}`, sourceUrl, credit: "Wikimedia Commons", license: "" };
  const ph = await photoFromThumb(raw, `${place.name} — ${title}`, sourceUrl);
  return { src: ph.src, alt: ph.alt, sourceUrl, credit: ph.credit, license: ph.license };
}

async function fetchPlace(place) {
  const title = cleanName(place.name);
  const sourceUrl = `https://de.wikipedia.org/wiki/${encodeURIComponent(title)}`;

  let cands = [];
  try {
    cands = await mediaCandidates(title, place, sourceUrl);
  } catch {
    /* Media-Liste fehlt → Fallback unten */
  }

  const photos = [];
  for (const c of cands) {
    const ph = await photoFromThumb(c.thumb, `${place.name} — ${c.fileName.replace(/\.[a-z]+$/i, "")}`, sourceUrl);
    photos.push({ src: ph.src, alt: ph.alt, sourceUrl, credit: ph.credit, license: ph.license });
    await sleep(200);
  }

  if (!photos.length) {
    const hero = await summaryHero(title, place, sourceUrl);
    if (hero) photos.push(hero);
  }

  if (!photos.length) return null;
  const [hero, ...gallery] = photos;
  return gallery.length ? { hero, gallery } : { hero };
}

async function main() {
  const places = readPlaces();
  console.log(`Ziele: ${places.length}`);
  const result = {};
  let ok = 0,
    fail = 0;

  for (const p of places) {
    try {
      const set = await fetchPlace(p);
      if (set) {
        result[p.id] = set;
        ok++;
        console.log(`✓ ${p.id}: hero + ${set.gallery?.length ?? 0} Galerie`);
      } else {
        fail++;
        console.log(`– ${p.id}: kein Foto`);
      }
    } catch (e) {
      fail++;
      console.log(`✗ ${p.id}: ${e.message}`);
    }
    await sleep(300);
  }

  writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
  console.log(`\nFertig: ${ok} mit Bild, ${fail} ohne. → ${OUT}`);
}

main();
