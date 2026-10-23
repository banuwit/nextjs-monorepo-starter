"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CellTableSettings = {
  compact: boolean;
  stripes: boolean;
  lines: boolean;
};
export const defaultSettings: CellTableSettings = {
  compact: true,
  stripes: false,
  lines: true,
};
export const defaultWidths: Record<string, number> = {
  no: 60,
  id: 150,
  name: 240,
  email: 280,
  gender: 140,
  role: 140,
  joinDate: 170,
  status: 160,
};

export function CellTableControls({
  settings,
  setSettings,
  disabled,
}: {
  settings: CellTableSettings;
  setSettings: (settings: CellTableSettings) => void;
  disabled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button size="sm" variant="outline" disabled={disabled} />}
      >
        <Settings2 />
        Settings
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={settings.compact ? "compact" : "comfortable"}
            onValueChange={(value) =>
              setSettings({ ...settings, compact: value === "compact" })
            }
          >
            <DropdownMenuRadioItem value="comfortable">
              Comfortable
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">
              Compact
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={settings.lines}
            onCheckedChange={(lines) => setSettings({ ...settings, lines })}
          >
            Column lines
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={settings.stripes}
            onCheckedChange={(stripes) => setSettings({ ...settings, stripes })}
          >
            Row stripes
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
