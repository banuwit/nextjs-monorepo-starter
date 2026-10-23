"use client";

import type { ComponentProps, ReactNode } from "react";
import { RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  PREFERENCES_CONFIG,
  PREFERENCE_OPTIONS,
  parsePreference,
  SIDEBAR_COLORS,
  PRIMARY_COLORS,
  appBodyLightColor,
} from "@/lib/preferences-config";
import { usePreferences } from "@/providers/preferences-provider";

const fontLabels = {
  geist: "Geist",
  inter: "Inter",
  nunito: "Nunito",
  roboto: "Roboto",
  "dm-sans": "DM Sans",
  poppins: "Poppins",
  raleway: "Raleway",
};
const groups = [
  {
    key: "contentLayout",
    label: "Page Layout",
    labels: ["Centered", "Full Width"],
  },
  {
    key: "sidebarStyle",
    label: "Sidebar Style",
    labels: ["Sidebar", "Inset", "Floating", "Header"],
  },
  {
    key: "borderRadius",
    label: "Border Radius",
    labels: ["None", "Small", "Medium", "Large"],
  },
  {
    key: "scale",
    label: "Scale",
    labels: ["Small", "Medium", "Large"],
  },
] as const;

const colorGroups = [
  { key: "primaryColor", label: "Primary Color" },
  { key: "sidebarColor", label: "Sidebar Color" },
  { key: "headerColor", label: "Header Color" },
  { key: "appBodyColor", label: "App Body Color" },
] as const;

export function PreferencesControls() {
  const { values, setPreference, resetPreferences } = usePreferences();
  return (
    <>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="preference-font">Fonts</FieldLabel>
          <Select
            value={values.font}
            items={fontLabels}
            onValueChange={(value) => {
              if (value) setPreference("font", parsePreference("font", value));
            }}
          >
            <SelectTrigger id="preference-font" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PREFERENCE_OPTIONS.font.map((font) => (
                  <SelectItem key={font} value={font}>
                    {fontLabels[font]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        {colorGroups.map(({ key, label }) => (
          <Field key={key}>
            <FieldLabel htmlFor={`preference-${key}`}>{label}</FieldLabel>
            <Select
              value={values[key]}
              items={Object.fromEntries(
                PREFERENCE_OPTIONS[key].map((color) => [
                  color,
                  SIDEBAR_COLORS[color].label,
                ]),
              )}
              onValueChange={(value) => {
                if (value) setPreference(key, parsePreference(key, value));
              }}
            >
              <SelectTrigger id={`preference-${key}`} className="w-full">
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 rounded-full border border-foreground/20"
                  style={{
                    backgroundColor:
                      key === "appBodyColor"
                        ? appBodyLightColor(
                            parsePreference("appBodyColor", values[key]),
                          )
                        : key === "primaryColor"
                          ? PRIMARY_COLORS[
                              parsePreference("primaryColor", values[key])
                            ].color
                          : SIDEBAR_COLORS[values[key]].light,
                  }}
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PREFERENCE_OPTIONS[key].map((color) => (
                    <SelectItem key={color} value={color}>
                      <span
                        aria-hidden="true"
                        className="size-3 shrink-0 rounded-full border border-foreground/20"
                        style={{
                          backgroundColor:
                            key === "appBodyColor"
                              ? appBodyLightColor(
                                  parsePreference("appBodyColor", color),
                                )
                              : key === "primaryColor"
                                ? PRIMARY_COLORS[
                                    parsePreference("primaryColor", color)
                                  ].color
                                : SIDEBAR_COLORS[color].light,
                        }}
                      />
                      {SIDEBAR_COLORS[color].label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        ))}
        {groups.map(({ key, label, labels }) => (
          <Field key={key}>
            <FieldLabel id={`preference-${key}`}>{label}</FieldLabel>
            <ToggleGroup
              aria-labelledby={`preference-${key}`}
              value={[values[key]]}
              variant="outline"
              spacing={0}
              className="w-full"
              onValueChange={(selected) => {
                if (selected[0])
                  setPreference(key, parsePreference(key, selected[0]));
              }}
            >
              {PREFERENCE_OPTIONS[key].map((value, index) => (
                <ToggleGroupItem key={value} value={value} className="flex-1">
                  {labels[index]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
        ))}
      </FieldGroup>
      <Button variant="outline" onClick={resetPreferences}>
        <RotateCcwIcon data-icon="inline-start" />
        Restore Defaults
      </Button>
    </>
  );
}

export function PreferencesDialog({
  children,
  ...props
}: ComponentProps<typeof Dialog> & { children?: ReactNode }) {
  if (!PREFERENCES_CONFIG.showPreferences) return null;

  return (
    <Dialog {...props}>
      {children}
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Customize your dashboard appearance.
          </DialogDescription>
        </DialogHeader>
        <PreferencesControls />
      </DialogContent>
    </Dialog>
  );
}

export function PreferencesMenu() {
  return (
    <PreferencesDialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="Preferences" />}
      >
        <SlidersHorizontalIcon />
      </DialogTrigger>
    </PreferencesDialog>
  );
}
