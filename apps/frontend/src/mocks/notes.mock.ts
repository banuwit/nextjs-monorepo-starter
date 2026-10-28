import type { Note, Person } from "../features/notes/types/notes";

export const notePeople: Person[] = [
  { id: "daniel", label: "Daniel Okafor", role: "Support lead" },
  { id: "sofia", label: "Sofia Chen", role: "Incident manager" },
  { id: "marcus", label: "Marcus Reed", role: "Site reliability" },
  { id: "priya", label: "Priya Sharma", role: "Customer success" },
];
const text = (value: string) => ({ type: "text", text: value });
const paragraph = (value: string) => ({
  type: "paragraph",
  content: value ? [text(value)] : [],
});
const heading = (value: string, level = 2) => ({
  type: "heading",
  attrs: { level },
  content: [text(value)],
});
const cell = (value: string, header = false) => ({
  type: header ? "tableHeader" : "tableCell",
  content: [paragraph(value)],
});

export const exampleNote: Note = {
  title: "Escalation Playbook",
  content: {
    type: "doc",
    content: [
      heading("Escalation Playbook", 1),
      {
        type: "paragraph",
        content: [
          text(
            "How Loomwell support hands a customer problem to engineering without losing context. ",
          ),
          {
            type: "mention",
            attrs: {
              id: "daniel",
              label: "Daniel Okafor",
              role: "Support lead",
            },
          },
          text(" owns this page; propose edits in "),
          { ...text("#support-ops"), marks: [{ type: "code" }] },
          text("."),
        ],
      },
      { type: "tableOfContents" },
      heading("When to Escalate"),
      paragraph(
        "Escalate as soon as one of these is true. When in doubt, escalate and let the next tier downgrade it.",
      ),
      {
        type: "bulletList",
        content: [
          "Email stops syncing for a workspace for more than 15 minutes.",
          "Inbox search misses conversations that exist, for more than one agent.",
          "Scheduled replies send at the wrong time, or not at all.",
          "Anything that looks like another workspace’s data is always Tier 3.",
        ].map((value) => ({ type: "listItem", content: [paragraph(value)] })),
      },
      heading("Escalation Tiers"),
      paragraph(
        "Targets run from the moment the ticket is tagged, around the clock for Tier 3.",
      ),
      {
        type: "table",
        content: [
          {
            type: "tableRow",
            content: ["Tier", "Owner", "Response target", "Channel"].map(
              (value) => cell(value, true),
            ),
          },
          ...[
            ["Tier 1", "Daniel Okafor", "4 business hours", "#support-desk"],
            ["Tier 2", "Sofia Chen", "1 business hour", "#engineering-support"],
            ["Tier 3", "Marcus Reed", "15 minutes", "#incidents"],
          ].map((row) => ({
            type: "tableRow",
            content: row.map((value) => cell(value)),
          })),
        ],
      },
      heading("Paging Engineering", 3),
      paragraph(
        "Include the workspace, customer impact, and what you have already tried. Page the on-call engineer for urgent incidents.",
      ),
      {
        type: "blockquote",
        content: [
          paragraph(
            "Keep one thread per incident. Link related tickets to that thread so context stays together.",
          ),
        ],
      },
      heading("Handoff Checklist"),
      {
        type: "taskList",
        content: [
          "Confirm the affected workspace and severity.",
          "Attach timestamps, screenshots, and reproduction steps.",
          "Assign an owner and agree on the next update.",
        ].map((value, index) => ({
          type: "taskItem",
          attrs: { checked: index === 0 },
          content: [paragraph(value)],
        })),
      },
      heading("Handoff Note"),
      paragraph(
        "Use this template to give the next person enough context to act.",
      ),
      {
        type: "codeBlock",
        content: [
          text(
            "Workspace:\nImpact and severity:\nSteps to reproduce:\nWhat we have tried:\nOwner and next update:",
          ),
        ],
      },
      heading("Search Diagnostics", 3),
      paragraph(
        "Record the query, expected result, and when the message was received. Include a reproducible example without sensitive customer data.",
      ),
      heading("Customer Updates", 3),
      paragraph(
        "Acknowledge the impact, explain what we know, and give a clear time for the next update.",
      ),
      heading("Review Cadence"),
      paragraph(
        "Review escalations every Friday. Update this playbook when the handoff process changes.",
      ),
      paragraph(""),
    ],
  },
};
