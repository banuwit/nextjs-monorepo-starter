import Link from "next/link";
import { CommandIcon } from "lucide-react";

export function AuthBrand() {
  return (
    <Link
      href="/dashboard"
      aria-label="Studio Admin — back to dashboard"
      className="inline-flex items-center justify-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CommandIcon className="size-8" aria-hidden="true" />
      <span className="text-lg font-semibold">Studio Admin</span>
    </Link>
  );
}
