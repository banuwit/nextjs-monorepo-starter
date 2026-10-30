"use client";

import { useState } from "react";
import { DownloadIcon, MailIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InvoiceActions({
  id,
  emailHref,
}: {
  id: string;
  emailHref: string;
}) {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5 print:hidden">
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogTrigger
          render={
            <Button size="sm" aria-label={`Download invoice ${id} as PDF`} />
          }
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save invoice as PDF</DialogTitle>
            <DialogDescription>
              Choose “Save as PDF” in the print dialog. Turn off headers and
              footers for a clean invoice. Only the invoice will be printed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setPdfOpen(false);
                window.print();
              }}
            >
              Open print dialog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<a href={emailHref} />}
        aria-label={`Email invoice ${id}`}
      >
        <MailIcon data-icon="inline-start" />
        Email
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`Print invoice ${id}`}
        title="Print invoice"
        onClick={() => window.print()}
      >
        <PrinterIcon />
      </Button>
    </div>
  );
}
