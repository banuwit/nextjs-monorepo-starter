"use client";

import { useState } from "react";

import { crmOpportunities, type CrmOpportunity } from "@/mocks/dashboard-crm.mock";

import { summarizeCrmStages } from "../utils/crm-data";
import { CrmOpportunities } from "./crm-opportunities";
import { CrmPipelineStages } from "./crm-pipeline-stages";

/** Owns deal state so stage totals update as soon as a deal is edited. */
export function CrmPipeline() {
  const [opportunities, setOpportunities] = useState<CrmOpportunity[]>(crmOpportunities);
  const [stage, setStage] = useState<CrmOpportunity["stage"] | null>(null);

  return (
    <>
      <CrmPipelineStages
        stages={summarizeCrmStages(opportunities)}
        selected={stage}
        onSelect={setStage}
      />
      <CrmOpportunities
        opportunities={opportunities}
        stage={stage}
        onSave={(next) =>
          setOpportunities((current) =>
            current.map((opportunity) => (opportunity.id === next.id ? next : opportunity)),
          )
        }
      />
    </>
  );
}
