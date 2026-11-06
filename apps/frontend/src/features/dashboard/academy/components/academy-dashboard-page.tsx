import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { academyMetrics } from "@/mocks/dashboard-academy.mock";

import { formatLongDate } from "../utils/format";
import { AcademyCohortSchedule } from "./academy-cohort-schedule";
import { AcademyCompletionFunnel } from "./academy-completion-funnel";
import { AcademyEnrollments } from "./academy-enrollments";
import { AcademyInstructors } from "./academy-instructors";
import { AcademyScoreDistribution } from "./academy-score-distribution";
import { AcademyTopCourses } from "./academy-top-courses";
import { KpiStrip } from "./kpi-strip";

export function AcademyDashboardPage({ today }: { today: string }) {
  return (
    <AppBody>
      <PageHeading
        title="Learning overview"
        currentPage="Academy"
        description={`${formatLongDate(today)}. Enrollments, completions, course performance, and today's live sessions.`}
      />
      <KpiStrip label="This term" items={academyMetrics} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <AcademyEnrollments />
        </div>
        <AcademyCompletionFunnel />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <AcademyTopCourses />
        </div>
        <AcademyCohortSchedule />
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <AcademyScoreDistribution />
        </div>
        <AcademyInstructors />
      </div>
    </AppBody>
  );
}
