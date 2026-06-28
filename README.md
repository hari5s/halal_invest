# Ethiq Invest AI

Prototype web premium en français pour une plateforme d'analyse d'actions et d'ETF éthiques / islamiques.
**Scope : actions ("stocks") et ETF uniquement — aucune crypto.**
Les données sont fictives et statiques.

**Prototype — données de démonstration — ne constitue pas un conseil en investissement.**

## Lancer en local

1. Installer les dépendances :

~~~bash
npm install
~~~

2. Lancer le serveur de développement :

~~~bash
npm run dev
~~~

3. Ouvrir l'application :

~~~text
http://localhost:3000
~~~

## Vérifier le build

~~~bash
npm run build
~~~

## Fonctionnalités du prototype

- **Dashboard premium** avec indices (S&P 500, Nasdaq, Dow Jones, CAC 40, Or)
- **Demander à Ethiq AI** : widget central avec questions rapides, autocomplétion et réponses structurées mockées
- **Graphiques Lightweight Charts** : chandeliers japonais, volume, 5 périodes (1J/1S/1M/3M/1A), mode ligne
- **Recap 72h** : timeline d'événements mockés expliquant la courbe de prix
- **Watchlist locale** (localStorage) avec NVIDIA, Apple, Microsoft, ASML, Tesla, ETF Demo
- **Pages d'actif** : Vue générale, Finances, Technique, Actualités, Analyse IA, Éthique, Discussion IA
- **Conformité islamique prudente** : aucun verdict — "Conformité à vérifier" uniquement

## Ce qui est mocké

- Données de marché, prix, variations et séries OHLC de graphiques.
- Scores IA, sentiment, niveau de risque et sources affichées.
- Actualités, impacts estimés et résumés.
- Récapitulatif des 72 dernières heures par actif.
- Discussion IA locale, générée sans appel externe.
- Statuts de conformité éthique / islamique, toujours présentés comme à vérifier.

## APIs à ajouter plus tard (voir docs/roadmap.md)

- Données de marché : Polygon, Twelve Data, Alpha Vantage ou équivalent.
- Données financières fondamentales : fournisseur spécialisé ou filings.
- Actualités : News API, fournisseur financier ou flux propriétaire.
- IA : route API OpenAI remplaçant le générateur mocké dans `lib/mock-chat.ts`.
- Conformité : Musaffa, AAOIFI ou méthodologie validée par un conseil charia.

Variables d'environnement à configurer (voir `.env.example`) :

~~~env
MARKET_DATA_API_KEY=
NEWS_API_KEY=
MUSAFFA_API_KEY=
OPENAI_API_KEY=
~~~

## Structure

- `app/` : pages Next.js App Router
- `components/` : composants UI réutilisables
  - `components/charts/CandleChart.tsx` : graphique TradingView Lightweight Charts
  - `components/asset/` : détail actif, IA, recap 72h
  - `components/dashboard/` : widgets dashboard
- `data/` : données de démonstration facilement remplaçables
  - `data/services.ts` : interfaces TypeScript pour les futurs providers
- `hooks/` : logique client, dont la watchlist locale
- `lib/` : helpers et générateur de réponses IA mockées
- `docs/roadmap.md` : étapes pour transformer le prototype en vraie application
