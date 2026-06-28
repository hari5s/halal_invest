"use client";

import useSWR from "swr";
import type { AssetNews } from "@/data/assets";

export type FinnhubNewsItem = {
  headline: string;
  source: string;
  datetime: number;
  url: string;
  summary: string;
};

function classifyImpact(headline: string, summary: string): AssetNews["impact"] {
  const text = (headline + " " + summary).toLowerCase();
  const pos = ["surge", "beat", "record", "upgrade", "growth", "gains", "strong", "rise",
               "profit", "exceed", "bullish", "outperform", "rally", "positive", "win"];
  const neg = ["fall", "drop", "miss", "downgrade", "cut", "weak", "lawsuit", "loss",
               "decline", "disappoint", "recall", "probe", "investigation", "crash", "risk"];
  const posScore = pos.filter(w => text.includes(w)).length;
  const negScore = neg.filter(w => text.includes(w)).length;
  if (posScore > negScore) return "positif";
  if (negScore > posScore) return "négatif";
  return "neutre";
}

function formatDatetime(unix: number): string {
  const d = new Date(unix * 1000);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3_600_000;
  const hm = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  if (diffH < 24) return `Aujourd'hui ${hm}`;
  if (diffH < 48) return `Hier ${hm}`;
  return `Il y a ${Math.floor(diffH / 24)}j ${hm}`;
}

async function fetchNews(ticker: string): Promise<AssetNews[]> {
  const to = new Date().toISOString().split("T")[0];
  const from = new Date(Date.now() - 30 * 86_400_000).toISOString().split("T")[0];
  const res = await fetch(`/api/market/news?symbol=${ticker}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error("Failed");
  const data: FinnhubNewsItem[] = await res.json();
  return data.slice(0, 15).map(n => ({
    title:  n.headline,
    source: n.source,
    time:   formatDatetime(n.datetime),
    impact: classifyImpact(n.headline, n.summary ?? ""),
    url:    n.url,
  }));
}

/**
 * Returns real news from Finnhub with 1h cache.
 * Falls back to static asset.news if the API fails.
 */
export function useStockNews(ticker: string, fallback: AssetNews[]) {
  const { data, isLoading, error } = useSWR(
    ["stock-news", ticker],
    () => fetchNews(ticker),
    { refreshInterval: 3_600_000 } // 1 h
  );

  return {
    news:      (data && data.length > 0) ? data : fallback,
    isLive:    !!(data && data.length > 0),
    isLoading,
    error,
  };
}
