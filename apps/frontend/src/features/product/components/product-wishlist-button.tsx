import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductWishlistButton({
  productName,
  active,
  onToggle,
  className,
}: {
  productName: string;
  active: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={`${productName} in wishlist`}
      aria-pressed={active}
      className={className}
      onClick={onToggle}
    >
      <HeartIcon
        aria-hidden="true"
        className={cn(active && "fill-red-500 text-red-500")}
      />
    </Button>
  );
}
