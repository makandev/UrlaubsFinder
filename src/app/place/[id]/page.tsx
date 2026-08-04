import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";
import { PlaceDetail } from "@/components/PlaceDetail";

export function generateStaticParams() {
  return destinations.map((d) => ({ id: d.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const d = destinations.find((x) => x.id === params.id);
  if (!d) return {};
  return {
    title: `${d.name}, ${d.country} — UrlaubsCoach`,
    description: d.desc.de,
  };
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const d = destinations.find((x) => x.id === params.id);
  if (!d) notFound();
  return <PlaceDetail id={params.id} />;
}
