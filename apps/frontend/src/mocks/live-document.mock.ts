import type { JSONContent } from "@tiptap/react";
import type {
  CommentThread,
  PeerTrack,
  Person,
} from "../features/live-document/types/live-document";

// Sample teammates, document, comments and scripted edits for the Live
// Document demo room. Replace PEOPLE/SPEC/THREADS with real data and delete
// PEER_TRACKS when a collaboration provider is wired in.

export const LOCAL_USER_ID = "daniel";

export const PEOPLE: Person[] = [
  {
    id: "daniel",
    name: "Daniel Okafor",
    role: "Product manager",
    color: "#e24b4b",
  },
  {
    id: "maya",
    name: "Maya Chen",
    role: "Support lead",
    color: "#7c3aed",
  },
  {
    id: "lena",
    name: "Lena Fischer",
    role: "Engineer",
    color: "#0d9488",
  },
];

const text = (value: string, marks?: JSONContent["marks"]): JSONContent =>
  marks ? { type: "text", text: value, marks } : { type: "text", text: value };
const comment = (value: string, id: string) =>
  text(value, [{ type: "comment", attrs: { id } }]);
const paragraph = (...content: (string | JSONContent)[]): JSONContent => ({
  type: "paragraph",
  content: content.map((part) => (typeof part === "string" ? text(part) : part)),
});
const heading = (value: string, level = 2): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [text(value)],
});
const bullets = (...items: JSONContent[]): JSONContent => ({
  type: "bulletList",
  content: items.map((item) => ({ type: "listItem", content: [item] })),
});
const tasks = (...items: [boolean, string][]): JSONContent => ({
  type: "taskList",
  content: items.map(([checked, value]) => ({
    type: "taskItem",
    attrs: { checked },
    content: [paragraph(value)],
  })),
});

export const SPEC_TITLE = "Shared Drafts";
export const SPEC_META = ["Loomwell 4.3", "Product spec"];

export const SPEC: JSONContent = {
  type: "doc",
  content: [
    paragraph(
      "Loomwell 4.3 lets two support agents write one customer reply together before it goes out. This spec covers the first release, planned for general availability on November 18. A private beta opens to 40 accounts on October 28.",
    ),
    heading("Problem"),
    paragraph(
      "Hard tickets pull in a second agent on 22% of escalations. Today the helper pastes a draft into an internal note, waits for a thumbs up, and the owner copies the final text back into the reply. Across 1,840 escalations in August, that loop added ",
      comment("a median of 14 minutes", "thread-median"),
      " to first response.",
    ),
    heading("Goals"),
    bullets(
      paragraph(
        "Two agents edit the same reply draft at once, with named cursors, and see each other's changes as they type.",
      ),
      paragraph(
        "Cut the median handoff on escalations from 14 minutes to under 5, measured from invite to send.",
      ),
      paragraph("Every draft keeps one owner, and only the owner sends it."),
      paragraph("Nothing typed is lost when an agent drops offline."),
    ),
    heading("Non-Goals"),
    bullets(
      paragraph("Co-editing internal notes, macros or help center articles."),
      paragraph("Suggesting mode or tracked changes inside a reply."),
    ),
    heading("How It Works"),
    paragraph(
      "Any agent on a ticket can invite a teammate from the reply box. The teammate joins the draft in place, and a presence row above the composer shows everyone in it. ",
      comment("Only the owner can press Send", "thread-owner"),
      "; a teammate can ask for ownership and the owner approves it in one click.",
    ),
    paragraph(
      "Drafts sync through the existing realtime gateway. If an agent drops offline, edits queue locally and merge when the connection returns, with no conflict prompts. The reply box shows an Offline badge until the queue is empty.",
    ),
    heading("Open Questions"),
    bullets(
      paragraph(
        "Can ",
        comment("agents on the free plan", "thread-pricing"),
        " invite a teammate, or is co-editing a Team plan feature?",
      ),
      paragraph(
        "Should the beta include the mobile app, which still uses the old composer?",
      ),
    ),
    heading("Launch Checklist"),
    tasks(
      [true, "Presence row and named cursors in the composer."],
      [true, "Ownership handoff with a single approval."],
      [false, "Offline queue with merge on reconnect."],
      [false, "Beta invite list for the first 40 accounts."],
    ),
  ],
};

export const THREADS: CommentThread[] = [
  {
    id: "thread-median",
    authorId: "daniel",
    quote: "a median of 14 minutes",
    body: "These numbers come from the August export. Is queue time included, or only agent handle time?",
    createdAt: "2025-09-25T15:40:00",
    resolved: false,
    replies: [],
  },
  {
    id: "thread-owner",
    authorId: "maya",
    quote: "Only the owner can press Send",
    body: "What does the teammate see if the owner goes offline mid-draft? We should say whether ownership moves automatically.",
    createdAt: "2025-09-26T09:12:00",
    resolved: false,
    replies: [
      {
        id: "reply-owner-1",
        authorId: "daniel",
        body: "It stays with the owner. The teammate gets an Ask for ownership button once the owner has been gone for two minutes.",
        createdAt: "2025-09-26T09:30:00",
      },
    ],
  },
  {
    id: "thread-pricing",
    authorId: "daniel",
    quote: "agents on the free plan",
    body: "Pricing needs this settled before the beta invite list goes out.",
    createdAt: "2025-09-26T11:30:00",
    resolved: false,
    replies: [],
  },
];

export const PEER_TRACKS: PeerTrack[] = [
  {
    personId: "maya",
    delayMs: 1800,
    steps: [
      {
        kind: "type",
        after: "A private beta opens to 40 accounts on October 28.",
        text: " Enterprise accounts join the beta on November 4.",
        cps: 13,
      },
      { kind: "wait", ms: 2500 },
      { kind: "select", find: "a median of 14 minutes", holdMs: 4000 },
      {
        kind: "reply",
        threadId: "thread-median",
        text: "Queue time is included. I will split the two numbers in the next revision.",
      },
      { kind: "wait", ms: 3500 },
      {
        kind: "type",
        after: "The reply box shows an Offline badge until the queue is empty.",
        text: " Queued edits also show a small clock next to the agent's avatar.",
        cps: 12,
      },
      { kind: "wait", ms: 6000 },
      { kind: "select", find: "Suggesting mode or tracked changes", holdMs: 3000 },
      { kind: "park", after: "Suggesting mode or tracked changes inside a reply." },
    ],
  },
  {
    personId: "lena",
    delayMs: 5200,
    steps: [
      {
        kind: "type",
        after: "measured from invite to send.",
        text: " The dashboard tracks p50 and p90 weekly.",
        cps: 11,
      },
      { kind: "wait", ms: 3000 },
      {
        kind: "select",
        find: "Nothing typed is lost when an agent drops offline.",
        holdMs: 3500,
      },
      { kind: "wait", ms: 2000 },
      {
        kind: "type",
        after: "which still uses the old composer?",
        text: " Mobile moves to the new composer in 4.4, so no.",
        cps: 12,
      },
      { kind: "wait", ms: 4000 },
      {
        kind: "reply",
        threadId: "thread-pricing",
        text: "Billing can gate the invite button by plan. One flag, no new UI.",
      },
      { kind: "park", after: "Offline queue with merge on reconnect." },
    ],
  },
];
