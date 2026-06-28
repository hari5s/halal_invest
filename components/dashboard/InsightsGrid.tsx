import { BrainCircuit } from "lucide-react";
import { dashboardInsights } from "@/data/market";
import { RiskBadge, SentimentBadge } from "@/components/ui/Badge";

export function InsightsGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3 xl:gap-6 stagger-children">
      {dashboardInsights.map(function (insight) {
        return (
          <article key={insight.title} className="group surface-card surface-card-hover relative overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-350/20 bg-emerald-350/10 text-emerald-350">
                <BrainCircuit className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="value-mono text-xs font-semibold text-zinc-500">{insight.asset}</span>
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
