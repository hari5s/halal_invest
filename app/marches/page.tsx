import { MarketStrip } from "@/components/dashboard/MarketStrip";
import { WatchTodayGrid } from "@/components/dashboard/WatchTodayGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function MarchesPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">Marchés</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Vue marché fictive</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Indices et actions suivis avec variations de démonstration. Données entièrement mockées.</p>
      </section>
      <section>
        <SectionHeader title="Indices et repères globaux" />
        <MarketStrip />
      </section>
      <section>
        <SectionHeader title="Actions & ETF suivis" />
        <WatchTodayGrid />
      </section>
    </div>
  );
}
