export type FlowApp =
  "Stripe" | "Neon" | "Claude" | "ClickUp" | "Resend" | "Custom Code" | "Slack";

export type RunResult = {
  status: "Passed" | "Failed" | "Skipped" | "Not run" | "Running";
  detail: string;
  metric?: string;
};

export type FlowStep = {
  id: string;
  title: string;
  detail: string;
  app: FlowApp;
  parent?: string;
  branch?: string;
  fixture?: RunResult;
};
