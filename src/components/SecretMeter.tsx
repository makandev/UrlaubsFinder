"use client";

export function SecretMeter({ score, label }: { score: number; label: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-inkfaint">{label}</span>
        <span className="font-semibold tabular-nums text-teal">{score}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full bg-teal transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
