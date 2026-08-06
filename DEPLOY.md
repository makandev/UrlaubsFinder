# Deployment — Fernweh Atlas

Die App ist eine **statisch exportierte** Next.js-Seite, die über **GitHub Pages** ausgeliefert wird.

- **Live-URL:** https://makandev.github.io/UrlaubsFinder/
- **Workflow:** `.github/workflows/deploy-pages.yml` (Name „Deploy to GitHub Pages")
- **CI-Build-Check:** `.github/workflows/ci.yml` (nur `next build`, kein Deploy)

## Wie es funktioniert (branch-basiert)

1. Push auf `main` (oder manuell „Run workflow") startet den Deploy-Workflow.
2. Der Workflow baut die Seite mit `GITHUB_PAGES=true` → statischer Export nach `out/`
   (mit `basePath` = `/UrlaubsFinder`, weil Pages unter diesem Unterpfad ausliefert).
3. `peaceiris/actions-gh-pages` schreibt den Inhalt von `out/` in den **`gh-pages`-Branch**
   (inkl. automatischer `.nojekyll`, nötig für den `_next`-Ordner).
4. GitHub Pages liefert die Seite aus dem `gh-pages`-Branch aus.

## Einmalige Einstellung (GitHub UI)

Repo → **Settings → Pages → Build and deployment → Source**:
**„Deploy from a branch"** · Branch **`gh-pages`** · Ordner **`/ (root)`** → **Save**.

> Danach nie wieder nötig — jeder Push aktualisiert den `gh-pages`-Branch automatisch.

## Warum branch-basiert (nicht die Actions-Artefakt-Variante)

Der ursprüngliche Weg (`actions/upload-pages-artifact` + `actions/deploy-pages`) hing wiederholt
in `deployment_queued` und lief nach 10 Min in einen Timeout (mehrere Läufe, Ursache: verklemmte
Pages-Deployment-Pipeline nach schnell abgebrochenen Läufen). Der branch-basierte Weg umgeht diese
Pipeline komplett und ist robust.

## Fehlersuche

- **Ich sehe eine alte Version:** Browser-Cache → im privaten/Inkognito-Tab öffnen. Oder Pages-Source
  steht noch nicht auf `gh-pages` (siehe oben).
- **Deploy „failure":** Zuerst prüfen, ob der **Build**-Schritt grün war (dann ist der Code okay).
  Läuft der Build grün, ist es ein Pages-Infrastrukturproblem.
- **Nach Rename/Move:** Die Origin ist `makandev.github.io`; Projekt-Pages liegen immer unter
  `/<repo>/` → daher der `basePath`.

## Später: eigene Domain

Mit eigener Domain entfällt der Unterpfad: `basePath` in `next.config.mjs` auf `""` setzen (bzw.
`GITHUB_PAGES`-Logik anpassen), `CNAME` ins `out/`/Repo legen, DNS setzen, Pages-Custom-Domain +
HTTPS aktivieren. Das ist auch die Voraussetzung für den Play-Store-Weg (TWA/Digital Asset Links).
