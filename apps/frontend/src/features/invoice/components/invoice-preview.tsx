import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Invoice } from "../invoice-model";
import { InvoicePaper } from "./invoice-paper";

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const container = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 0, height: 1056 });
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!container.current || !paper.current) return;
      setLayout({
        scale: Math.min(
          0.6,
          Math.max(0, container.current.clientWidth - 32) / 816,
        ),
        height: paper.current.offsetHeight,
      });
    });
    if (container.current) observer.observe(container.current);
    if (paper.current) observer.observe(paper.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card"
      aria-label="Invoice preview"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <h2 className="text-lg font-medium">Preview</h2>
        <ButtonGroup aria-label="Export invoice">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.print()}
          >
            <PrinterIcon data-icon="inline-start" />
            Print
          </Button>
          <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
            <DialogTrigger render={<Button type="button" variant="outline" />}>
              <DownloadIcon data-icon="inline-start" />
              Download PDF
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save invoice as PDF</DialogTitle>
                <DialogDescription>
                  In the print dialog, choose “Save as PDF” as the destination.
                  Use Letter paper, no margins, and turn off headers and footers
                  for the best result.
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
        </ButtonGroup>
      </div>
      <div
        ref={container}
        className="grid min-w-0 flex-1 place-items-center bg-stone-200 px-4 py-10 dark:bg-stone-800"
      >
        <div
          style={{
            width: 816 * layout.scale,
            height: layout.height * layout.scale,
          }}
          className="relative"
        >
          <div
            ref={paper}
            className="absolute left-0 top-0 w-[816px] origin-top-left"
            style={{ transform: `scale(${layout.scale})` }}
          >
            <InvoicePaper invoice={invoice} />
          </div>
        </div>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <div data-invoice-print-root aria-hidden="true">
            <InvoicePaper invoice={invoice} />
          </div>,
          document.body,
        )}
    </section>
  );
}
