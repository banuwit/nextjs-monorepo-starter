"use client";

import { useState } from "react";

export function useCompareSelection(defaultIds: string[]) {
  const [selectedIds, setSelectedIds] = useState(defaultIds);

  const remove = (id: string) => {
    setSelectedIds((current) => current.filter((item) => item !== id));
  };

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return { selectedIds, remove, toggle };
}
