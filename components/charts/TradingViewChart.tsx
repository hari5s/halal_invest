"use client";

import { useMemo } from "react";
import type { TimeRange } from "@/data/assets";
import { cn } from "@/lib/utils";

// ── Symbol mapping ──────────────────────────────────────────────────────────
export const TV_SYMBOLS: Record<string, string> = {
  NVDA: "NASDAQ:NVDA",
  AAPL: "NASDAQ:AAPL",
  ASML: "NASDAQ:ASML",
  MSFT: "NASDAQ:MSFT",
  TSLA: "NASDAQ:TSLA",
  EIW:  "NASDAQ:ESGV",
};

// ── Candlestick interval ────────────────────────────────────────────────────
const RANGE_TO_INTERVAL: Record<TimeRange, string> = {
  "1J": "5",
  "1S": "60",
  "1M": "D",
  "3M": "D",
  "1A": "W",
};

// ── Approximate date range so TradingView scrolls to the right window ───────
const RANGE_TO_DATERANGE: Record<TimeRange, string> = {
  "1J": "1D",
  "1S": "5D",
  "1M": "1M",
  "3M": "3M",
  "1A": "12M",
};

interface TradingViewChartProps {
  ticker:        string;
  range:         TimeRange;
  ranges:        TimeRange[];
  onRangeChange: (r: TimeRange) => void;
}

export function TradingViewChart({
  ticker,
  range,
  ranges,
  onRangeChange,
}: TradingViewChartProps) {
  const symbol   = TV_SYMBOLS[ticker] ?? `NASDAQ:${ticker}`;
  const interval = RANGE_TO_INTERVAL[range];
  const dateRange = RANGE_TO_DATERANGE[range];

  // Build the iframe URL — TradingView's widgetembed is the exact same
  // engine that powers tradingview.com charts, with live animated data.
  const src = useMemo(() => {
    const params = new URLSearchParams({
      symbol,
      interval,
      range:               dateRange,
      timezone:            "Europe/Paris",
      theme:               "dark",
      style:               "1",          // Candlesticks
      locale:              "fr",
      toolbar_bg:          "0d1117",
      hide_top_toolbar:    "0",
      hide_side_toolbar:   "0",
      allow_symbol_change: "0",
      save_image:          "0",
      calendar:            "0",
      hide_volume:         "0",
      withdateranges:      "1",
      // Force a fresh load on every range/symbol change
      _t:                  String(Date.now()),
    });
    return `https://www.tradingview.com/widgetembed/?${params.toString()}`;
  }, [symbol, interval, dateRange]);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Period selector ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
          {ranges.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange(r)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                range === r
                  ? "bg-emerald-350 text-ink-950 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/70 select-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          TradingView Live
        </div>
      </div>

      {/* ── iframe ──────────────────────────────────────────────────────── */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
        <iframe
          key={src}            /* force remount on URL change */
          src={src}
          title={`Graphique ${ticker}`}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <p className="text-[10px] text-zinc-700 text-right select-none">
        Données fournies par TradingView · Délai 15 min (gratuit) · Marchés fermés le week-end
      </p>
    </div>
  );
}
