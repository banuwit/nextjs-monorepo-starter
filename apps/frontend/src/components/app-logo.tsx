import Image from "next/image";

import { cn } from "@/lib/utils";

// Wordmark WIT.; varian hitam/putih dipilih CSS di globals.css sesuai permukaan
// (tema, Sidebar Color, Header Color).
export function AppLogo({
  className,
  preload,
}: {
  className?: string;
  preload?: boolean;
}) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      {(["black", "white"] as const).map((variant) => (
        <Image
          key={variant}
          src={`/wit-logo-${variant}.png`}
          alt=""
          width={2639}
          height={827}
          preload={preload}
          data-slot="app-logo"
          data-variant={variant}
          className="h-auto w-full"
        />
      ))}
    </span>
  );
}
