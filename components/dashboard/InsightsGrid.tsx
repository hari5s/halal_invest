import Link from "next/link";
import { BrainCircuit, ArrowUpRight } from "lucide-react";
import { dashboardInsights } from "@/data/market";
import { RiskBadge, SentimentBadge } from "@/components/ui/Badge";

export function InsightsGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3 xl:gap-6 stagger-children">
      {dashboardInsights.map(function (insight) {
        return (
          <article key={insight.title} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-5 transition-all duration-200 hover:border-emerald-350/25 hover:bg-white/[0.065]">
            {/* Subtle glow top-right */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-350/[0.06] blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" aria-hidden="true" />

            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-350/20 bg-emerald-350/10 text-emerald-350">
                <BrainCircuit className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold text-zinc-500">{insight.asset}</span>
            </div>

            <h3 className="text-sm font-semibold text-zinc-50">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{insight.detail}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SentimentBadge value={insight.sentiment} />
              <RiskBadge value={insight.risk} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
