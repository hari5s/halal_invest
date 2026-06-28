import { BarChart3 } from "lucide-react";
import { MarketStrip } from "@/components/dashboard/MarketStrip";
import { WatchTodayGrid } from "@/components/dashboard/WatchTodayGrid";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function MarchesPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Marchés"
        title="Vue marché fictive"
        description="Indices, repères et actifs suivis avec variations de démonstration. Les prix live disponibles restent limités aux fournisseurs branchés dans le prototype."
        icon={BarChart3}
      />

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
