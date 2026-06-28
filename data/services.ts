/**
 * Service layer interfaces for future API integrations.
 * All providers are currently mocked — replace implementations when real APIs are ready.
 *
 * PROTOTYPE — données de démonstration — ne constitue pas un conseil en investissement.
 */

import type { OHLCBar, Asset, AssetNews, Event72h } from "@/data/assets";

// ─── Market Data ─────────────────────────────────────────────────────────────

export type MarketQuote = {
  ticker: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap?: number;
  currency: string;
  timestamp: number;
};

export interface MarketDataProvider {
  /** Fetch current quote for a ticker */
  getQuote(ticker: string): Promise<MarketQuote>;
  /** Fetch OHLC bars for a ticker and time range */
  getOHLC(ticker: string, range: string): Promise<OHLCBar[]>;
  /** Search tickers by keyword */
  search(query: string): Promise<Array<{ ticker: string; name: string; exchange: string }>>;
}

// ─── News Provider ────────────────────────────────────────────────────────────

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  impact: "positif" | "neutre" | "négatif";
  tickers: string[];
};

export interface NewsProvider {
  /** Fetch latest news for a specific ticker */
  getNewsByTicker(ticker: string, limit?: number): Promise<AssetNews[]>;
  /** Fetch general market news */
  getMarketNews(limit?: number): Promise<NewsArticle[]>;
  /** Fetch events for the last 72 hours for a ticker */
  getEvents72h(ticker: string): Promise<Event72h[]>;
}

// ─── Sharia Compliance Provider ───────────────────────────────────────────────

export type ComplianceStatus =
  | "non_evaluated"   // Default — prototype state
  | "needs_review"    // Flagged for manual review
  | "verified"        // Confirmed by external source
  | "non_compliant";  // Confirmed non-compliant

export type ComplianceReport = {
  ticker: string;
  status: ComplianceStatus;
  source: string;               // e.g., "Musaffa", "AAOIFI", "Internal"
  methodology: string;          // e.g., "AAOIFI FAS 21"
  verifiedAt: string;           // ISO date
  criteria: {
    activityScreening: "pass" | "fail" | "pending";
    debtRatio: "pass" | "fail" | "pending";
    nonCompliantRevenue: "pass" | "fail" | "pending";
    purificationAmount?: number;
  };
  disclaimer: string;
};

export interface ShariaComplianceProvider {
  /**
   * Get compliance report for a ticker.
   * In the prototype, always returns status "non_evaluated".
   * Future: connect to Musaffa API or AAOIFI database.
   */
  getCompliance(ticker: string): Promise<ComplianceReport>;
}

// ─── AI Analysis Provider ─────────────────────────────────────────────────────

export type AIAnalysisRequest = {
  ticker: string;
  question: string;
  context?: {
    price?: number;
    change24h?: number;
    recentNews?: string[];
    metrics?: Record<string, string>;
  };
};

export type AIAnalysisResponse = {
  shortAnswer: string;
  dataUsed: string[];
  positives: string[];
  risks: string[];
  sources: string[];
  disclaimer: string;
  generatedAt: string;
  isMocked: boolean;
};

export interface AIAnalysisProvider {
  /**
   * Analyze an asset based on a user question.
   * In the prototype, uses mock-chat.ts locally.
   * Future: route to OpenAI API server-side.
   */
  analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
  /** Get a pre-generated summary for a specific asset */
  getSummary(ticker: string): Promise<AIAnalysisResponse>;
}

// ─── Mock implementations (used by prototype) ─────────────────────────────────

export const finnhubMarketDataProvider: MarketDataProvider = {
  async getQuote(ticker) {
    const res = await fetch(`/api/market/quote?symbol=${ticker}`);
    if (!res.ok) throw new Error("Failed to fetch quote");
    const data = await res.json();
    return {
      ticker,
      price: data.c,
      change24h: data.dp,
      volume: 0, // Finnhub quote doesn't provide volume directly in free tier, or we can use previous close
      currency: "USD",
      timestamp: data.t ? data.t * 1000 : Date.now(),
    };
  },
  async getOHLC(ticker, range) {
    // Convert range to Finnhub resolution and timestamps
    let resolution = "D";
    let days = 30;
    if (range === "1J") { resolution = "5"; days = 1; }
    else if (range === "1S") { resolution = "15"; days = 7; }
    else if (range === "1M") { resolution = "D"; days = 30; }
    else if (range === "3M") { resolution = "D"; days = 90; }
    else if (range === "1A") { resolution = "W"; days = 365; }

    const to = Math.floor(Date.now() / 1000);
    const from = to - (days * 24 * 60 * 60);

    const res = await fetch(`/api/market/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}`);
    if (!res.ok) throw new Error("Failed to fetch OHLC");
    const data = await res.json();
    
    if (data.s !== "ok" || !data.t) return [];

    return data.t.map((t: number, i: number) => ({
      time: t,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i]
    }));
  },
  async search(query) {
    // Free tier finnhub doesn't have a great search endpoint, mock for now or use /search if available.
    return [];
  }
};

export const finnhubNewsProvider: NewsProvider = {
  async getNewsByTicker(ticker, limit = 5) {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const res = await fetch(`/api/market/news?symbol=${ticker}&from=${from}&to=${to}`);
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    
    return data.slice(0, limit).map((n: any) => ({
      title: n.headline,
      source: n.source,
      time: new Date(n.datetime * 1000).toLocaleDateString(),
      impact: "neutre" // Finnhub free doesn't give sentiment, we default to neutre
    }));
  },
  async getMarketNews(limit) { return []; },
  async getEvents72h(ticker) { return []; }
};

/** Placeholder — replace with real ShariaComplianceProvider */
export const mockShariaProvider: ShariaComplianceProvider = {
  async getCompliance(ticker) {
    return {
      ticker,
      status: "non_evaluated",
      source: "Prototype — aucune source externe connectée",
      methodology: "À définir — Musaffa, AAOIFI ou conseil charia identifié",
      verifiedAt: new Date().toISOString(),
      criteria: {
        activityScreening: "pending",
        debtRatio: "pending",
        nonCompliantRevenue: "pending"
      },
      disclaimer: "Analyse de démonstration — ne constitue pas un verdict religieux. Une validation réelle doit provenir d'une source externe ou d'une méthodologie définie."
    };
  }
};
