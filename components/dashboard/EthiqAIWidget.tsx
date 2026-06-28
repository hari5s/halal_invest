"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, SendHorizontal, Sparkles, TrendingUp, Shield, BarChart3, ChevronRight, Loader2 } from "lucide-react";
import { assets, searchAssets } from "@/data/assets";
import { AssetLogo } from "@/components/ui/AssetLogo";

const SUGGESTED_QUESTIONS = [
  { icon: TrendingUp, label: "Pourquoi NVIDIA évolue-t-elle aujourd'hui ?", asset: "nvda" },
  { icon: BarChart3, label: "Quels sont les risques d'Apple actuellement ?", asset: "aapl" },
  { icon: TrendingUp, label: "Compare NVIDIA et AMD", asset: "nvda" },
  { icon: Sparkles, label: "Quelles actions ont les actualités les plus positives ?", asset: null },
  { icon: Shield, label: "Quels éléments de conformité faut-il vérifier pour ASML ?", asset: "asml" }
];

type MockResponse = {
  synthesis: string;
  dataUsed: string[];
  positives: string[];
  risks: string[];
  sources: string[];
};

function buildMockResponse(question: string): MockResponse {
  const lower = question.toLowerCase();

  if (lower.includes("nvidia") && lower.includes("amd")) {
    return {
      synthesis: "NVIDIA présente un score IA global de 74/100 contre une estimation fictive de 68/100 pour AMD. La différence principale réside dans l'écosystème logiciel CUDA et la part de marché datacenter.",
      dataUsed: ["Score IA NVDA : 74/100 (fictif)", "Variation 24h NVDA : +2,36% (fictif)", "Valorisation P/E NVDA : 49,8x vs AMD estimé ~45x (fictif)", "Segment datacenter : avantage NVDA (fictif)"],
      positives: ["Avantage concurrentiel logiciel (CUDA ecosystem)", "Exposition datacenter dominante", "Carnet de commandes IA plus visible"],
      risks: ["Valorisation exigeante des deux côtés", "AMD gagne des parts dans certains segments", "Risque de concentration sectorielle"],
      sources: ["Score IA local mockée", "Données fictives de démonstration", "Comparaison simulée sans fournisseur externe"]
    };
  }

  if (lower.includes("nvidia") || lower.includes("nvda")) {
    return {
      synthesis: "La hausse de NVIDIA aujourd'hui (+2,36% fictif) semble portée par des annonces de commandes IA chez les hyperscalers et un upgrade d'analyste. La valorisation reste exigeante à 49,8x.",
      dataUsed: ["Prix fictif : 132,48 $", "Variation 24h fictive : +2,36%", "Score IA global : 74/100 (fictif)", "P/E fictif : 49,8x"],
      positives: ["Commandes datacenter supérieures aux attentes (fictif)", "Upgrade analyste avec objectif relevé (fictif)", "Momentum technique favorable"],
      risks: ["Valorisation très élevée", "Risque restrictions export", "Pression concurrentielle ASIC croissante"],
      sources: ["Flux news fictif FinWire Demo", "Score IA local mockée", "Données de démonstration"]
    };
  }

  if (lower.includes("apple") || lower.includes("aapl")) {
    return {
      synthesis: "Apple présente un profil de qualité solide (-0,42% fictif aujourd'hui). Une enquête réglementaire simulée sur l'App Store pèse sur le sentiment malgré des précommandes supérieures aux attentes.",
      dataUsed: ["Prix fictif : 214,07 $", "Variation 24h fictive : -0,42%", "Score IA global : 68/100 (fictif)", "Services : ~40% des revenus (fictif)"],
      positives: ["Trésorerie massive et rachats d'actions", "Écosystème fidélisant", "Croissance des services à marge élevée"],
      risks: ["Enquête antitrust App Store (fictif)", "Cycle iPhone potentiellement plus faible", "Retard fonctionnalités IA vs concurrents"],
      sources: ["Flux news fictif Tech Ledger", "Score IA local mockée", "Données de démonstration"]
    };
  }

  if (lower.includes("asml") && (lower.includes("conform") || lower.includes("halal") || lower.includes("éthique"))) {
    return {
      synthesis: "Pour ASML, les éléments de conformité islamique à examiner incluent l'activité principale (équipements semi-conducteurs), le ratio de dette et les revenus potentiellement non conformes. Aucun verdict n'est fourni ici.",
      dataUsed: ["Activité : équipements de lithographie EUV (fictif)", "Statut : Conformité à vérifier via source externe", "Score IA : 77/100 (fictif)"],
      positives: ["Activité industrielle généralement moins problématique", "Pas de revenus financiers identifiés comme majoritaires (fictif)", "Structure de dette à mesurer selon méthodologie"],
      risks: ["Ratio dette/actifs à vérifier selon seuils externes", "Revenus accessoires à qualifier", "Exposition géographique à analyser"],
      sources: ["Prototype — aucun verdict religieux", "Analyse de démonstration uniquement", "Musaffa ou AAOIFI requis pour verdict réel"]
    };
  }

  if (lower.includes("positif") || lower.includes("actualité")) {
    const positiveAssets = assets.filter(a => a.news.some(n => n.impact === "positif"));
    return {
      synthesis: `D'après les données fictives, ${positiveAssets.slice(0, 3).map(a => a.ticker).join(", ")} affichent les actualités les plus favorables dans le prototype.`,
      dataUsed: positiveAssets.slice(0, 3).map(a => `${a.ticker} : ${a.news.find(n => n.impact === "positif")?.title ?? ""} (fictif)`),
      positives: ["Momentum news positif sur les semi-conducteurs (fictif)", "Cloud en croissance supérieure aux attentes (fictif)", "Commandes équipements solides (fictif)"],
      risks: ["Les actualités mockées ne reflètent pas la réalité", "L'impact réel nécessite un fournisseur de news financières"],
      sources: ["Flux news fictif de démonstration uniquement"]
    };
  }

  return {
    synthesis: "Cette question touche à l'ensemble du marché fictif. Le prototype analyse les données statiques disponibles pour vous offrir une réponse structurée sans prétendre à l'exhaustivité.",
    dataUsed: ["Données de marché fictives", "Scores IA locaux mockés", "Actualités de démonstration"],
    positives: ["Vision structurée des actifs disponibles", "Cadre d'analyse reproductible", "Interface prête pour une vraie API"],
    risks: ["Données entièrement mockées", "Aucun flux temps réel", "Analyse non personnalisée"],
    sources: ["Prototype Ethiq Invest AI — données de démonstration"]
  };
}

export function EthiqAIWidget() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchAssets>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setInput("");
    setSearchResults([]);
    setLoading(true);
    setResponse(null);

    // Simulate 1.2s "analysis" loading
    setTimeout(function () {
      setResponse(buildMockResponse(trimmed));
      setLoading(false);
    }, 1200);
  }

  function handleInput(value: string) {
    setInput(value);
    if (value.length >= 2) {
      setSearchResults(searchAssets(value).slice(0, 4));
    } else {
      setSearchResults([]);
    }
  }

  return (
    <section className="surface-panel terminal-grid">
      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-350/30 bg-emerald-350/10 text-emerald-350">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-50">Demander à Ethiq AI</h2>
            <p className="text-xs text-zinc-500">Analyse mockée — données de démonstration</p>
          </div>
          <span className="ml-auto hidden rounded-full border border-gold-400/25 bg-gold-400/10 px-2 py-1 text-xs text-gold-300 sm:inline">
            Prototype IA
          </span>
        </div>

        {/* Suggested questions */}
        {!response && !loading && (
          <div className="mb-5 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map(function (q) {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={function () { handleSend(q.label); }}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-xs text-zinc-300 transition-colors hover:border-emerald-350/35 hover:bg-emerald-350/[0.055] hover:text-zinc-50"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-350/70 shrink-0" aria-hidden="true" />
                  {q.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <form
            onSubmit={function (e) { e.preventDefault(); handleSend(input); }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={input}
                onChange={function (e) { handleInput(e.target.value); }}
                placeholder="Ex: Pourquoi NVIDIA monte aujourd'hui ? Quels risques pour ASML ?"
                aria-label="Question pour Ethiq AI"
                name="ethiq-ai-question"
                autoComplete="off"
                className="h-11 w-full rounded-lg border border-white/10 bg-[#071018]/80 pl-4 pr-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus-visible:border-emerald-350/60"
                disabled={loading}
              />
              {/* Autocomplete dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-12 z-40 overflow-hidden rounded-lg border border-white/10 bg-ink-900 shadow-panel">
                  {searchResults.map(function (asset) {
                    return (
                      <button
                        type="button"
                        key={asset.slug}
                        onClick={function () {
                          handleSend("Analyse " + asset.name + " (" + asset.ticker + ")");
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                      >
                        <AssetLogo name={asset.name} ticker={asset.ticker} tone={asset.logoTone} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-100">{asset.name}</span>
                          <span className="text-xs text-zinc-500">{asset.ticker} · {asset.type}</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-350 text-ink-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Envoyer la question"
            >
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4" aria-live="polite">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-350" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-zinc-200">Analyse en cours…</p>
              <p className="mt-0.5 text-xs text-zinc-500">Traitement des données mockées disponibles</p>
            </div>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div className="mt-5 space-y-4 animate-fade-slide-up">
            {/* Question recap */}
            <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2.5">
              <span className="mt-0.5 text-xs font-medium text-zinc-500">Question :</span>
              <p className="text-sm text-zinc-300">{question}</p>
            </div>

            {/* Synthesis */}
            <div className="rounded-lg border border-emerald-350/20 bg-emerald-350/[0.07] p-4">
              <p className="data-label text-emerald-350/80">Synthèse</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{response.synthesis}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Data used */}
              <div className="surface-card p-4">
                <p className="data-label">Données utilisées</p>
                <ul className="mt-2 space-y-1.5">
                  {response.dataUsed.map(function (item) {
                    return <li key={item} className="flex gap-2 text-xs leading-5 text-zinc-400"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-350/60" />{item}</li>;
                  })}
                </ul>
              </div>

              {/* Positives */}
              <div className="surface-card p-4">
                <p className="data-label text-emerald-350/80">Points positifs</p>
                <ul className="mt-2 space-y-1.5">
                  {response.positives.map(function (item) {
                    return <li key={item} className="flex gap-2 text-xs leading-5 text-zinc-400"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-350" />{item}</li>;
                  })}
                </ul>
              </div>

              {/* Risks */}
              <div className="surface-card p-4">
                <p className="data-label text-rose-300/80">Risques</p>
                <ul className="mt-2 space-y-1.5">
                  {response.risks.map(function (item) {
                    return <li key={item} className="flex gap-2 text-xs leading-5 text-zinc-400"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />{item}</li>;
                  })}
                </ul>
              </div>

              {/* Sources */}
              <div className="surface-card p-4">
                <p className="data-label">Sources fictives</p>
                <ul className="mt-2 space-y-1.5">
                  {response.sources.map(function (item) {
                    return <li key={item} className="text-xs leading-5 text-zinc-500">— {item}</li>;
                  })}
                </ul>
              </div>
            </div>

            {/* Disclaimer + reset */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="rounded-lg border border-gold-400/20 bg-gold-400/[0.07] px-3 py-2 text-xs text-gold-100/80">
                Analyse de démonstration — ne constitue pas un conseil en investissement.
              </p>
              <button
                type="button"
                onClick={function () { setResponse(null); setQuestion(""); }}
                className="shrink-0 text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
              >
                Nouvelle question
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
