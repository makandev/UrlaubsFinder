# Fortschritt — Fernweh Atlas

Lebende Übersicht über die **komplette Reihenfolge** und den Status. Quelle der Wahrheit
für „wo stehen wir". Ergänzt: `ROADMAP-v2.md` (Detailplan), `DECISIONS.md`, `DEPLOY.md`, `DEVELOPMENT.md`.

Legende: ✅ fertig · 🔄 in Arbeit · ⬜ offen

---

## Etappe 1 — Nacht-Bau (M1–M13) — ✅ komplett
Siehe `PLAN.md`. Alle 13 Meilensteine gebaut, browsergetestet, gemergt: Datensatz (42 Orte),
Live-Wetter, zwei Modi, Lernen, „nie leer"-Motor, Karte + Vergleich, Bildkarten, Onboarding +
Coach, SEO, Insider-Chat (regelbasiert), Recht-Minimum, Daten-Export, Politur.

## Namensfindung — ✅
Produktname festgelegt: **Fernweh Atlas** (Untertitel „Europas Geheimtipps").

## Deployment — ✅ gelöst
GitHub Pages **branch-basiert** über `gh-pages` (peaceiris). Grund: die Actions-Artefakt-Pages-
Pipeline hing wiederholt in `deployment_queued` (Timeouts). Details in `DEPLOY.md`.

---

## Etappe 2 — v2 „Profi-Panel + Tester" (Phase A)
Detailplan: `ROADMAP-v2.md`. Reihenfolge & Status:

- ✅ **Name** überall auf *Fernweh Atlas* vereinheitlicht
- ✅ **N4-Teil / Bild-forward Karten** — `SmartImage` (Verlauf-Fallback) + 4:5-Bildkarten mit Overlay & Glas-Buttons
- ✅ **N5-Teil / App-Chrome mobil** — Bottom-Navigation + Modus-Toggle mobil sichtbar
- ✅ **N5 / Reiche Filter** — Vibe-Chips + Filter-Bottom-Sheet mit Live-Zähler
- 🔄 **N3 / Foto-Pipeline** — GitHub Actions holt echte Wikimedia-Bilder (nächster Schritt)
- ⬜ **N6 / Entdeck-Tiefe** — Infinite Scroll + Skeletons + Kollektions-Rails
- ⬜ **N7 / Immersive Detailseite** — Vollbild-Header + Snap-Galerie + sticky Action-Bar
- ⬜ **N7 / Mehr & geheime Infos pro Ort** (aus Wikidata/OSM, eigene Texte)
- ⬜ **N8 / Agentischer Chat Stufe 0** — `{blocks, actions}`: Bilder/Videos/Links/Geheim-Infos gleichzeitig
- ⬜ **N9 / Geheimtipps datenbasiert** (versteckte POIs + Nachbar-Alternative)
- ⬜ **N10 / PWA-Basis** — manifest, maskable Icons, Service Worker
- ⬜ **N1 / Test-Gate** — CI: tsc + lint + Playwright-Smoke + Lighthouse-Budget
- ⬜ **N2 / Daten-Pipeline entkoppeln** — `data-refresh.yml` schreibt Snapshots, Deploy liest nur

## Phase B — braucht Nutzer-Entscheidung (später)
- ⬜ Eigene Domain (~10 €/Jahr) → entfernt den Unterpfad, entblockt Play Store
- ⬜ Play Console (25 $) + Datenschutz + Data-Safety + 20 Tester/14 Tage
- ⬜ Monetarisierung entscheiden (frei vs. Abo) → steuert LLM-Stufe

## Bewusst später
Skalierung 200–300 Orte · echte LLM-Schicht (BYOK) · echte Live-Preise (Affiliate) · Store-Einreichung.

---

_Zuletzt aktualisiert beim Anlegen der Doku-Dateien; danach Weiterbau an der Foto-Pipeline._
