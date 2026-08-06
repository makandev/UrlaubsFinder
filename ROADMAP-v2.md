# UrlaubsFinder — v2-Plan (Profi-Panel + Tester)

**Stand:** 6. August 2026
**Ziel:** Die berechtigte Kritik lösen — echte Bilder, viel mehr (und echte geheime) Infos,
reiche Filter/Vielfalt, ein **agentischer** Chat (holt Bilder/Videos/Links/Geheim-Infos, führt
mehrere Aktionen aus) — **kostenlos**, **next-gen Design**, Weg in den **Play Store**.
Erarbeitet mit vier Fach-Perspektiven (Content/Daten, agentische KI, Play-Store/PWA, UX-Design)
und einem Tester, der den Repo-Stand gegengeprüft hat.

---

## Die 4 Kritikpunkte → Lösung

| Deine Kritik | Lösung (kostenlos, statisch) |
|---|---|
| „Keine Bilder an sinnvollen Stellen" | Echte Fotos aus **Wikimedia Commons**, zur **Build-Zeit** als WebP + Blur-up-Platzhalter erzeugt; Bild-forward Redesign |
| „Zu wenig Infos, keine geheimen" | Mehr Fakten aus **Wikidata/OSM** (frei), **eigene** Texte; Geheimtipps **datenbasiert** (weniger besuchte Orte laut Wikipedia-Aufrufen + versteckte OSM-Punkte + ruhige Nachbar-Alternative), mit Herkunfts-Badge |
| „Nur Überrasch-mich + 2 Mini-Filter, zu wenig Vielfalt" | **Reiche Filter** (Vibe-Chips + Bottom-Sheet mit Live-Count), **Kollektions-Rails**, unendliches Nachladen, „Mehr wie dieses" |
| „Kein KI-Chat der mehrere Aktionen ausführt" | **Agentischer Chat Stufe 0**: strukturierte Antworten `{blocks, actions}` — rendert Bild-Galerien/Videos/Links/Karten/Geheimtipps **und** löst Seiten-Aktionen aus — **gratis, ohne Server, ohne KI-Kosten** |

---

## Die 6 ehrlichen Leit-Korrekturen (vom Tester)

1. **Play Store & der GitHub-Pages-Unterpfad sind inkompatibel.** Die App-Verifizierung (Digital Asset Links) prüft die *Origin* `makandev.github.io`, nicht den Pfad `/UrlaubsFinder/`. **Lösung: eine eigene Domain (~10 €/Jahr)** — dann fällt der Unterpfad weg und Store, HTTPS, SEO werden auf einen Schlag sauber. (Nötig **erst für den Store**, nicht für den Bau.)
2. **„Agentischer Chat" ≠ „echte Sprach-KI".** Deine sichtbaren Wünsche (Bilder/Videos/Links/Geheim-Infos gleichzeitig) sind **Werkzeug-Aktionen** → 100 % gratis & statisch. Echte LLM-Sprach-KI kostet Geld → kommt **später**, optional, mit eigenem Schlüssel (BYOK) und Kostendeckel. „Unlimited & kostenlos" gibt es technisch nicht.
3. **Kein Wikivoyage-*Text* ableiten** (CC-BY-SA-Falle: das würde unsere Inhalte „anstecken"). Nur **Fakten** (Wikidata/OSM = frei) nutzen und **eigene** Prosa schreiben; aus Wikivoyage höchstens kurze, klar zitierte Snippets.
4. **Erst 42 exzellent, dann Masse.** 200–300 Orte auf einen Schlag riskieren Googles „Scaled-Content"-Abstrafung. Erweiterung **in Wellen** nach echtem Nachfrage-Signal.
5. **Daten-Pipeline vom Deploy entkoppeln.** Fremde APIs (Overpass/Wikidata) sind wackelig → eigener `data-refresh`-Workflow schreibt geprüfte JSON-Snapshots; der Deploy liest **nur** Snapshots und bleibt **immer grün**.
6. **Erst der Prüfstand, dann bauen.** „Test nach jeder Änderung" braucht ein echtes Gate: `tsc` + Lint + Playwright-Smoke + Lighthouse-Budget in CI.

---

## Bilder & Offline — die Technik-Details

- Hero + 2–3 Galeriebilder pro Ort **lokal** (zur Build-Zeit erzeugt, ins Deploy-Artefakt `out/`, **nicht** in die Git-History) → schnell, offline-fähig, kein toter Hotlink.
- **Attribution ist Pflicht** (CC): kleines „i" auf jedem Bild + eigene „Bildnachweise"-Seite.
- Share-Bildkarte: Bilder mit `crossOrigin="anonymous"` laden, sonst bricht der Canvas-Export.

---

## Der agentische Chat (Stufe 0, gratis) — Architektur

Eine Schnittstelle, strukturierte Antwort:
```
askInsider({placeId, message, history}) → { blocks[], actions[] }
blocks: text · imageGallery · videoEmbed · linkList · mapCard · factCard · secretTip · warningBanner
actions: scrollTo · openLightbox · addToItinerary · filterMap
```
Werkzeuge (alle **gratis, ohne Schlüssel, browsertauglich**): Commons-Bilder, Wikipedia-Kurzinfo,
Open-Meteo-Wetter, OSM-Karte, eigene Geheimtipp-DB, YouTube-**Deep-Links**. Top-Fragen pro Ort
werden **vorberechnet** ausgeliefert → 0 € Grenzkosten. Echte LLM-Schicht = spätere, gedeckelte Option.

*Ehrliche Grenzen:* automatisch *passende* YouTube-**Embeds** und Reisewarnungen live im Browser
sind nicht garantiert (Schlüssel/CORS) → Start mit Deep-Links bzw. Build-Zeit-Daten.

---

## Fahrplan

### 🟢 Phase A — JETZT autonom baubar (0 €, kein Blocker)
Mit den **bestehenden 42 Orten**, DE+EN, next-gen. Nach **jeder** Änderung: Build + Browser-Test + Bewertung.

- **N1 — Test-Gate:** `ci.yml` erweitern (tsc, Lint, Playwright-Smoke, Lighthouse-Budget).
- **N2 — Daten-Pipeline entkoppeln:** `scripts/*` + `data-refresh.yml` (manuell/geplant, fehlertolerant) → committet JSON-Snapshots; Deploy liest nur Snapshots.
- **N3 — Echte Bilder:** sharp-Build-Script → WebP + Inline-LQIP (Hero + Galerie) für die 42; Bildnachweis-Seite + Attribution-Overlay.
- **N4 — SmartImage + Bildkarten-Redesign** (4:5, Text-Overlay, Herz oben rechts).
- **N5 — App-Chrome mobil:** Bottom-Navigation, Mode-Toggle mobil sichtbar, Filter-Chip-Reihe + **Filter-Bottom-Sheet** (Vibe/Slider/Monate/Live-Count), aktive-Filter-Chips, **0-Treffer-/Fehler-Zustände**.
- **N6 — Entdeck-Tiefe:** Infinite Scroll + Skeletons, **Kollektions-Rails** („Küstenperlen"…), „Mehr wie dieses".
- **N7 — Immersive Detailseite:** Vollbild-Header + Snap-Galerie + sticky Action-Bar.
- **N8 — Agentischer Chat Stufe 0:** `{blocks, actions}` auf Basis des vorhandenen `chatEngine.ts`; Bilder/Videos/Links/Karten/Geheimtipps + Seiten-Aktionen; Top-Fragen vorberechnet.
- **N9 — Geheimtipps datenbasiert** (versteckte POIs + Nachbar-Alternative), Herkunfts-Badge, eigene Texte.
- **N10 — PWA-Basis:** manifest (scope korrekt), maskable Icons, Service Worker → „installierbar" grün.
- **N11 — Politur:** Performance-Budget, Motion-safe, Dark-Mode-Elevation, i18n-Fallback der neuen Inhalte.

### 🟡 Phase B — braucht dich (Geld/Konto/Entscheidung; parallel anstoßbar)
- **Name/Branding festnageln** (aktuell 4 Namen: Ordner `UrlaubsCoach`, Paket `urlaubscoach`, Repo `UrlaubsFinder`, github.io) → blockt Domain & Store.
- **Eigene Domain (~10 €/Jahr)** → entfernt den Unterpfad, entblockt den Store.
- **Play Console (25 $ einmalig)** + Identitätsprüfung + Datenschutz-URL + Data-Safety + Content-Rating + Store-Assets (512-Icon, 1024×500-Grafik, ≥2 Screenshots).
- **Closed Testing: 20 Tester / 14 Tage** (Pflicht für neue Privatkonten) → früh Tester organisieren.
- **Monetarisierung entscheiden** (frei vs. Abo) → steuert, ob die LLM-Stufe kommt.

### ⚪ Bewusst später
Skalierung 200–300 Orte (nach Nachfrage-Signal) · echte LLM-Schicht (BYOK) · große Hotlink-Galerien / YouTube-Auto-Embeds · Store-Einreichung (nach Domain + grüner PWA).

---

## Was heute ohne dich starten kann
**Phase A komplett** — das ist ein vollständiges, ehrliches, kostenloses v2 mit den 42 Orten:
echte Bilder, next-gen Design, agentischer Gratis-Chat, PWA-installierbar, echtes Test-Gate.
Der **einzige Tag-1-Entscheid, den nur du treffen kannst, ist der Name/Domain** — und den brauchst
du erst für den Store, nicht für den Bau.
