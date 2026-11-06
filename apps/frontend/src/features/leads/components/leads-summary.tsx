import { CircleDollarSignIcon, ScaleIcon, TrophyIcon, UsersRoundIcon } from "lucide-react";
import type { Lead, Pipeline } from "../types/leads";
import { formatCompactCurrency, summarizePipeline } from "../utils/leads";

export function LeadsSummary({ pipeline, leads }: { pipeline: Pipeline; leads: Lead[] }) {
  const summary = summarizePipeline(pipeline, leads);
  const won = pipeline.stages.find((stage) => stage.kind === "won")?.name ?? "Won";
  const stats = [
    {
      label: "Lead aktif",
      value: String(summary.open),
      hint: `${formatCompactCurrency(summary.openValue)} di pipeline`,
      icon: UsersRoundIcon,
    },
    {
      label: "Forecast tertimbang",
      value: formatCompactCurrency(summary.weighted),
      hint: "Nilai × peluang tahap",
      icon: ScaleIcon,
    },
    {
      label: won,
      value: formatCompactCurrency(summary.wonValue),
      hint: `${summary.won} lead ditutup menang`,
      icon: CircleDollarSignIcon,
    },
    {
      label: "Win rate",
      value: summary.winRate === null ? "—" : `${summary.winRate}%`,
      hint: `${summary.won} menang · ${summary.lost} kalah`,
      icon: TrophyIcon,
    },
  ];

  return (
    <section
      aria-label={`Ringkasan pipeline ${pipeline.name}`}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4"
    >
      {stats.map(({ label, value, hint, icon: Icon }) => (
        <div key={label} className="flex flex-col gap-2 bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <Icon className="size-4 shrink-0 text-muted-foreground" />
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      ))}
    </section>
  );
}
