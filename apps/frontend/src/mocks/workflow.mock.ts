export type WorkflowStep = {
  id: string;
  time: string;
  phase: string;
  title: string;
  status: "completed" | "running" | "pending";
  attachment: string;
  rating: number;
  actionLabel: string;
  description: string;
  owner: string;
};

// Frontend-only sample workflow based on the public ReUI timeline-6 preview.
export const workflowSteps: WorkflowStep[] = [
  {
    id: "intake",
    time: "09:00",
    phase: "Intake",
    title: "Trigger Captured",
    status: "completed",
    attachment: "intake.json",
    rating: 4.8,
    actionLabel: "Open",
    description: "Customer, urgency, and routing fields arrived cleanly.",
    owner: "Sam Lee",
  },
  {
    id: "enrichment",
    time: "09:14",
    phase: "Enrichment",
    title: "Records Matched",
    status: "completed",
    attachment: "crm-match.csv",
    rating: 4.9,
    actionLabel: "Review",
    description: "CRM and billing records attached before risk review.",
    owner: "Ira Wells",
  },
  {
    id: "review",
    time: "09:31",
    phase: "Review",
    title: "Policy Cleared",
    status: "completed",
    attachment: "policy.pdf",
    rating: 4.7,
    actionLabel: "View",
    description: "Terms, region rules, and account flags passed review.",
    owner: "Owen Fox",
  },
  {
    id: "approval",
    time: "09:48",
    phase: "Approval",
    title: "Lead Signoff Running",
    status: "running",
    attachment: "signoff.docx",
    rating: 4.4,
    actionLabel: "Approve",
    description: "The recommended decision is with the account lead.",
    owner: "Maya Chen",
  },
  {
    id: "execution",
    time: "10:05 ETA",
    phase: "Execution",
    title: "Changes Scheduled",
    status: "pending",
    attachment: "changes.json",
    rating: 4.6,
    actionLabel: "Inspect",
    description: "Approved changes are queued for the next execution window.",
    owner: "Alex Morgan",
  },
  {
    id: "verification",
    time: "10:20 ETA",
    phase: "Verification",
    title: "Quality Check",
    status: "pending",
    attachment: "checks.csv",
    rating: 4.8,
    actionLabel: "Check",
    description: "Confirm the outcome and verify every required change.",
    owner: "Jordan Park",
  },
  {
    id: "completion",
    time: "10:35 ETA",
    phase: "Completion",
    title: "Record Updated",
    status: "pending",
    attachment: "summary.pdf",
    rating: 4.7,
    actionLabel: "View",
    description: "The final decision and supporting evidence will be recorded.",
    owner: "Ira Wells",
  },
  {
    id: "notification",
    time: "10:45 ETA",
    phase: "Notification",
    title: "Customer Notified",
    status: "pending",
    attachment: "notice.docx",
    rating: 4.9,
    actionLabel: "Preview",
    description: "Send the customer a clear summary of the completed request.",
    owner: "Sam Lee",
  },
];
