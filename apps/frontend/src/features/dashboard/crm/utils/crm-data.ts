import { crmStages, type CrmOpportunity } from "@/mocks/dashboard-crm.mock";

export function summarizeCrmLeadFlow(
  points: readonly { qualified: number; booked: number }[],
) {
  const qualified = points.reduce((total, point) => total + point.qualified, 0);
  const booked = points.reduce((total, point) => total + point.booked, 0);
  return {
    qualified,
    booked,
    bookingRate: qualified ? Math.round((booked / qualified) * 100) : 0,
  };
}

export type CrmStageSummary = {
  stage: CrmOpportunity["stage"];
  count: number;
  value: number;
  atRisk: number;
};

/** Count, value, and at-risk deals per stage, in pipeline order. */
export function summarizeCrmStages(
  opportunities: readonly CrmOpportunity[],
): CrmStageSummary[] {
  return crmStages.map((stage) => {
    const rows = opportunities.filter((opportunity) => opportunity.stage === stage);
    return {
      stage,
      count: rows.length,
      value: rows.reduce((sum, row) => sum + row.value, 0),
      atRisk: rows.filter((row) => row.health === "At Risk").length,
    };
  });
}

export function opportunityValueError(value: number) {
  if (!Number.isFinite(value)) return "Enter a deal value.";
  if (value <= 0) return "Deal value must be greater than zero.";
  if (value > 10_000_000) return "Deal value must be $10,000,000 or less.";
  return null;
}
