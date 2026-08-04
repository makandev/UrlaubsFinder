# UrlaubsCoach — Konzept

**Stand:** 4. August 2026 · Entwurf v0.2
**Was das ist:** Der A-bis-Z-Plan für deinen persönlichen Reise-Coach. Kein fertiger Plan — ein Entwurf zum Draufreagieren. Für jeden Block gibt es einen Vorschlag; du sagst nur „passt" oder „ändern".

---

## Die Idee in einem Satz

Ein **persönlicher Reise-Coach als Web-App**, der dich Schritt für Schritt zu deinem perfekten Urlaubsort führt, aus jeder deiner Reaktionen lernt, beliebig tief ins Detail geht, fertige Vorschläge im Dashboard speichert — und mit der Zeit zu einem „Reise-Wikipedia" für jedes Land und jede Stadt wächst.

## Der rote Faden: alles flexibel

Dein wichtigster Wunsch, der sich durch das ganze Konzept zieht: **nichts ist in Stein gemeißelt.** Ton, Funktionen, Detailtiefe, wie oft der Coach sich meldet — überall drehst du an Reglern und schaltest um, statt dich einmal festzulegen.

---

## Deine getroffenen Entscheidungen

| Thema | Entscheidung |
|---|---|
| **Grundform** | Web-App (Browser, PC + Handy, später installierbar) |
| **Coach-Ton** | Jederzeit flexibel einstellbar |
| **Initiative** | Funktionen je nach Laune tauschbar |
| **Konto / Login** | ✅ Ja — Orte & Vorlieben auf jedem Gerät verfügbar |
| **Nutzer** | ✅ Von Anfang an für mehrere Nutzer geplant |
| **Sprache** | ✅ Deutsch + Englisch (umschaltbar) |

> Weil es **von Anfang an für mehrere Nutzer** gebaut wird und **Login** dazugehört, plane ich Konten, Datenschutz und Mehrsprachigkeit von der ersten Etappe an mit ein — das ist später kaum noch nachrüstbar, deshalb machen wir es gleich richtig.

---

## Die Route — 7 Bausteine (A–G)

### A · Die Grundform — wo dein Coach lebt
**Vorschlag:** Web-App im Browser, am PC *und* am Handy, ohne Installation. Später als „installierbare" App (Icon am Homescreen) erweiterbar, ohne alles neu zu bauen.
✓ *So gewählt.*

### B · Der Coach-Charakter — wie er mit dir redet
**Vorschlag:** Ein **Ton-Regler** von *ruhig-beratend* bis *anfeuernd-motivierend*, jederzeit verschiebbar. Dazu kleine Voreinstellungen: „Sanft", „Kumpel", „Trainer".
- **Ruhig:** erklärt geduldig, drängt nie.
- **Anfeuernd:** hält dich bei der Stange, gibt Antrieb.
- **Kurz-Modus:** für Tage, an denen du nur schnell etwas sehen willst.

⇄ *Umschaltbar — Ton in einer Sekunde geändert.*

### C · Dein Profil & das Lernen — was er sich über dich merkt
**Vorschlag:** Ein **Vorlieben-Profil**, das sich auf zwei Wegen füllt: (1) durch deine **👍/👎-Reaktionen** auf Vorschläge, (2) durch direktes Einstellen. Immer sichtbar, immer überschreibbar.

Woran er dich erkennt:
- **Budget** — Sparfuchs bis Luxus
- **Klima** — Sonne, Schnee, mild, egal
- **Stadt ↔ Natur** und **Action ↔ Ruhe**
- **Kultur, Essen, Nachtleben, Sport**
- **Anreise & Entfernung** — Nähe, Flug, Roadtrip
- **Menschenmengen** — Trubel oder Geheimtipp
- **Reisezeit & Dauer** — Wochenende bis Langzeit

⇄ *Umschaltbar — Profil auch mal ignorieren („überrasch mich").*

### D · Vorschläge & Tiefe — immer geht noch mehr
**Dein stärkster Wunsch:** so viele Details wie möglich — und wenn es schon viele gibt, noch mehr. Gelöst über **Tiefen-Ebenen** und einen Knopf, der nie „leer" wird:

1. **Ebene 1 — Überblick:** Ort, ein Bild, warum er zu dir passt, 3 Kernfakten
2. **Ebene 2 — Details:** Wetter, Kosten, Anreise, Highlights, Essen
3. **Ebene 3 — Tiefer:** Viertel, Tagesabläufe, Stimmung, beste Zeit
4. **Ebene 4 — Geheimtipps:** versteckte Ecken, lokale Insider
5. **∞ „Zeig mir noch mehr":** greift immer einen neuen Blickwinkel auf

Blickwinkel, aus denen „mehr" immer schöpfen kann: Wetter & Klima · Kosten im Detail · Anreise-Wege · Viertel & Ecken · Essen & Cafés · Events & Saison · Sicherheit · Foto-Spots · Tagesplan · Community-Stimmen · Ähnliche Orte nebenan · Geschichte.

⇄ *Umschaltbar — Schalter „knapp ↔ ausführlich" regelt, wie viel sofort erscheint.*

### E · Echte Daten — woher das Wissen kommt
**Vorschlag:** Eine Mischung. **Live-Daten** für Wetter und Attraktionen/Karten (offene Datendienste); **KI-Recherche** für Geheimtipps, Stimmung und die „warum passt das zu dir"-Texte. Jeder Fakt wird gekennzeichnet, damit du siehst, wie sicher er ist.
- **Wetter:** aktuelle Werte & beste Reisezeit
- **Attraktionen:** Orte, Sehenswürdigkeiten, Karten
- **Geheimtipps & Community:** KI-recherchiert, klar als „Recherche" markiert

◐ *Offen:* Manche Live-Dienste kosten ab einer gewissen Nutzung Geld. Wir starten mit kostenlosen und entscheiden später über Aufpreise.

### F · Das Dashboard — dein Zuhause & die gespeicherten Orte
**Vorschlag:** Eine **modulare Startseite aus Kacheln**, die du an-/ausschalten und umsortieren kannst: Coach-Chat, Entdecken, Geheimtipps, Wetter, Reise-Wiki, Merkliste. Du baust dir dein Cockpit selbst.
- **Merkliste:** gespeicherte Orte mit Status — *Wunsch · geplant · gewesen*
- **Vergleich:** mehrere Orte nebeneinander
- **Notizen & Tags:** eigene Gedanken zu jedem Ort
- **Karte:** alle Favoriten als Pins auf der Weltkarte

⇄ *Umschaltbar — Kacheln je nach Laune tauschen und neu anordnen (dein Wunsch).*

### G · Reise-Wiki & Community — wie ein Wikipedia für jeden Ort
**Vorschlag:** Jeder recherchierte Ort bekommt eine **eigene, dauerhafte Seite**. So wächst das Wiki mit deiner Nutzung. Community-Funktionen (Bewertungen, andere Reisende) kommen als eigene, spätere Etappe — passt gut, weil ohnehin für mehrere Nutzer geplant.

---

## Der Weg dahin — 3 Etappen

Wir bauen in Etappen, jede für sich schon nutzbar.

**Etappe 1 · Das Fundament**
Konten & Login, DE/EN-Umschaltung, Chat-Coach mit einstellbarem Ton (B), lernendes Vorlieben-Profil (C), Vorschläge mit Tiefen-Ebenen & „noch mehr" (D), Speichern im modularen Dashboard (F).

**Etappe 2 · Es wird echt**
Live-Wetter, echte Attraktionen & Karten, KI-recherchierte Geheimtipps (E).

**Etappe 3 · Das große Ganze**
Dauerhafte Länder-/Städteseiten, die mitwachsen (G), plus Community-Ebene mit Stimmen anderer Reisender.

---

## Noch offen — sag mir kurz Bescheid

1. **Passt die grobe Richtung?** Alle 7 Bausteine so okay — oder willst du bei einem etwas ganz anders?
2. **Dein Geschmack als Startpunkt:** Nenn mir 2–3 Orte, an denen du warst oder die dich reizen — dann startet der Coach nicht bei null.
3. **Später:** Welche Live-Datendienste (Wetter, Karten) — entscheiden wir in Etappe 2.

*Reagier einfach lose auf diese Punkte, dann lege ich mit Etappe 1 los.*
