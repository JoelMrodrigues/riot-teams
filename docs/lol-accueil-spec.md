# Spec visuelle — Accueil LoL Hub (`/lol`)

> Document destiné à l'agent `dev-frontend`. Ne pas modifier les fichiers `src/` avant
> validation de cette spec. Source de vérité tokens : `src/index.css` + `src/constants/lolTheme.ts`.

---

## 1. Structure de page (de haut en bas)

La page est rendue dans `LolLayout` (header 60 px fixe + `<main>` scrollable). Elle remplace
intégralement `LolHomePage.tsx` dans son contenu, sans toucher au shell.

```
┌─────────────────────────────────────────────────────────┐
│  LolHeader (60 px, existant — ne pas toucher)            │
├─────────────────────────────────────────────────────────┤
│  [A] LolSearchHero          — zone de recherche centrale │
│      ± 120 px (compact, pas de grande section hero)      │
├─────────────────────────────────────────────────────────┤
│  [B] LolQuickAccess         — 3 cartes Solo/Équipes/Stats│
│      ~96 px par carte, grille 3 colonnes desktop         │
├─────────────────────────────────────────────────────────┤
│  [C] LolMyTeamsPreview      — mes équipes LoL locales    │
│      grille 2–3 colonnes, hauteur variable                │
├─────────────────────────────────────────────────────────┤
│  [D] LolRecentSearches      — dernières recherches       │
│      1 ligne horizontale de chips défilables             │
├─────────────────────────────────────────────────────────┤
│  [E] LolUpcomingBanner      — bloc discret "à venir"     │
│      1 ligne, hauteur ~48 px                             │
└─────────────────────────────────────────────────────────┘
```

### Espacement global

- Conteneur `max-w-5xl mx-auto px-4 md:px-6 lg:px-8` (pas de `max-w-6xl` — le hub est dense).
- `pb-8` en bas de page (pas de `pb-20`).
- Entre chaque zone : `gap-6` (pas de `py-24`, pas de `mt-12`).
- Pas de fond décoratif (`LolAuroraBackground` archivé) : le fond ambiant de `LolLayout` suffit.

### Responsive (mobile-first)

| Zone | Mobile (< md) | Tablette (md) | Desktop (lg+) |
|------|---------------|---------------|---------------|
| A — SearchHero | colonne unique, barre plein largeur | idem | idem |
| B — QuickAccess | 1 colonne (cartes empilées) | 3 colonnes | 3 colonnes |
| C — MyTeamsPreview | 1 colonne | 2 colonnes | 3 colonnes |
| D — RecentSearches | défilement horizontal (overflow-x) | idem | idem |
| E — UpcomingBanner | masqué sur mobile xs, visible sm+ | visible | visible |

---

## 2. Découpage en composants

### 2.1 Nouveaux composants à créer

Tous sous `src/components/lol/home/`.

| Fichier | Rôle unique | Props clés |
|---------|-------------|------------|
| `LolSearchHero.tsx` | Bloc de recherche Riot ID : titre court + `RiotIdSearch` | — |
| `LolQuickAccess.tsx` | Conteneur des 3 cartes accès rapides | — |
| `LolQuickAccessCard.tsx` | Une carte (Solo / Équipes / Stats) | `label`, `description`, `to`, `accent: LolAccent`, `icon: IconKey` |
| `LolMyTeamsPreview.tsx` | Aperçu des équipes LoL locales + bouton création | `teams: Team[]`, `onCreate: () => void` |
| `LolMyTeamsEmptyState.tsx` | État vide "Aucune équipe" | — |
| `LolRecentSearches.tsx` | Barre de recherches récentes | `searches: RecentSearch[]`, `onSelect: (s: RecentSearch) => void`, `onClear: () => void` |
| `LolUpcomingBanner.tsx` | Bandeau discret "fonctionnalités à venir" | — |

Hook à créer sous `src/hooks/` :

| Fichier | Rôle |
|---------|------|
| `useRecentSearches.ts` | Lecture/écriture localStorage des 5 derniers Riot ID recherchés |

### 2.2 Composants existants recyclés

| Composant | Localisation actuelle | Usage dans le hub |
|-----------|-----------------------|-------------------|
| `RiotIdSearch` | `src/components/lol/search/RiotIdSearch.tsx` | Intégré dans `LolSearchHero` |
| `LolSectionHeading` | `src/components/lol/home/LolSectionHeading.tsx` | Labels de sections B, C, D — **avec des valeurs compactes** (titres courts, pas de subtitle long) |
| `TeamCard` | `src/components/teams/TeamCard.tsx` | Cartes dans `LolMyTeamsPreview` |
| `LolFeatureIcon` | `src/components/lol/home/LolFeatureIcon.tsx` | Icônes dans `LolQuickAccessCard` |

### 2.3 Composants à archiver (ne plus importer dans `LolHomePage`)

Ces composants ne sont **pas supprimés** (ils peuvent servir ailleurs ou comme référence),
mais ils ne doivent plus être importés par la nouvelle `LolHomePage`.

| Composant | Raison |
|-----------|--------|
| `LolAuroraBackground` | Fond marketing trop lourd ; le `LolLayout` a déjà un fond ambiant |
| `LolHero` | Grand hero marketing — incompatible cockpit |
| `LolHeroPreview` | Cartes flottantes animées liées au hero |
| `LolSoloShowcase` | Section vitrine verticale, style landing |
| `LolTeamShowcase` | Idem |
| `LolFeatureGrid` | Bento grid décoratif — remplacé par `LolQuickAccess` |
| `LolFeatureCard` | Dépend de `LolFeatureGrid` |
| `LolCtaBanner` | Bandeau arc-en-ciel, style marketing |

`LolSoloProfileCard` et `LolScrimBoard` : conservés pour une éventuelle utilisation comme
démos dans la page Solo ou la page Équipes. Non utilisés dans le hub.

---

## 3. Spec visuelle par composant

### [A] `LolSearchHero`

**Rôle** : point d'entrée n°1 de la page. Dense, pas de hero pleine hauteur.

**Structure**
```
┌────────────────────────────────────────────────┐
│  LEAGUE OF LEGENDS · HUB           [eyebrow]   │
│  Recherche un joueur                [h1 court]  │
│  ┌─────────────────────────────┐ [Rechercher]  │
│  │  Pseudo#TAG                 │               │
│  └─────────────────────────────┘               │
└────────────────────────────────────────────────┘
```

**Tokens**
- Fond : aucun fond de section (transparent, hérite `--lol-bg`).
- Eyebrow : `font-family: Rajdhani`, `text-xs uppercase tracking-[0.15em]`, `color: var(--lol-violet-soft)`.
- `h1` : `font-family: Rajdhani`, `font-weight: 700`, `text-2xl md:text-3xl`, `color: var(--lol-text)`. Pas de dégradé de couleur sur le titre — ici le titre est neutre, la recherche est l'action.
- Input `RiotIdSearch` : réutilisé tel quel (déjà conforme : `var(--lol-surface)`, `var(--lol-border)`, `rounded-md`).
- Bouton Rechercher : `btn btn-solid btn-md` (violet `var(--brand)` / `var(--lol-violet-strong)`).
- Padding de section : `pt-8 pb-4` (compact).
- Aucune animation de type `rotateY` ni `scale`. Juste un `fade` court à l'entrée via framer-motion (`opacity: 0 → 1`, `y: 12 → 0`, `duration: 0.35`).

**Comportement**
- `onSearch` redirige vers `/lol/search?q=PseudoTAG` ou `/lol/player/:gameName/:tagLine`.
- En attendant le câblage : appel de `useNavigate` vers `/lol/search`.

---

### [B] `LolQuickAccess` + `LolQuickAccessCard`

**Rôle** : 3 raccourcis vers les sous-sections principales. Cartes denses, pas de texte marketing long.

**Structure `LolQuickAccess`**
```
Accès rapides                        [label Rajdhani xs muted]
┌───────────┐  ┌───────────┐  ┌───────────┐
│  [icône]  │  │  [icône]  │  │  [icône]  │
│  Solo     │  │  Équipes  │  │  Stats    │
│  Desc.    │  │  Desc.    │  │  Desc.    │
│  → Accéder│  │  → Accéder│  │  Bientôt →│
└───────────┘  └───────────┘  └───────────┘
```

**Contenu des 3 cartes**

| label | description | to | accent | icon |
|-------|-------------|-----|--------|------|
| `SOLO` | « Rechercher un joueur, voir rang & historique » | `/lol/search` | `LOL_ACCENTS.solo` | `search` |
| `ÉQUIPES` | « Créer et gérer ton roster de scrim » | `/lol/teams` | `LOL_ACCENTS.team` | `team` |
| `STATS` | « Analyses approfondies — bientôt disponible » | `/lol/stats` | `LOL_ACCENTS.stats` | `stats` |

**Tokens `LolQuickAccessCard`**
- Fond : `background: var(--lol-surface)`.
- Bordure : `border: 1px solid {accent.color}28` au repos.
- Rayon : `rounded-md`.
- Padding : `p-4` (compact).
- Icône : carré `h-9 w-9`, `rounded-sm`, `background: {accent.color}18`, icône SVG `color: {accent.color}`.
- Label : `font-family: Rajdhani`, `font-weight: 700`, `text-sm uppercase tracking-[0.1em]`, `color: var(--lol-text)`.
- Description : `text-xs`, `color: var(--lol-text-muted)`, `font-family: Inter`, `leading-snug`.
- Lien « Accéder » : `text-xs font-bold uppercase tracking-wider`, `color: {accent.color}`, `font-family: Rajdhani`.
- Flèche `→` : transition `translate-x-0 → translate-x-1` au hover de la carte.

**Hover de la carte**
- `border-color: {accent.color}55` (bordure légèrement plus visible).
- `background: {accent.color}0A` (teinte légère sur le fond).
- Transition `duration-150`.
- Pas de `whileHover: { y: -6 }` (réservé aux cartes bento marketing archivées).

**Stats (carte désactivée)** : même apparence mais `opacity-60`, le texte « Accéder » devient « Bientôt » sans lien actif (`<span>` non cliquable). Curseur `default`.

---

### [C] `LolMyTeamsPreview` + `LolMyTeamsEmptyState`

**Rôle** : voir ses équipes LoL locales d'un coup d'œil, accéder à la création.

**Structure**
```
Mes équipes LoL                    [label + bouton "Nouvelle équipe"]
┌──────────┐  ┌──────────┐  ┌──────────┐
│ TeamCard │  │ TeamCard │  │ TeamCard │
└──────────┘  └──────────┘  └──────────┘
```

**Filtrage** : `useTeams()` → `teams.filter(t => t.game === 'lol')`. Limité aux **3 premières équipes** dans l'aperçu hub (pas une liste paginée). Si > 3, afficher un lien « Voir toutes les équipes (N) » en bas à droite, pointant vers `/lol/teams`.

**Tokens `LolMyTeamsPreview`**
- En-tête : `flex items-center justify-between mb-3`.
- Label section : `font-family: Rajdhani`, `text-xs font-bold uppercase tracking-[0.12em]`, `color: var(--lol-text-muted)`.
- Bouton « Nouvelle équipe » : `btn btn-ghost btn-sm` (bordure subtile, style global). Pas de violet plein — action secondaire.
- Grille : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3`.
- `TeamCard` est réutilisé **sans modification** (il est déjà conforme — `var(--bg-surface)`, `rounded-sm`, accent par jeu).

**État vide `LolMyTeamsEmptyState`**
```
┌──────────────────────────────────────────────────────┐
│  [icône team SVG, 24px, var(--lol-text-muted)]       │
│  Aucune équipe LoL                                    │  ← Rajdhani sm, lol-text
│  Crée ton premier roster pour commencer.             │  ← Inter xs, lol-text-muted
│  [Créer une équipe →]                                │  ← btn ghost sm
└──────────────────────────────────────────────────────┘
```
- Fond : `var(--lol-surface)`, `border: 1px solid var(--lol-border)`, `rounded-md`.
- Padding : `p-8`, alignement centré `text-center`.
- Pas de grand espace vide : hauteur max `~120px`.
- L'icône est le SVG `team` de `LolFeatureIcon` (réutilisé), `color: var(--lol-text-muted)`.

---

### [D] `LolRecentSearches`

**Rôle** : rerouler vers un profil récemment consulté, en 1 clic.

**Structure**
```
Recherches récentes                           [Effacer]
 ┌────────────┐  ┌────────────┐  ┌────────────┐
 │ Pseudo#TAG │  │ Pseudo#TAG │  │ Pseudo#TAG │  …
 └────────────┘  └────────────┘  └────────────┘
      chip                chip              chip
```

**Tokens**
- Label : identique aux autres sections (Rajdhani xs muted).
- « Effacer » : `btn btn-text btn-sm` (discret, `color: var(--lol-text-muted)`).
- Conteneur chips : `flex gap-2 overflow-x-auto` (défilement horizontal sur mobile, pas de wrapping).
- Chip : `px-3 py-1.5`, `rounded-sm`, `text-xs font-semibold`, `font-family: Rajdhani`, `color: var(--lol-text)`, `background: var(--lol-surface)`, `border: 1px solid var(--lol-border)`.
- Hover chip : `border-color: var(--lol-violet)`, `color: var(--lol-violet-soft)`, `transition-colors duration-150`.
- Focus chip (accessibilité) : `outline: 2px solid var(--lol-violet)`, `outline-offset: 2px`.

**État vide**
- Ne pas afficher le bloc du tout si `searches.length === 0` (pas de zone vide visible).
- Le composant retourne `null` dans ce cas.

**Hook `useRecentSearches`**
- Lit/écrit dans `localStorage` sous la clé `'lol:recent-searches'`.
- Stocke au maximum 5 entrées (LIFO : la plus récente en premier).
- Type : `RecentSearch = { riotId: string; tagLine: string; addedAt: string }`.
- Méthodes : `searches`, `addSearch(riotId, tagLine)`, `clearAll()`.

---

### [E] `LolUpcomingBanner`

**Rôle** : signaler les fonctionnalités à venir sans créer un grand vide marketing.

**Structure**
```
┌─────────────────────────────────────────────────────┐
│  ● Bientôt : Tier list LoL · Meta hebdomadaire      │
└─────────────────────────────────────────────────────┘
```

**Tokens**
- Fond : `var(--lol-surface)`, `border: 1px solid var(--lol-border)`, `rounded-sm`.
- Padding : `px-4 py-2.5` (très compact).
- Point indicateur : `h-1.5 w-1.5 rounded-full`, `background: var(--lol-violet)`, animé en `pulse` (Tailwind `animate-pulse`).
- Texte : `text-xs`, `color: var(--lol-text-muted)`, `font-family: Inter`.
- Label « Bientôt » : `font-family: Rajdhani`, `font-weight: 700`, `text-xs uppercase tracking-wider`, `color: var(--lol-violet-soft)`.
- Pas de CTA, pas de bouton. Informatif uniquement.
- Composant statique, pas de props (les contenus à venir sont codés en dur dans le fichier).
- Masqué sur mobile `xs` (en dessous de `sm:`) via `hidden sm:flex`.

---

## 4. États vides (récapitulatif)

| Zone | Condition | Rendu |
|------|-----------|-------|
| Recherche | — | Pas d'état vide (la barre est toujours là) |
| Quick Access | — | Toujours affiché (données statiques) |
| Mes équipes | `lolTeams.length === 0` | `LolMyTeamsEmptyState` (compact, centré, bouton création) |
| Mes équipes | `lolTeams.length > 3` | Grille des 3 premières + lien "Voir toutes" |
| Recherches récentes | `searches.length === 0` | Composant `null` (invisible, pas de zone réservée) |
| Recherches récentes | `searches.length > 0` | Chips horizontales |

### Principes pour les états vides
- Jamais de grand espace vide : une zone vide = fond de carte avec message compact.
- L'icône de l'état vide est monochrome (`var(--lol-text-muted)`), pas colorée.
- Le texte principal est Rajdhani (label court), le sous-texte est Inter xs muted.
- L'action proposée (si présente) est un `btn-ghost btn-sm` uniquement.

---

## 5. Tokens manquants / à proposer

Aucun token vraiment manquant — les `var(--lol-*)` couvrent le besoin. Cependant, un token
supplémentaire serait utile pour la densité :

| Nom proposé | Valeur dark | Valeur light | Usage |
|-------------|-------------|--------------|-------|
| `--lol-surface-hover` | `rgba(139, 92, 246, 0.10)` | `rgba(124, 58, 237, 0.08)` | Fond hover des cartes Quick Access et chips (évite de coder la valeur en dur avec `{accent}0A`) |

A ajouter dans `src/index.css` dans le scope du thème LoL (là où les autres `--lol-*` sont
injectés par `useLolTheme`). Ne pas modifier le code maintenant — le dev devra l'ajouter.

---

## 6. Règles typographiques appliquées

| Élément | Police | Poids | Taille | Casse | Tracking |
|---------|--------|-------|--------|-------|----------|
| Titre section (`h1` SearchHero) | Rajdhani | 700 | `text-2xl md:text-3xl` | Title case | normal |
| Labels de zones (eyebrow) | Rajdhani | 700 | `text-xs` | UPPERCASE | `0.12em` |
| Label carte QuickAccess | Rajdhani | 700 | `text-sm` | UPPERCASE | `0.10em` |
| Description carte | Inter | 400 | `text-xs` | normale | — |
| Lien "Accéder" | Rajdhani | 700 | `text-xs` | UPPERCASE | `0.10em` |
| Chips recherches récentes | Rajdhani | 600 | `text-xs` | conservée | — |
| Texte état vide principal | Rajdhani | 700 | `text-sm` | Title case | — |
| Texte état vide secondaire | Inter | 400 | `text-xs` | normale | — |

---

## 7. Animations autorisées

| Élément | Animation | Paramètres |
|---------|-----------|------------|
| Entrée page (zones A, B, C) | `opacity: 0→1`, `y: 12→0` | `duration: 0.3–0.4`, `ease: easeOut`, stagger 0.08 entre les zones |
| Hover carte Quick Access | `border-color`, `background` | `transition duration-150` (CSS uniquement, pas framer) |
| Hover chip recent search | `border-color`, `color` | `transition-colors duration-150` |
| Dot UpcomingBanner | `animate-pulse` | Tailwind natif |

Pas d'animation `rotateY`, `scale` au hover, ni de lévitation (`y: [0, -14, 0]`). Ces effets
sont réservés aux composants archivés (style marketing).

---

## 8. Synthèse — liste finale des composants

### A créer (nouveaux)

| Fichier | Taille estimée |
|---------|----------------|
| `src/components/lol/home/LolSearchHero.tsx` | ~50 lignes |
| `src/components/lol/home/LolQuickAccess.tsx` | ~30 lignes |
| `src/components/lol/home/LolQuickAccessCard.tsx` | ~70 lignes |
| `src/components/lol/home/LolMyTeamsPreview.tsx` | ~70 lignes |
| `src/components/lol/home/LolMyTeamsEmptyState.tsx` | ~40 lignes |
| `src/components/lol/home/LolRecentSearches.tsx` | ~60 lignes |
| `src/components/lol/home/LolUpcomingBanner.tsx` | ~30 lignes |
| `src/hooks/useRecentSearches.ts` | ~50 lignes |
| `src/pages/lol/LolHomePage.tsx` (réécriture) | ~60 lignes |

### A recycler (existants, non modifiés)

| Composant | Importé par |
|-----------|------------|
| `RiotIdSearch` | `LolSearchHero` |
| `LolSectionHeading` | `LolMyTeamsPreview`, `LolRecentSearches` (labels courts) |
| `TeamCard` | `LolMyTeamsPreview` |
| `LolFeatureIcon` | `LolQuickAccessCard`, `LolMyTeamsEmptyState` |

### A archiver (ne plus importer dans LolHomePage)

| Composant | Statut fichier |
|-----------|---------------|
| `LolAuroraBackground` | Conserver le fichier (peut servir ailleurs), juste ne plus l'importer |
| `LolHero` | Idem |
| `LolHeroPreview` | Idem |
| `LolSoloShowcase` | Idem |
| `LolTeamShowcase` | Idem |
| `LolFeatureGrid` | Idem |
| `LolFeatureCard` | Idem |
| `LolCtaBanner` | Idem |

`LolSoloProfileCard`, `LolScrimBoard`, `LolComingSoon` : non utilisés dans le hub, mais à
**conserver** — utiles pour la page Solo (démo) et les pages Équipes.

---

*Spec rédigée le 2026-06-09 par l'agent designer. Prochaine étape : implémentation par `dev-frontend` (Lot 1 du backlog `lol-cadrage.md`).*
