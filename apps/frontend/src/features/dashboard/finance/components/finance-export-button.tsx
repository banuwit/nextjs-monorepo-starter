"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/features/dashboard/utils/csv";
import { financeTransactions } from "@/mocks/dashboard-finance.mock";

import { transactionsCsvHeader, transactionsCsvRows } from "../utils/finance";

export function FinanceExportButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        downloadCsv(
          "transactions.csv",
          transactionsCsvHeader,
          transactionsCsvRows(financeTransactions),
        )
      }
    >
      <DownloadIcon data-icon="inline-start" />
      Export transactions
    </Button>
  );
}
