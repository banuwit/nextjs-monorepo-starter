"use client";

import type { ReactNode } from "react";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { cn } from "@/lib/utils";

export function ChatThread({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller className={cn("flex-1", className)}>
        <MessageScrollerViewport aria-label={label}>
          <MessageScrollerContent className="p-4">
            {children}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

export function ChatThreadItem({
  messageId,
  children,
}: {
  messageId: string;
  children: ReactNode;
}) {
  return (
    <MessageScrollerItem messageId={messageId} scrollAnchor>
      {children}
    </MessageScrollerItem>
  );
}
