/** Mock data for the Sankey chart variants. Nodes list sources first. */

export const leadSourceFunnel = {
  nodes: [
    { name: "Website" },
    { name: "Events" },
    { name: "Partners" },
    { name: "Outbound" },
    { name: "Leads" },
    { name: "Qualified" },
    { name: "Disqualified" },
    { name: "Won" },
    { name: "Lost" },
  ],
  links: [
    { source: 0, target: 4, value: 540 },
    { source: 1, target: 4, value: 260 },
    { source: 2, target: 4, value: 310 },
    { source: 3, target: 4, value: 190 },
    { source: 4, target: 5, value: 780 },
    { source: 4, target: 6, value: 520 },
    { source: 5, target: 7, value: 340 },
    { source: 5, target: 8, value: 440 },
  ],
};

export const customerJourney = {
  nodes: [
    { name: "Search" },
    { name: "Social" },
    { name: "Email" },
    { name: "Landing" },
    { name: "Product" },
    { name: "Bounced" },
    { name: "Cart" },
    { name: "Browsed" },
    { name: "Purchased" },
    { name: "Abandoned" },
  ],
  links: [
    { source: 0, target: 3, value: 520 },
    { source: 1, target: 3, value: 310 },
    { source: 2, target: 4, value: 180 },
    { source: 3, target: 4, value: 560 },
    { source: 3, target: 5, value: 270 },
    { source: 4, target: 6, value: 410 },
    { source: 4, target: 7, value: 330 },
    { source: 6, target: 8, value: 260 },
    { source: 6, target: 9, value: 150 },
  ],
};

export const budgetAllocation = {
  nodes: [
    { name: "Revenue" },
    { name: "Funding" },
    { name: "Budget" },
    { name: "Engineering" },
    { name: "Marketing" },
    { name: "Operations" },
    { name: "Salaries" },
    { name: "Cloud" },
    { name: "Ads" },
    { name: "Events" },
    { name: "Office" },
  ],
  links: [
    { source: 0, target: 2, value: 900 },
    { source: 1, target: 2, value: 400 },
    { source: 2, target: 3, value: 650 },
    { source: 2, target: 4, value: 380 },
    { source: 2, target: 5, value: 270 },
    { source: 3, target: 6, value: 480 },
    { source: 3, target: 7, value: 170 },
    { source: 4, target: 8, value: 260 },
    { source: 4, target: 9, value: 120 },
    { source: 5, target: 6, value: 150 },
    { source: 5, target: 10, value: 120 },
  ],
};

/** Ordered by priority: with `sort={false}` nodes keep this order. */
export const ticketRouting = {
  nodes: [
    { name: "Email" },
    { name: "Chat" },
    { name: "Phone" },
    { name: "Tier 1" },
    { name: "Tier 2" },
    { name: "Resolved" },
    { name: "Escalated" },
  ],
  links: [
    { source: 0, target: 3, value: 420 },
    { source: 1, target: 3, value: 380 },
    { source: 1, target: 4, value: 60 },
    { source: 2, target: 4, value: 160 },
    { source: 3, target: 5, value: 680 },
    { source: 3, target: 6, value: 120 },
    { source: 4, target: 5, value: 150 },
    { source: 4, target: 6, value: 70 },
  ],
};

export const regionPlans = {
  nodes: [
    { name: "Americas" },
    { name: "Europe" },
    { name: "Asia Pacific" },
    { name: "Starter" },
    { name: "Pro" },
    { name: "Enterprise" },
  ],
  links: [
    { source: 0, target: 3, value: 120 },
    { source: 0, target: 4, value: 210 },
    { source: 0, target: 5, value: 90 },
    { source: 1, target: 3, value: 140 },
    { source: 1, target: 4, value: 160 },
    { source: 1, target: 5, value: 60 },
    { source: 2, target: 3, value: 180 },
    { source: 2, target: 4, value: 90 },
    { source: 2, target: 5, value: 30 },
  ],
};
