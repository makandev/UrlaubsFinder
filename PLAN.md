# Autonomer Bau-Fahrplan

Autonomer Nacht-Lauf. Nach jedem Meilenstein wird committet & gepusht.
Entscheidungen des Nutzers: Insider-Chat = Mock jetzt/KI-bereit · Konto = vorerst lokal · Umfang = alles (M1–M13).

Legende: ⬜ offen · 🔄 in Arbeit · ✅ fertig

- ✅ **M1** — Datensatz ausbauen: 42 europäische Ziele (Geheimtipp-Fokus, alle Regionen)
- ✅ **M2** — Live-Wetter (Open-Meteo, client-seitig, ohne Schlüssel) auf Ortsseiten, mit Fallback
- ✅ **M3** — Zwei Modi: Ruhig ↔ Profi (Score-Breakdown auf Karten), im Header umschaltbar · browsergetestet
- ✅ **M4** — Implizites Lernen: Speichern zieht Profil hin, „Nichts für mich" weg; Panel zieht nach (Explore-Quote folgt in M5)
- ✅ **M5** — „Nie leer"-Motor: Perspektiven-Engine (7 Blickwinkel aus Daten) + „Überrasch mich" (Explore) · browsergetestet
- ✅ **M6** — Europa-Karte (projizierte Pins, Größe = Geheimtipp-Grad) + Vergleichstabelle in der Merkliste · browsergetestet
- ✅ **M7** — Teilbare Bildkarte (Canvas 1080×1350 → PNG-Download, Vorschau-Modal) · browsergetestet, Profi-Optik
- ✅ **M8** — Onboarding (3 Fragen → Vorlieben) + Coach-Panel „Weg zum Urlaub" (Stepper + nächster Schritt) · browsergetestet
- ✅ **M9** — SEO: sitemap.xml, robots.txt, Open-Graph + JSON-LD (TouristDestination), server-gerenderter Inhalt · verifiziert
- ✅ **M10** — Insider-Chat: interaktive Oberfläche + regelbasierte Engine (gegroundet auf Ortsdaten), `askInsider()` KI-bereit · browsergetestet
- ⬜ **M11** — Recht-Minimum: Impressum/Datenschutz/Attribution/Affiliate-Hinweis (Platzhalter)
- ⬜ **M12** — Konto: lokal-first bleibt; Export/Import + saubere Abstraktion für späteres Backend
- ⬜ **M13** — Politur, Barrierefreiheit, Tests, Build-Check

## Fortschritts-Log
- (Start) Fahrplan angelegt.
