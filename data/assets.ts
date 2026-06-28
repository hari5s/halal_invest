export type AssetType = "Action" | "ETF";
export type Sentiment = "Favorable" | "Neutre" | "Prudent" | "Défavorable";
export type RiskLevel = "Faible" | "Moyen" | "Élevé";
export type TimeRange = "1J" | "1S" | "1M" | "3M" | "1A";

export type PricePoint = {
  label: string;
  value: number;
};

export type OHLCBar = {
  time: number; // unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type AssetNews = {
  title: string;
  source: string;
  time: string;
  impact: "positif" | "neutre" | "négatif";
};

export type Event72h = {
  datetime: string;
  title: string;
  detail: string;
  impact: "positif" | "neutre" | "négatif";
};

export type Asset = {
  slug: string;
  name: string;
  ticker: string;
  type: AssetType;
  currency: string;
  price: number;
  change24h: number;
  logoTone: string;
  sentiment: Sentiment;
  risk: RiskLevel;
  complianceStatus: string;
  aiSummary: string;
  recap72hSummary: string;
  metrics: {
    marketCap: string;
    pe: string;
    debt: string;
    revenue: string;
    growth: string;
    volatility: string;
  };
  aiScores: {
    global: number;
    fundamentals: number;
    technical: number;
    news: number;
    risk: number;
  };
  thesis: {
    bull: string[];
    bear: string[];
    risks: string[];
    invalidation: string[];
  };
  ethics: {
    activity: string;
    interestDebt: string;
    nonCompliantRevenue: string;
    purification: string;
    methodology: string;
  };
  sources: string[];
  news: AssetNews[];
  events72h: Event72h[];
  priceSeries: Record<TimeRange, PricePoint[]>;
  ohlcSeries: Record<TimeRange, OHLCBar[]>;
};

function series(base: number, moves: number[]): PricePoint[] {
  return moves.map(function (move, index) {
    return {
      label: String(index + 1),
      value: Number((base * (1 + move / 100)).toFixed(base > 1000 ? 0 : 2))
    };
  });
}

// Generate realistic OHLC bars from a base price and a list of daily % moves
function ohlcSeries(base: number, dailyMoves: number[], daysBack: number): OHLCBar[] {
  const now = Math.floor(Date.now() / 1000);
  const DAY = 86400;
  const bars: OHLCBar[] = [];
  let price = base;

  for (let i = dailyMoves.length - 1; i >= 0; i--) {
    const move = dailyMoves[i];
    const open = Number((price / (1 + move / 100)).toFixed(2));
    const close = Number(price.toFixed(2));
    const amplitude = Math.abs(open - close) * (1.4 + Math.random() * 0.8);
    const high = Number((Math.max(open, close) + amplitude * 0.5).toFixed(2));
    const low = Number((Math.min(open, close) - amplitude * 0.5).toFixed(2));
    const vol = Math.floor(500000 + Math.random() * 4000000);
    bars.unshift({
      time: now - (dailyMoves.length - 1 - i) * DAY,
      open,
      high,
      low,
      close,
      volume: vol
    });
    price = open;
  }
  return bars;
}

// Helper to build intraday 1J bars (15-min intervals, ~26 bars)
function intradayBars(base: number, finalChange: number): OHLCBar[] {
  const now = Math.floor(Date.now() / 1000);
  const INTERVAL = 900; // 15 min
  const bars: OHLCBar[] = [];
  let price = base * (1 - finalChange / 100);
  const target = base;
  const steps = 26;

  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const noise = (Math.random() - 0.5) * base * 0.006;
    const open = Number(price.toFixed(2));
    const close = Number((price + (target - price) * 0.08 + noise).toFixed(2));
    const amplitude = Math.abs(open - close) * (1.2 + Math.random());
    const high = Number((Math.max(open, close) + amplitude * 0.4).toFixed(2));
    const low = Number((Math.min(open, close) - amplitude * 0.4).toFixed(2));
    bars.push({
      time: now - (steps - i) * INTERVAL,
      open, high, low, close,
      volume: Math.floor(50000 + Math.random() * 400000)
    });
    price = close;
  }
  return bars;
}

export const assets: Asset[] = [
  {
    slug: "nvda",
    name: "NVIDIA",
    ticker: "NVDA",
    type: "Action",
    currency: "USD",
    price: 132.48,
    change24h: 2.36,
    logoTone: "from-emerald-350 to-gold-400",
    sentiment: "Prudent",
    risk: "Élevé",
    complianceStatus: "Conformité à vérifier",
    aiSummary: "L'analyse reste constructive, portée par une croissance solide et un momentum favorable. Cependant, la valorisation élevée et la dépendance au secteur de l'IA rendent l'actif sensible aux prochaines publications.",
    recap72hSummary: "La hausse récente semble principalement liée à des perspectives de croissance solides dans l'IA, mais la volatilité reste élevée après des prises de bénéfices suite à l'annonce de nouvelles restrictions export.",
    metrics: {
      marketCap: "3,26 T$",
      pe: "49,8x",
      debt: "Faible à modérée",
      revenue: "96,4 Md$",
      growth: "+58 %",
      volatility: "Élevée"
    },
    aiScores: { global: 74, fundamentals: 82, technical: 76, news: 69, risk: 55 },
    thesis: {
      bull: ["Demande persistante pour les accélérateurs IA", "Pouvoir de fixation des prix encore robuste", "Écosystème logiciel difficile à répliquer"],
      bear: ["Valorisation exigeante", "Risque de normalisation des marges", "Dépendance aux cycles de dépenses cloud"],
      risks: ["Restrictions export", "Concurrence ASIC interne", "Déception sur les prochains guidages"],
      invalidation: ["Ralentissement net des commandes datacenter", "Compression durable des marges", "Perte de parts chez les hyperscalers"]
    },
    ethics: {
      activity: "Semi-conducteurs, calcul accéléré et plateformes logicielles. Classification démonstrative uniquement.",
      interestDebt: "Ratio à vérifier via états financiers audités et méthodologie externe.",
      nonCompliantRevenue: "Aucune conclusion. Les lignes de revenus doivent être qualifiées par source spécialisée.",
      purification: "Non calculée dans ce prototype. Requiert un référentiel religieux et financier daté.",
      methodology: "Le statut réel devra provenir d'une source comme Musaffa, AAOIFI ou un conseil charia identifié. Aucun verdict religieux définitif n'est fourni."
    },
    sources: ["Marché mock", "Résultats simulés", "Flux news fictif", "Score IA local"],
    news: [
      { title: "Hausse fictive des commandes IA chez les grands clients cloud", source: "FinWire Demo", time: "08:40", impact: "positif" },
      { title: "Analystes divisés sur la durabilité des marges", source: "Market Pulse", time: "10:05", impact: "neutre" },
      { title: "Nouvelle règle export évoquée dans la presse spécialisée", source: "Policy Desk", time: "12:20", impact: "négatif" }
    ],
    events72h: [
      { datetime: "Hier 09:30", title: "Annonce de commandes massives par un hyperscaler", detail: "Un grand client cloud a confirmé une commande record d'accélérateurs H100 pour 2025, dépassant les attentes du consensus.", impact: "positif" },
      { datetime: "Hier 14:15", title: "Nouvelles restrictions export envisagées", detail: "Des sources proches du régulateur américain évoquent un élargissement des contrôles à l'export vers certains marchés asiatiques.", impact: "négatif" },
      { datetime: "Hier 17:45", title: "Upgrade d'analyste avec objectif relevé", detail: "Un desk sell-side a relevé son objectif de cours de 140 à 155$, citant la visibilité exceptionnelle du carnet de commandes.", impact: "positif" },
      { datetime: "Aujourd'hui 08:10", title: "Prises de bénéfices à l'ouverture", detail: "Des flux de vente modérés ont été observés à l'ouverture après la forte hausse de la veille, sans catalyseur négatif identifié.", impact: "neutre" },
      { datetime: "Aujourd'hui 11:30", title: "Rebond porté par les institutionnels", detail: "Les flux acheteurs ont repris en milieu de séance, soutenant le titre au-dessus du support court terme.", impact: "positif" }
    ],
    priceSeries: {
      "1J": series(132.48, [-1.4, -0.6, 0.2, 0.9, 1.4, 1.9, 2.36]),
      "1S": series(132.48, [-4.2, -2.9, -2.1, 0.8, 1.1, 2.0, 2.36]),
      "1M": series(132.48, [-8.5, -6.1, -2.5, 1.2, 5.8, 3.6, 2.36]),
      "3M": series(132.48, [-18, -12, -4, 5, 12, 18, 14, 22, 28, 24, 30, 36, 42, 38, 45]),
      "1A": series(132.48, [-22, -14, -5, 12, 28, 42, 57])
    },
    ohlcSeries: {
      "1J": intradayBars(132.48, 2.36),
      "1S": ohlcSeries(132.48, [-4.2, -2.9, -2.1, 0.8, 1.1, 2.0, 2.36], 7),
      "1M": ohlcSeries(132.48, [-8.5, -6.1, -4.2, -2.5, -0.8, 1.2, 2.6, 4.1, 5.8, 4.9, 3.6, 2.36], 30),
      "3M": ohlcSeries(132.48, [-18, -15, -12, -8, -4, 0, 3, 6, 10, 14, 18, 14, 22, 25, 28, 24, 27, 30, 33, 36, 39, 42, 38, 40, 43, 45, 42, 44, 46, 48, 50], 90),
      "1A": ohlcSeries(132.48, [-22, -19, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 28, 35, 40, 42, 45, 50, 55, 52, 57], 365)
    }
  },
  {
    slug: "aapl",
    name: "Apple",
    ticker: "AAPL",
    type: "Action",
    currency: "USD",
    price: 214.07,
    change24h: -0.42,
    logoTone: "from-zinc-200 to-emerald-350",
    sentiment: "Neutre",
    risk: "Moyen",
    complianceStatus: "Conformité à vérifier",
    aiSummary: "Profil de qualité, trésorerie importante et base installée solide. Le potentiel dépend surtout du renouvellement produit et de la capacité à accélérer les services sans pression réglementaire excessive.",
    recap72hSummary: "Le titre consolide après des précommandes supérieures aux attentes, mais une enquête réglementaire simulée sur l'App Store pèse sur le sentiment à court terme.",
    metrics: { marketCap: "3,12 T$", pe: "31,2x", debt: "Maîtrisée", revenue: "383 Md$", growth: "+4 %", volatility: "Moyenne" },
    aiScores: { global: 68, fundamentals: 78, technical: 58, news: 64, risk: 72 },
    thesis: {
      bull: ["Écosystème très fidélisant", "Services à marge élevée", "Rachats d'actions soutenus"],
      bear: ["Croissance matérielle modérée", "Risque antitrust", "Valorisation peu généreuse"],
      risks: ["Cycle iPhone plus faible", "Pression sur commissions App Store", "Retard dans les fonctionnalités IA"],
      invalidation: ["Baisse prolongée des services", "Perte de parts premium", "Marge brute sous pression durable"]
    },
    ethics: {
      activity: "Matériel, logiciels, services et distribution numérique. Statut à qualifier par source externe.",
      interestDebt: "Dette et trésorerie à recalculer selon le référentiel choisi.",
      nonCompliantRevenue: "Revenus à auditer, notamment services et contenus tiers.",
      purification: "Non calculée. Nécessite une méthodologie documentée.",
      methodology: "La conformité doit être reliée à une méthodologie, une date de vérification et une source auditable."
    },
    sources: ["Marché mock", "Comptes simulés", "Flux news fictif"],
    news: [
      { title: "Précommandes fictives supérieures aux attentes sur une gamme premium", source: "Tech Ledger", time: "09:15", impact: "positif" },
      { title: "Enquête réglementaire simulée sur une place de marché", source: "Policy Desk", time: "11:45", impact: "négatif" }
    ],
    events72h: [
      { datetime: "Il y a 2j 10:00", title: "Précommandes record sur la nouvelle gamme", detail: "Les chiffres de précommandes fictives dépassent les estimations du consensus de +12%, porté par les marchés asiatiques.", impact: "positif" },
      { datetime: "Hier 11:45", title: "Ouverture d'une enquête antitrust simulée", detail: "Le régulateur européen fictif a annoncé une investigation sur les commissions de l'App Store, soulevant des incertitudes sur les revenus de services.", impact: "négatif" },
      { datetime: "Hier 16:20", title: "Stabilisation des flux institutionnels", detail: "Les données de flux fictifs montrent une stabilisation des positions institutionnelles sans mouvement directionnel fort.", impact: "neutre" }
    ],
    priceSeries: {
      "1J": series(214.07, [0.2, 0.1, -0.1, -0.6, -0.5, -0.3, -0.42]),
      "1S": series(214.07, [1.6, 0.8, 0.2, -0.7, -0.4, -0.1, -0.42]),
      "1M": series(214.07, [-2.4, -1.8, -0.4, 0.9, 1.2, 0.1, -0.42]),
      "3M": series(214.07, [-6, -4.5, -3, -1.5, 0, 1.5, 3, 2, 1, -0.5, -1, -0.8, -0.42, -0.2, 0.1]),
      "1A": series(214.07, [-6, -2, 8, 11, 14, 9, 12])
    },
    ohlcSeries: {
      "1J": intradayBars(214.07, -0.42),
      "1S": ohlcSeries(214.07, [1.6, 0.8, 0.2, -0.7, -0.4, -0.1, -0.42], 7),
      "1M": ohlcSeries(214.07, [-2.4, -2.0, -1.8, -1.2, -0.4, 0.2, 0.9, 1.2, 0.8, 0.1, -0.2, -0.42], 30),
      "3M": ohlcSeries(214.07, [-6, -5, -4.5, -3.5, -3, -2, -1.5, -1, 0, 1, 1.5, 2, 3, 2.5, 1.5, 1, 0.5, 0, -0.5, -1, -0.8, -0.5, -0.8, -0.42, -0.2, 0, 0.1, -0.1, -0.3, -0.42, -0.1], 90),
      "1A": ohlcSeries(214.07, [-6, -5, -3, -1, 2, 5, 8, 10, 11, 13, 14, 12, 9, 11, 12, 10, 11, 12, 11, 11.5, 12], 365)
    }
  },
  {
    slug: "asml",
    name: "ASML Holding",
    ticker: "ASML",
    type: "Action",
    currency: "EUR",
    price: 946.3,
    change24h: 1.18,
    logoTone: "from-gold-300 to-emerald-350",
    sentiment: "Favorable",
    risk: "Moyen",
    complianceStatus: "Conformité à vérifier",
    aiSummary: "Position concurrentielle rare dans les équipements de lithographie. La visibilité reste élevée, mais les cycles semi-conducteurs et les restrictions géopolitiques exigent une lecture prudente.",
    recap72hSummary: "Une commande importante d'un fondeur asiatique a soutenu le titre, tandis que des commentaires prudents sur les délais de livraison ont tempéré l'enthousiasme initial.",
    metrics: { marketCap: "372 Md€", pe: "38,4x", debt: "Modérée", revenue: "27,6 Md€", growth: "+17 %", volatility: "Moyenne" },
    aiScores: { global: 77, fundamentals: 84, technical: 71, news: 72, risk: 65 },
    thesis: {
      bull: ["Position quasi unique en EUV", "Carnet de commandes robuste", "Exposition structurelle aux puces avancées"],
      bear: ["Cycle de commandes irrégulier", "Sensibilité Chine", "Valorisation déjà premium"],
      risks: ["Restrictions export", "Décalage de capex clients", "Pression sur délais de livraison"],
      invalidation: ["Annulations de commandes majeures", "Baisse prolongée du carnet", "Rupture technologique concurrente crédible"]
    },
    ethics: {
      activity: "Équipements de fabrication de semi-conducteurs. Démonstration sans verdict.",
      interestDebt: "À mesurer selon les derniers comptes et seuils de la méthodologie externe.",
      nonCompliantRevenue: "À vérifier auprès d'un fournisseur de conformité.",
      purification: "Non calculée dans le prototype.",
      methodology: "Un avis réel devrait citer Musaffa, AAOIFI ou un comité charia, avec date et critères."
    },
    sources: ["Marché mock", "Carnet fictif", "Score IA local"],
    news: [
      { title: "Commande fictive importante d'un fondeur asiatique", source: "Semi Daily", time: "07:55", impact: "positif" },
      { title: "Commentaires prudents sur le calendrier de livraisons", source: "Market Pulse", time: "13:05", impact: "neutre" }
    ],
    events72h: [
      { datetime: "Il y a 2j 08:00", title: "Commande record d'un fondeur taïwanais", detail: "TSMC fictif a confirmé une commande de 5 systèmes EUV supplémentaires pour ses fabs de nouvelle génération, valorisée à 3,5 Md€.", impact: "positif" },
      { datetime: "Hier 13:05", title: "Management prudent sur les délais de livraison", detail: "La direction a évoqué des tensions logistiques pouvant décaler la livraison de 2 à 3 systèmes au trimestre suivant.", impact: "neutre" },
      { datetime: "Hier 15:30", title: "Hausse de la cible par une banque d'investissement", detail: "Un desk buy-side a relevé l'objectif de 960 à 1020€, maintenant sa conviction sur le leadership EUV.", impact: "positif" },
      { datetime: "Aujourd'hui 09:45", title: "Légère pression des semi-conducteurs en Europe", detail: "Le secteur semi-conducteurs européen a connu une rotation modérée, pesant légèrement sur le titre sans catalyseur propre.", impact: "neutre" }
    ],
    priceSeries: {
      "1J": series(946.3, [-0.8, -0.2, 0.4, 0.6, 1.0, 1.25, 1.18]),
      "1S": series(946.3, [-1.6, -0.4, 0.6, 1.4, 2.5, 2.2, 1.18]),
      "1M": series(946.3, [-5.2, -3.8, -1.1, 2.6, 4.4, 3.7, 1.18]),
      "3M": series(946.3, [-12, -9, -7, -4, -2, 0, 2, 4, 7, 9, 11, 8, 5, 3, 1.18]),
      "1A": series(946.3, [-12, -4, 6, 18, 23, 31, 36])
    },
    ohlcSeries: {
      "1J": intradayBars(946.3, 1.18),
      "1S": ohlcSeries(946.3, [-1.6, -0.4, 0.6, 1.4, 2.5, 2.2, 1.18], 7),
      "1M": ohlcSeries(946.3, [-5.2, -4.2, -3.8, -2.5, -1.1, 0.5, 2.0, 2.6, 3.8, 4.4, 3.7, 2.8, 1.18], 30),
      "3M": ohlcSeries(946.3, [-12, -10, -9, -7.5, -7, -5, -4, -2, 0, 2, 4, 6, 7, 9, 10, 11, 9, 8, 5, 4, 3, 2, 1.5, 1.18, 1, 1.5, 0.8, 1.2, 1.18, 0.9, 1.18], 90),
      "1A": ohlcSeries(946.3, [-12, -9, -6, -3, 0, 3, 6, 10, 14, 18, 22, 23, 25, 28, 30, 31, 33, 35, 36, 34, 36], 365)
    }
  },
  {
    slug: "msft",
    name: "Microsoft",
    ticker: "MSFT",
    type: "Action",
    currency: "USD",
    price: 441.2,
    change24h: 0.86,
    logoTone: "from-emerald-350 to-cyan-300",
    sentiment: "Favorable",
    risk: "Moyen",
    complianceStatus: "Conformité à vérifier",
    aiSummary: "Croissance cloud et intégration IA soutiennent le scénario central. Le risque principal porte sur la concurrence cloud, le coût des infrastructures IA et les enquêtes réglementaires.",
    recap72hSummary: "Une publication de revenus cloud meilleure qu'attendu a propulsé le titre, malgré des interrogations persistantes sur les dépenses en infrastructure IA et leur impact sur les marges.",
    metrics: { marketCap: "3,28 T$", pe: "36,1x", debt: "Faible", revenue: "245 Md$", growth: "+15 %", volatility: "Moyenne" },
    aiScores: { global: 79, fundamentals: 86, technical: 73, news: 76, risk: 68 },
    thesis: {
      bull: ["Cloud en croissance", "Distribution entreprise exceptionnelle", "Monétisation progressive de l'IA"],
      bear: ["Capex IA élevé", "Risque réglementaire", "Concurrence sur Azure"],
      risks: ["Compression des marges cloud", "Coûts GPU", "Enquêtes antitrust"],
      invalidation: ["Ralentissement durable Azure", "Adoption IA inférieure aux attentes", "Hausse des coûts non compensée"]
    },
    ethics: {
      activity: "Logiciels, cloud, jeux et productivité. Analyse religieuse non fournie.",
      interestDebt: "À vérifier sur base de comptes consolidés et seuils externes.",
      nonCompliantRevenue: "Certaines activités doivent être qualifiées par fournisseur spécialisé.",
      purification: "Non calculée.",
      methodology: "La conformité réelle doit être validée par une source externe reconnue."
    },
    sources: ["Marché mock", "Guidance simulée", "Flux news fictif"],
    news: [
      { title: "Croissance cloud fictive meilleure que prévu", source: "Cloud Brief", time: "08:30", impact: "positif" },
      { title: "Dépenses d'infrastructure IA surveillées par le marché", source: "Market Pulse", time: "14:10", impact: "neutre" }
    ],
    events72h: [
      { datetime: "Il y a 2j 22:00", title: "Publication des résultats trimestriels (après clôture)", detail: "Azure a affiché une croissance de +31% contre +28% attendu. Le BPA ajusté dépasse le consensus de 4%.", impact: "positif" },
      { datetime: "Hier 09:00", title: "Gap haussier à l'ouverture, fort volume", detail: "Le titre a ouvert en hausse de +4,2%, avec un volume record en pré-marché portant la capitalisation au-delà de 3,3T$.", impact: "positif" },
      { datetime: "Hier 14:10", title: "Interrogations sur la rentabilité du Capex IA", detail: "Plusieurs analystes ont soulevé la question du retour sur investissement des 80Md$ de capex IA prévus pour l'exercice.", impact: "neutre" },
      { datetime: "Aujourd'hui 10:20", title: "Consolidation ordonnée après la hausse", detail: "Le titre consolide dans les +2% au-dessus de son cours d'avant résultats, soutenu par les flux d'indices.", impact: "neutre" }
    ],
    priceSeries: {
      "1J": series(441.2, [-0.3, 0.1, 0.4, 0.7, 0.9, 0.8, 0.86]),
      "1S": series(441.2, [-1.0, -0.2, 0.5, 1.2, 1.6, 1.4, 0.86]),
      "1M": series(441.2, [-3.0, -1.2, 1.0, 3.2, 4.1, 3.5, 0.86]),
      "3M": series(441.2, [-8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 8, 6, 4, 2, 0.86]),
      "1A": series(441.2, [-8, -1, 5, 13, 20, 24, 29])
    },
    ohlcSeries: {
      "1J": intradayBars(441.2, 0.86),
      "1S": ohlcSeries(441.2, [-1.0, -0.2, 0.5, 1.2, 1.6, 1.4, 0.86], 7),
      "1M": ohlcSeries(441.2, [-3.0, -2.2, -1.2, -0.2, 1.0, 2.0, 3.2, 4.1, 3.5, 2.5, 1.5, 0.86], 30),
      "3M": ohlcSeries(441.2, [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.86, 1, 0.86], 90),
      "1A": ohlcSeries(441.2, [-8, -6, -4, -2, 0, 2, 5, 8, 11, 14, 17, 20, 22, 24, 26, 27, 28, 29, 28, 29, 29], 365)
    }
  },
  {
    slug: "tsla",
    name: "Tesla",
    ticker: "TSLA",
    type: "Action",
    currency: "USD",
    price: 186.45,
    change24h: -3.82,
    logoTone: "from-rose-400 to-gold-300",
    sentiment: "Défavorable",
    risk: "Élevé",
    complianceStatus: "Conformité à vérifier",
    aiSummary: "La volatilité reste élevée avec pression sur les marges et visibilité réduite. Les options de croissance existent, mais le marché demande davantage de preuves opérationnelles.",
    recap72hSummary: "Une guerre des prix agressive sur plusieurs marchés clés a déclenché une vague de ventes. Le titre subit une pression persistante malgré l'annonce d'un nouveau site de production pour 2027.",
    metrics: { marketCap: "594 Md$", pe: "54,6x", debt: "Faible", revenue: "97 Md$", growth: "+3 %", volatility: "Élevée" },
    aiScores: { global: 49, fundamentals: 52, technical: 41, news: 45, risk: 38 },
    thesis: {
      bull: ["Marque forte", "Option robotique et énergie", "Structure financière flexible"],
      bear: ["Marges sous pression", "Demande plus cyclique", "Valorisation dépendante d'options futures"],
      risks: ["Guerre des prix", "Retards produit", "Risque de gouvernance"],
      invalidation: ["Rebond durable des marges", "Livraisons au-dessus du consensus", "Monétisation visible de nouvelles activités"]
    },
    ethics: {
      activity: "Véhicules électriques, énergie et logiciels. Qualification externe requise.",
      interestDebt: "À vérifier selon méthodologie datée.",
      nonCompliantRevenue: "À vérifier par source de conformité.",
      purification: "Non calculée.",
      methodology: "Aucun verdict définitif. Les seuils et sources doivent être explicites."
    },
    sources: ["Marché mock", "Livraisons simulées", "Flux news fictif"],
    news: [
      { title: "Baisse fictive des prix sur plusieurs marchés", source: "Auto Ledger", time: "09:35", impact: "négatif" },
      { title: "Nouvelle usine simulée annoncée pour 2027", source: "Industry Note", time: "15:50", impact: "neutre" }
    ],
    events72h: [
      { datetime: "Il y a 2j 07:00", title: "Annonce de baisses de prix sur 3 marchés", detail: "Tesla a réduit ses tarifs de 5 à 9% en Europe, Chine et Australie, amplifiant les inquiétudes sur les marges brutes.", impact: "négatif" },
      { datetime: "Il y a 2j 15:20", title: "Révision à la baisse des estimations de livraison", detail: "Plusieurs desks ont réduit leurs estimations de livraisons T3 de 480K à 460K unités, sous le consensus.", impact: "négatif" },
      { datetime: "Hier 15:50", title: "Annonce d'un site de production pour 2027", detail: "Une nouvelle gigafactory fictive en Asie du Sud-Est a été annoncée, avec un horizon d'ouverture en 2027.", impact: "neutre" },
      { datetime: "Aujourd'hui 09:00", title: "Accélération des ventes à l'ouverture", detail: "Le titre subit des flux vendeurs en préouverture, amplifiant la tendance baissière des deux jours précédents.", impact: "négatif" }
    ],
    priceSeries: {
      "1J": series(186.45, [0.4, -0.8, -1.7, -2.5, -3.2, -3.5, -3.82]),
      "1S": series(186.45, [1.2, -0.4, -2.5, -5.8, -6.4, -4.6, -3.82]),
      "1M": series(186.45, [6.0, 2.1, -4.6, -8.1, -12.4, -9.6, -3.82]),
      "3M": series(186.45, [18, 14, 10, 6, 2, -2, -4, -6, -8, -10, -8, -5, -3.82, -4, -3.82]),
      "1A": series(186.45, [18, 9, -4, -11, -22, -18, -15])
    },
    ohlcSeries: {
      "1J": intradayBars(186.45, -3.82),
      "1S": ohlcSeries(186.45, [1.2, -0.4, -2.5, -5.8, -6.4, -4.6, -3.82], 7),
      "1M": ohlcSeries(186.45, [6.0, 4.5, 2.1, 0.5, -2, -4.6, -6.5, -8.1, -10, -12.4, -11, -9.6, -7, -5, -3.82], 30),
      "3M": ohlcSeries(186.45, [18, 16, 14, 12, 10, 8, 6, 4, 2, 0, -2, -3, -4, -5, -6, -7, -8, -7, -6, -5, -4, -5, -6, -7, -8, -6, -4, -3.82, -4, -3.5, -3.82], 90),
      "1A": ohlcSeries(186.45, [18, 15, 12, 8, 4, 0, -4, -7, -10, -13, -16, -19, -22, -20, -18, -17, -15, -14, -13, -14, -15], 365)
    }
  },
  {
    slug: "world-etf",
    name: "ETF Monde Éthique Demo",
    ticker: "EIW",
    type: "ETF",
    currency: "EUR",
    price: 87.42,
    change24h: 0.21,
    logoTone: "from-emerald-350 to-teal-200",
    sentiment: "Neutre",
    risk: "Faible",
    complianceStatus: "Panier à vérifier ligne par ligne",
    aiSummary: "Panier mondial fictif conçu pour la démonstration. Le risque est plus diversifié, mais la conformité doit être vérifiée au niveau de chaque ligne et de la méthode d'indice.",
    recap72hSummary: "Une rotation modérée vers la qualité a légèrement bénéficié à l'ETF, qui suit l'évolution des marchés actions mondiaux sans catalyseur propre significatif sur la période.",
    metrics: { marketCap: "1,2 Md€", pe: "22,4x", debt: "Agrégée", revenue: "Diversifiée", growth: "+8 %", volatility: "Faible à moyenne" },
    aiScores: { global: 66, fundamentals: 64, technical: 61, news: 60, risk: 78 },
    thesis: {
      bull: ["Diversification mondiale", "Volatilité réduite", "Exposition multi-secteurs"],
      bear: ["Moins de potentiel spécifique", "Méthodologie d'indice à auditer", "Frais et réplication à examiner"],
      risks: ["Concentration cachée", "Changement d'indice", "Exposition devises"],
      invalidation: ["Méthodologie non transparente", "Frais excessifs", "Conformité non vérifiable par ligne"]
    },
    ethics: {
      activity: "ETF fictif. Les composantes doivent être auditées individuellement.",
      interestDebt: "À calculer sur chaque émetteur du panier.",
      nonCompliantRevenue: "À mesurer ligne par ligne selon la méthode externe.",
      purification: "À calculer seulement après audit complet des composants.",
      methodology: "Un ETF réel nécessite une analyse de l'indice, des constituants, de la réplication et des revenus accessoires."
    },
    sources: ["Panier mock", "Méthode fictive", "Score IA local"],
    news: [
      { title: "Rééquilibrage fictif du panier avec baisse du poids cyclique", source: "ETF Lab", time: "10:30", impact: "neutre" }
    ],
    events72h: [
      { datetime: "Il y a 2j 12:00", title: "Rééquilibrage trimestriel fictif", detail: "Le panier a été rééquilibré avec une réduction du poids cyclique au profit des valeurs de qualité défensives.", impact: "neutre" },
      { datetime: "Hier 10:15", title: "Rotation marchés vers la qualité", detail: "Une rotation sectorielle globale a légèrement bénéficié à l'ETF, dont le biais qualité est positionné favorablement.", impact: "positif" }
    ],
    priceSeries: {
      "1J": series(87.42, [-0.1, 0.0, 0.1, 0.16, 0.23, 0.2, 0.21]),
      "1S": series(87.42, [-0.8, -0.2, 0.1, 0.4, 0.7, 0.5, 0.21]),
      "1M": series(87.42, [-2.0, -1.1, -0.2, 0.8, 1.4, 1.1, 0.21]),
      "3M": series(87.42, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 4, 3, 2, 0.21]),
      "1A": series(87.42, [-5, -2, 3, 6, 9, 11, 10])
    },
    ohlcSeries: {
      "1J": intradayBars(87.42, 0.21),
      "1S": ohlcSeries(87.42, [-0.8, -0.2, 0.1, 0.4, 0.7, 0.5, 0.21], 7),
      "1M": ohlcSeries(87.42, [-2.0, -1.6, -1.1, -0.6, -0.2, 0.3, 0.8, 1.1, 1.4, 1.1, 0.7, 0.21], 30),
      "3M": ohlcSeries(87.42, [-5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0.21], 90),
      "1A": ohlcSeries(87.42, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 10, 10], 365)
    }
  }
];

export const defaultWatchlistSlugs = ["nvda", "aapl", "asml", "msft", "tsla", "world-etf"];
export const timeRanges: TimeRange[] = ["1J", "1S", "1M", "3M", "1A"];

export function getAssetBySlug(slug: string) {
  return assets.find(function (asset) {
    return asset.slug === slug;
  });
}

export function searchAssets(query: string) {
  var normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return assets.filter(function (asset) {
    return asset.name.toLowerCase().includes(normalized) || asset.ticker.toLowerCase().includes(normalized) || asset.type.toLowerCase().includes(normalized);
  });
}
