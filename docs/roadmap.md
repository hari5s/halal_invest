# Roadmap vers une vraie application

---

## Phase 1 — Prototype actuel (complété)

**Objectif** : démontrer l'expérience produit avec données mockées.

- [x] Actions et ETF uniquement (aucune crypto)
- [x] Données de prix, OHLC et métriques statiques
- [x] Graphiques Lightweight Charts (chandeliers, volume, 5 périodes)
- [x] IA mockée locale (`lib/mock-chat.ts`)
- [x] Widget "Demander à Ethiq AI" sur le dashboard
- [x] Récapitulatif 72h avec timeline d'événements
- [x] Watchlist locale (localStorage)
- [x] Conformité islamique prudente sans verdict définitif
- [x] Interfaces TypeScript pour les futurs providers (`data/services.ts`)

---

## Phase 2 — Données et IA réelles

**Objectif** : remplacer les mocks par de vraies sources.

### 2.1 Données boursières réelles
- Brancher `MarketDataProvider` sur Polygon, Twelve Data ou Alpha Vantage
- Normaliser les tickers, gérer les devises, les horaires de marché et les erreurs
- Mettre en cache les OHLC côté serveur (Redis ou ISR Next.js)

### 2.2 Données financières fondamentales
- Ajouter bilans, comptes de résultat, dette, revenus, croissance, marges et ratios
- Stocker les snapshots pour garder une trace des analyses historiques

### 2.3 Actualités financières réelles
- Brancher `NewsProvider` sur News API ou fournisseur financier
- Dédupliquer, classer l'impact, afficher les sources avec horodatage fiable
- Alimenter le bloc "Recap 72h" automatiquement

### 2.4 Analyse IA via API
- Créer une route API Next.js côté serveur (`app/api/analyze/route.ts`)
- Brancher `AIAnalysisProvider` sur OpenAI (GPT-4o)
- L'IA doit citer les données utilisées, séparer faits et interprétation
- Refuser le conseil personnalisé, intégrer un historique de conversation

### 2.5 Conformité islamique externe
- Brancher `ShariaComplianceProvider` sur Musaffa, AAOIFI ou source équivalente
- Associer chaque statut à une méthodologie, une date, une version de critères et une source auditable
- Ne jamais afficher "halal" ou "haram" sans source externe vérifiable

---

## Phase 3 — Comptes utilisateurs et fonctionnalités avancées

**Objectif** : transformer le prototype en application complète.

### 3.1 Base de données
- Ajouter PostgreSQL (via Supabase ou Neon) pour :
  - Utilisateurs et profils
  - Watchlists synchronisées
  - Préférences et alertes
  - Snapshots d'actifs et conversations
  - Journaux de conformité

### 3.2 Authentification
- Mettre en place NextAuth.js ou Clerk
- Gestion des sessions, MFA, suppression de compte, export de données

### 3.3 Alertes et notifications
- Alertes de prix et de variation
- Notifications de changement de conformité
- Résumés IA périodiques par actif suivi

### 3.4 RGPD et mentions légales
- Consentement, politique de confidentialité, conservation des données
- Droit à l'effacement, mentions légales, cookies et audit des traitements

### 3.5 Encadrement réglementaire
- Éviter le conseil personnalisé réglementé
- Afficher les limites, ne pas recommander d'achat ou de vente
- Distinguer information générale, analyse éducative et décision utilisateur

### 3.6 Portefeuille (optionnel, phase tardive)
- Suivi de positions sans connexion broker
- Calcul de performance et purification estimée
- Ne jamais permettre le passage d'ordres réels
