import { useEffect, useRef, useState } from "react";
import type { Invoice } from "../types/invoice";
import type { renderInvoicePdf } from "../utils/render-invoice-pdf";
import { invoiceSchema } from "../schemas/invoice.schema";
import { invoiceFilename } from "../utils/invoice";

type InvoiceFile = {
  url: string;
  name: string;
  source: Invoice;
  pages: Awaited<ReturnType<typeof renderInvoicePdf>>;
};

export function useInvoiceExport(invoice: Invoice) {
  const [file, setFile] = useState<InvoiceFile | null>(null);
  const [failure, setFailure] = useState<{
    source: Invoice;
    message: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const currentUrl = useRef<string | null>(null);
  const queue = useRef(Promise.resolve());
  const valid = invoiceSchema.safeParse(invoice).success;

  useEffect(
    () => () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    },
    [],
  );

  useEffect(() => {
    const parsed = invoiceSchema.safeParse(invoice);
    if (!parsed.success) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      // Serialize document rendering; superseded edits never replace a newer preview.
      queue.current = queue.current.then(async () => {
        if (cancelled) return;
        setFailure(null);
        try {
          const [{ createInvoicePdf }, { renderInvoicePdf }] =
            await Promise.all([
              import("../components/invoice-document"),
              import("../utils/render-invoice-pdf"),
            ]);
          if (cancelled) return;
          const blob = await createInvoicePdf(parsed.data);
          if (cancelled) return;
          const pages = await renderInvoicePdf(blob);
          if (cancelled) return;
          if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
          const url = URL.createObjectURL(blob);
          currentUrl.current = url;
          setFile({
            url,
            name: invoiceFilename(parsed.data.reference),
            source: invoice,
            pages,
          });
        } catch {
          if (!cancelled)
            setFailure({
              source: invoice,
              message:
                "The preview could not be created. Your changes are still here. Please try again.",
            });
        }
      });
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [invoice, retry]);

  const ready = file?.source === invoice;
  const error = failure?.source === invoice ? failure.message : "";
  const busy = valid && !ready && !error;

  function download() {
    if (!file || !ready) return;
    const anchor = document.createElement("a");
    anchor.href = file.url;
    anchor.download = file.name;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setMessage(`Download started: ${file.name}`);
  }

  return {
    file,
    ready,
    busy,
    valid,
    error,
    message,
    download,
    retry: () => {
      setFailure(null);
      setRetry((value) => value + 1);
    },
  };
}
