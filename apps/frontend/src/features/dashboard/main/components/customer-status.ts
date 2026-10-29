import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleMinusIcon,
  CirclePauseIcon,
  Clock3Icon,
  HourglassIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "@/features/dashboard/types/dashboard";
import type { DashboardCustomer } from "@/mocks/dashboard-main.mock";

type StatusStyle = { tone: StatusTone; icon: LucideIcon };

export const billingStyles: Record<DashboardCustomer["billing"], StatusStyle> = {
  Paid: { tone: "success", icon: CircleCheckIcon },
  Pending: { tone: "warning", icon: HourglassIcon },
  Overdue: { tone: "danger", icon: CircleAlertIcon },
  Trial: { tone: "info", icon: Clock3Icon },
};

export const accountStyles: Record<DashboardCustomer["status"], StatusStyle> = {
  Subscribed: { tone: "success", icon: CircleCheckIcon },
  Inactive: { tone: "neutral", icon: CirclePauseIcon },
  Unsubscribed: { tone: "neutral", icon: CircleMinusIcon },
};
