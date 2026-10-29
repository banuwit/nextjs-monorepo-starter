import {
  CircleAlertIcon,
  CircleCheckIcon,
  CirclePauseIcon,
  EyeIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type { CrmOpportunity } from "@/mocks/dashboard-crm.mock";

export const healthStyles: Record<CrmOpportunity["health"], { tone: StatusTone; icon: LucideIcon }> = {
  "On Track": { tone: "success", icon: CircleCheckIcon },
  "Needs Review": { tone: "warning", icon: EyeIcon },
  "On Hold": { tone: "neutral", icon: CirclePauseIcon },
  "At Risk": { tone: "danger", icon: CircleAlertIcon },
};

export const priorityLabels: Record<CrmOpportunity["priority"], string> = {
  1: "High",
  2: "Medium",
  3: "Low",
};
