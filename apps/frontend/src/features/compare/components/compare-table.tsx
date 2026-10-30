import type { ReactNode } from "react";
import { CheckIcon, CircleHelpIcon, MinusIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  CompareProduct,
  CompareSpec,
  CompareSpecGroup,
  CompareSpecValue,
} from "../types/compare";
import { CompareProductHeader } from "./compare-product-header";

const borderClassName = "border-b border-border";
const labelClassName = cn(
  borderClassName,
  "sticky start-0 z-10 w-36 min-w-36 px-3 whitespace-normal sm:w-56 sm:min-w-56",
);
const columnClassName = cn(
  borderClassName,
  "w-52 min-w-52 border-s px-3 whitespace-normal",
);

type CompareTableProps = {
  products: CompareProduct[];
  specGroups: CompareSpecGroup[];
  cartIds: string[];
  /** Trailing column header; shown while more products can be added. */
  addColumn?: ReactNode;
  onRemove: (id: string) => void;
  onToggleCart: (id: string) => void;
};

export function CompareTable({
  products,
  specGroups,
  cartIds,
  addColumn,
  onRemove,
  onToggleCart,
}: CompareTableProps) {
  const columnCount = products.length + (addColumn ? 2 : 1);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <Table className="border-separate border-spacing-0">
        <TableCaption className="sr-only">Product comparison</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className={cn(labelClassName, "bg-muted")}>
              <span className="sr-only">Specification</span>
            </TableHead>
            {products.map((product) => (
              <TableHead
                key={product.id}
                scope="col"
                className={cn(columnClassName, "h-px py-3 align-top font-normal")}
              >
                <CompareProductHeader
                  product={product}
                  inCart={cartIds.includes(product.id)}
                  onRemove={() => onRemove(product.id)}
                  onToggleCart={() => onToggleCart(product.id)}
                />
              </TableHead>
            ))}
            {addColumn && (
              <TableHead scope="col" className={cn(columnClassName, "h-px py-3")}>
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center font-normal">
                  {addColumn}
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        {specGroups.map((group) => (
          <TableBody key={group.id}>
            <TableRow className="hover:bg-transparent">
              <TableHead
                scope="rowgroup"
                colSpan={columnCount}
                className={cn(borderClassName, "h-8 bg-muted px-3")}
              >
                <span className="sticky start-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {group.title}
                </span>
              </TableHead>
            </TableRow>
            {group.specs.map((spec) => (
              <TableRow key={spec.id} className="hover:bg-transparent">
                <TableHead scope="row" className={cn(labelClassName, "bg-card")}>
                  <SpecLabel spec={spec} />
                </TableHead>
                {products.map((product) => (
                  <TableCell key={product.id} className={columnClassName}>
                    <SpecValue value={product.specs[spec.id]} />
                  </TableCell>
                ))}
                {addColumn && <TableCell className={columnClassName} />}
              </TableRow>
            ))}
          </TableBody>
        ))}
      </Table>
    </div>
  );
}

function SpecLabel({ spec }: { spec: CompareSpec }) {
  return (
    <span className="inline-flex items-center gap-1">
      {spec.label}
      {spec.hint && (
        <Tooltip>
          <TooltipTrigger
            className="rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={`About ${spec.label}: ${spec.hint}`}
          >
            <CircleHelpIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent className="max-w-56">{spec.hint}</TooltipContent>
        </Tooltip>
      )}
    </span>
  );
}

function SpecValue({ value }: { value: CompareSpecValue }) {
  if (typeof value === "string") return value;

  return value ? (
    <>
      <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
      <span className="sr-only">Yes</span>
    </>
  ) : (
    <>
      <MinusIcon className="size-4 text-muted-foreground/60" aria-hidden />
      <span className="sr-only">No</span>
    </>
  );
}
