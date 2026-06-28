"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { assets, defaultWatchlistSlugs, type Asset } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { RiskBadge, SentimentBadge, StatusBadge } from "@/components/ui/Badge";
import { changeTone, formatCurrency, formatPercent } from "@/lib/format";
import useSWR from "swr";
import { finnhubMarketDataProvider } from "@/data/services";

const watchedAssets = defaultWatchlistSlugs
  .map(function (slug) { return assets.find(function (a) { return a.slug === slug; }); })
  .filter(function (asset): asset is Asset { return asset !== undefined; });

function WatchTodayCard({ asset }: { asset: Asset }) {
  const { data: quote } = useSWR(["quote", asset.ticker], () => finnhubMarketDataProvider.getQuote(asset.ticker), { refreshInterval: 60000 });
  const price = quote?.price ?? asset.price;
  const change24h = quote?.change24h ?? asset.change24h;
  const positive = change24h >= 0;

  return (
    <Link
      href={"/assets/" + asset.slug}
      className="group surface-card surface-card-hover p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-zinc-50">{asset.name}</p>
            <p className="text-xs text-zinc-500">{asset.ticker} · {asset.type}</p>
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors duration-200 group-hover:text-emerald-350" aria-hidden="true" />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="value-mono text-2xl font-semibold text-zinc-50">{formatCurrency(price, asset.currency)}</p>
          <p className={changeTone(change24h) + " value-mono mt-1 flex items-center gap-1 text-sm font-semibold"}>
            <span className={positive ? "inline-block h-0 w-0 border-l-4 border-r-4 border-b-[6px] border-l-transparent border-r-transparent border-b-emerald-350 mb-0.5" : "inline-block h-0 w-0 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-rose-400 mt-0.5"} aria-hidden="true" />
            {formatPercent(change24h)} 24h
          </p>
        </div>
        <StatusBadge>{asset.complianceStatus}</StatusBadge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SentimentBadge value={asset.sentiment} />
        <RiskBadge value={asset.risk} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-zinc-600">Score IA</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${asset.aiScores.global >= 70 ? "bg-emerald-350" : asset.aiScores.global >= 50 ? "bg-gold-400" : "bg-rose-400"}`}
            style={{ width: asset.aiScores.global + "%" }}
          />
        </div>
        <span className="value-mono text-[10px] font-medium text-zinc-400">{asset.aiScores.global}</span>
      </div>
    </Link>
  );
}

export function WatchTodayGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 stagger-children">
      {watchedAssets.map((asset) => (
        <WatchTodayCard key={asset.slug} asset={asset} />
      ))}
    </div>
  );
}
