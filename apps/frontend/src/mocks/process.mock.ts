import type { Graph } from "../features/process/types/process";

export const stepOwners = ["Ines Marchetti", "Tomas Lindqvist", "Hanna Berg"];

export const initialProcess: Graph = {
  nodes: [
    {
      id: "trigger",
      type: "step",
      position: { x: 0, y: 160 },
      data: {
        title: "Form submitted",
        detail: "Webhook: demo.request",
        category: "trigger",
        owner: "Ines Marchetti",
        status: "Success",
        duration: "0.2s",
        icon: "webhook",
      },
    },
    {
      id: "filter",
      type: "step",
      position: { x: 300, y: 160 },
      data: {
        title: "Plan is Enterprise",
        detail: "company.size > 200",
        category: "condition",
        owner: "Ines Marchetti",
        status: "Success",
        duration: "0.1s",
        icon: "branch",
      },
    },
    {
      id: "enrich",
      type: "step",
      position: { x: 600, y: 40 },
      data: {
        title: "Enrich company",
        detail: "Clearbit lookup",
        category: "action",
        owner: "Tomas Lindqvist",
        status: "Failed",
        duration: "8.0s",
        icon: "search",
      },
    },
    {
      id: "notify",
      type: "step",
      position: { x: 600, y: 280 },
      data: {
        title: "Notify sales",
        detail: "Slack #inbound-leads",
        category: "action",
        owner: "Hanna Berg",
        status: "Skipped",
        duration: "Not run",
        icon: "message",
      },
    },
    {
      id: "deal",
      type: "step",
      position: { x: 900, y: 40 },
      data: {
        title: "Create deal",
        detail: "HubSpot pipeline: Inbound",
        category: "action",
        owner: "Tomas Lindqvist",
        status: "Idle",
        duration: "Not run",
        icon: "deal",
      },
    },
  ],
  edges: [
    {
      id: "trigger-filter",
      source: "trigger",
      target: "filter",
      type: "smoothstep",
    },
    {
      id: "filter-enrich",
      source: "filter",
      sourceHandle: "yes",
      target: "enrich",
      label: "Yes",
      type: "smoothstep",
    },
    {
      id: "filter-notify",
      source: "filter",
      sourceHandle: "no",
      target: "notify",
      label: "No",
      type: "smoothstep",
    },
    { id: "enrich-deal", source: "enrich", target: "deal", type: "smoothstep" },
  ],
};
