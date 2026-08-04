# UrlaubsCoach 🧭

Dein persönlicher Reise-Coach: finde **das Geheimste vom Besten in Europa** — mit
messbarem Geheimtipp-Grad, lernenden Vorlieben, Merkliste und Profi-Design.

- **Konzept:** siehe [`KONZEPT.md`](./KONZEPT.md) (A-bis-Z, von vier Fach-Perspektiven geschärft)
- **Markt-Strategie:** siehe [`STRATEGIE.md`](./STRATEGIE.md) (Keil, MVP, Geld-Modell, Recht)

## Was schon läuft (Etappe 1, erste Version)

- **Entdecken** europäischer Ziele mit Reitern: Entdecken · Beliebt · Schnäppchen · Geheimtipps
- **Geheimtipp-Grad** (0–100), berechnet aus Qualität × Bekanntheit × regionalem Kontrast
- **Vorlieben-Regler** („Was ist dir wichtig?") → „Passt zu dir"-Sortierung
- **Speichern / Überspringen / Nichts für mich** an jeder Ortskarte
- **Ortsdetailseiten** mit Fakten, „warum das zu dir passt" und vorbereitetem Insider-Chat
- **Merkliste** mit Status (Wunsch / Geplant / Gewesen) + „Übersprungen"-Ablage
- **Deutsch/Englisch** umschaltbar, **Hell-/Dunkelmodus**

Daten sind aktuell handgesetzte Anhaltspunkte (Seed) und werden in einer späteren
Etappe aus offenen Quellen (Wikipedia-Seitenaufrufe, Wikidata, OSM, Open-Meteo) berechnet.

## Technik

Next.js 14 (App Router) · React · TypeScript · Tailwind CSS.

## Lokal starten

```bash
npm install
npm run dev      # Entwicklungsserver auf http://localhost:3000
```

Produktions-Build:

```bash
npm run build && npm start
```

## Struktur

```
src/
  app/            Seiten (Entdecken, Merkliste, Ortsdetail)
  components/     UI-Bausteine (Karten, Filter, Regler, Header …)
  data/           Seed-Datensatz europäischer Ziele
  lib/            Scoring (Geheimtipp-Grad, Match), Merkliste-Store, Typen
  i18n/           Deutsch/Englisch
```
