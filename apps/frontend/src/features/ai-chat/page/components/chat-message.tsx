import { SparklesIcon } from "lucide-react";

import { MessageAvatar } from "@/components/ui/message";
import { Spinner } from "@/components/ui/spinner";

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
