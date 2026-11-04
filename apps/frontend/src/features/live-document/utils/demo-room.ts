import * as Y from "yjs";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import { prosemirrorJSONToYDoc } from "@tiptap/y-tiptap";
import type { Schema } from "@tiptap/pm/model";
import type { JSONContent } from "@tiptap/react";
import { DOC_FIELD } from "../schemas/live-document.schema";
import type {
  CommentThread,
  MergeResult,
  PeerStep,
  PeerTrack,
  Person,
  PresenceEntry,
  RoomAdapter,
  RoomSnapshot,
} from "../types/live-document";
import { currentTime } from "./time";

// Demo stand-in for a collaboration provider. `doc` is the local replica the
// editor binds to; `server` is the shared room that scripted teammates edit.
// Updates flow between the two like a websocket would, and are queued while
// the room is offline so Yjs can merge them on reconnect.

export const THREADS_KEY = "threads";
const HEARTBEAT_MS = 10_000;

type Listener = () => void;

class Channel {
  private listeners = new Set<Listener>();
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  emit() {
    for (const listener of this.listeners) listener();
  }
}

type AwarenessUser = Pick<Person, "id" | "name" | "color">;
type AwarenessState = { user?: AwarenessUser; cursor?: unknown };

function* xmlTexts(
  node: Y.XmlFragment | Y.XmlElement,
): Generator<Y.XmlText> {
  for (const child of node.toArray()) {
    if (child instanceof Y.XmlText) yield child;
    else if (child instanceof Y.XmlElement) yield* xmlTexts(child);
  }
}

/** Plain text of a Y.XmlText with inline nodes counted as one character. */
function plainText(text: Y.XmlText) {
  return (text.toDelta() as { insert: unknown }[])
    .map((op) => (typeof op.insert === "string" ? op.insert : "\u0000"))
    .join("");
}

export function findText(doc: Y.Doc, needle: string) {
  for (const text of xmlTexts(doc.getXmlFragment(DOC_FIELD))) {
    const index = plainText(text).indexOf(needle);
    if (index >= 0) return { text, index };
  }
  return null;
}

class Peer {
  readonly awareness = new Awareness(new Y.Doc());

  constructor(
    readonly person: Person,
    readonly track: PeerTrack,
  ) {
    const { id, name, color } = person;
    this.awareness.setLocalState({ user: { id, name, color } });
  }

  get clientId() {
    return this.awareness.clientID;
  }

  setCursor(anchor: Y.RelativePosition, head: Y.RelativePosition = anchor) {
    this.awareness.setLocalStateField("cursor", {
      anchor: Y.relativePositionToJSON(anchor),
      head: Y.relativePositionToJSON(head),
    });
  }

  /** Re-sends the same state with a newer clock so it is not aged out. */
  touch() {
    this.awareness.setLocalState(this.awareness.getLocalState());
  }

  destroy() {
    this.awareness.destroy();
  }
}

export type DemoRoomOptions = {
  schema: Schema;
  content: JSONContent;
  threads: CommentThread[];
  people: Person[];
  tracks: PeerTrack[];
  localUser: Person;
};

export class DemoRoom implements RoomAdapter {
  readonly doc = new Y.Doc();
  readonly awareness: Awareness;
  private readonly server: Y.Doc;
  private readonly peers: Peer[];
  private online = true;
  private inbound: Uint8Array[] = [];
  private outbound: Uint8Array[] = [];
  private lastEditedAt: number | null = null;
  private destroyed = false;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private readonly heartbeat: ReturnType<typeof setInterval>;

  private snapshot: RoomSnapshot = {
    online: true,
    queuedLocal: 0,
    queuedRemote: 0,
    lastEditedAt: null,
  };
  private presence: PresenceEntry[] = [];
  private threadList: CommentThread[] = [];
  private readonly snapshotChannel = new Channel();
  private readonly presenceChannel = new Channel();
  private readonly threadChannel = new Channel();

  readonly subscribe = this.snapshotChannel.subscribe;
  readonly subscribePresence = this.presenceChannel.subscribe;
  readonly subscribeThreads = this.threadChannel.subscribe;
  readonly getSnapshot = () => this.snapshot;
  readonly getPresence = () => this.presence;
  readonly getThreads = () => this.threadList;

  constructor(private readonly options: DemoRoomOptions) {
    this.server = prosemirrorJSONToYDoc(
      options.schema,
      options.content,
      DOC_FIELD,
    );
    const seed = this.server.getMap<CommentThread>(THREADS_KEY);
    this.server.transact(() => {
      for (const thread of options.threads) seed.set(thread.id, thread);
    }, "seed");
    Y.applyUpdate(this.doc, Y.encodeStateAsUpdate(this.server), "seed");

    const { id, name, color } = options.localUser;
    this.awareness = new Awareness(this.doc);
    this.awareness.setLocalStateField("user", { id, name, color });
    this.awareness.on("change", this.refreshPresence);
    this.refreshPresence();

    this.threads.observe(this.refreshThreads);
    this.refreshThreads();

    this.doc.on("update", this.handleLocalUpdate);
    this.server.on("update", this.handleServerUpdate);

    this.peers = options.tracks.flatMap((track) => {
      const person = options.people.find(({ id }) => id === track.personId);
      return person ? [new Peer(person, track)] : [];
    });
    for (const peer of this.peers) {
      this.publish(peer);
      void this.play(peer);
    }
    this.heartbeat = setInterval(() => {
      for (const peer of this.peers) {
        peer.touch();
        this.publish(peer);
      }
    }, HEARTBEAT_MS);
  }

  get threads() {
    return this.doc.getMap<CommentThread>(THREADS_KEY);
  }

  setThread(thread: CommentThread) {
    this.threads.set(thread.id, thread);
  }

  updateThread(id: string, update: (thread: CommentThread) => CommentThread) {
    const thread = this.threads.get(id);
    if (thread) this.threads.set(id, update(thread));
  }

  isOnline() {
    return this.online;
  }

  /** Simulates disconnecting from and reconnecting to the room. */
  setOnline(online: boolean): MergeResult {
    if (online === this.online || this.destroyed) return { merged: 0, sent: 0 };
    this.online = online;
    const result: MergeResult = { merged: 0, sent: 0 };
    if (online) {
      result.merged = this.inbound.length;
      result.sent = this.outbound.length;
      const inbound = this.inbound;
      const outbound = this.outbound;
      this.inbound = [];
      this.outbound = [];
      if (inbound.length)
        Y.applyUpdate(this.doc, Y.mergeUpdates(inbound), "remote");
      if (outbound.length)
        Y.applyUpdate(this.server, Y.mergeUpdates(outbound), "local");
      for (const peer of this.peers) {
        peer.touch();
        this.publish(peer);
      }
    } else {
      removeAwarenessStates(
        this.awareness,
        this.peers.map((peer) => peer.clientId),
        "offline",
      );
    }
    this.emit();
    return result;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    clearInterval(this.heartbeat);
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    this.doc.off("update", this.handleLocalUpdate);
    this.server.off("update", this.handleServerUpdate);
    this.threads.unobserve(this.refreshThreads);
    this.awareness.off("change", this.refreshPresence);
    for (const peer of this.peers) peer.destroy();
    this.awareness.destroy();
  }

  private handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
    if (origin === "remote" || origin === "seed") return;
    this.lastEditedAt = Date.now();
    if (this.online) Y.applyUpdate(this.server, update, "local");
    else this.outbound.push(update);
    this.emit();
  };

  private handleServerUpdate = (update: Uint8Array, origin: unknown) => {
    if (origin === "local" || origin === "seed") return;
    this.lastEditedAt = Date.now();
    if (this.online) Y.applyUpdate(this.doc, update, "remote");
    else this.inbound.push(update);
    this.emit();
  };

  private emit() {
    this.snapshot = {
      online: this.online,
      queuedLocal: this.outbound.length,
      queuedRemote: this.inbound.length,
      lastEditedAt: this.lastEditedAt,
    };
    this.snapshotChannel.emit();
  }

  private refreshPresence = () => {
    const order = this.options.people.map(({ id }) => id);
    const entries: PresenceEntry[] = [];
    for (const [clientId, state] of this.awareness.getStates() as Map<
      number,
      AwarenessState
    >) {
      if (!state.user) continue;
      const user =
        this.options.people.find(({ id }) => id === state.user?.id) ??
        ({ ...state.user, role: "" } satisfies Person);
      entries.push({
        clientId,
        user,
        editing: state.cursor != null,
        isLocal: clientId === this.awareness.clientID,
      });
    }
    entries.sort(
      (a, b) =>
        Number(b.isLocal) - Number(a.isLocal) ||
        order.indexOf(a.user.id) - order.indexOf(b.user.id),
    );
    this.presence = entries;
    this.presenceChannel.emit();
  };

  private refreshThreads = () => {
    this.threadList = [...this.threads.values()].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
    this.threadChannel.emit();
  };

  private publish(peer: Peer) {
    if (!this.online || this.destroyed) return;
    applyAwarenessUpdate(
      this.awareness,
      encodeAwarenessUpdate(peer.awareness, [peer.clientId]),
      "remote",
    );
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        resolve();
      }, ms);
      this.timers.add(timer);
    });
  }

  private async play(peer: Peer) {
    await this.sleep(peer.track.delayMs);
    for (const step of peer.track.steps) {
      if (this.destroyed) return;
      await this.runStep(peer, step);
    }
  }

  private async runStep(peer: Peer, step: PeerStep) {
    switch (step.kind) {
      case "wait":
        await this.sleep(step.ms);
        return;
      case "park": {
        const hit = findText(this.server, step.after);
        if (!hit) return;
        peer.setCursor(
          Y.createRelativePositionFromTypeIndex(
            hit.text,
            hit.index + step.after.length,
          ),
        );
        this.publish(peer);
        return;
      }
      case "select": {
        const hit = findText(this.server, step.find);
        if (!hit) return;
        peer.setCursor(
          Y.createRelativePositionFromTypeIndex(hit.text, hit.index),
          Y.createRelativePositionFromTypeIndex(
            hit.text,
            hit.index + step.find.length,
          ),
        );
        this.publish(peer);
        await this.sleep(step.holdMs ?? 3000);
        return;
      }
      case "reply": {
        this.server.transact(() => {
          const map = this.server.getMap<CommentThread>(THREADS_KEY);
          const thread = map.get(step.threadId);
          if (!thread) return;
          map.set(step.threadId, {
            ...thread,
            replies: [
              ...thread.replies,
              {
                id: `${step.threadId}-${peer.person.id}-${thread.replies.length + 1}`,
                authorId: peer.person.id,
                body: step.text,
                createdAt: currentTime().toISOString(),
              },
            ],
          });
        }, peer);
        return;
      }
      case "type": {
        const hit = findText(this.server, step.after);
        if (!hit) return;
        let cursor = Y.createRelativePositionFromTypeIndex(
          hit.text,
          hit.index + step.after.length,
        );
        peer.setCursor(cursor);
        this.publish(peer);
        await this.sleep(600);
        const delay = 1000 / (step.cps ?? 12);
        for (const char of step.text) {
          if (this.destroyed) return;
          const absolute = Y.createAbsolutePositionFromRelativePosition(
            cursor,
            this.server,
          );
          if (!absolute || !(absolute.type instanceof Y.XmlText)) return;
          const { type: text, index } = absolute;
          this.server.transact(() => text.insert(index, char), peer);
          cursor = Y.createRelativePositionFromTypeIndex(text, index + 1);
          peer.setCursor(cursor);
          this.publish(peer);
          await this.sleep(delay + Math.random() * delay * 0.6);
        }
        return;
      }
    }
  }
}
