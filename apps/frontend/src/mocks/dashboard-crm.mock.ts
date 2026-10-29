// Data contoh untuk dashboard CRM; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/crm/types/dashboard";

export const crmMetrics = [
  {
    label: "Pipeline value",
    value: "$284,500",
    delta: { value: "+12%", direction: "up", sentiment: "good" },
    context: "vs $254,200 last month",
  },
  {
    label: "Qualified lead rate",
    value: "28.4%",
    delta: { value: "-2.5 pts", direction: "down", sentiment: "bad" },
    context: "vs 30.9% last month",
  },
  {
    label: "Open opportunities",
    value: "42",
    delta: { value: "+7", direction: "up", sentiment: "good" },
    context: "vs 35 last month",
  },
  {
    label: "Lead-to-deal rate",
    value: "18.1%",
    delta: { value: "+1.6 pts", direction: "up", sentiment: "good" },
    context: "vs 16.5% last month",
  },
] as const satisfies readonly KpiItem[];

export const crmLeadFlow = [
  { month: "Nov", qualified: 34, booked: 12 },
  { month: "Dec", qualified: 36, booked: 13 },
  { month: "Jan", qualified: 38, booked: 13 },
  { month: "Feb", qualified: 40, booked: 14 },
  { month: "Mar", qualified: 39, booked: 14 },
  { month: "Apr", qualified: 42, booked: 14 },
  { month: "May", qualified: 45, booked: 15 },
  { month: "Jun", qualified: 47, booked: 16 },
  { month: "Jul", qualified: 44, booked: 17 },
  { month: "Aug", qualified: 48, booked: 18 },
  { month: "Sep", qualified: 52, booked: 19 },
  { month: "Oct", qualified: 58, booked: 19 },
];

export const crmMeetings = [
  { time: "09:00", minutes: 15, title: "Sales team check-in", account: "Internal", kind: "internal" },
  { time: "10:00", minutes: 30, title: "Discovery call", account: "BlueHaven Systems", kind: "call" },
  { time: "13:30", minutes: 45, title: "Product demo", account: "Weblabs Studio", kind: "video" },
  { time: "15:00", minutes: 30, title: "Proposal review", account: "Everline Freight", kind: "video" },
] as const;

export const crmProposalGoal = { sent: 12, target: 18 } as const;

export const crmStages = [
  "Qualified",
  "Discovery",
  "Proposal Sent",
  "Negotiation",
] as const;
export const crmHealth = [
  "On Track",
  "On Hold",
  "At Risk",
  "Needs Review",
] as const;

export type CrmOpportunity = {
  id: string;
  account: string;
  stage: (typeof crmStages)[number];
  priority: 1 | 2 | 3;
  health: (typeof crmHealth)[number];
  value: number;
};

export const crmOpportunities: CrmOpportunity[] = [
  {
    id: "OP-1842",
    account: "Asteron Bioworks",
    stage: "Proposal Sent",
    priority: 1,
    health: "On Track",
    value: 42000,
  },
  {
    id: "OP-1841",
    account: "BlueHaven Systems",
    stage: "Discovery",
    priority: 1,
    health: "On Hold",
    value: 18500,
  },
  {
    id: "OP-1840",
    account: "Cinder Health",
    stage: "Negotiation",
    priority: 1,
    health: "At Risk",
    value: 63000,
  },
  {
    id: "OP-1839",
    account: "Drift Manufacturing",
    stage: "Qualified",
    priority: 1,
    health: "At Risk",
    value: 26400,
  },
  {
    id: "OP-1838",
    account: "Everline Freight",
    stage: "Proposal Sent",
    priority: 1,
    health: "Needs Review",
    value: 58900,
  },
  {
    id: "OP-1837",
    account: "Fieldstone Capital",
    stage: "Discovery",
    priority: 1,
    health: "On Track",
    value: 31200,
  },
  {
    id: "OP-1836",
    account: "Granite Studios",
    stage: "Negotiation",
    priority: 1,
    health: "On Track",
    value: 15600,
  },
  {
    id: "OP-1835",
    account: "Halcyon Dynamics",
    stage: "Qualified",
    priority: 1,
    health: "On Hold",
    value: 47900,
  },
  {
    id: "OP-1834",
    account: "Ironcrest Ventures",
    stage: "Proposal Sent",
    priority: 1,
    health: "At Risk",
    value: 52400,
  },
  {
    id: "OP-1833",
    account: "Juniper Infrastructure",
    stage: "Discovery",
    priority: 1,
    health: "At Risk",
    value: 22800,
  },
  {
    id: "OP-1832",
    account: "Keystone Labs",
    stage: "Qualified",
    priority: 2,
    health: "On Track",
    value: 19800,
  },
  {
    id: "OP-1831",
    account: "Lumen Retail",
    stage: "Proposal Sent",
    priority: 2,
    health: "Needs Review",
    value: 36700,
  },
  {
    id: "OP-1830",
    account: "Meridian Works",
    stage: "Discovery",
    priority: 2,
    health: "On Hold",
    value: 24100,
  },
  {
    id: "OP-1829",
    account: "Northstar Energy",
    stage: "Negotiation",
    priority: 2,
    health: "On Track",
    value: 71400,
  },
  {
    id: "OP-1828",
    account: "Orion Digital",
    stage: "Qualified",
    priority: 2,
    health: "At Risk",
    value: 12900,
  },
  {
    id: "OP-1827",
    account: "Pioneer Foods",
    stage: "Discovery",
    priority: 3,
    health: "On Track",
    value: 17400,
  },
  {
    id: "OP-1826",
    account: "Quarry Analytics",
    stage: "Proposal Sent",
    priority: 3,
    health: "On Hold",
    value: 33900,
  },
  {
    id: "OP-1825",
    account: "Ridgeway Media",
    stage: "Negotiation",
    priority: 3,
    health: "On Track",
    value: 45800,
  },
  {
    id: "OP-1824",
    account: "Solstice Partners",
    stage: "Qualified",
    priority: 3,
    health: "Needs Review",
    value: 28600,
  },
  {
    id: "OP-1823",
    account: "Tandem Mobility",
    stage: "Discovery",
    priority: 3,
    health: "At Risk",
    value: 21400,
  },
];
