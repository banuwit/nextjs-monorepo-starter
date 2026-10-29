import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { formatLongDate } from "@/features/dashboard/utils/format";
import { profile } from "@/mocks/profile.mock";

import { greetingFor } from "../utils/productivity";
import { ProductivityCalendar } from "./productivity-calendar";
import { ProductivityNotes } from "./productivity-notes";
import { ProductivityProjects } from "./productivity-projects";
import { ProductivityWorkspace } from "./productivity-workspace";

export function ProductivityDashboardPage({ today, hour }: { today: string; hour: number }) {
  const firstName = profile.name.split(" ")[0];
  return (
    <AppBody>
      <PageHeading
        title={`${greetingFor(hour)}, ${firstName}`}
        currentPage="Productivity"
        description={formatLongDate(today)}
      />
      <ProductivityWorkspace
        main={
          <>
            <ProductivityProjects today={today} />
            <ProductivityNotes />
          </>
        }
        aside={<ProductivityCalendar today={today} />}
      />
    </AppBody>
  );
}
