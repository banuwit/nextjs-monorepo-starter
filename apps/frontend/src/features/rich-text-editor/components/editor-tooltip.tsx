"use client";

import type { ReactElement, ReactNode } from "react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatShortcut, isMacPlatform } from "@/utils/editor-shortcut";

export function EditorTooltip({
  label,
  shortcut,
  render,
  children,
}: {
  label: string;
  shortcut?: string;
  render: ReactElement;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={render}>{children}</TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && (
          <KbdGroup>
            {formatShortcut(shortcut, isMacPlatform()).map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
