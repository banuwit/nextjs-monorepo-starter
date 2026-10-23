import { useLayoutEffect, useRef } from "react";

/** Event handlers read the latest committed value without changing identity. */
export function useCommittedRef<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
