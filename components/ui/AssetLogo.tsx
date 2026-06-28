import { cn } from "@/lib/utils";

export function AssetLogo({ name, ticker, tone, size = "md" }: { name: string; ticker: string; tone: string; size?: "sm" | "md" | "lg" }) {
  var sizeClass = "h-11 w-11 text-sm";
  if (size === "sm") sizeClass = "h-9 w-9 text-xs";
  if (size === "lg") sizeClass = "h-16 w-16 text-lg";

  return (
    <div
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br font-black text-ink-950 shadow-card", tone, sizeClass)}
      aria-label={name}
      translate="no"
    >
      <span className="absolute inset-x-1 top-1 h-px bg-white/55" aria-hidden="true" />
      <span className="value-mono">{ticker.slice(0, 2)}</span>
    </div>
  );
}
