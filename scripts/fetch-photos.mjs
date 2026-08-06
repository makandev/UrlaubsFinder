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

async function fetchHero(place) {
  const title = cleanName(place.name);
  const url = `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const s = await getJson(url);
  const raw = s?.originalimage?.source || s?.thumbnail?.source;
  if (!raw) return null;

  const isThumb = /\/thumb\//.test(raw) && /\/\d+px-[^/]+$/.test(raw);
  const src = isThumb ? biggerThumb(raw) : raw;
  const sourceUrl = s?.content_urls?.desktop?.page || `https://de.wikipedia.org/wiki/${encodeURIComponent(title)}`;

  let credit = { author: "Wikimedia Commons", license: "" };
  const fileTitle = isThumb ? fileTitleFromThumb(raw) : null;
  if (fileTitle) credit = await commonsCredit(fileTitle);

  return {
    src,
    alt: `${place.name} — ${title}`,
    sourceUrl,
    credit: credit.author,
    license: credit.license,
  };
}

async function main() {
  const places = readPlaces();
  console.log(`Ziele: ${places.length}`);
  const result = {};
  let ok = 0,
    fail = 0;

  for (const p of places) {
    try {
      const hero = await fetchHero(p);
      if (hero) {
        result[p.id] = { hero };
        ok++;
        console.log(`✓ ${p.id}: ${hero.src.slice(0, 70)}`);
      } else {
        fail++;
        console.log(`– ${p.id}: kein Bild`);
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
