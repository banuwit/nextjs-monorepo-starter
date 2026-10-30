import { cn } from "@/lib/utils";

/** Two product cards with a plus badge, drawn with theme tokens so it follows light/dark. */
export function CompareIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      aria-hidden
      className={cn("h-28 w-auto", className)}
    >
      <ellipse cx="80" cy="108" rx="56" ry="6" className="fill-muted" />

      <g transform="rotate(-8 52 62)">
        <rect
          x="22"
          y="26"
          width="62"
          height="72"
          rx="10"
          className="fill-card stroke-border"
          strokeWidth="2"
        />
        <rect x="32" y="36" width="42" height="34" rx="6" className="fill-muted" />
        <path
          d="M42 58v-4a11 11 0 0 1 22 0v4"
          className="stroke-muted-foreground/60"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="39" y="56" width="5" height="8" rx="2" className="fill-muted-foreground/60" />
        <rect x="62" y="56" width="5" height="8" rx="2" className="fill-muted-foreground/60" />
        <rect x="32" y="78" width="30" height="5" rx="2.5" className="fill-muted" />
        <rect x="32" y="87" width="18" height="5" rx="2.5" className="fill-muted" />
      </g>

      <g transform="rotate(7 108 62)">
        <rect
          x="78"
          y="22"
          width="62"
          height="72"
          rx="10"
          className="fill-card stroke-primary"
          strokeWidth="2"
        />
        <rect x="88" y="32" width="42" height="34" rx="6" className="fill-primary/15" />
        <path
          d="M98 54v-4a11 11 0 0 1 22 0v4"
          className="stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="95" y="52" width="5" height="8" rx="2" className="fill-primary" />
        <rect x="118" y="52" width="5" height="8" rx="2" className="fill-primary" />
        <rect x="88" y="74" width="30" height="5" rx="2.5" className="fill-primary/25" />
        <rect x="88" y="83" width="18" height="5" rx="2.5" className="fill-primary/25" />
      </g>

      <circle cx="128" cy="24" r="13" className="fill-primary" />
      <path
        d="M128 18v12M122 24h12"
        className="stroke-primary-foreground"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
