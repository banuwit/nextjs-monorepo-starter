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

export function ReceiptActions({
  id,
  emailHref,
}: {
  id: string;
  emailHref: string;
}) {
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogTrigger
          render={
            <Button size="sm" aria-label={`Download receipt ${id} as PDF`} />
          }
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save receipt as PDF</DialogTitle>
            <DialogDescription>
              Choose “Save as PDF” in the print dialog. Turn off headers and
              footers for a clean receipt. Only the receipt will be printed.
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
        size="icon-sm"
        nativeButton={false}
        render={<a href={emailHref} />}
        aria-label={`Email receipt ${id}`}
        title="Open receipt in your email app"
      >
        <MailIcon />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`Print receipt ${id}`}
        title="Print receipt"
        onClick={() => window.print()}
      >
        <PrinterIcon />
      </Button>
    </div>
  );
}
