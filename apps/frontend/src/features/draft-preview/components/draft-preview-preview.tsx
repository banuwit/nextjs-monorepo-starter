import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  LoaderCircleIcon,
  PrinterIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { useDraftPreviewExport } from "../hooks/use-draft-preview-export";

export function DraftPreviewPreview({
  output,
  onValidate,
}: {
  output: ReturnType<typeof useDraftPreviewExport>;
  onValidate: () => void;
}) {
  const printRoot = useRef<HTMLDivElement>(null);
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pages = output.file?.pages ?? [];
  const selectedIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
  const page = pages[selectedIndex];

  async function print() {
    if (!output.ready) return;
    setPrinting(true);
    setPrintError("");
    try {
      await Promise.all(
        Array.from(printRoot.current?.querySelectorAll("img") ?? []).map(
          (img) => img.decode(),
        ),
      );
      window.print();
    } catch {
      setPrintError(
        "Printing could not start. Download the PDF and print it from your PDF reader.",
      );
    } finally {
      setPrinting(false);
    }
  }

  return (
    <>
      <section
        aria-label="Draft Preview"
        className="min-w-0 self-start overflow-hidden rounded-xl border border-border bg-card text-card-foreground @min-[900px]/main:sticky @min-[900px]/main:top-28"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h2 className="text-sm font-medium">Print preview</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A4 · Fits the entire page
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={!output.ready || printing}
              onClick={() => void print()}
            >
              <PrinterIcon />
              Print
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={output.busy}
              onClick={onValidate}
            >
              <DownloadIcon />
              PDF
            </Button>
          </div>
        </header>
        <div
          data-draft-preview-preview-stage
          aria-busy={output.busy}
          className="relative flex h-[clamp(16rem,calc(100dvh-18rem),50rem)] items-center justify-center overflow-hidden bg-muted/60 p-4 sm:p-6"
        >
          {page ? (
            <figure className="contents">
              <Image
                unoptimized
                src={page.image}
                width={page.width}
                height={page.height}
                alt={`Draft Preview page ${selectedIndex + 1} of ${pages.length}`}
                className="h-auto max-h-full w-auto max-w-full object-contain shadow-sm"
                loading="eager"
              />
              <figcaption className="sr-only">{page.text}</figcaption>
            </figure>
          ) : (
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              {output.busy && (
                <LoaderCircleIcon className="size-5 animate-spin" />
              )}
              {output.error
                ? "Preview unavailable."
                : output.valid
                  ? "Preparing your preview…"
                  : "Complete the required details to see your preview."}
            </div>
          )}
          {(output.busy || !output.valid || output.error) && page && (
            <div
              className="absolute inset-x-3 bottom-3 rounded-lg border bg-card/95 px-3 py-2 text-center text-xs text-muted-foreground"
              role="status"
            >
              {output.busy
                ? "Updating preview…"
                : output.error
                  ? "Preview could not update."
                  : "Complete the required details to update this preview."}
            </div>
          )}
          {output.error && (
            <Button
              type="button"
              variant="outline"
              onClick={output.retry}
              className="absolute bottom-14"
            >
              <RefreshCwIcon />
              Try again
            </Button>
          )}
        </div>
        <footer className="flex items-center justify-between gap-2 border-t px-4 py-3">
          <span className="text-xs text-muted-foreground" role="status">
            {pages.length
              ? `Page ${selectedIndex + 1} of ${pages.length}`
              : "Preparing document"}
          </span>
          <nav
            aria-label="Preview pagination"
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Previous draft preview page"
              disabled={selectedIndex === 0 || output.busy}
              onClick={() => setPageIndex(selectedIndex - 1)}
            >
              <ChevronLeftIcon />
            </Button>
            <span
              className="min-w-8 text-center text-xs tabular-nums"
              aria-hidden="true"
            >
              {pages.length ? `${selectedIndex + 1} / ${pages.length}` : "—"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Next draft preview page"
              disabled={selectedIndex >= pages.length - 1 || output.busy}
              onClick={() => setPageIndex(selectedIndex + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </nav>
        </footer>
        {printError && (
          <p role="alert" className="border-t p-3 text-xs text-destructive">
            {printError}
          </p>
        )}
      </section>
      {output.ready &&
        output.file &&
        createPortal(
          <div
            ref={printRoot}
            data-playground-draft-preview-print-root
            aria-hidden="true"
          >
            {pages.map((page, index) => (
              <Image
                key={index}
                unoptimized
                src={page.image}
                width={page.width}
                height={page.height}
                alt=""
                loading="eager"
              />
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
