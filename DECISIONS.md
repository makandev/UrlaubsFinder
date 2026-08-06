# Entscheidungen (Decision Log) — Fernweh Atlas

Kurz festgehalten, damit Kontext später nicht verloren geht. Neueste zuerst.

## Produkt
- **Name:** „Fernweh Atlas" (Untertitel „Europas Geheimtipps"). Behält das beliebte Wort
  „Fernweh", „Atlas" gibt Entdecker-Substanz; markenfähiger als das beschreibende „UrlaubsFinder".
- **Kern-Nische:** das *Geheime, wenig Überlaufene, Bezahlbare* finden — mit messbarem
  **Geheimtipp-Grad** als Alleinstellungsmerkmal.
- **Kostenlos** für Nutzer; Monetarisierung (Abo/Affiliate) bewusst später (siehe `STRATEGIE.md`).

## Technik / Architektur
- **Next.js (App Router), statischer Export** (`output: "export"`) — kein Server nötig.
- **Lokal-first:** Vorlieben/Merkliste nur im Browser (`localStorage`), keine Accounts/Backend (v2).
  Export/Import/Reset als Brücke.
- **Hosting: GitHub Pages, branch-basiert** über `gh-pages` (peaceiris). Grund: die Actions-
  Artefakt-Pages-Pipeline hing wiederholt (Timeouts). Details `DEPLOY.md`.
- **basePath `/UrlaubsFinder`** nur wenn `GITHUB_PAGES=true` (Projekt-Pages-Unterpfad).

## KI-Chat
- **Stufe 0 (jetzt, dauerhaft, gratis, statisch):** regelbasierte **Tool-Engine** → strukturierte
  Antworten `{blocks, actions}`, die Bilder/Videos/Links/Karten/Geheimtipps rendern und Seiten-
  aktionen auslösen. Deckt „Chat macht mehreres gleichzeitig" ohne Kosten ab.
- **Stufe 1 (später, optional):** echtes LLM über Proxy (z. B. Cloudflare Worker) + Kostendeckel,
  „unlimited" nur per **BYOK** (eigener Schlüssel). Kein „kostenlos & unlimitiert" — das gibt es nicht.
- **Nahtstelle:** `src/lib/chatEngine.ts → askInsider()`.

## Daten & Inhalte
- **Fotos:** Wikimedia Commons (frei, CC), zur **Build-Zeit** (GitHub Actions), Attribution Pflicht.
- **Mehr Infos:** aus **Wikidata/OSM** (frei) + **eigene** Texte.
- **Geheimtipps datenbasiert** (weniger besuchte Orte laut Wikipedia-Aufrufen, versteckte OSM-POIs,
  ruhige Nachbar-Alternative) — **niemals halluziniert**, mit Herkunfts-Badge.
- **Keine Ableitung von Wikivoyage-*Text*** (CC-BY-SA-Share-Alike-Falle) — nur kurze Zitate mit Quelle.
- **Skalierung 42 → 200–300** in Wellen nach Nachfrage-Signal, nicht auf einmal (Google „Scaled-Content").

## Play Store (später)
- Weg: **PWA → TWA** (Bubblewrap/PWABuilder). Braucht **eigene Domain** (Digital Asset Links am
  Origin-Root — der Unterpfad funktioniert nicht), **25 $** Play Console einmalig, Datenschutz-URL,
  Data-Safety/Content-Rating, und für neue Privatkonten **20 Tester / 14 Tage** Closed Testing.
- iOS: kein Äquivalent (out of scope).

## Reihenfolge-Prinzip
Erst **42 Orte exzellent** (Design v2 + Stufe-0-Chat + PWA + Test-Gate, alles gratis/autonom),
Deploy von Datengewinnung entkoppeln, dann Store/Domain/LLM/Skalierung. Siehe `PROGRESS.md`.
