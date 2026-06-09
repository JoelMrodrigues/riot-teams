# Guide — Piloter les agents sur void.pro

## 1. Lancer

1. Ouvre le dossier **`void-pro`** dans Claude Code, puis **relance-le une fois**
   (ça charge les 7 agents + le `CLAUDE.md` du projet).
2. Appelle un agent :
   - **Explicite** (le plus fiable) : « Utilise l'agent `dev-frontend` pour … »
   - **Automatique** : décris la tâche, Claude choisit l'agent.
   - **`/agents`** : voir / éditer / supprimer.

## 2. Tes 7 agents

| Besoin | Agent | Droits |
|---|---|---|
| Identité, charte, composants visuels | `designer` | écrit |
| Pages & navigation | `dev-frontend` | écrit + terminal |
| Logique serveur / API / DB (plus tard) | `dev-backend` | écrit + terminal |
| Audit dette technique, bugs, sécurité | `qa-securite` | **lecture seule** |
| Textes des pages | `redacteur` | écrit |
| Cadrage / roadmap | `chef-de-projet` | écrit (.md) |
| SEO (plus tard) | `seo` | écrit |

## 3. La boucle de travail (sans baisser la qualité)

1. Prends **UNE** tâche dans `docs/BACKLOG.md`.
2. Colle son prompt.
3. **Relis** le résultat (`npm run dev:full` → http://localhost:5173).
4. Coche la tâche, passe à la suivante.

## 4. Bon à savoir

- Le « auto » n'est **pas** un pilote sans toi : ce sont des tâches cadrées + ta relecture.
  C'est ce qui évite d'accumuler de la dette technique.
- **Tout** prompt visuel doit référencer `docs/DESIGN.md`, sinon le style part dans tous les sens.
- Sur le réseau d'entreprise, l'API Riot est bloquée (firewall) → normal. On ne fait que du **front**
  pour l'instant, donc aucun souci.
- Astuce avancée : la commande **`/loop`** peut enchaîner une tâche en auto-rythme, mais pour du
  design je conseille la **boucle manuelle avec relecture**.
