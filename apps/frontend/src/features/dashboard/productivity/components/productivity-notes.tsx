import Link from "next/link";
import { FileTextIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatShortDate } from "@/features/dashboard/utils/format";
import { productivityNotes } from "@/mocks/dashboard-productivity.mock";

export function ProductivityNotes() {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Recent notes</CardTitle>
        <CardAction>
          <Link href="/playground/notes" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Open notes
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {productivityNotes.map((note) => (
            <li key={note.title} className="flex items-start gap-3">
              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{note.title}</p>
                <p className="text-xs text-muted-foreground">
                  <time dateTime={note.date}>{formatShortDate(note.date)}</time>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
