# Cahier des charges — Plateforme de gestion d'équipe LoL (nom provisoire)

> Document de cadrage produit par l'agent `chef-de-projet`.
> Statut : brouillon V1 — à valider/ajuster.

## Objectif

Une plateforme web **gratuite** qui sert d'**espace de travail aux équipes amateurs
et semi-pro de League of Legends** : gérer le roster, enregistrer et analyser les
**scrims**, et suivre la progression individuelle (parties classées) et collective.

Positionnement : pas « encore un site de stats » (op.gg, dpm.lol…), mais l'outil de
**gestion d'équipe + scrims** qui leur manque. Modèle économique : gratuit, puis
publicité non intrusive et sponsoring une fois l'audience installée.

Périmètre : **LoL d'abord**. Valorant puis TFT viendront réutiliser la même base.

## Personas

1. **Le coach / capitaine (cible n°1)** — organise l'équipe, planifie les scrims,
   veut voir la progression et identifier les points faibles.
2. **Le joueur d'équipe** — consulte ses stats, prépare les matchs, suit le planning.
3. *(plus tard)* Le manager / recruteur — gère plusieurs joueurs, scoute.

## User stories — MVP (V1)

### Compte & accès
- [ ] En tant qu'utilisateur, je crée un compte et **lie mon Riot ID** pour accéder à la plateforme.

### Gestion d'équipe
- [ ] En tant que coach, je **crée une équipe** et **invite** mes joueurs (lien/code).
- [ ] En tant que coach, j'**attribue les rôles** (Top/Jungle/Mid/ADC/Support, coach, manager).
- [ ] En tant que membre, je vois le **roster** et qui fait quoi.

### Scrims (saisie manuelle en V1)
- [ ] En tant que coach, j'**enregistre un scrim** : adversaire, date, score par game, picks/bans, notes.
- [ ] En tant que coach, je consulte les **stats d'équipe** issues des scrims : winrate par côté (bleu/rouge), champions joués, tendances.
- [ ] En tant que membre, je consulte l'**historique** des scrims de l'équipe.

### Stats individuelles
- [ ] En tant que joueur, je vois mes **stats de parties classées** (via API Riot) sur mon profil.
- [ ] En tant que coach, je compare la **forme de chaque joueur** du roster.

### Tableau de bord
- [ ] En tant que membre, j'ai un **dashboard d'équipe** : prochains scrims, derniers résultats, faits marquants.

## Sitemap — MVP

- **Accueil** (page publique : pitch + inscription)
- **Connexion / Inscription / Lier Riot ID**
- **Dashboard équipe**
- **Équipe** : roster, rôles, invitations
- **Scrims** : liste · ajouter un scrim · détail d'un scrim · stats d'équipe
- **Joueur** : profil + stats individuelles
- **Paramètres** : équipe + compte
- **Pages légales** : À propos · Mentions légales · Confidentialité (RGPD) · Contact

## Roadmap priorisée

### 🟢 MVP (V1) — objectif : un produit utilisable vite
Compte + liaison Riot ID · gestion d'équipe · saisie de scrims + stats d'équipe ·
stats individuelles (ranked) · dashboard.

### 🟡 V1.5 — l'automatisation promise
**Scrims automatiques via Tournament API Riot** (codes de tournoi) ·
calendrier/planning d'équipe · notes de coaching.

### 🔵 V2 — les outils de théorie
Simulateur de **draft** LoL · **plan de map** (tableau tactique) · **stats des joueurs pros**.

### ⚪ V3 et au-delà
**Valorant** puis **TFT** · régie publicitaire · éventuels comptes premium · scouting/recrutement.

## Points techniques & légaux à anticiper (éléments manquants)

- **API Riot** : clé *développeur* pour prototyper → clé *production* (validation Riot requise) pour le lancement. Respect des conditions d'utilisation et des quotas (rate limits).
- **Liaison de compte** : à choisir → **Riot Sign-On (RSO)**, propre mais soumis à validation Riot, *ou* saisie du **Riot ID + vérification** (plus simple pour démarrer).
- **Base de données** : à choisir (ex. PostgreSQL). Modèle : utilisateurs, équipes, membres/rôles, scrims, games, stats.
- **RGPD** : données de joueurs → consentement, mentions légales, politique de confidentialité dès le MVP.
- **Hébergement** : Vercel (adapté à Next.js) + base de données managée.

## Décisions ouvertes (à trancher avec toi)

1. **Nom du site** (et nom de domaine).
2. Liaison de compte : **RSO** ou **saisie manuelle du Riot ID** pour le MVP.
3. Choix de la base de données et de l'hébergement.
4. Identité visuelle (couleurs, ton) → à confier à l'agent `designer`.
