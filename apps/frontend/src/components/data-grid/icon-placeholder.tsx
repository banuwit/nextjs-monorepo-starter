import type { ComponentProps } from "react";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowLeftToLineIcon,
  ArrowRightIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  PinOffIcon,
  PlusIcon,
  Settings2Icon,
} from "lucide-react";

const icons = {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowLeftToLineIcon,
  ArrowRightIcon,
  ArrowRightToLineIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  PinOffIcon,
  PlusIcon,
  Settings2Icon,
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
