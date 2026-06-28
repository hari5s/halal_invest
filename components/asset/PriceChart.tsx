"use client";

/**
 * PriceChart — wrapper vers CandleChart pour la compatibilité avec les anciens usages.
 * Ce composant n'est plus utilisé directement dans le prototype (remplacé par CandleChart),
 * mais il est conservé pour éviter les erreurs d'import résiduels.
 */

import type { OHLCBar, TimeRange } from "@/data/assets";
import { CandleChart } from "@/components/charts/CandleChart";

const DEFAULT_RANGES: TimeRange[] = ["1J", "1S", "1M", "3M", "1A"];

interface PriceChartProps {
  data: OHLCBar[];
  currency: string;
  range?: TimeRange;
  ranges?: TimeRange[];
  onRangeChange?: (range: TimeRange) => void;
}

export function PriceChart({ data, currency, range = "1M", ranges = DEFAULT_RANGES, onRangeChange }: PriceChartProps) {
  return (
    <CandleChart
      data={data}
      currency={currency}
      range={range}
      ranges={ranges}
      onRangeChange={onRangeChange ?? function () {}}
    />
  );
}
