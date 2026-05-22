import { cn } from "@/lib/utils";

/**
 * Yilong logomark — pure SVG, no raster assets.
 * The "Y" sits inside an Aurora-gradient rounded square. The wordmark uses the
 * display font with a single brand-colored period to give it personality without
 * the usual "designed by chatgpt" sameness.
 */
interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  /** monochrome variant — used inside dense surfaces like footer */
  mono?: boolean;
  size?: number;
}

export function Logo({
  className,
  withWordmark = true,
  mono = false,
  size = 32,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark size={size} mono={mono} />
      {withWordmark && (
        <span className="font-display text-[1.05rem] font-extrabold tracking-tight">
          yilong
          <span className={mono ? "text-foreground" : "text-primary"}>.</span>
        </span>
      )}
    </span>
  );
}

function Mark({ size, mono }: { size: number; mono: boolean }) {
  const id = "yl-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Yilong logo"
    >
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="hsl(var(--brand-fire-from))" />
          <stop offset="55%" stopColor="hsl(var(--brand-fire-to))" />
          <stop offset="100%" stopColor="hsl(var(--brand-electric))" />
        </linearGradient>
      </defs>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="9"
        fill={mono ? "currentColor" : `url(#${id})`}
      />
      {/* Stylized Y — three strokes meeting at a single fulcrum, suggests a serving fork */}
      <path
        d="M10 8.5 L16 17.5 L22 8.5"
        stroke={mono ? "hsl(var(--background))" : "hsl(var(--background))"}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17.5 L16 24"
        stroke={mono ? "hsl(var(--background))" : "hsl(var(--background))"}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Aurora dot — references the wordmark's period and the Electric Lime accent */}
      <circle cx="24.5" cy="7.5" r="1.6" fill="hsl(var(--brand-electric))" />
    </svg>
  );
}
