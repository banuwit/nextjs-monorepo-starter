import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface DataGridErrorProps {
  message: string
  onRetry?: () => void
}

export function DataGridError({ message, onRetry }: DataGridErrorProps) {
  return (
    <Empty role="alert" className="border-0 py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Unable to load data</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {onRetry && (
        <EmptyContent>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
}
