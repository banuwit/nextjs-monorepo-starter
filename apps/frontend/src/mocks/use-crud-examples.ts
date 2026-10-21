"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { crudSchemas } from "./crud-model";
import { initialCrudExamples } from "./crud-examples.mock";
import {
  applyCrudExampleChange,
  type CrudExampleChange,
} from "./crud-examples-change";

const storageKey = "workspace-crud-examples-v1";
const changedEvent = "crud-examples-changed";
const schema = z.array(crudSchemas.parameters);

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changedEvent, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(changedEvent, notify);
  };
}

function snapshot() {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return "unavailable";
  }
}

function read(raw: string | null) {
  return raw === null ? initialCrudExamples : schema.parse(JSON.parse(raw));
}

export function useCrudExamples() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => undefined);
  const [saveError, setSaveError] = useState("");
  const { data, readError } = useMemo(() => {
    try {
      return {
        data: raw === undefined ? initialCrudExamples : read(raw),
        readError: "",
      };
    } catch {
      return {
        data: initialCrudExamples,
        readError:
          "Data contoh di browser tidak dapat dibaca. Data tersimpan tidak ditimpa.",
      };
    }
  }, [raw]);
  const ready = raw !== undefined && !readError;

  function reload() {
    setSaveError("");
    window.dispatchEvent(new Event(changedEvent));
  }

  function commit(change: CrudExampleChange) {
    if (!ready) return false;
    try {
      const current = read(localStorage.getItem(storageKey));
      const next = applyCrudExampleChange(
        current,
        change.type === "save"
          ? { ...change, record: crudSchemas.parameters.parse(change.record) }
          : change,
      );
      localStorage.setItem(storageKey, JSON.stringify(next));
      reload();
      return true;
    } catch (cause) {
      setSaveError(
        cause instanceof z.ZodError
          ? (cause.issues[0]?.message ?? "Data tidak valid.")
          : cause instanceof Error && !(cause instanceof DOMException)
            ? cause.message
            : "Perubahan belum tersimpan. Penyimpanan browser tidak tersedia.",
      );
      return false;
    }
  }

  return { data, ready, error: readError || saveError, reload, commit };
}
