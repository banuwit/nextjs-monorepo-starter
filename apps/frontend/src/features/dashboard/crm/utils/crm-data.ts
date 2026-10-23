import type { CrmOpportunity } from "@/mocks/dashboard-crm.mock";

export function filterCrmOpportunities(
  opportunities: CrmOpportunity[],
  filters: { query: string; stage: string; health: string },
): CrmOpportunity[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return opportunities.filter(
    (opportunity) =>
      (!query ||
        `${opportunity.id} ${opportunity.account}`
          .toLocaleLowerCase()
          .includes(query)) &&
      (filters.stage === "all" || opportunity.stage === filters.stage) &&
      (filters.health === "all" || opportunity.health === filters.health),
  );
}

export function summarizeCrmLeadFlow(
  points: { qualified: number; booked: number }[],
) {
  const qualified = points.reduce((total, point) => total + point.qualified, 0);
  const booked = points.reduce((total, point) => total + point.booked, 0);
  return {
    qualified,
    booked,
    bookingRate: qualified ? Math.round((booked / qualified) * 100) : 0,
  };
}
