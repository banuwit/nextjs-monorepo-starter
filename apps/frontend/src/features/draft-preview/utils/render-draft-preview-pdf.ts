import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export async function renderDraftPreviewPdf(blob: Blob) {
  const task = getDocument({
    data: new Uint8Array(await blob.arrayBuffer()),
    useSystemFonts: true,
  });
  try {
    const pdf = await task.promise;
    const pages: {
      image: string;
      text: string;
      width: number;
      height: number;
    }[] = [];
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, viewport }).promise;
      const content = await page.getTextContent();
      pages.push({
        image: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height,
        text: content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" "),
      });
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
    return pages;
  } finally {
    await task.destroy();
  }
}
