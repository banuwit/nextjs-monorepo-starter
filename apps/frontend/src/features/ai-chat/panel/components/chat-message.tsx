import type { ReactNode } from "react";
import { SparklesIcon } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";
import type { ChatMessage } from "../types/chat";

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <MessageAvatar
      className={className ?? "size-8 bg-primary text-primary-foreground"}
    >
      <SparklesIcon className="size-4" aria-hidden="true" />
    </MessageAvatar>
  );
}

export function ThinkingIndicator({ label = "Sedang berpikir…" }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <Spinner />
      <span className="shimmer">{label}</span>
    </span>
  );
}

export function ChatMessageItem({
  message,
  children,
  footer,
}: {
  message: ChatMessage<unknown>;
  /** Konten interaktif di bawah teks, ditampilkan setelah stream selesai. */
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const isUser = message.role === "user";
  const done = message.status === "done";

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && <AssistantAvatar />}
      <MessageContent>
        {(message.text || !done) && (
          <Bubble
            variant={isUser ? "default" : "ghost"}
            align={isUser ? "end" : "start"}
          >
            <BubbleContent
              className="whitespace-pre-line"
              aria-busy={!done || undefined}
            >
              {message.status === "thinking" ? (
                <ThinkingIndicator />
              ) : (
                message.text
              )}
            </BubbleContent>
          </Bubble>
        )}
        {done && children}
        {done && footer && <MessageFooter>{footer}</MessageFooter>}
      </MessageContent>
    </Message>
  );
}
