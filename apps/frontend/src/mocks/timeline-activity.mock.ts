type Release = {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  description: string;
  type: "New" | "Improved";
  impact: string;
  changes: {
    label: string;
    tone: "violet" | "amber" | "emerald" | "neutral";
  }[];
};

export const releases: Release[] = [
  {
    id: "release-channels",
    date: "2025-05-01",
    dateLabel: "May 2025",
    title: "v2.5 Release Channels",
    description:
      "Create staged release channels for beta teams, enterprise accounts, and internal QA cohorts.",
    type: "New",
    impact: "Team Rollout",
    changes: [
      { label: "Channel Permissions", tone: "violet" },
      { label: "Scheduled Publishing", tone: "amber" },
    ],
  },
  {
    id: "ai-assist",
    date: "2025-04-01",
    dateLabel: "Apr 2025",
    title: "v2.4 AI Assist",
    description:
      "Added workspace summaries, prompt presets, and faster review suggestions.",
    type: "New",
    impact: "Faster Reviews",
    changes: [
      { label: "Prompt Library", tone: "amber" },
      { label: "Review Summaries", tone: "emerald" },
    ],
  },
  {
    id: "theme-studio",
    date: "2025-03-01",
    dateLabel: "Mar 2025",
    title: "v2.3 Theme Studio",
    description:
      "Introduced token previews, component states, and one-click CSS exports.",
    type: "Improved",
    impact: "Design Systems",
    changes: [
      { label: "Token Previews", tone: "emerald" },
      { label: "CSS Export", tone: "neutral" },
    ],
  },
  {
    id: "live-editing",
    date: "2025-02-01",
    dateLabel: "Feb 2025",
    title: "v2.2 Live Editing",
    description:
      "Improved shared cursors, presence labels, and conflict-safe draft recovery.",
    type: "Improved",
    impact: "Collaboration",
    changes: [
      { label: "Presence Labels", tone: "neutral" },
      { label: "Draft Recovery", tone: "violet" },
    ],
  },
];
