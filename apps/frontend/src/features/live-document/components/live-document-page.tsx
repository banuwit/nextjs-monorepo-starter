"use client";

import { useState } from "react";
import { AppBody } from "@/components/app-body";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDemoRoom } from "../hooks/use-live-room";
import { LiveDocumentWorkspace } from "./live-document-workspace";

export function LiveDocumentPage() {
  const [session, setSession] = useState(0);
  const room = useDemoRoom(session);

  return (
    <AppBody>
      <h1 className="sr-only">Live Document</h1>
      <TooltipProvider delay={300}>
        {room ? (
          <LiveDocumentWorkspace
            key={session}
            room={room}
            onReplay={() => setSession((value) => value + 1)}
          />
        ) : (
          <div
            role="status"
            aria-label="Opening the document"
            className="flex h-[calc(100svh-6.5rem)] min-h-[32rem] flex-col gap-4 rounded-xl border bg-muted/25 p-4"
          >
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-7 w-96 max-w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        )}
      </TooltipProvider>
      <p className="text-xs text-muted-foreground">
        Demo room with scripted teammates on Yjs. Switch Online off to queue
        edits and watch them merge on reconnect; nothing leaves this browser.
      </p>
      <Toaster />
    </AppBody>
  );
}
