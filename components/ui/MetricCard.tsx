import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
  tone?: "default" | "emerald" | "gold" | "rose";
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "default" }: MetricCardProps) {
  var iconClass = "border-white/10 bg-white/5 text-zinc-300";
  if (tone === "emerald") iconClass = "border-emerald-350/20 bg-emerald-350/10 text-emerald-350";
  if (tone === "gold") iconClass = "border-gold-400/25 bg-gold-400/10 text-gold-300";
  if (tone === "rose") iconClass = "border-rose-400/25 bg-rose-400/10 text-rose-300";

  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="data-label truncate">{label}</p>
          <p className="value-mono mt-2 text-xl font-semibold text-zinc-50">{value}</p>
        </div>
        {Icon ? (
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", iconClass)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-zinc-400">{detail}</p> : null}
    </div>
  );
}
