import type { Lead, LeadPriority, LeadSource, Pipeline } from "../types/leads";

export const leadSources: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  event: "Event",
  outbound: "Outbound",
  partner: "Partner",
};

export const leadPriorities: Record<LeadPriority, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const compactCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export const formatCurrency = (value: number) => currency.format(value);
export const formatCompactCurrency = (value: number) =>
  compactCurrency.format(value);
export const formatDate = (date: string) =>
  dateFormat.format(new Date(date.length === 10 ? `${date}T00:00:00Z` : date));
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Whole days since the lead entered its current stage; `null` until `today` is known. */
export function daysInStage(lead: Lead, today: string) {
  const entered = lead.history.at(-1)?.at;
  if (!entered || !today) return null;
  const diff = Date.parse(`${today}T00:00:00Z`) - Date.parse(entered.slice(0, 10) + "T00:00:00Z");
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export type LeadFilters = {
  query: string;
  owner: string | null;
  priority: string | null;
};

export function selectLeads(leads: Lead[], pipelineId: string, filters: LeadFilters) {
  const search = filters.query.trim().toLocaleLowerCase();
  return leads.filter(
    (lead) =>
      lead.pipelineId === pipelineId &&
      (!filters.owner || lead.owner === filters.owner) &&
      (!filters.priority || lead.priority === filters.priority) &&
      [lead.name, lead.company, lead.email].some((value) =>
        value.toLocaleLowerCase().includes(search),
      ),
  );
}

export function summarizePipeline(pipeline: Pipeline, leads: Lead[]) {
  const kindOf = new Map(pipeline.stages.map((stage) => [stage.id, stage]));
  let openValue = 0;
  let weighted = 0;
  let wonValue = 0;
  let open = 0;
  let won = 0;
  let lost = 0;
  for (const lead of leads) {
    const stage = kindOf.get(lead.stageId);
    if (!stage) continue;
    if (stage.kind === "open") {
      open += 1;
      openValue += lead.value;
      weighted += (lead.value * stage.probability) / 100;
    } else if (stage.kind === "won") {
      won += 1;
      wonValue += lead.value;
    } else lost += 1;
  }
  const closed = won + lost;
  return {
    open,
    openValue,
    weighted,
    won,
    wonValue,
    lost,
    winRate: closed ? Math.round((won / closed) * 100) : null,
  };
}

/** Lead count and value per stage, in pipeline order. */
export function stageTotals(pipeline: Pipeline, leads: Lead[]) {
  return pipeline.stages.map((stage) => {
    const inStage = leads.filter((lead) => lead.stageId === stage.id);
    return {
      stage,
      count: inStage.length,
      value: inStage.reduce((sum, lead) => sum + lead.value, 0),
    };
  });
}
