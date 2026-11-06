"use client";

import { useMemo, useReducer } from "react";
import { initialLeads, initialPipelines } from "@/mocks/leads.mock";
import type { Lead, Pipeline } from "../types/leads";

type State = { pipelines: Pipeline[]; leads: Lead[] };

type Action =
  | { type: "save-lead"; lead: Lead }
  | { type: "delete-lead"; id: string }
  | { type: "reorder-lead"; id: string; beforeId: string | null }
  | { type: "add-pipeline"; pipeline: Pipeline };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "save-lead": {
      const exists = state.leads.some((lead) => lead.id === action.lead.id);
      return {
        ...state,
        leads: exists
          ? state.leads.map((lead) =>
              lead.id === action.lead.id ? action.lead : lead,
            )
          : [action.lead, ...state.leads],
      };
    }
    case "delete-lead":
      return {
        ...state,
        leads: state.leads.filter((lead) => lead.id !== action.id),
      };
    case "reorder-lead": {
      const moving = state.leads.find((lead) => lead.id === action.id);
      if (!moving) return state;
      const rest = state.leads.filter((lead) => lead.id !== action.id);
      const index = action.beforeId
        ? rest.findIndex((lead) => lead.id === action.beforeId)
        : -1;
      // Without a valid anchor the lead goes after its stage mates, i.e. last among its stage.
      const target =
        index >= 0
          ? index
          : rest.reduce(
              (last, lead, at) =>
                lead.pipelineId === moving.pipelineId &&
                lead.stageId === moving.stageId
                  ? at + 1
                  : last,
              rest.length,
            );
      return {
        ...state,
        leads: [...rest.slice(0, target), moving, ...rest.slice(target)],
      };
    }
    case "add-pipeline":
      return { ...state, pipelines: [...state.pipelines, action.pipeline] };
  }
}

/**
 * Local, in-memory leads store seeded from mocks; reload restores the seed.
 * Replace with TanStack Query hooks once the leads API exists.
 */
export function useLeads() {
  const [state, dispatch] = useReducer(reducer, {
    pipelines: initialPipelines,
    leads: initialLeads,
  });

  // `dispatch` is stable, so the actions keep their identity across renders.
  const actions = useMemo(
    () => ({
      saveLead: (lead: Lead) => dispatch({ type: "save-lead", lead }),
      deleteLead: (id: string) => dispatch({ type: "delete-lead", id }),
      reorderLead: (id: string, beforeId: string | null) =>
        dispatch({ type: "reorder-lead", id, beforeId }),
      addPipeline: (pipeline: Pipeline) =>
        dispatch({ type: "add-pipeline", pipeline }),
    }),
    [],
  );

  return { pipelines: state.pipelines, leads: state.leads, ...actions };
}
