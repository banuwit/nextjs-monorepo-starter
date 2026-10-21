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

export function insertStep(
  steps: FlowStep[],
  id: string,
  parent: string,
  target?: string,
): FlowStep[] {
  const child = steps.find(
    (step) => step.id === target && step.parent === parent,
  );
  return [
    ...steps.map((step) =>
      step === child ? { ...step, parent: id, branch: undefined } : step,
    ),
    {
      id,
      parent,
      branch: child?.branch,
      title: "New step",
      detail: "Not configured yet",
      app: "Custom Code",
    },
  ];
}

export function removeStep(steps: FlowStep[], id: string): FlowStep[] {
  const removed = steps.find((step) => step.id === id);
  if (!removed?.parent) return steps;
  return steps
    .filter((step) => step.id !== id)
    .map((step) =>
      step.parent === id
        ? {
            ...step,
            parent: removed.parent,
            branch: step.branch ?? removed.branch,
          }
        : step,
    );
}

// Recorded demo outcomes; no external services are called.
export function simulateRun(steps: FlowStep[]): Record<string, RunResult> {
  const results: Record<string, RunResult> = {};
  function visit(step: FlowStep, active: boolean) {
    const taken = active && (!step.branch || step.branch === "Promised");
    const result: RunResult = taken
      ? (step.fixture ?? {
          status: "Failed",
          detail: "No test fixture configured",
        })
      : {
          status: "Skipped",
          detail: active ? "Branch not taken" : "Upstream skipped",
        };
    results[step.id] = result;
    steps
      .filter((child) => child.parent === step.id)
      .forEach((child) => visit(child, result.status === "Passed"));
  }
  steps.filter((step) => !step.parent).forEach((step) => visit(step, true));
  return results;
}
