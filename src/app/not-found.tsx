import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span aria-hidden className="text-5xl">🧭</span>
      <h1 className="text-2xl font-extrabold tracking-tight">Verlaufen?</h1>
      <p className="max-w-sm text-inksoft">
        Diese Seite gibt es nicht. Aber es warten über 40 Orte in Europa auf dich.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Zum Entdecken →
      </Link>
    </div>
  );
}
