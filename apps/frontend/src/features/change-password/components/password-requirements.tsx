import { CheckIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countMetRequirements,
  passwordRequirements,
} from "../utils/password-requirements";

export function PasswordRequirements({ password }: { password: string }) {
  const met = countMetRequirements(password);
  const total = passwordRequirements.length;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p id="password-requirements-title" className="text-xs font-medium">
          Password requirements
        </p>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {met} of {total} met
        </p>
      </div>
      <ul
        aria-labelledby="password-requirements-title"
        className="grid gap-1.5 sm:grid-cols-2"
      >
        {passwordRequirements.map((requirement) => {
          const passed = requirement.test(password);
          return (
            <li
              key={requirement.id}
              className={cn(
                "flex items-center gap-2 text-xs",
                passed
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {passed ? (
                <CheckIcon className="size-3.5" aria-hidden />
              ) : (
                <CircleIcon className="size-3.5" aria-hidden />
              )}
              {requirement.label}
              <span className="sr-only">{passed ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
