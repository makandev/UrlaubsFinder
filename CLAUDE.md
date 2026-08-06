# Fernweh Atlas — Projekt-Kontext für Claude

Persönlicher KI-Reise-Coach (Web-App): findet das *Geheime, wenig Überlaufene, Bezahlbare* in Europa,
mit messbarem **Geheimtipp-Grad**. Next.js (statischer Export) auf GitHub Pages, lokal-first, DE/EN.

> **Diese Datei wird bei jedem Session-Start automatisch geladen.** Sie orientiert; die Details
> stehen in den verlinkten `.md`-Dateien — diese bei Bedarf gezielt lesen (nicht alles auf einmal).

## Zuerst lesen — wann & was
- **Bei Session-Start, nach Kontext-Kompaktierung und VOR jeder Planung/Weiterarbeit:**
  1. **`PROGRESS.md`** → wo stehen wir, was ist als Nächstes dran (Status-Quelle der Wahrheit)
  2. **`DECISIONS.md`** → welche Entscheidungen gelten (damit ich nichts umwerfe/vergesse)
- **Bei Deploy-/Live-Themen:** `DEPLOY.md`
- **Beim lokalen Bauen/Testen:** `DEVELOPMENT.md`
- **Beim Planen größerer v2-Schritte:** `ROADMAP-v2.md`
- **Für Vision/Markt/Historie (selten):** `KONZEPT.md`, `STRATEGIE.md`, `PLAN.md`

## Kernfakten (nicht vergessen)
- **Name: Fernweh Atlas** (Repo/URL heißen aus historischen Gründen noch `UrlaubsFinder`).
- **Deploy:** Next.js `output: export` → GitHub Pages **branch-basiert über `gh-pages`** (peaceiris).
  Live: https://makandev.github.io/UrlaubsFinder/ · Details & Fehlersuche in `DEPLOY.md`.
- **Lokal-first:** Zustand in `localStorage`, keine Accounts/Backend (v2).
- **Sandbox-Netz eingeschränkt:** Open-Meteo & Wikimedia sind aus der Build-Umgebung **geblockt**
  → Wetter läuft client-seitig, die **Foto-Pipeline über GitHub Actions**. Lokal `out/` ausliefern
  statt `next start` (statischer Export).
- **Alles landet auf `main`**; Deploy nach `gh-pages` passiert automatisch.

## Arbeitsweise (verbindlich)
Nach **jeder** Änderung: `npm run build` grün → im Browser (Playwright gegen `out/`) testen & bewerten
→ committen & pushen. Design **next-gen** halten. Prinzip: erst die 42 Orte exzellent
(Design v2 + Stufe-0-Chat + PWA + Test-Gate), dann Store/Domain/LLM/Skalierung.
