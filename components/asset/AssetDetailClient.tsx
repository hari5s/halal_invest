"use client";

import { useState } from "react";
import { Activity, AlertTriangle, BarChart3, Bot, Check, Database, ExternalLink, Landmark, LineChart, MessageCircle, Newspaper, Plus, ShieldCheck, TrendingUp, Wallet, Wifi } from "lucide-react";
import type { Asset, AssetNews, TimeRange } from "@/data/assets";
import { timeRanges } from "@/data/assets";
import { AIPanel } from "@/components/asset/AIPanel";
import { AssetChat } from "@/components/asset/AssetChat";
import { TradingViewChart } from "@/components/charts/TradingViewChart";
import { Recap72h } from "@/components/asset/Recap72h";
import { AssetLogo } from "@/components/ui/AssetLogo";
import { ImpactBadge, RiskBadge, SentimentBadge, StatusBadge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useStockNews } from "@/hooks/useStockNews";
import { changeTone, formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { finnhubMarketDataProvider } from "@/data/services";
import { Check as CheckIcon, Plus as PlusIcon } from "lucide-react";

const tabs = [
  { id: "overview", label: "Vue générale", icon: LineChart },
  { id: "finance", label: "Finances", icon: Wallet },
  { id: "technical", label: "Technique", icon: BarChart3 },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "ai", label: "Analyse IA", icon: Bot },
  { id: "ethics", label: "Éthique & conformité", icon: ShieldCheck },
  { id: "chat", label: "Discussion IA", icon: MessageCircle }
] as const;

type TabId = typeof tabs[number]["id"];

function BulletPanel({ title, items, tone = "default" }: { title: string; items: string[]; tone?: "default" | "emerald" | "gold" | "rose" }) {
  var dotClass = "bg-zinc-500";
  if (tone === "emerald") dotClass = "bg-emerald-350";
  if (tone === "gold") dotClass = "bg-gold-400";
  if (tone === "rose") dotClass = "bg-rose-400";
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-semibold text-zinc-50">{title}</h3>
      <ul className="mt-3 space-y-3 text-sm leading-6 text-zinc-400">
        {items.map(function (item) {
          return (
            <li key={item} className="flex gap-3">
              <span className={dotClass + " mt-2 h-1.5 w-1.5 shrink-0 rounded-full"} />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function OverviewTab({ asset, ticker, range, setRange, onOpenChat }: { asset: Asset; ticker: string; range: TimeRange; setRange: (range: TimeRange) => void; onOpenChat: () => void }) {
  return (
    <div className="space-y-6">
      {/* ── Chart LEFT + Recap 72h RIGHT ───────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        {/* Chart */}
        <div className="min-w-0">
          <TradingViewChart
            ticker={ticker}
            range={range}
            ranges={timeRanges}
            onRangeChange={setRange}
          />
        </div>

        {/* "Ce qui explique la courbe" — right column, scrollable */}
        <div className="xl:max-h-[600px] xl:overflow-y-auto custom-scrollbar">
          <Recap72h asset={asset} />
        </div>
      </div>

      {/* AI Panel */}
      <AIPanel asset={asset} onOpenChat={onOpenChat} />

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Capitalisation" value={asset.metrics.marketCap} icon={Landmark} />
        <MetricCard label="P/E" value={asset.metrics.pe} icon={Activity} />
        <MetricCard label="Dette" value={asset.metrics.debt} icon={Database} />
        <MetricCard label="Revenus" value={asset.metrics.revenue} icon={Wallet} />
        <MetricCard label="Croissance" value={asset.metrics.growth} icon={TrendingUp} tone="emerald" />
        <MetricCard label="Volatilité" value={asset.metrics.volatility} icon={AlertTriangle} tone={asset.risk === "Élevé" ? "rose" : "gold"} />
      </div>

      {/* Thesis */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BulletPanel title="Thèse haussière" items={asset.thesis.bull} tone="emerald" />
        <BulletPanel title="Thèse baissière" items={asset.thesis.bear} tone="gold" />
        <BulletPanel title="Risques principaux" items={asset.thesis.risks} tone="rose" />
        <BulletPanel title="Ce qui pourrait invalider l'analyse" items={asset.thesis.invalidation} />
      </div>
    </div>
  );
}

function FinanceTab({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard label="Capitalisation" value={asset.metrics.marketCap} detail="Donnée fictive, présentée pour valider l'expérience produit." icon={Landmark} />
      <MetricCard label="P/E" value={asset.metrics.pe} detail="Ratio de valorisation démonstratif, non issu d'un fournisseur réel." icon={Activity} />
      <MetricCard label="Dette" value={asset.metrics.debt} detail="Lecture à remplacer par des états financiers vérifiés." icon={Database} />
      <MetricCard label="Revenus" value={asset.metrics.revenue} detail="Montant mocké pour construire l'interface d'analyse." icon={Wallet} />
      <MetricCard label="Croissance" value={asset.metrics.growth} detail="Tendance fictive utilisée par le score IA local." icon={TrendingUp} tone="emerald" />
      <MetricCard label="Volatilité" value={asset.metrics.volatility} detail="Niveau synthétique du prototype." icon={AlertTriangle} tone={asset.risk === "Élevé" ? "rose" : "gold"} />
    </div>
  );
}

function TechnicalTab({ asset, ticker, range, setRange }: { asset: Asset; ticker: string; range: TimeRange; setRange: (r: TimeRange) => void }) {
  return (
    <div className="space-y-5">
      <TradingViewChart
        ticker={ticker}
        range={range}
        ranges={timeRanges}
        onRangeChange={setRange}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Momentum" value={asset.sentiment} detail="Signal basé sur le prix de marché réel." icon={TrendingUp} tone={asset.sentiment === "Favorable" ? "emerald" : "gold"} />
        <MetricCard label="Risque technique" value={asset.risk} detail="Niveau indicatif." icon={AlertTriangle} tone={asset.risk === "Élevé" ? "rose" : "gold"} />
      </div>
    </div>
  );
}

function NewsTab({ news, isLive, isLoading }: { news: AssetNews[]; isLive: boolean; isLoading: boolean }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">Actualités récentes</h3>
        {isLive ? (
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Finnhub Live
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
          </div>
        ) : news.length === 0 ? (
          <p className="p-6 text-center text-sm text-zinc-500">Aucune actualité disponible.</p>
        ) : (
          news.map((item, i) => (
            <article key={i} className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div>
                {(item as any).url ? (
                  <a href={(item as any).url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-1.5">
                    <h3 className="font-medium text-zinc-100 group-hover:text-emerald-350 transition-colors leading-5">{item.title}</h3>
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600 group-hover:text-emerald-350 transition-colors" />
                  </a>
                ) : (
                  <h3 className="font-medium text-zinc-100 leading-5">{item.title}</h3>
                )}
                <p className="mt-1 text-sm text-zinc-500">{item.source}</p>
              </div>
              <p className="text-sm text-zinc-500 whitespace-nowrap">{item.time}</p>
              <ImpactBadge value={item.impact} />
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function AiTab({ asset }: { asset: Asset }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-lg border border-emerald-350/20 bg-emerald-350/[0.055] p-5">
        <p className="text-sm text-emerald-350">Score global fictif</p>
        <p className="mt-2 text-6xl font-semibold text-zinc-50">{asset.aiScores.global}</p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">{asset.aiSummary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {asset.sources.map(function (source) { return <StatusBadge key={source}>{source}</StatusBadge>; })}
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div className="space-y-5">
          <ScoreBar label="Fondamentaux" value={asset.aiScores.fundamentals} />
          <ScoreBar label="Technique" value={asset.aiScores.technical} />
          <ScoreBar label="Actualités" value={asset.aiScores.news} tone="gold" />
          <ScoreBar label="Risque" value={asset.aiScores.risk} tone={asset.aiScores.risk < 45 ? "rose" : "gold"} />
        </div>
      </div>
    </div>
  );
}

function EthicsTab({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-gold-400/25 bg-gold-400/[0.055] p-5">
        <StatusBadge>Conformité à vérifier via une source externe</StatusBadge>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          Ce prototype ne présente jamais de verdict religieux définitif. Les critères réels devront venir de Musaffa, AAOIFI ou d'un conseil charia documenté.
        </p>
        <p className="mt-3 text-xs leading-5 text-zinc-500">
          Exemple de critères à analyser : activité principale, dette à intérêt, revenus non conformes, purification éventuelle. Une validation réelle doit provenir d'une source externe ou d'une méthodologie définie.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard label="Activité de l'entreprise" value="À qualifier" detail={asset.ethics.activity} icon={ShieldCheck} />
        <MetricCard label="Dette à intérêt" value="À vérifier" detail={asset.ethics.interestDebt} icon={Landmark} tone="gold" />
        <MetricCard label="Revenus non conformes" value="À auditer" detail={asset.ethics.nonCompliantRevenue} icon={Database} tone="gold" />
        <MetricCard label="Purification potentielle" value="Non calculée" detail={asset.ethics.purification} icon={Activity} />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <h3 className="font-semibold text-zinc-50">Méthodologie</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{asset.ethics.methodology}</p>
      </div>
    </div>
  );
}

export function AssetDetailClient({ asset }: { asset: Asset }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [range, setRange] = useState<TimeRange>("1M");
  const watchlist = useWatchlist();
  const inWatchlist = watchlist.has(asset.slug);

  function openChat() {
    setActiveTab("chat");
    setTimeout(function () { window.scrollTo({ top: 0, behavior: "smooth" }); }, 80);
  }

  const { data: quote } = useSWR(["quote", asset.ticker], () => finnhubMarketDataProvider.getQuote(asset.ticker), { refreshInterval: 60000 });
  const { news, isLive: newsIsLive, isLoading: newsLoading } = useStockNews(asset.ticker, asset.news);

  const currentPrice = quote ? quote.price : asset.price;
  const currentChange = quote ? quote.change24h : asset.change24h;
  
  const dynamicAsset = { ...asset, price: currentPrice, change24h: currentChange };

  return (
    <div className="space-y-6">
      {/* Asset header */}
      <section className="rounded-xl border border-white/10 bg-white/[0.045] p-5 shadow-panel">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 gap-4">
            <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-3xl font-semibold text-zinc-50">{asset.name}</h1>
                <span className="rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1 text-sm text-zinc-400">{asset.ticker}</span>
                <span className="rounded-lg border border-white/10 bg-white/[0.045] px-2 py-1 text-xs text-zinc-500">{asset.type}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-3xl font-semibold text-zinc-50">{formatCurrency(dynamicAsset.price, dynamicAsset.currency)}</p>
                <p className={changeTone(dynamicAsset.change24h) + " text-sm font-medium"}>{formatPercent(dynamicAsset.change24h)} 24h</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <SentimentBadge value={asset.sentiment} />
                <RiskBadge value={asset.risk} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={function () { watchlist.toggle(asset.slug); }}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-350/30 bg-emerald-350/10 px-4 text-sm font-medium text-emerald-350 transition hover:bg-emerald-350 hover:text-ink-950"
          >
            {inWatchlist ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
            {inWatchlist ? "Dans la watchlist" : "Ajouter à ma watchlist"}
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="custom-scrollbar flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.035] p-2">
        {tabs.map(function (tab) {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={function () { setActiveTab(tab.id); }}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                activeTab === tab.id ? "bg-emerald-350 text-ink-950" : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" ? <OverviewTab asset={dynamicAsset} ticker={asset.ticker} range={range} setRange={setRange} onOpenChat={openChat} /> : null}
      {activeTab === "finance" ? <FinanceTab asset={dynamicAsset} /> : null}
      {activeTab === "technical" ? <TechnicalTab asset={dynamicAsset} ticker={asset.ticker} range={range} setRange={setRange} /> : null}
      {activeTab === "news" ? <NewsTab news={news} isLive={newsIsLive} isLoading={newsLoading} /> : null}
      {activeTab === "ai" ? <AiTab asset={dynamicAsset} /> : null}
      {activeTab === "ethics" ? <EthicsTab asset={dynamicAsset} /> : null}
      {activeTab === "chat" ? <AssetChat asset={dynamicAsset} /> : null}
    </div>
  );
}
