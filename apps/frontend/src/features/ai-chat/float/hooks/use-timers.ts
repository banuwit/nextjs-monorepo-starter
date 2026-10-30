"use client";

import { useEffect, useMemo, useRef } from "react";

import { streamText, type StreamTextOptions } from "../utils/stream-text";

/** Mengumpulkan timer simulasi agar seluruhnya dibatalkan saat unmount atau reset. */
export function useTimers() {
  const cancels = useRef(new Set<() => void>());

  useEffect(() => {
    const pending = cancels.current;
    return () => {
      pending.forEach((cancel) => cancel());
      pending.clear();
    };
  }, []);

  return useMemo(() => {
    const track = (cancel: () => void) => {
      cancels.current.add(cancel);
      return () => {
        cancel();
        cancels.current.delete(cancel);
      };
    };

    return {
      after(ms: number, callback: () => void) {
        const id = window.setTimeout(() => {
          cancels.current.delete(cancel);
          callback();
        }, ms);
        const cancel = () => window.clearTimeout(id);
        return track(cancel);
      },
      stream(text: string, options: StreamTextOptions) {
        let cancel = () => {};
        cancel = streamText(text, {
          ...options,
          onDone: () => {
            cancels.current.delete(cancel);
            options.onDone?.();
          },
        });
        return track(cancel);
      },
      clear() {
        cancels.current.forEach((cancel) => cancel());
        cancels.current.clear();
      },
    };
  }, []);
}
