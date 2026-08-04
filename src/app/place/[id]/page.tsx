import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { PlaceDetail } from "@/components/PlaceDetail";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const d = destinations.find((x) => x.id === params.id);
  if (!d) return {};
  const title = `${d.name}, ${d.country} — Geheimtipp | ${SITE_NAME}`;
  const url = `${SITE_URL}/place/${d.id}`;
  return {
    title,
    description: d.desc.de,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: d.desc.de,
      url,
      siteName: SITE_NAME,
      type: "article",
    },
  };
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const d = destinations.find((x) => x.id === params.id);
  if (!d) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.desc.de,
    address: { "@type": "PostalAddress", addressCountry: d.country },
    geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
    url: `${SITE_URL}/place/${d.id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaceDetail id={params.id} />
    </>
  );
}
