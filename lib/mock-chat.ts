import type { Asset } from "@/data/assets";

export type MockChatResponse = {
  shortAnswer: string;
  dataUsed: string[];
  positives: string[];
  risks: string[];
  disclaimer: string;
};

export function createMockChatResponse(asset: Asset, question: string): MockChatResponse {
  var lower = question.toLowerCase();
  var focus = "son score IA, ses métriques affichées, les actualités fictives et les risques listés dans cette fiche";
  var positives: string[] = asset.thesis.bull.slice(0, 2);

  if (lower.includes("prudent") || lower.includes("avis") || lower.includes("tendance")) {
    focus = "la combinaison entre sentiment " + asset.sentiment + ", risque " + asset.risk + " et score global de " + asset.aiScores.global + "/100";
    positives = asset.thesis.bull;
  }

  if (lower.includes("risque")) {
    focus = "les risques principaux : " + asset.thesis.risks.join(", ");
    positives = ["Identification des risques facilitée", "Cadre d'analyse structuré disponible"];
  }

  if (lower.includes("amd") || lower.includes("compare")) {
    focus = "une comparaison fictive avec AMD : momentum semi-conducteurs similaire, mais exposition, valorisation et diversification à vérifier séparément";
    positives = ["Comparaison sectorielle utile", "Identification des différences de profil"];
  }

  if (lower.includes("actualité") || lower.includes("variation") || lower.includes("courbe") || lower.includes("72")) {
    focus = "les actualités mockées les plus récentes : " + asset.news.map(function (item) { return item.title; }).join("; ");
    positives = asset.news.filter(function (n) { return n.impact === "positif"; }).map(function (n) { return n.title; }).slice(0, 2);
  }

  if (lower.includes("conform") || lower.includes("halal") || lower.includes("éthique") || lower.includes("islamique")) {
    focus = "les points de conformité à vérifier : activité principale, dette à intérêt, revenus non conformes et purification potentielle. Aucun verdict religieux n'est fourni.";
    positives = ["Critères d'analyse disponibles", "Structure de données extensible pour Musaffa / AAOIFI"];
  }

  return {
    shortAnswer: "Pour " + asset.ticker + ", la lecture du prototype s'appuie sur " + focus + ". La conclusion reste volontairement non définitive, car les données sont statiques et démonstratives.",
    dataUsed: [
      "Prix fictif : " + asset.price + " " + asset.currency,
      "Variation 24h fictive : " + (asset.change24h >= 0 ? "+" : "") + asset.change24h + " %",
      "Score IA global fictif : " + asset.aiScores.global + "/100",
      "Statut conformité : " + asset.complianceStatus,
      "Sentiment : " + asset.sentiment + " · Risque : " + asset.risk
    ],
    positives,
    risks: asset.thesis.risks,
    disclaimer: "Prototype — données de démonstration — ne constitue pas un conseil en investissement. Aucune conformité religieuse définitive n'est fournie. Une validation réelle doit provenir d'une source externe ou d'une méthodologie définie."
  };
}
