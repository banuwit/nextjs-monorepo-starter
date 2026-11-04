"use client";

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PresenceEntry } from "../types/live-document";
import { initials } from "../utils/time";

export function LiveDocumentPresence({
  presence,
  followingId,
  onFollow,
}: {
  presence: PresenceEntry[];
  followingId: string | null;
  onFollow: (userId: string | null) => void;
}) {
  const editing = presence.filter((entry) => entry.editing && !entry.isLocal);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground" aria-live="polite">
        {editing.length === 0
          ? "Only you"
          : `${editing.length} editing`}
      </span>
      <AvatarGroup aria-label="People in this document">
        {presence.map((entry) => {
          const following = entry.user.id === followingId;
          const status = entry.isLocal
            ? "you"
            : entry.editing
              ? "editing"
              : "viewing";
          const avatar = (
            <Avatar
              size="sm"
              className={cn(
                "ring-2 ring-background",
                following && "ring-primary",
              )}
            >
              <AvatarFallback
                className="text-[0.6rem] font-semibold text-white"
                style={{ background: entry.user.color }}
              >
                {initials(entry.user.name)}
              </AvatarFallback>
            </Avatar>
          );
          return (
            <Tooltip key={entry.clientId}>
              <TooltipTrigger
                render={
                  entry.isLocal || !entry.editing ? (
                    <span className="rounded-full" />
                  ) : (
                    <button
                      type="button"
                      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-pressed={following}
                      aria-label={
                        following
                          ? `Stop following ${entry.user.name}`
                          : `Follow ${entry.user.name}`
                      }
                      onClick={() => onFollow(following ? null : entry.user.id)}
                    />
                  )
                }
              >
                {avatar}
              </TooltipTrigger>
              <TooltipContent>
                {entry.user.name}
                {" · "}
                {following ? "following" : status}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </AvatarGroup>
    </div>
  );
}
