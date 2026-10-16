"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { z } from "zod";
import { initialCrudData } from "./crud.mock";
import {
  applyCrudChange,
  crudStorageKey,
  currentMockUserId,
  parseCrudStorage,
  type CrudChange,
} from "./crud-model";

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === crudStorageKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("crud-changed", notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("crud-changed", notify);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(crudStorageKey);
  } catch {
    return "unavailable";
  }
}
function serverSnapshot() {
  return undefined;
}

export function useCrudData() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [saveError, setSaveError] = useState("");
  const { data, readError } = useMemo(() => {
    try {
      return {
        data: raw == null ? initialCrudData : parseCrudStorage(raw),
        readError: "",
      };
    } catch {
      return {
        data: initialCrudData,
        readError:
          "Data browser tidak dapat dibaca. Data tersimpan tidak ditimpa. Periksa izin penyimpanan lalu coba lagi.",
      };
    }
  }, [raw]);
  const ready = raw !== undefined && !readError;
  function reload() {
    setSaveError("");
    window.dispatchEvent(new Event("crud-changed"));
  }
  function commit(change: CrudChange) {
    if (!ready) return false;
    try {
      const latest = localStorage.getItem(crudStorageKey);
      const next = applyCrudChange(
        latest === null ? initialCrudData : parseCrudStorage(latest),
        change,
        currentMockUserId,
      );
      localStorage.setItem(
        crudStorageKey,
        JSON.stringify({ version: 1, data: next }),
      );
      reload();
      return true;
    } catch (cause) {
      setSaveError(
        cause instanceof z.ZodError
          ? (cause.issues[0]?.message ?? "Data tidak valid.")
          : cause instanceof Error && !(cause instanceof DOMException)
            ? cause.message
            : "Perubahan belum tersimpan. Penyimpanan browser penuh atau tidak tersedia; isian Anda tetap ada.",
      );
      return false;
    }
  }
  return { data, ready, error: readError || saveError, reload, commit };
}
