"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  LOCAL_USER_ID,
  PEER_TRACKS,
  PEOPLE,
  SPEC,
  THREADS,
} from "@/mocks/live-document.mock";
import { liveDocumentSchema } from "../schemas/live-document.schema";
import type {
  CommentThread,
  Person,
  PresenceEntry,
  RoomAdapter,
  RoomSnapshot,
} from "../types/live-document";
import { DemoRoom } from "../utils/demo-room";

const EMPTY_PRESENCE: PresenceEntry[] = [];
const EMPTY_THREADS: CommentThread[] = [];
const OFFLINE_SNAPSHOT: RoomSnapshot = {
  online: false,
  queuedLocal: 0,
  queuedRemote: 0,
  lastEditedAt: null,
};

export const localUser: Person = PEOPLE.find(
  ({ id }) => id === LOCAL_USER_ID,
) ?? { id: "you", name: "You", role: "", color: "#e24b4b" };

/**
 * Opens a demo room for the given session on the client. Bumping `session`
 * replays the scripted session from the sample document.
 */
export function useDemoRoom(session: number) {
  const [state, setState] = useState<{ session: number; room: RoomAdapter } | null>(
    null,
  );

  useEffect(() => {
    const room = new DemoRoom({
      schema: liveDocumentSchema,
      content: SPEC,
      threads: THREADS,
      people: PEOPLE,
      tracks: PEER_TRACKS,
      localUser,
    });
    // The room exists only after this client effect runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ session, room });
    return () => room.destroy();
  }, [session]);

  return state?.session === session ? state.room : null;
}

export function useRoomSnapshot(room: RoomAdapter) {
  return useSyncExternalStore(
    room.subscribe,
    room.getSnapshot,
    () => OFFLINE_SNAPSHOT,
  );
}

export function usePresence(room: RoomAdapter) {
  return useSyncExternalStore(
    room.subscribePresence,
    room.getPresence,
    () => EMPTY_PRESENCE,
  );
}

export function useThreads(room: RoomAdapter) {
  return useSyncExternalStore(
    room.subscribeThreads,
    room.getThreads,
    () => EMPTY_THREADS,
  );
}
