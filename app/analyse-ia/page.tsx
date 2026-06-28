import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { assets } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { RiskBadge, SentimentBadge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { ScoreBar } from "@/components/ui/ScoreBar";

export default function AnalyseIAPage() {
  const filteredAssets = assets.filter(function (asset) {
    return asset.type === "Action" || asset.type === "ETF";
  });

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Analyse IA"
        title="Scores synthétiques mockés"
        description="Comparaison des signaux fondamentaux, techniques et news. Les scores sont statiques et servent uniquement à démontrer le futur parcours d'aide à l'analyse."
        icon={BrainCircuit}
      />

      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        {filteredAssets.map(function (asset) {
          return (
            <Link
              key={asset.slug}
              href={"/assets/" + asset.slug}
              className="group surface-card surface-card-hover p-5"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-zinc-50">{asset.name}</p>
                    <p className="value-mono text-sm text-zinc-500">{asset.ticker} / {asset.type}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-350/20 bg-emerald-350/[0.08] px-3 py-2 text-right">
                  <p className="value-mono text-2xl font-semibold text-zinc-50">{asset.aiScores.global}</p>
                  <p className="text-xs text-zinc-500">/100 fictif</p>
                </div>
              </div>

              <div className="space-y-3">
                <ScoreBar label="Fondamentaux" value={asset.aiScores.fundamentals} />
                <ScoreBar label="Technique" value={asset.aiScores.technical} />
                <ScoreBar label="Actualités" value={asset.aiScores.news} tone="gold" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <SentimentBadge value={asset.sentiment} />
                <RiskBadge value={asset.risk} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
