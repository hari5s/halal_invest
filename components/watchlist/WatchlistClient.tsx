"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { assets, type AssetType } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { RiskBadge, SentimentBadge, StatusBadge } from "@/components/ui/Badge";
import { useWatchlist } from "@/hooks/useWatchlist";
import { changeTone, formatCurrency, formatPercent } from "@/lib/format";

const filters: Array<AssetType | "Tous"> = ["Tous", "Action", "ETF"];

export function WatchlistClient() {
  const watchlist = useWatchlist();
  const [selectedType, setSelectedType] = useState<AssetType | "Tous">("Tous");
  const watchedAssets = assets.filter(function (asset) { return watchlist.slugs.includes(asset.slug); });
  const filteredAssets = watchedAssets.filter(function (asset) { return selectedType === "Tous" || asset.type === selectedType; });
  const addableAssets = assets.filter(function (asset) { return !watchlist.slugs.includes(asset.slug); });

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-300/80">Watchlist</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Actifs suivis</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">Ajoutez ou retirez localement des actions et ETF fictifs. La liste est conservée dans le navigateur.</p>
          </div>
          <select value={selectedType} onChange={function (event) { setSelectedType(event.target.value as AssetType | "Tous"); }} className="h-11 rounded-lg border border-white/10 bg-ink-900 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-350/45">
            {filters.map(function (filter) { return <option key={filter} value={filter}>{filter}</option>; })}
          </select>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]">
        <div className="hidden grid-cols-[1.25fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr_0.5fr] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500 lg:grid">
          <span>Actif</span>
          <span>Prix</span>
          <span>Variation</span>
          <span>Sentiment IA</span>
          <span>Risque</span>
          <span>Conformité à vérifier</span>
          <span>Ouvrir</span>
        </div>
        {filteredAssets.length ? filteredAssets.map(function (asset) {
          return (
            <div key={asset.slug} className="grid gap-4 border-b border-white/10 p-4 last:border-b-0 lg:grid-cols-[1.25fr_0.7fr_0.7fr_0.8fr_0.8fr_1fr_0.5fr] lg:items-center">
              <div className="flex items-center gap-3">
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <div>
                  <p className="font-medium text-zinc-100">{asset.name}</p>
                  <p className="text-sm text-zinc-500">{asset.ticker} · {asset.type}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-zinc-100">{formatCurrency(asset.price, asset.currency)}</p>
              <p className={changeTone(asset.change24h) + " text-sm font-medium"}>{formatPercent(asset.change24h)}</p>
              <SentimentBadge value={asset.sentiment} />
              <RiskBadge value={asset.risk} />
              <StatusBadge>{asset.complianceStatus}</StatusBadge>
              <div className="flex gap-2">
                <Link href={"/assets/" + asset.slug} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition hover:text-emerald-350" aria-label={"Ouvrir " + asset.ticker}>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button type="button" onClick={function () { watchlist.remove(asset.slug); }} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-zinc-300 transition hover:text-rose-300" aria-label={"Supprimer " + asset.ticker}>
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
              <button key={asset.slug} type="button" onClick={function () { watchlist.add(asset.slug); }} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 text-left transition hover:border-emerald-350/35 hover:bg-white/[0.07]">
                <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-zinc-100">{asset.name}</span>
                  <span className="text-sm text-zinc-500">{asset.ticker}</span>
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
