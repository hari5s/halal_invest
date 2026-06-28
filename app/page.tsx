import { Bot, Radar, ShieldCheck, Sparkles } from "lucide-react";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";
import { EthiqAIWidget } from "@/components/dashboard/EthiqAIWidget";
import { InsightsGrid } from "@/components/dashboard/InsightsGrid";
import { MarketStrip } from "@/components/dashboard/MarketStrip";
import { NewsList } from "@/components/dashboard/NewsList";
import { WatchTodayGrid } from "@/components/dashboard/WatchTodayGrid";
import { DemoBadge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-8 xl:space-y-10">
      <PageHero
        eyebrow="Tableau de bord"
        title="Ethiq Invest AI"
        description="Un cockpit de marché pour surveiller actions et ETF, lire les signaux IA, puis isoler ce qui doit être vérifié côté conformité islamique."
        icon={Radar}
      >
        <DemoBadge />
        <div className="flex items-center gap-2 rounded-full border border-emerald-350/25 bg-emerald-350/[0.08] px-3 py-1 text-xs font-semibold text-emerald-200">
          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
          IA locale mockée
        </div>
        <div className="flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.08] px-3 py-1 text-xs font-semibold text-gold-200">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Verdict externe requis
        </div>
      </PageHero>

      <section>
        <SectionHeader eyebrow="Marchés" title="Indices & repères" />
        <MarketStrip />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <EthiqAIWidget />
        <section className="surface-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="data-label text-gold-300/80">Signal conformité</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-50">Lecture rapide</h2>
            </div>
            <Sparkles className="h-5 w-5 text-gold-300" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Activité", "À qualifier"],
              ["Dette à intérêt", "À vérifier"],
              ["Revenus non conformes", "À auditer"],
              ["Purification", "Non calculée"]
            ].map(function ([label, value]) {
              return (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-3">
                  <span className="text-sm text-zinc-400">{label}</span>
                  <span className="value-mono text-sm font-semibold text-gold-200">{value}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section>
        <SectionHeader eyebrow="Watchlist" title="A surveiller aujourd'hui" />
        <WatchTodayGrid />
      </section>

      <section>
        <SectionHeader eyebrow="Analyse" title="Insights IA récents" />
        <InsightsGrid />
      </section>

      <section>
        <SectionHeader eyebrow="Flux" title="Actualités importantes" />
        <NewsList />
      </section>

      <ComplianceOverview />
    </div>
  );
}
