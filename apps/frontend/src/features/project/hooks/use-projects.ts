"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { initialProjects } from "@/mocks/project.mock";
import {
  applyProjectChange,
  parseProjectStorage,
  projectStorageKey,
} from "../utils/project";
import type { ProjectChange } from "../types/project";

function subscribe(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === projectStorageKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("projects-changed", notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("projects-changed", notify);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(projectStorageKey);
  } catch {
    return "storage-unavailable";
  }
}

function getServerSnapshot() {
  return undefined;
}

export function useProjects() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [saveError, setSaveError] = useState("");
  const { projects, readError } = useMemo(() => {
    try {
      return {
        projects: raw == null ? initialProjects : parseProjectStorage(raw),
        readError: "",
      };
    } catch {
      return {
        projects: [],
        readError:
          "Data lokal tidak dapat dibaca. Periksa izin penyimpanan browser lalu coba lagi. Data tersimpan tidak ditimpa.",
      };
    }
  }, [raw]);
  const ready = raw !== undefined && !readError;

  function reload() {
    setSaveError("");
    window.dispatchEvent(new Event("projects-changed"));
  }

  function commit(change: ProjectChange) {
    if (!ready) return false;
    try {
      // Read before writing so edits in another tab do not erase unrelated projects.
      const raw = localStorage.getItem(projectStorageKey);
      const latest = raw === null ? initialProjects : parseProjectStorage(raw);
      const next = applyProjectChange(latest, change);
      localStorage.setItem(
        projectStorageKey,
        JSON.stringify({ version: 1, projects: next }),
      );
      reload();
      return true;
    } catch (cause) {
      setSaveError(
        cause instanceof Error && cause.message.includes("tidak ditemukan")
          ? cause.message
          : "Perubahan belum tersimpan. Penyimpanan browser mungkin penuh atau tidak tersedia. Coba lagi; isian Anda tetap ada.",
      );
      return false;
    }
  }

  return { projects, ready, error: readError || saveError, reload, commit };
}
