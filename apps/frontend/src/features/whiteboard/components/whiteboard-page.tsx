"use client";

import dynamic from "next/dynamic";
import { AppBody } from "@/components/app-body";
import { Skeleton } from "@/components/ui/skeleton";
import "./whiteboard.css";

const WhiteboardEditor = dynamic(
  async () => {
    const editor = await import("./whiteboard-editor");
    // Measure the seeded handwritten labels with the font that will render them.
    await document.fonts.load("20px Virgil").catch(() => undefined);
    return editor;
  },
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-full w-full" aria-label="Loading whiteboard" />
    ),
  },
);

export function WhiteboardPage() {
  return (
    <AppBody>
      <h1 className="sr-only">Whiteboard</h1>
      <section
        className="whiteboard-shell relative flex h-[calc(100svh-5rem)] min-h-[32rem] min-w-0 flex-col overflow-hidden rounded-lg border bg-background text-foreground"
        aria-label="Whiteboard"
      >
        <WhiteboardEditor />
      </section>
    </AppBody>
  );
}
