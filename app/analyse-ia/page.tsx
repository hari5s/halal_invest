import Link from "next/link";
import { assets } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { RiskBadge, SentimentBadge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";

export default function AnalyseIAPage() {
  // Only show stocks and ETFs
  const filteredAssets = assets.filter(function (asset) {
    return asset.type === "Action" || asset.type === "ETF";
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">Analyse IA</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Scores synthétiques mockés</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Ces scores sont statiques et servent uniquement à démontrer l'interface d'aide à l'analyse sur actions et ETF.
        </p>
      </section>
      <div className="grid gap-4 lg:grid-cols-2 stagger-children">
        {filteredAssets.map(function (asset) {
          return (
            <Link
              key={asset.slug}
              href={"/assets/" + asset.slug}
              className="group rounded-xl border border-white/10 bg-white/[0.045] p-5 transition-all duration-200 hover:border-emerald-350/35 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                  <div>
                    <p className="font-semibold text-zinc-50">{asset.name}</p>
                    <p className="text-sm text-zinc-500">{asset.ticker} · {asset.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-zinc-50">{asset.aiScores.global}</p>
                  <p className="text-xs text-zinc-600">/100 fictif</p>
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
