"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function LegalPage() {
  const { locale } = useI18n();
  const de = locale === "de";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-2 text-sm leading-relaxed">
      <h1 className="text-2xl font-extrabold tracking-tight">
        {de ? "Rechtliches & Quellen" : "Legal & sources"}
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold">{de ? "Impressum" : "Imprint"}</h2>
        <p className="rounded-lg border border-dashed border-line bg-surface2 p-3 text-inksoft">
          {de
            ? "Vor dem Live-Gang ausfüllen: [Vor- und Nachname], [Straße & Nr.], [PLZ Ort], [E-Mail]. In Deutschland ist ein Impressum mit ladungsfähiger Anschrift Pflicht (§ 5 DDG)."
            : "Fill in before going live: [Full name], [Street & no.], [Postcode City], [Email]. In Germany an imprint with a serviceable address is mandatory."}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold">{de ? "Datenschutz" : "Privacy"}</h2>
        <p className="text-inksoft">
          {de
            ? "Diese frühe Version speichert deine Vorlieben und Merkliste ausschließlich lokal in deinem Browser (localStorage) — nichts wird an einen Server gesendet. Es werden keine Konten angelegt und kein Tracking eingesetzt. Sobald echte Konten oder KI-Anbindung dazukommen, folgt eine vollständige Datenschutzerklärung inkl. Auftragsverarbeitung."
            : "This early version stores your preferences and saved list only locally in your browser (localStorage) — nothing is sent to a server. No accounts, no tracking. A full privacy policy will follow once real accounts or AI are added."}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold">{de ? "Datenquellen & Lizenzen" : "Data sources & licences"}</h2>
        <ul className="flex flex-col gap-1.5 text-inksoft">
          <li>• {de ? "Wetter" : "Weather"}: Open-Meteo (CC BY 4.0)</li>
          <li>• {de ? "Kartendaten & Orte" : "Map data & places"}: © OpenStreetMap-{de ? "Mitwirkende" : "contributors"} (ODbL)</li>
          <li>• {de ? "Ortsfakten" : "Place facts"}: Wikidata (CC0), Wikivoyage/Wikipedia (CC BY-SA)</li>
          <li>• {de ? "Geheimtipp-Grad & Beschreibungen sind eigene Berechnungen bzw. eigene Texte." : "Hidden-gem score & descriptions are our own computations / own texts."}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold">{de ? "Werbe- & Affiliate-Hinweis" : "Advertising & affiliate notice"}</h2>
        <p className="text-inksoft">
          {de
            ? "Sobald Preis- und Buchungslinks integriert sind, handelt es sich um Affiliate-Links: Wenn du darüber buchst, erhalten wir ggf. eine Provision — für dich ohne Mehrkosten. Solche Links werden klar als Werbung gekennzeichnet."
            : "Once price and booking links are added, they are affiliate links: if you book through them we may earn a commission — at no extra cost to you. Such links are clearly marked as advertising."}
        </p>
      </section>
    </div>
  );
}
