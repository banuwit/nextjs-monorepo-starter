"use client";

/**
 * Recharts names links "Source - Target"; show it as "Source → Target".
 * Nodes keep their own name.
 */
export function SankeyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly { name?: unknown; value?: unknown }[];
}) {
  const entry = payload?.[0];
  if (!active || !entry) return null;

  return (
    <div className="grid min-w-32 gap-0.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <span className="font-medium">
        {String(entry.name ?? "").replace(" - ", " → ")}
      </span>
      <span className="text-muted-foreground tabular-nums">
        {Number(entry.value ?? 0).toLocaleString("en-US")}
      </span>
    </div>
  );
}
