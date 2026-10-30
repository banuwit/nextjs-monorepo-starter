"use client";

import { useState } from "react";

export function useProductWishlist(initialIds: string[] = []) {
  const [ids, setIds] = useState(initialIds);

  const toggle = (id: string) =>
    setIds((current) =>
      current.includes(id)
        ? current.filter((other) => other !== id)
        : [...current, id],
    );

  return { has: (id: string) => ids.includes(id), toggle };
}
