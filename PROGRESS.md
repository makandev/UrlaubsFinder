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
- ✅ **N3 / Foto-Pipeline** — GitHub Actions holt echte Wikimedia-Fotos (Hero + 4er-Galerie)
  für 39/42 Orte; Wappen/Flaggen/Karten mehrsprachig gefiltert, Hero aus der Media-Liste.
- ✅ **N6 / Entdeck-Tiefe** — Infinite Scroll + Skeletons + Kollektions-Rails
- ✅ **N7 / Immersive Detailseite** — Vollbild-Header (`SmartImage`) + Snap-Galerie
- ✅ **N7 / Mehr & geheime Infos pro Ort** — datenbasierte Blickwinkel
  („Unterschätzt?", „Insider-Move", „Route-Idee") in Detailseite **und** Chat
- ✅ **N8 / Agentischer Chat Stufe 0** — eine Frage → mehrere Aktionen: Text, Foto-
  Galerie, Fakten, Geheimtipp, Live-Wetter, Nachbarorte, Links & Videos (mit Werkzeug-Log)
- ✅ **N10 / PWA-Basis** — Manifest (relativ, basePath-fest) + Service Worker + Icons
  (192/512/maskable/apple/favicon); Manifest lädt, SW aktiv, verifiziert
- ✅ **N2 / Deploy nach Foto-Refresh** — `workflow_run`-Trigger deployt neue Bilder
  automatisch (Bot-Commit löst sonst kein push-Deploy aus)
- ⬜ **N9 / Geheimtipps datenbasiert** (versteckte POIs + Nachbar-Alternative)
- ⬜ **N1 / Test-Gate** — CI: tsc + lint + Playwright-Smoke + Lighthouse-Budget

## Phase B — braucht Nutzer-Entscheidung (später)
- ⬜ Eigene Domain (~10 €/Jahr) → entfernt den Unterpfad, entblockt Play Store
- ⬜ Play Console (25 $) + Datenschutz + Data-Safety + 20 Tester/14 Tage
- ⬜ Monetarisierung entscheiden (frei vs. Abo) → steuert LLM-Stufe

## Bewusst später
Skalierung 200–300 Orte · echte LLM-Schicht (BYOK) · echte Live-Preise (Affiliate) · Store-Einreichung.

---

_Zuletzt aktualisiert: Phase-A-Nachtbau — Foto-Pipeline live (echte Bilder), immersive
Detailseite, agentischer Chat (Multi-Action), PWA-Basis, reichere Insider-Infos,
Auto-Deploy nach Foto-Refresh. Offen in Phase A: N9 (versteckte POIs) und N1 (Test-Gate CI)._
