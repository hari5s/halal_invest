import { Clock3, TrendingUp, Minus, TrendingDown, AlertCircle } from "lucide-react";
import type { Asset } from "@/data/assets";
import { cn } from "@/lib/utils";

function ImpactIcon({ impact }: { impact: "positif" | "neutre" | "négatif" }) {
  if (impact === "positif") return <TrendingUp className="h-3.5 w-3.5 text-emerald-350" aria-hidden="true" />;
  if (impact === "négatif") return <TrendingDown className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />;
  return <Minus className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />;
}

function ImpactBadge({ impact }: { impact: "positif" | "neutre" | "négatif" }) {
  const base = "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium";
  if (impact === "positif") return <span className={cn(base, "border-emerald-350/25 bg-emerald-350/10 text-emerald-350")}>Impact positif</span>;
  if (impact === "négatif") return <span className={cn(base, "border-rose-400/25 bg-rose-400/10 text-rose-400")}>Impact négatif</span>;
  return <span className={cn(base, "border-zinc-600/40 bg-zinc-500/10 text-zinc-400")}>Impact neutre</span>;
}

interface Recap72hProps {
  asset: Asset;
}

export function Recap72h({ asset }: Recap72hProps) {
  return (
    <div className="surface-panel flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="data-label">Ce qui explique la courbe</p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-50">Dernières 72 heures</h3>
        </div>
        <span className="shrink-0 rounded-full border border-gold-400/20 bg-gold-400/[0.07] px-2 py-0.5 text-[11px] text-gold-300/80">
          Démonstration
        </span>
      </div>

      {/* Synthesis */}
      <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3">
        <p className="text-xs leading-5 text-zinc-300">{asset.recap72hSummary}</p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-white/[0.08]" aria-hidden="true" />

        {asset.events72h.map(function (event, index) {
          return (
            <div key={index} className="relative flex gap-3 pb-4 last:pb-0">
              {/* Dot */}
              <div className={cn(
                "relative z-10 mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                event.impact === "positif" ? "border-emerald-350/30 bg-emerald-350/10" :
                event.impact === "négatif" ? "border-rose-400/30 bg-rose-400/10" :
                "border-white/10 bg-white/5"
              )}>
                <ImpactIcon impact={event.impact} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    {event.datetime}
                  </span>
                  <ImpactBadge impact={event.impact} />
                </div>
                <p className="text-xs font-medium text-zinc-200">{event.title}</p>
                <p className="mt-1 text-[11px] leading-4 text-zinc-500">{event.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg border border-gold-400/15 bg-gold-400/[0.05] px-3 py-2">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400/70" aria-hidden="true" />
        <p className="text-[11px] leading-4 text-zinc-500">
          Événements fictifs — ne reflètent pas l'actualité réelle. Données de démonstration uniquement.
        </p>
      </div>
    </div>
  );
}
