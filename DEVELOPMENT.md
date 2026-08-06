# Entwicklung — Fernweh Atlas

## Voraussetzungen
- Node.js 20+
- `npm install`

## Entwickeln
```bash
npm run dev        # http://localhost:3000
```

## Bauen & lokal ansehen (wichtig!)
Die App nutzt **`output: "export"`** — es gibt **keinen** Server. `npm start` (`next start`)
funktioniert daher **nicht**. Stattdessen den statischen Export ausliefern:

```bash
npm run build                          # erzeugt ./out
python3 -m http.server 8080 --directory out
#  → http://localhost:8080
# (oder: npx serve out)
```

## Umgebungsvariablen
- `GITHUB_PAGES=true` → setzt `basePath = /UrlaubsFinder` (nur für den Pages-Build nötig).
  Lokal **ohne** die Variable bauen → Seite liegt unter `/` (einfacher zum Testen).
- `NEXT_PUBLIC_SITE_URL` → Basis-URL für Sitemap/Canonical.

## Testen (Browser)
Getestet wird mit Playwright (Chromium unter `/opt/pw-browsers/...` in der CI/Sandbox) gegen den
ausgelieferten `out/`-Ordner: Routen laden, 0 Konsolenfehler, Kernaktionen klicken. Muster: Server
auf einem freien Port starten, dann ein kleines `*.mjs`-Playwright-Skript laufen lassen.

## Umgebungs-Hinweis (Sandbox)
Ausgehendes Netz ist in der Build-Sandbox eingeschränkt: **Open-Meteo und Wikimedia sind geblockt**.
- Wetter läuft **client-seitig** (im echten Browser des Nutzers) → im Sandbox-Test fehlt es (Fallback greift, kein Fehler).
- Die **Foto-Pipeline** läuft daher über **GitHub Actions** (dort ist das Netz offen), nicht lokal.

## Projektstruktur
```
src/
  app/          Seiten: / (Entdecken), /karte, /dashboard, /place/[id], /rechtliches,
                sitemap.ts, robots.ts, layout.tsx (Header + BottomNav)
  components/   Explorer, DestinationCard, SmartImage, FilterSheet, BottomNav, CoachPanel,
                Onboarding, ChatPanel, ShareCardButton, WeatherWidget, EuropeMap, PlaceDetail …
  data/         destinations.ts (42 Ziele)
  lib/          scoring (Geheimtipp-Grad/Match/Lernen), perspectives, chatEngine, sharecard,
                weather, store (localStorage), site, types
  i18n/         dictionaries (DE/EN) + I18nProvider
```

## Konventionen
- Lokal-first: Zustand in `localStorage` (`src/lib/store.tsx`), keine Server/Accounts.
- Zwei Sprachen (DE/EN) über `dictionaries.ts` — neue sichtbare Texte immer in beide eintragen.
- Theme über CSS-Variablen-Tokens + `.dark`-Klasse.
