import { cn } from "@/lib/utils";

export function AssetLogo({ name, ticker, tone, size = "md" }: { name: string; ticker: string; tone: string; size?: "sm" | "md" | "lg" }) {
  var sizeClass = "h-11 w-11 text-sm";
  if (size === "sm") sizeClass = "h-9 w-9 text-xs";
  if (size === "lg") sizeClass = "h-16 w-16 text-lg";

  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-bold text-ink-950 shadow-panel", tone, sizeClass)} aria-label={name}>
      {ticker.slice(0, 2)}
    </div>
  );
}
