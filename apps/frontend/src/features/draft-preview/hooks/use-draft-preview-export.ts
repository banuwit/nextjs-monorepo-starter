import { useEffect, useRef, useState } from "react";
import type { DraftPreview } from "../types/draft-preview";
import type { renderDraftPreviewPdf } from "../utils/render-draft-preview-pdf";
import { draftPreviewSchema } from "../schemas/draft-preview.schema";
import { draftPreviewFilename } from "../utils/draft-preview";

type DraftPreviewFile = {
  url: string;
  name: string;
  source: DraftPreview;
  pages: Awaited<ReturnType<typeof renderDraftPreviewPdf>>;
};

export function useDraftPreviewExport(draftPreview: DraftPreview) {
  const [file, setFile] = useState<DraftPreviewFile | null>(null);
  const [failure, setFailure] = useState<{
    source: DraftPreview;
    message: string;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const currentUrl = useRef<string | null>(null);
  const queue = useRef(Promise.resolve());
  const valid = draftPreviewSchema.safeParse(draftPreview).success;

  useEffect(
    () => () => {
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    },
    [],
  );

  useEffect(() => {
    const parsed = draftPreviewSchema.safeParse(draftPreview);
    if (!parsed.success) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      // Serialize document rendering; superseded edits never replace a newer preview.
      queue.current = queue.current.then(async () => {
        if (cancelled) return;
        setFailure(null);
        try {
          const [{ createDraftPreviewPdf }, { renderDraftPreviewPdf }] =
            await Promise.all([
              import("../components/draft-preview-document"),
              import("../utils/render-draft-preview-pdf"),
            ]);
          if (cancelled) return;
          const blob = await createDraftPreviewPdf(parsed.data);
          if (cancelled) return;
          const pages = await renderDraftPreviewPdf(blob);
          if (cancelled) return;
          if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
          const url = URL.createObjectURL(blob);
          currentUrl.current = url;
          setFile({
            url,
            name: draftPreviewFilename(parsed.data.reference),
            source: draftPreview,
            pages,
          });
        } catch {
          if (!cancelled)
            setFailure({
              source: draftPreview,
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
  }, [draftPreview, retry]);

  const ready = file?.source === draftPreview;
  const error = failure?.source === draftPreview ? failure.message : "";
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
