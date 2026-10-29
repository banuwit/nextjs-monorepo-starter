import { InfoIcon } from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PreferencesMenu } from "@/components/layout/preferences";
import { PageHeading } from "@/components/page-heading";
import { KpiStrip } from "@/features/dashboard/components/kpi-strip";
import { formatLongDate } from "@/features/dashboard/utils/format";
import { financeMetrics } from "@/mocks/dashboard-finance.mock";

import { FinanceAccounts } from "./finance-accounts";
import { FinanceBills } from "./finance-bills";
import { FinanceExportButton } from "./finance-export-button";
import { FinanceIncome } from "./finance-income";
import { FinanceNetWorth } from "./finance-net-worth";
import { FinanceSpending } from "./finance-spending";
import { FinanceTransactions } from "./finance-transactions";
import { FinanceTransfer } from "./finance-transfer";

export function FinanceDashboardPage({ today }: { today: string }) {
  return (
    <AppBody>
      <PageHeading
        title="Personal finances"
        currentPage="Finance"
        description={formatLongDate(today)}
      >
        <PreferencesMenu />
        <FinanceExportButton />
      </PageHeading>

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <FinanceNetWorth today={today} />
        </div>
        <FinanceAccounts />
      </div>

      <KpiStrip label="This month" items={financeMetrics} />

      <div className="grid min-w-0 gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <FinanceSpending />
        </div>
        <FinanceIncome />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <FinanceTransactions />
        <FinanceBills today={today} />
        <FinanceTransfer />
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <InfoIcon className="size-3.5" aria-hidden="true" />
        Example data. No bank account is connected and no money moves.
      </p>
    </AppBody>
  );
}
