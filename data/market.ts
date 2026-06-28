import type { RiskLevel, Sentiment } from "@/data/assets";

export type Impact = "positif" | "neutre" | "négatif";

export const marketCards = [
  { label: "S&P 500", value: "5 468", change: 0.42 },
  { label: "Nasdaq", value: "17 819", change: 0.78 },
  { label: "Dow Jones", value: "39 150", change: 0.21 },
  { label: "CAC 40", value: "7 642", change: -0.14 },
  { label: "Or", value: "2 338 $", change: -0.18 }
];

export const dashboardInsights: Array<{ title: string; asset: string; sentiment: Sentiment; risk: RiskLevel; detail: string }> = [
  {
    title: "Momentum positif mais valorisation élevée",
    asset: "NVDA",
    sentiment: "Prudent",
    risk: "Élevé",
    detail: "La tendance reste ferme, mais le scénario intègre déjà une croissance très ambitieuse."
  },
  {
    title: "Résultats solides, risque réglementaire",
    asset: "MSFT",
    sentiment: "Favorable",
    risk: "Moyen",
    detail: "Le cloud soutient les fondamentaux, tandis que les enquêtes antitrust restent à surveiller."
  },
  {
    title: "Position unique en lithographie EUV",
    asset: "ASML",
    sentiment: "Favorable",
    risk: "Moyen",
    detail: "Le carnet de commandes reste robuste, mais les cycles d'investissement capex semi-conducteurs introduisent une lecture irrégulière."
  }
];

export const importantNews: Array<{ title: string; source: string; time: string; impact: Impact }> = [
  { title: "Les semi-conducteurs progressent après des commandes IA fictives", source: "FinWire Demo", time: "08:40", impact: "positif" },
  { title: "Le marché attend une décision de banque centrale simulée", source: "Macro Brief", time: "09:10", impact: "neutre" },
  { title: "Débat réglementaire fictif autour des plateformes cloud", source: "Policy Desk", time: "10:25", impact: "négatif" },
  { title: "Rotation sectorielle modérée vers la qualité défensive", source: "Market Pulse", time: "11:30", impact: "neutre" },
  { title: "L'or consolide après une hausse hebdomadaire fictive", source: "Commodities Lab", time: "13:15", impact: "neutre" },
  { title: "Des analystes réduisent leurs attentes sur certains véhicules électriques", source: "Auto Ledger", time: "14:45", impact: "négatif" },
  { title: "Le CAC 40 résiste malgré la pression sur le secteur bancaire fictif", source: "Euro Desk", time: "15:20", impact: "neutre" }
];

export const complianceCounters = [
  { label: "Actifs à vérifier", value: 6, detail: "Tous les actifs du prototype restent soumis à une validation externe." },
  { label: "Conformes selon méthodologie externe", value: 0, detail: "Aucun verdict réel n'est produit dans cette démonstration." },
  { label: "Non conformes", value: 0, detail: "Aucun actif n'est classé définitivement non conforme ici." }
];
