import { ShieldAlert } from "lucide-react";
import { complianceCounters } from "@/data/market";

export function ComplianceOverview() {
  return (
    <section className="rounded-lg border border-gold-400/20 bg-gold-400/[0.045] p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/10 text-gold-300">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-zinc-50">Conformité éthique / islamique</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
            Les informations affichées sont des démonstrations. Une conformité réelle devra provenir d'une source externe vérifiée, comme Musaffa ou une méthodologie validée.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {complianceCounters.map(function (counter) {
            return (
              <div key={counter.label} className="rounded-lg border border-white/10 bg-ink-950/45 p-4">
                <p className="text-3xl font-semibold text-zinc-50">{counter.value}</p>
                <p className="mt-2 text-sm font-medium text-zinc-200">{counter.label}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">{counter.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
