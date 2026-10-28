"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CrudPage({
  title,
  actions,
  children,
  sidePanel,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  sidePanel?: ReactNode;
}) {
  // Simpan panel terakhir agar tetap tampil selama animasi tutup berjalan.
  const [lastPanel, setLastPanel] = useState(sidePanel);
  const [mounted, setMounted] = useState(!!sidePanel);
  const [visible, setVisible] = useState(false);
  if (sidePanel && sidePanel !== lastPanel) setLastPanel(sidePanel);
  if (sidePanel && !mounted) setMounted(true);
  useEffect(() => {
    if (!sidePanel) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(frame);
  }, [!!sidePanel]); // eslint-disable-line react-hooks/exhaustive-deps
  const open = !!sidePanel;
  useEffect(() => {
    if (open || !mounted) return;
    // Timer (bukan transitionend) agar tetap berjalan saat reduced motion.
    const timer = setTimeout(() => {
      setMounted(false);
      setVisible(false);
      setLastPanel(undefined);
    }, 320);
    return () => clearTimeout(timer);
  }, [open, mounted]);
  return (
    <div className="@container flex min-w-0 flex-1 flex-col md:flex-row">
      <div
        data-slot="crud-page-body"
        className={cn(
          "min-w-0 flex-1 [&_[data-slot=page-heading-content]]:flex-wrap",
          sidePanel && "hidden md:block",
        )}
      >
        <AppBody>
          <PageHeading
            title={title}
            currentPage={title}
          >
            {actions}
          </PageHeading>
          {children}
        </AppBody>
      </div>
      {mounted && (
        <div
          data-slot="crud-side-panel"
          inert={!open}
          className={cn(
            "order-first w-full min-w-0 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:sticky md:top-12 md:order-last",
            open && visible ? "md:w-[min(28rem,45cqw)]" : "md:w-0",
            open
              ? "max-md:animate-in max-md:fade-in max-md:duration-200"
              : "max-md:hidden",
          )}
        >
          <div className="md:ml-auto md:w-[min(28rem,45cqw)]">
            {lastPanel}
          </div>
        </div>
      )}
    </div>
  );
}
