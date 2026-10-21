import type { ReactNode } from "react";

export function AppBody({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="app-body"
      className="@container/main mx-auto flex w-full min-w-0 flex-1 flex-col gap-4 p-4"
    >
      {children}
    </div>
  );
}
