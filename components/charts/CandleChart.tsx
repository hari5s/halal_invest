"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type LineData,
  type Time
} from "lightweight-charts";
import type { OHLCBar, TimeRange } from "@/data/assets";
import { cn } from "@/lib/utils";

const EMERALD = "#48e0a4";
const UP_COLOR = "#48e0a4";
const DOWN_COLOR = "#f87171";
const VOLUME_UP = "rgba(72,224,164,0.30)";
const VOLUME_DOWN = "rgba(248,113,113,0.30)";

type ChartMode = "candle" | "line";

interface CandleChartProps {
  data: OHLCBar[];
  currency: string;
  range: TimeRange;
  ranges: TimeRange[];
  onRangeChange: (range: TimeRange) => void;
}

function formatPrice(price: number, currency: string): string {
  if (currency === "EUR") {
    return price.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  }
  return price.toLocaleString("fr-FR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function CandleChart({ data, currency, range, ranges, onRangeChange }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [mode, setMode] = useState<ChartMode>("candle");
  const [hoverPrice, setHoverPrice] = useState<string | null>(null);
  const [hoverChange, setHoverChange] = useState<number | null>(null);

  // Create chart once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        fontSize: 11
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" }
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "rgba(72,224,164,0.4)", labelBackgroundColor: "#0f1319" },
        horzLine: { color: "rgba(72,224,164,0.4)", labelBackgroundColor: "#0f1319" }
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
        scaleMargins: { top: 0.06, bottom: 0.22 }
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true
      },
      handleScale: { mouseWheel: false },
      handleScroll: { mouseWheel: false }
    });

    chartRef.current = chart;

    // v4 API: addCandlestickSeries()
    const candleSeries = chart.addCandlestickSeries({
      upColor: UP_COLOR,
      downColor: DOWN_COLOR,
      borderUpColor: UP_COLOR,
      borderDownColor: DOWN_COLOR,
      wickUpColor: UP_COLOR,
      wickDownColor: DOWN_COLOR
    });
    candleRef.current = candleSeries;

    // v4 API: addLineSeries()
    const lineSeries = chart.addLineSeries({
      color: EMERALD,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: EMERALD,
      crosshairMarkerBackgroundColor: "#0f1319",
      lastValueVisible: true,
      priceLineVisible: false,
      visible: false
    });
    lineRef.current = lineSeries;

    // v4 API: addHistogramSeries()
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
      color: VOLUME_UP
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 }
    });
    volumeRef.current = volumeSeries;

    // Crosshair hover for price display
    chart.subscribeCrosshairMove(function (param) {
      if (!param.point || !candleRef.current) {
        setHoverPrice(null);
        setHoverChange(null);
        return;
      }
      const item = param.seriesData.get(candleRef.current) as CandlestickData | undefined;
      if (item && "close" in item) {
        setHoverPrice(formatPrice(item.close as number, currency));
        const open = item.open as number;
        const close = item.close as number;
        setHoverChange(Number((((close - open) / open) * 100).toFixed(2)));
      }
    });

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      lineRef.current = null;
      volumeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  // Update data whenever `data` or `mode` changes
  useEffect(() => {
    if (!candleRef.current || !lineRef.current || !volumeRef.current) return;

    const candleData: CandlestickData[] = data.map(bar => ({
      time: bar.time as Time,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close
    }));

    const lineData: LineData[] = data.map(bar => ({
      time: bar.time as Time,
      value: bar.close
    }));

    const volumeData: HistogramData[] = data.map(bar => ({
      time: bar.time as Time,
      value: bar.volume,
      color: bar.close >= bar.open ? VOLUME_UP : VOLUME_DOWN
    }));

    candleRef.current.setData(candleData);
    lineRef.current.setData(lineData);
    volumeRef.current.setData(volumeData);

    // Toggle series visibility
    candleRef.current.applyOptions({ visible: mode === "candle" });
    lineRef.current.applyOptions({ visible: mode === "line" });

    chartRef.current?.timeScale().fitContent();
  }, [data, mode]);

  return (
    <div className="flex flex-col gap-3">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Period selector */}
        <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
          {ranges.map(function (r) {
            return (
              <button
                key={r}
                type="button"
                onClick={function () { onRangeChange(r); }}
                className={cn(
                  "value-mono rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  range === r
                    ? "bg-emerald-350 text-ink-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100"
                )}
              >
                {r}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Hover price display */}
          {hoverPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-50">{hoverPrice}</span>
              {hoverChange !== null && (
                <span className={cn("text-xs font-medium", hoverChange >= 0 ? "text-emerald-350" : "text-rose-400")}>
                  {hoverChange >= 0 ? "+" : ""}{hoverChange}%
                </span>
              )}
            </div>
          )}

          {/* Mode toggle: candle ↔ line */}
          <div className="flex rounded-lg border border-white/10 bg-black/25 p-1">
            <button
              type="button"
              onClick={function () { setMode("candle"); }}
              className={cn("rounded-md px-2.5 py-1.5 text-xs transition-colors", mode === "candle" ? "bg-white/10 text-zinc-50" : "text-zinc-500 hover:text-zinc-300")}
              title="Chandeliers japonais"
              aria-label="Afficher les chandeliers japonais"
            >
              ▌▌
            </button>
            <button
              type="button"
              onClick={function () { setMode("line"); }}
              className={cn("rounded-md px-2.5 py-1.5 text-xs transition-colors", mode === "line" ? "bg-white/10 text-zinc-50" : "text-zinc-500 hover:text-zinc-300")}
              title="Courbe de prix"
              aria-label="Afficher la courbe de prix"
            >
              ╌
            </button>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative h-[340px] w-full overflow-hidden rounded-lg border border-white/10 bg-[#0b1118] shadow-card">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 text-[10px] text-emerald-400/60 select-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </span>
          Finnhub Live
        </div>
      </div>
    </div>
  );
}
