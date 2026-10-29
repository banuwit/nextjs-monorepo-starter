import Link from "next/link";

import { AppLogo } from "@/components/app-logo";

export function AuthBrand() {
  return (
    <Link
      href="/dashboard"
      aria-label="WIT. Studio — back to dashboard"
      className="inline-flex items-center justify-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <AppLogo className="w-20" preload />
    </Link>
  );
}
