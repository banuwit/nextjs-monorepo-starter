import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStepId } from "../types/checkout";
import { CHECKOUT_STEP_IDS, CHECKOUT_STEPS } from "../utils/checkout";

type CheckoutStepperProps = {
  stepIndex: number;
  locked: boolean;
  onStepSelect: (step: CheckoutStepId) => void;
};

export function CheckoutStepper({
  stepIndex,
  locked,
  onStepSelect,
}: CheckoutStepperProps) {
  const currentStep = CHECKOUT_STEP_IDS[stepIndex] ?? "customer";

  return (
    <nav aria-label="Checkout steps" className="flex flex-col gap-2">
      <p
        aria-hidden="true"
        className="text-sm text-muted-foreground @lg/main:hidden"
      >
        Step {stepIndex + 1} of {CHECKOUT_STEP_IDS.length}
        <span className="font-medium text-foreground">
          {" "}
          · {CHECKOUT_STEPS[currentStep].label}
        </span>
      </p>
      <ol className="flex items-center gap-2.5">
        {CHECKOUT_STEP_IDS.map((step, index) => {
          const completed = index < stepIndex;
          const current = index === stepIndex;
          const content = (
            <>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center text-xs",
                  completed && "rounded-full bg-primary text-primary-foreground",
                  current &&
                    "rounded-md border border-dashed border-foreground/50 bg-muted",
                  !completed &&
                    !current &&
                    "rounded-full border border-border bg-card text-muted-foreground",
                )}
              >
                {completed ? (
                  <CheckIcon aria-hidden="true" className="size-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "text-sm @max-lg/main:sr-only",
                  completed || current
                    ? "font-medium"
                    : "text-muted-foreground",
                )}
              >
                {CHECKOUT_STEPS[step].label}
              </span>
            </>
          );

          return (
            <li
              key={step}
              aria-current={current ? "step" : undefined}
              className="flex flex-1 items-center gap-2.5 last:flex-none"
            >
              {completed && !locked ? (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  onClick={() => onStepSelect(step)}
                >
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2">{content}</span>
              )}
              {index < CHECKOUT_STEP_IDS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 min-w-4 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
                    completed ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
