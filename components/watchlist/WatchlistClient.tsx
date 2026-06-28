"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Eye, Plus, Trash2 } from "lucide-react";
import { assets, type AssetType } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { RiskBadge, SentimentBadge, StatusBadge } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/PageHero";
import { useWatchlist } from "@/hooks/useWatchlist";
import { changeTone, formatCurrency, formatPercent } from "@/lib/format";

const filters: Array<AssetType | "Tous"> = ["Tous", "Action", "ETF"];

export function WatchlistClient() {
  const watchlist = useWatchlist();
  const [selectedType, setSelectedType] = useState<AssetType | "Tous">("Tous");
  const watchedAssets = assets.filter(function (asset) { return watchlist.slugs.includes(asset.slug); });
  const filteredAssets = watchedAssets.filter(function (asset) { return selectedType === "Tous" || asset.type === selectedType; });
  const addableAssets = assets.filter(function (asset) { return !watchlist.slugs.includes(asset.slug); });

  function removeAsset(slug: string, ticker: string) {
    if (window.confirm("Retirer " + ticker + " de la watchlist ?")) {
      watchlist.remove(slug);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Watchlist"
        title="Actifs suivis"
        description="Ajoutez ou retirez localement des actions et ETF fictifs. La liste est conservée dans le navigateur."
        icon={Eye}
      >
        <label className="flex flex-col gap-1 text-xs text-zinc-500">
          Filtrer
          <select
            value={selectedType}
            onChange={function (event) { setSelectedType(event.target.value as AssetType | "Tous"); }}
            className="h-11 rounded-lg border border-white/10 bg-[#071018] px-3 text-sm text-zinc-100 outline-none transition-colors focus-visible:border-emerald-350/60"
          >
            {filters.map(function (filter) { return <option key={filter} value={filter}>{filter}</option>; })}
          </select>
        </label>
      </PageHero>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
        <div className="hidden grid-cols-[1.25fr_0.72fr_0.72fr_0.82fr_0.75fr_1fr_0.55fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase text-zinc-500 lg:grid">
          <span>Actif</span>
          <span>Prix</span>
          <span>Variation</span>
          <span>Sentiment IA</span>
          <span>Risque</span>
          <span>Conformité</span>
          <span>Actions</span>
        </div>
        {filteredAssets.length ? filteredAssets.map(function (asset) {
          return (
            <div key={asset.slug} className="ticker-row grid gap-4 border-b border-white/10 p-4 last:border-b-0 lg:grid-cols-[1.25fr_0.72fr_0.72fr_0.82fr_0.75fr_1fr_0.55fr] lg:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">{asset.name}</p>
                  <p className="value-mono text-sm text-zinc-500">{asset.ticker} / {asset.type}</p>
                </div>
              </div>
              <p className="value-mono text-sm font-medium text-zinc-100">{formatCurrency(asset.price, asset.currency)}</p>
              <p className={changeTone(asset.change24h) + " value-mono text-sm font-semibold"}>{formatPercent(asset.change24h)}</p>
              <SentimentBadge value={asset.sentiment} />
              <RiskBadge value={asset.risk} />
              <StatusBadge>{asset.complianceStatus}</StatusBadge>
              <div className="flex gap-2">
                <Link href={"/assets/" + asset.slug} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition-colors hover:border-emerald-350/30 hover:text-emerald-350" aria-label={"Ouvrir " + asset.ticker}>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button type="button" onClick={function () { removeAsset(asset.slug, asset.ticker); }} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition-colors hover:border-rose-400/30 hover:text-rose-300" aria-label={"Supprimer " + asset.ticker}>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="p-6 text-sm text-zinc-400">Aucun actif dans ce filtre.</div>
        )}
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-50">Ajouter un actif</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {addableAssets.map(function (asset) {
            return (
              <button
                key={asset.slug}
                type="button"
                onClick={function () { watchlist.add(asset.slug); }}
                className="surface-card surface-card-hover flex items-center gap-3 p-3 text-left"
              >
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-zinc-100">{asset.name}</span>
                  <span className="value-mono text-sm text-zinc-500">{asset.ticker}</span>
                </span>
                <Plus className="h-4 w-4 text-emerald-350" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
