import type { ComponentProps } from "react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  MinusIcon,
  PlusIcon,
  RepeatIcon,
} from "lucide-react";

const icons = {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GripVerticalIcon,
  MinusIcon,
  PlusIcon,
  RepeatIcon,
};

type LucideIconName = keyof typeof icons;

/**
 * Resolves the ReUI registry icon placeholder to this project's lucide icon set.
 * The other icon-library props are accepted so vendored ReUI sources stay unmodified.
 */
export type IconPlaceholderProps = ComponentProps<"svg"> & {
  lucide: LucideIconName;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
};

export function IconPlaceholder({
  lucide,
  tabler,
  hugeicons,
  phosphor,
  remixicon,
  ...props
}: IconPlaceholderProps) {
  const Icon = icons[lucide];

  return <Icon {...props} />;
}
