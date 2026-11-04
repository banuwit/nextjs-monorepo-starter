import type { Doc } from "yjs";
import type { Awareness } from "y-protocols/awareness";

export type Person = {
  id: string;
  name: string;
  role: string;
  /** Six-digit hex color; CollaborationCaret rejects any other format. */
  color: string;
};

export type CommentReply = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type CommentThread = {
  id: string;
  authorId: string;
  /** Text the thread is anchored to; kept after the anchor is removed. */
  quote: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
};

export type PeerStep =
  | { kind: "wait"; ms: number }
  /** Place the caret after `after` and type `text` character by character. */
  | { kind: "type"; after: string; text: string; cps?: number }
  /** Select `find` and hold the selection. */
  | { kind: "select"; find: string; holdMs?: number }
  /** Park the caret after `after` without typing. */
  | { kind: "park"; after: string }
  | { kind: "reply"; threadId: string; text: string };

export type PeerTrack = {
  personId: string;
  delayMs: number;
  steps: PeerStep[];
};

export type PresenceEntry = {
  clientId: number;
  user: Person;
  editing: boolean;
  isLocal: boolean;
};

export type RoomSnapshot = {
  online: boolean;
  /** Local edits waiting to be sent to the room. */
  queuedLocal: number;
  /** Teammate edits waiting to be merged. */
  queuedRemote: number;
  lastEditedAt: number | null;
};

export type MergeResult = { merged: number; sent: number };

/**
 * What the workspace needs from a collaboration room. `DemoRoom` implements
 * it with scripted teammates; a real provider (Hocuspocus, y-websocket, …)
 * can be wrapped in the same shape and handed to the workspace instead.
 */
export interface RoomAdapter {
  readonly doc: Doc;
  readonly awareness: Awareness;
  subscribe(listener: () => void): () => void;
  subscribePresence(listener: () => void): () => void;
  subscribeThreads(listener: () => void): () => void;
  getSnapshot(): RoomSnapshot;
  getPresence(): PresenceEntry[];
  getThreads(): CommentThread[];
  setThread(thread: CommentThread): void;
  updateThread(
    id: string,
    update: (thread: CommentThread) => CommentThread,
  ): void;
  isOnline(): boolean;
  setOnline(online: boolean): MergeResult;
  destroy(): void;
}
