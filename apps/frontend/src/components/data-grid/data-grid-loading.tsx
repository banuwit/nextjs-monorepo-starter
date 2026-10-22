import { Skeleton } from "@/components/ui/skeleton"

/** Accessible loading placeholder shared by client and server grids. */
export function DataGridLoading() {
  return (
    <div role="status" className="space-y-3 p-4">
      <span className="sr-only">Loading data...</span>
      <div aria-hidden="true" className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-5 min-w-0 flex-1" />
            <Skeleton className="h-5 min-w-0 flex-1" />
            <Skeleton className="hidden h-5 min-w-0 flex-1 sm:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
