import { UserRoundXIcon } from "lucide-react";
import { Fragment } from "react";

import type { FilterOption } from "@/components/reui/filters/filters-types";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * A colour per option. Class names are written out whole because Tailwind
 * only generates classes it can find in source text.
 */
export interface Tone {
  value: string;
  label: string;
  dot: string;
  badge: string;
}

const NO_TONE = "bg-muted-foreground";

/** Looks up an option's tone; options without one fall back to grey. */
export const findTone = (tones: readonly Tone[], value: string) =>
  tones.find((tone) => tone.value === value);

export function ToneDot({ tone }: { tone: Tone | undefined }) {
  return (
    <span
      aria-hidden
      className={cn("size-2 shrink-0 rounded-full", tone?.dot ?? NO_TONE)}
    />
  );
}

export function ToneBadge({
  tone,
  label,
}: {
  tone: Tone | undefined;
  label: string;
}) {
  return (
    <Badge variant="outline" className={cn("px-2", tone?.badge)}>
      {label}
    </Badge>
  );
}

export const toneOptions = (tones: Tone[]): FilterOption[] =>
  tones.map((tone) => ({
    value: tone.value,
    label: tone.label,
    icon: <ToneDot tone={tone} />,
  }));

/** How many badges a chip draws before folding them into a dot stack. */
const BADGE_LIMIT = 2;

/** Tinted badges until a third pick folds them into dots + count (c-filters-3). */
export function BadgesOrStack({
  options,
  tones,
  fallback,
}: {
  options: FilterOption[];
  tones: readonly Tone[];
  fallback: string;
}) {
  if (options.length === 0) return <>{fallback}</>;
  if (options.length <= BADGE_LIMIT) {
    return (
      <span className="flex items-center gap-1.5">
        {options.map((option) => (
          <ToneBadge
            key={option.value}
            tone={findTone(tones, option.value)}
            label={option.label}
          />
        ))}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center">
        {options.slice(0, 4).map((option) => (
          <span
            key={option.value}
            className={cn(
              "-ml-1 size-2.5 rounded-full ring-2 ring-background first:ml-0",
              findTone(tones, option.value)?.dot ?? NO_TONE,
            )}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {options.length}
      </span>
    </span>
  );
}

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

/** A small avatar for option rows and chips. */
export function Face({ name }: { name: string }) {
  return (
    <Avatar className="size-5">
      <AvatarFallback className="text-[0.625rem]">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

/** The exclusive "No manager" row's avatar. */
export function NoFace() {
  return (
    <Avatar className="size-5">
      <AvatarFallback className="text-muted-foreground [&_svg]:size-3">
        <UserRoundXIcon />
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * One pick reads as face + name; several overlap into a group with "+N"
 * (c-filters-1/4). Ids restored before their names load show a count.
 */
export function StackedFaces({
  options,
  values,
  empty,
  countLabel,
}: {
  options: FilterOption[];
  values: unknown[];
  empty: string;
  countLabel: (count: number) => string;
}) {
  if (values.length > 0 && options.length === 0) {
    return <>{countLabel(values.length)}</>;
  }
  const [first] = options;
  if (!first) return <>{empty}</>;
  if (options.length === 1) {
    return (
      <span className="flex items-center gap-1.5">
        {first.icon}
        {first.label}
      </span>
    );
  }
  const overflow = options.length - 3;
  return (
    <span className="flex items-center gap-1.5">
      <AvatarGroup className="-space-x-1 *:data-[slot=avatar]:size-4">
        {options.slice(0, 3).map((option) => (
          // Fragments keep each avatar a direct child of the group.
          <Fragment key={option.value}>{option.icon}</Fragment>
        ))}
      </AvatarGroup>
      {overflow > 0 && (
        <span className="text-xs text-muted-foreground tabular-nums">
          +{overflow}
        </span>
      )}
    </span>
  );
}
