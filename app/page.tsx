import { Bot, Sparkles } from "lucide-react";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";
import { EthiqAIWidget } from "@/components/dashboard/EthiqAIWidget";
import { InsightsGrid } from "@/components/dashboard/InsightsGrid";
import { MarketStrip } from "@/components/dashboard/MarketStrip";
import { NewsList } from "@/components/dashboard/NewsList";
import { WatchTodayGrid } from "@/components/dashboard/WatchTodayGrid";
import { DemoBadge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-12 xl:space-y-16">
      {/* Hero */}
      <section className="rounded-xl border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <DemoBadge />
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-zinc-50 sm:text-4xl">Ethiq Invest AI</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
              Plateforme premium d'analyse d'actions et d'ETF éthiques / islamiques. Données de démonstration, IA locale, graphiques Lightweight Charts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-350/20 bg-emerald-350/10 px-3 py-2 text-sm text-emerald-350">
              <Bot className="h-4 w-4" aria-hidden="true" />
              IA locale mockée
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gold-400/25 bg-gold-400/10 px-3 py-2 text-sm text-gold-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Actions & ETF uniquement
            </div>
          </div>
        </div>
      </section>

      {/* Market strip */}
      <section>
        <SectionHeader eyebrow="Marchés" title="Indices & repères" />
        <MarketStrip />
      </section>

      {/* Ethiq AI Widget — central */}
      <EthiqAIWidget />

      {/* Watchlist */}
      <section>
        <SectionHeader eyebrow="Watchlist" title="À surveiller aujourd'hui" />
        <WatchTodayGrid />
      </section>

      {/* IA Insights */}
      <section>
        <SectionHeader eyebrow="Analyse" title="Insights IA récents" />
        <InsightsGrid />
      </section>

      {/* News */}
      <section>
        <SectionHeader eyebrow="Flux" title="Actualités importantes" />
        <NewsList />
      </section>

      {/* Compliance */}
      <ComplianceOverview />
    </div>
  );
}
