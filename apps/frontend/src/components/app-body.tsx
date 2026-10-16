import type { ReactNode } from "react";

export function AppBody({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="app-body"
      className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6"
    >
      {children}
    </div>
  );
}
