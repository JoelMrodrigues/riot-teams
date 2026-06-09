# DESIGN.md — Charte de marque void.pro

> **Charte OBLIGATOIRE** pour tout travail visuel (agents `designer` & `dev-frontend`).
> Source de vérité technique : `src/index.css` (variables CSS) + `tailwind.config.cjs`.
> **Ne jamais coder une couleur / police "en dur" hors de ces tokens.**

## L'essence de void.pro

Outil **pro** pour équipes esport. Identité : **sombre, minimaliste, futuriste, précis**.
Le « void » = espace profond, fond quasi-noir, sobriété. Le « pro » = sérieux, dense en
informations, sans fioritures. On vise l'esthétique d'un **cockpit / outil d'analyse**,
pas d'un site grand public coloré.

- **Adjectifs guides** : sombre · net · dense · feutré · violet électrique en accent.
- **À bannir (anti « style random A.I. »)** : dégradés arc-en-ciel, couleurs hors palette,
  gros coins arrondis « bulle », emojis décoratifs, ombres lourdes, glassmorphism partout,
  grands vides « marketing ».

## Couleurs (tokens — voir `src/index.css`)

- **Fonds** : `--bg-base` #080808 · `--bg-surface` #111 · `--bg-elevated` #1a1a1a · `--bg-modal` #141414
- **Bordures** : `--border-subtle` / `--border-default` / `--border-strong` (blanc à faible opacité)
- **Texte** : `--text-primary` (blanc) · `--text-secondary` (50%) · `--text-muted` (25%)
- **Marque** : `--brand` #7C3AED · `--brand-hover` #6D28D9 · `--brand-muted`
- **Accents par jeu** (réservés au contexte du jeu) : LoL or #C89B3C · Valorant rouge #FF4655 · TFT violet #9B72CF
- **Mode clair** géré via `:root[data-theme="light"]` → toujours passer par les variables,
  jamais une couleur fixe, sinon on casse la compatibilité clair/sombre.

## Typographie

- **Rajdhani** (700, UPPERCASE, letter-spacing ~0.1em) → titres, labels, boutons, chiffres/stats.
- **Inter** (300–600) → corps de texte, descriptions.
- Hiérarchie nette : peu de tailles différentes, on joue surtout sur la **graisse** et le contraste.

## Composants & règles

- **Boutons** : `.btn` + `.btn-solid` (violet) / `.btn-ghost` (bordure) / `.btn-text`, tailles `.btn-sm/md/lg`.
  Coins `rounded-sm`, `active:scale-95`.
- **Rayons** : petits (`rounded-sm` / `rounded-md`), jamais de gros arrondis.
- **Layout** : app-shell pleine hauteur (root `overflow:hidden`), en-têtes de **60px**, fonds sombres.
- **Scrollbar** fine (4px) déjà définie — ne pas la surcharger.
- **Animations** : `framer-motion`, **subtiles et fluides** (fade / slide courts), jamais clinquantes.
  ⚠️ Une **modale** doit utiliser `createPortal` vers `document.body` (sinon les `transform` de
  framer-motion cassent le `position: fixed`).
- **Densité** : information lisible et compacte (outil pro), pas de grands espaces vides.

## Règle d'or

**Cohérence > nouveauté.** Avant d'inventer un style, réutiliser un token / composant existant.
Si un besoin n'a pas de token, on l'ajoute **dans `src/index.css`** (un seul endroit) — jamais en dur dans la page.
