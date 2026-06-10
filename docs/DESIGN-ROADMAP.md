# DESIGN-ROADMAP — void.pro (section LoL)

> Objectif : **arrêter de tourner en rond**. Méthode + anatomie des composants +
> ordre de travail. Complète la charte d'ambiance `docs/DESIGN.md`.

## 1. Méthode de travail (obligatoire)

1. **Spec + maquette ASCII validée AVANT de coder** une page ou une refonte.
   L'utilisateur valide en ~2 min, puis on construit la page **d'un seul coup**.
2. **Milestones validés** (page entière), jamais de micro-retouches en boucle.
3. **Preview partout** via le **mode démo** : ajouter `?demo=1` à l'URL → données
   fictives, sans serveur (même sur réseau qui bloque l'API).
4. **Sessions séparées** : design (front + mock) ≠ backend ≠ déploiement.
5. **Tokens only** (`src/index.css`) — jamais de couleur/police en dur.

## 2. Anatomie des composants récurrents (référence)

- **Gabarit de page** : `mx-auto w-full max-w-5xl/6xl px-4 md:px-6 lg:px-8` + `flex flex-col gap-6` ; en-tête = titre Rajdhani (2xl/3xl) + sous-titre Inter muted.
- **Surface/carte** : `rounded-md border`, fond `--lol-surface`, bordure `--lol-border`, padding `p-4`/`p-5`.
- **Carte joueur** (Aperçu) : bande d'en-tête teintée à **hauteur fixe** (nom + Riot ID + chips rôle/rang court + crête à droite) → corps « Top 5 champions ».
- **Chip** : `rounded-sm px-2 py-0.5 text-[10-11px] font-bold uppercase`, fond `accent1A`, texte accent.
- **Stat card** : label muted 10px + valeur `text-2xl` Rajdhani + sous-texte.
- **Ligne de liste** : `rounded-md border` + barre colorée à gauche + contenu flex + valeur à droite.
- **Couleurs sémantiques** : winrate → `winrateColor`, rang → `tierColor`/`formatRankShort`, victoire = emerald, défaite = `--danger`.
- **Responsive** : mobile-first, grilles `1 → 2 → 3/5` colonnes, aucune largeur fixe.

## 3. Roadmap design (ordre proposé — à valider)

| # | Page | État | Intention |
|---|------|------|-----------|
| 1 | **Aperçu équipe** | refait (cartes denses) | valider à l'œil, ajustements fins |
| 2 | **Profil Solo** | op.gg-like | polir hiérarchie / densité |
| 3 | **Liste équipes + Membres** | fonctionnel | cohérence cartes & lignes |
| 4 | **Scrims / Stats / Calendrier** | brouillons | valider puis brancher (sortir de « Brouillon ») |
| 5 | **Accueil (hub) + Stats global** | placeholder | polish final |

## 4. Backlog hors-design (rappel)

- ⚠️ Vérif propriété de compte Riot (challenge icône) — avant tout usage public.
- Mise en ligne : HTTPS + domaine + durcissement + relecture qa-securite.
- Étendre le mode démo au **profil Solo** (preview offline complète).
