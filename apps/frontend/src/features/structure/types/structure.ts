export type StructureApp =
  "Stripe" | "Neon" | "Claude" | "ClickUp" | "Resend" | "Custom Code" | "Slack";

export type RunResult = {
  status: "Passed" | "Failed" | "Skipped" | "Not run" | "Running";
  detail: string;
  metric?: string;
};

export type StructureStep = {
  id: string;
  title: string;
  detail: string;
  app: StructureApp;
  parent?: string;
  branch?: string;
  fixture?: RunResult;
};
