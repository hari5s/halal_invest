"use client";

import { useState } from "react";
import { Bot, SendHorizontal, ChevronRight, Loader2, Sparkles } from "lucide-react";
import type { Asset } from "@/data/assets";
import { createMockChatResponse } from "@/lib/mock-chat";

interface AIPanelProps {
  asset: Asset;
  onOpenChat: () => void;
}

export function AIPanel({ asset, onOpenChat }: AIPanelProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<ReturnType<typeof createMockChatResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  function handleAsk(question: string) {
    const q = question.trim();
    if (!q) return;
    setLoading(true);
    setAsked(true);
    setResponse(null);
    setInput("");
    setTimeout(function () {
      setResponse(createMockChatResponse(asset, q));
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="surface-panel p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-350/25 bg-emerald-350/10 text-emerald-350">
            <Bot className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-50">
              Que souhaitez-vous comprendre sur {asset.name} ?
            </p>
            <p className="text-xs text-zinc-500">Analyse mockée</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenChat}
          className="hidden shrink-0 items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-emerald-350 sm:flex"
        >
          Discussion complète <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quick questions */}
      {!asked && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            "Quelle est la tendance actuelle ?",
            "Quels sont les risques principaux ?",
            "Quels éléments de conformité vérifier ?"
          ].map(function (q) {
            return (
              <button
                key={q}
                type="button"
                onClick={function () { handleAsk(q); }}
                className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-emerald-350/30 hover:text-zinc-200"
              >
                {q}
              </button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={function (e) { e.preventDefault(); handleAsk(input); }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={function (e) { setInput(e.target.value); }}
          placeholder={"Question sur " + asset.ticker + "…"}
          aria-label={"Question sur " + asset.ticker}
          name="asset-ai-question"
          autoComplete="off"
          className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#071018]/80 pl-3 pr-3 text-sm text-zinc-100 outline-none transition-colors focus-visible:border-emerald-350/60"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-350 text-ink-950 transition-colors hover:bg-emerald-300 disabled:opacity-40"
          aria-label="Envoyer"
        >
          <SendHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500" aria-live="polite">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-350" />
          Analyse des données mockées…
        </div>
      )}

      {/* Response */}
      {response && !loading && (
        <div className="mt-3 space-y-2.5 animate-fade-slide-up">
          <div className="rounded-lg border border-emerald-350/15 bg-emerald-350/[0.06] p-3">
            <p className="text-xs leading-5 text-zinc-300">{response.shortAnswer}</p>
          </div>
          {response.risks.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">Risques clés</p>
              <p className="text-xs text-zinc-500">{response.risks.slice(0, 2).join(" · ")}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-600 italic">Données de démonstration — non personnalisé</p>
            <button
              type="button"
              onClick={onOpenChat}
              className="flex items-center gap-1 text-[11px] text-emerald-350/70 hover:text-emerald-350"
            >
              <Sparkles className="h-3 w-3" />
              Discussion complète
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
