"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { SaveIcon, SendIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createDemoInvoice, invoiceClients } from "@/mocks/invoice.mock";
import {
  calculateInvoice,
  formatInvoiceCurrency,
  invoiceSchema,
  readyInvoiceSchema,
  type Invoice,
} from "../invoice-model";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

const draftKey = "invoice-draft:v1";

export function InvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [clients, setClients] = useState(invoiceClients);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  useEffect(() => {
    let initial = createDemoInvoice(format(new Date(), "yyyy-MM-dd"));
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = invoiceSchema.safeParse(JSON.parse(saved));
        if (parsed.success) {
          initial = parsed.data;
          // Restore browser-only storage after hydration; these updates are batched once.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMessage("Draft restored from this browser.");
        } else {
          setError(true);
          setMessage(
            "The saved draft could not be restored. Showing the example invoice.",
          );
        }
      }
    } catch {
      setError(true);
      setMessage(
        "Browser storage is unavailable or the draft is unreadable. You can still edit and print this invoice.",
      );
    }
    setClients((current) =>
      current.some((client) => client.id === initial.to.id)
        ? current
        : [...current, initial.to],
    );
    setInvoice(initial);
  }, []);

  function saveDraft() {
    const parsed = invoiceSchema.safeParse(invoice);
    if (!parsed.success) {
      setError(true);
      setMessage(parsed.error.issues[0]?.message ?? "Check invoice details.");
      return;
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify(parsed.data));
      setError(false);
      setMessage("Draft saved in this browser.");
    } catch {
      setError(true);
      setMessage(
        "Draft could not be saved. Browser storage may be full or disabled.",
      );
    }
  }

  function reviewInvoice() {
    const result = readyInvoiceSchema.safeParse(invoice);
    if (!result.success) {
      setError(true);
      setMessage(result.error.issues.map((issue) => issue.message).join(" "));
      return;
    }
    setMessage("");
    setSendOpen(true);
  }

  return (
    <AppBody>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none font-medium tracking-tight">
              Create New Invoice
            </h1>
            <p className="text-sm text-muted-foreground">
              Add invoice details, review the preview, and send it to your
              client.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" disabled={!invoice} onClick={saveDraft}>
              <SaveIcon data-icon="inline-start" />
              Save as Draft
            </Button>
            <Button disabled={!invoice} onClick={reviewInvoice}>
              <SendIcon data-icon="inline-start" />
              Send Invoice
            </Button>
          </div>
        </div>
        {message && (
          <Alert
            variant={error ? "destructive" : "default"}
            role={error ? "alert" : "status"}
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {invoice ? (
          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            <div className="@container/editor min-w-0 [&>div]:h-full">
              <InvoiceForm
                invoice={invoice}
                clients={clients}
                onChange={(patch) => {
                  setMessage("");
                  setInvoice((current) =>
                    current ? { ...current, ...patch } : current,
                  );
                }}
                onAddClient={(client) => {
                  setMessage("");
                  setClients((current) => [...current, client]);
                  setInvoice((current) =>
                    current ? { ...current, to: client } : current,
                  );
                }}
              />
            </div>
            <InvoicePreview invoice={invoice} />
          </div>
        ) : (
          <div
            role="status"
            aria-label="Loading invoice"
            className="grid gap-5 xl:grid-cols-2"
          >
            <Skeleton className="h-[720px] rounded-xl" />
            <Skeleton className="h-[720px] rounded-xl" />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Demo invoice · Drafts are saved only in this browser. Email delivery
          is not connected.
        </p>
      </div>
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice ready for review</DialogTitle>
            <DialogDescription>
              This demo does not send email. Save your draft or download a PDF
              to share it yourself.
            </DialogDescription>
          </DialogHeader>
          {invoice && (
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
              <dt>Reference</dt>
              <dd className="break-words">{invoice.referenceNumber}</dd>
              <dt>Client</dt>
              <dd className="break-words">{invoice.to.name}</dd>
              <dt>Email</dt>
              <dd className="break-words">{invoice.to.email}</dd>
              <dt>Balance due</dt>
              <dd className="font-medium">
                {formatInvoiceCurrency(calculateInvoice(invoice).total)}
              </dd>
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                saveDraft();
                setSendOpen(false);
              }}
            >
              Save as Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppBody>
  );
}
