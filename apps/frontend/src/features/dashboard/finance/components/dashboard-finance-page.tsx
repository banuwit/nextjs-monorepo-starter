"use client";

import { useState } from "react";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  DropletIcon,
  HistoryIcon,
  LightbulbIcon,
  MoreHorizontalIcon,
  ReceiptIcon,
  ScanLineIcon,
  SendIcon,
  SmartphoneIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { PreferencesMenu } from "@/components/preferences";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  financeBills,
  financeIncome,
  financeMetrics,
  financeTransactions,
  financeWallet,
} from "@/mocks/dashboard-finance.mock";

import { AccountAllocation, SpendingOverview } from "./finance-charts";
import { transactionsCsv } from "../utils/finance-export";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function exportTransactions() {
  const url = URL.createObjectURL(
    new Blob([transactionsCsv(financeTransactions)], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "finance-sample-transactions.csv";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Metrics() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 xl:grid-cols-8">
        {financeMetrics.map((metric, index) => (
          <Card
            key={metric.label}
            className={cn(
              "gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4",
              index < 2 && "border-b border-foreground/10",
              index % 2 === 0 && "xl:border-r xl:border-foreground/10",
            )}
          >
            <CardHeader>
              <CardTitle className="font-normal">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div
                className={index === 0 ? "space-y-1" : "flex flex-col gap-1"}
              >
                <div className="text-3xl leading-none tracking-tight">
                  {metric.value}
                </div>
                <p className="text-muted-foreground text-xs">{metric.detail}</p>
              </div>
              <Badge
                variant={metric.tone === "negative" ? "destructive" : "default"}
                className={
                  metric.tone === "negative"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
                }
              >
                {metric.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IncomeSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Income sources</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-1 md:grid-cols-3">
        {financeIncome.map((source, index) => (
          <section key={source.label} className="isolate flex gap-px">
            <span
              className="mb-1 border-l border-dashed border-muted-foreground/50"
              aria-hidden="true"
            />
            <div className="flex min-h-24 min-w-0 flex-1 flex-col justify-between">
              <div className="flex min-w-0 flex-col gap-1 px-1">
                <p className="text-xs leading-none text-muted-foreground wrap-break-word">
                  {source.label} · {source.share}%
                </p>
                <div className="text-lg leading-none tracking-tight">
                  {source.amount}
                </div>
              </div>
              <div
                className={cn(
                  "-ml-0.5 h-5 rounded-sm",
                  ["bg-chart-3", "bg-chart-3/75", "bg-chart-3/50"][index],
                )}
              />
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

function CreditNotice() {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border px-3 py-2.5 text-sm">
      <span className="self-start pt-0.5">
        <ArrowUpRightIcon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-medium leading-snug">Credit score updated</p>
        <p className="leading-normal text-muted-foreground">
          Your score increased by 14 points to 782.
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-7 px-2.5 text-[0.8rem]"
      >
        View details
      </Button>
    </div>
  );
}

function Wallet() {
  return (
    <Card id="finance-wallet">
      <CardHeader>
        <CardTitle className="font-normal">Wallet</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[financeWallet.slice(0, 3), financeWallet.slice(3)]
          .map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-4">
              {group.map((account) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium leading-none">
                      {account.name} · {account.detail}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {account.value}
                    </span>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border bg-background text-xs font-semibold">
                    {account.mark}
                  </span>
                </div>
              ))}
            </div>
          ))
          .flatMap((group, index) =>
            index === 0
              ? [group, <div key="divider" className="h-px bg-border" />]
              : [group],
          )}
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-medium text-muted-foreground">
            Physical Vault:{" "}
            <span className="text-foreground">Ledger Nano X</span>
          </span>
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-green-500">
            <span className="size-1 rounded-full bg-green-500" /> Air-Gapped
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingBills() {
  return (
    <Card id="finance-bills">
      <CardHeader>
        <CardTitle className="font-normal">
          Upcoming Bills &amp; Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-baseline text-3xl leading-none tracking-tight">
              <span>$1,245</span>
              <span className="text-xl text-muted-foreground">.00</span>
            </h2>
            <p className="text-sm leading-none text-muted-foreground">
              You have <span className="font-medium text-foreground">3</span>{" "}
              bills due this month
            </p>
          </div>
          <div className="flex w-max items-center gap-2 rounded-md border border-border bg-muted/70 px-2 py-1.5 text-sm">
            <ZapIcon className="size-4" /> Autopay will process{" "}
            <strong>$145.00</strong> today
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {financeBills.map((bill) => (
            <li
              key={bill.name}
              className="flex min-h-[55px] items-center gap-2 rounded-lg border border-border px-2.5 py-2"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted font-semibold">
                {bill.mark}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{bill.name}</p>
                <p className="text-xs text-muted-foreground">{bill.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function QuickTransfer() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const recipients = ["AR", "SC", "MJ", "ED"];

  return (
    <Card id="finance-transfer">
      <CardHeader>
        <CardTitle className="font-normal">Quick Transfer</CardTitle>
        <CardAction className="flex items-center -space-x-1">
          {recipients.map((recipient) => (
            <span
              key={recipient}
              className="grid size-7 place-items-center rounded-full border border-background bg-muted text-[10px] font-medium"
            >
              {recipient}
            </span>
          ))}
        </CardAction>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setMessage(
              amount && Number(amount) > 0
                ? "This is sample data. No transfer was sent."
                : "Enter an amount greater than zero.",
            );
          }}
          className="flex items-center gap-2"
        >
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              aria-label="Sample transfer amount in USD"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setMessage("");
              }}
              className="pl-7 pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              USD
            </span>
          </div>
          <Button type="submit" size="sm">
            <SendIcon data-icon="inline-start" /> Send
          </Button>
        </form>
        {message && (
          <p role="status" className="text-xs text-muted-foreground">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

const shortcuts = [
  { label: "Scan QR", icon: ScanLineIcon },
  { label: "Transfer", icon: SendIcon },
  { label: "Pay Bills", icon: ReceiptIcon },
  { label: "History", icon: HistoryIcon },
  { label: "Mobile", icon: SmartphoneIcon },
  { label: "Electricity", icon: LightbulbIcon },
  { label: "Water", icon: DropletIcon },
  { label: "More", icon: MoreHorizontalIcon },
];

function Shortcuts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Shortcuts</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-4">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.label}
            className="flex flex-col items-center gap-2.5 text-center"
          >
            <Button
              type="button"
              variant="outline"
              className="size-12 rounded-full p-0"
              aria-label={shortcut.label}
            >
              <shortcut.icon className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {shortcut.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Transactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border">
        {financeTransactions.map((transaction) => (
          <div
            key={`${transaction.name}-${transaction.date}`}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{transaction.name}</p>
              <p className="text-xs text-muted-foreground">
                {transaction.date} · {transaction.type}
              </p>
            </div>
            <span className="shrink-0 font-medium tabular-nums">
              {transaction.amount > 0 ? "+" : ""}
              {currency.format(transaction.amount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FinanceDashboardPage() {
  return (
    <AppBody>
      <PageHeading
        title="Personal Finances"
        currentPage="Finance"
        titleClassName="text-3xl font-medium tracking-tight"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Wednesday, 21st October 2026
          </p>
          <Badge variant="outline" className="mt-2">
            Sample data
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <PreferencesMenu />
          <Button variant="outline" onClick={exportTransactions}>
            <DownloadIcon data-icon="inline-start" /> Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="dashboard" className="min-w-0">
        <TabsList variant="line" className="mb-2 border-b border-border">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <Metrics />
            </div>
            <div className="flex flex-col gap-4 xl:col-span-6">
              <IncomeSources />
              <CreditNotice />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-7">
              <SpendingOverview />
            </div>
            <div className="xl:col-span-5">
              <AccountAllocation />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <Wallet />
            </div>
            <div className="xl:col-span-4">
              <UpcomingBills />
            </div>
            <div className="flex flex-col gap-4 xl:col-span-4">
              <QuickTransfer />
              <Shortcuts />
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="accounts"
          className="grid min-w-0 gap-4 xl:grid-cols-2"
        >
          <AccountAllocation />
          <Wallet />
        </TabsContent>
        <TabsContent
          value="transactions"
          className="grid min-w-0 gap-4 xl:grid-cols-2"
        >
          <Transactions />
          <UpcomingBills />
        </TabsContent>
      </Tabs>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <WalletIcon className="size-3.5" /> Finance preview uses example values;
        no bank account is connected.
      </p>
    </AppBody>
  );
}
