# Spec visuelle — Modal de création d'équipe LoL (`LolCreateTeamModal`)

> Document destiné à l'agent `dev-frontend`. Ne toucher à aucun fichier `src/` avant
> validation de cette spec. Source de vérité tokens : `src/index.css` + `src/constants/lolTheme.ts`.
>
> Le modal générique `CreateTeamModal.tsx` reste intact — il continue de servir pour Valorant et TFT.

---

## 1. Modèle de données — Extension du type `Team`

### Nouveaux types à ajouter dans `src/types/team.types.ts`

```typescript
// Type discriminé pour l'icône d'équipe — rétro-compatible (absent = pas d'icône)
export type LolTeamIcon =
  | { kind: 'champion'; value: string }   // clé du champion ex: 'Jinx', 'LeeSin'
  | { kind: 'emblem';   value: string };  // identifiant d'emblème ex: 'sword', 'shield'

// Régions Riot disponibles
export type LolRegion =
  | 'EUW' | 'EUNE' | 'NA' | 'KR' | 'BR'
  | 'LAN' | 'LAS' | 'OCE' | 'JP' | 'TR' | 'RU';

// Extension optionnelle du type Team — tous les champs sont optionnels,
// les équipes existantes (Valorant, TFT, LoL génériques) ne sont pas cassées
export interface LolTeamMeta {
  tag?:         string;        // Abréviation 2–4 caractères majuscules ex: "TSL"
  region?:      LolRegion;     // Serveur de jeu
  accentColor?: string;        // Clé de couleur ex: 'violet' | 'cyan' | 'gold' | ...
  description?: string;        // Description courte, max 200 caractères
  icon?:        LolTeamIcon;   // Icône discriminée ou absente
}
```

### Stratégie d'extension de `Team`

Le type `Team` existant ne doit PAS être modifié structurellement. On ajoute les champs via
intersection ou en les ajoutant directement comme optionnels :

```typescript
export interface Team {
  id:          string;
  name:        string;
  game:        GameType;
  members:     TeamMember[];
  createdAt:   string;
  updatedAt:   string;
  // Champs LoL optionnels — ignorés par les contextes Valorant/TFT
  tag?:         string;
  region?:      LolRegion;
  accentColor?: string;
  description?: string;
  icon?:        LolTeamIcon;
}
```

Tous les anciens `Team` sauvegardés en localStorage sans ces champs restent valides : TypeScript
les traite comme `undefined`, les composants d'affichage gèrent le cas absent avec une valeur
de repli.

### Palette d'accents disponibles pour `accentColor`

La valeur stockée est une **clé string**. La résolution vers la couleur hexadécimale se fait
dans un fichier de données dédié `lolTeamAccents.data.ts` (voir section 4). Cela permet de
changer les couleurs sans migrer le localStorage.

| Clé | Couleur hex | Usage |
|-----|-------------|-------|
| `'violet'`  | `#8B5CF6` | Défaut, cohérent avec `--lol-violet` |
| `'cyan'`    | `#22D3EE` | Accent Solo existant |
| `'pink'`    | `#F472B6` | Accent Team existant |
| `'gold'`    | `#C89B3C` | Or LoL (charte `DESIGN.md`) |
| `'amber'`   | `#FBBF24` | Accent Stats existant |
| `'emerald'` | `#34D399` | Vert forêt |
| `'rose'`    | `#FB7185` | Rouge sang/danger doux |
| `'sky'`     | `#38BDF8` | Bleu ciel |

---

## 2. Layout du modal

### Shell (réutilise `BaseModal`)

`BaseModal` gère déjà le portal, l'overlay flouté, l'animation spring, la fermeture Escape et
le clic overlay. `LolCreateTeamModal` est le `children` passé à `BaseModal` — aucune
duplication de cette logique.

La seule modification par rapport au `BaseModal` actuel : la largeur du conteneur interne passe
de `max-w-md` à `max-w-lg` (520 px) pour accueillir la grille de champions / emblèmes. Cette
surcharge est passée via une prop `size` à ajouter à `BaseModal`, ou bien le composant
`LolCreateTeamModal` enveloppe son propre conteneur en ignorant le div interne de `BaseModal`.

**Recommandation** : ajouter une prop `maxWidth?: string` à `BaseModal` avec valeur par défaut
`'max-w-md'`. Le `LolCreateTeamModal` passe `maxWidth="max-w-lg"`. Aucun autre changement de
`BaseModal`.

### Structure verticale du modal

```
┌──────────────────────────────────────────────────────────┐
│  [En-tête modal]  CRÉER UNE ÉQUIPE LoL          [✕]     │  ~56px
├──────────────────────────────────────────────────────────┤
│  [LolTeamPreview]  Aperçu en direct de l'équipe          │  ~72px
├──────────────────────────────────────────────────────────┤
│  ┌──── zone scrollable ─────────────────────────────┐   │
│  │  [Champ] Nom de l'équipe          (obligatoire)   │   │
│  │  [Champ] Tag / Abréviation        (obligatoire)   │   │
│  │  [Champ] Région / Serveur         (obligatoire)   │   │
│  │  [Champ] Couleur d'accent         (obligatoire)   │   │
│  │  [LolTeamIconPicker] Icône équipe (obligatoire)   │   │
│  │  [Champ] Description              (optionnel)     │   │
│  └──────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  [Bouton] Créer l'équipe                                  │  ~52px
└──────────────────────────────────────────────────────────┘
```

### Zones fixes vs scrollables

- **En-tête** (titre + bouton fermeture) : `position: sticky` en haut, fond `var(--bg-modal)`.
- **Aperçu `LolTeamPreview`** : sticky sous l'en-tête, fond `var(--bg-modal)`. Toujours visible
  pendant le scroll pour que l'utilisateur voit le résultat en temps réel.
- **Corps du formulaire** : scrollable (`overflow-y: auto`, scrollbar fine déjà définie dans
  l'app). `max-h` calculée pour que le modal ne dépasse pas `90vh` sur mobile.
- **Bouton de validation** : `position: sticky` en bas, fond `var(--bg-modal)`. Toujours
  accessible sans scroller jusqu'en bas.

### Tokens layout

```
fond modal :      var(--bg-modal)          (#141414)
bordure modal :   var(--border-default)
rayon modal :     rounded-sm  (cohérent avec BaseModal existant)
padding modal :   p-6 (réduit vs p-7 actuel pour compenser la largeur accrue)
gap sections :    gap-5
largeur :         max-w-lg (520px)
hauteur max :     max-h-[90vh]
```

---

## 3. Détail des champs du formulaire

### 3.1 Nom de l'équipe

| Attribut | Valeur |
|----------|--------|
| Type | `input[type="text"]` |
| Obligatoire | Oui |
| Validation | min 2 caractères, max 40 caractères |
| Placeholder | `ex : Neon Knights` |
| Comportement | Met à jour l'aperçu en temps réel |
| Erreur | Affichée sous le champ, `var(--danger)`, Inter xs |

### 3.2 Tag / Abréviation

| Attribut | Valeur |
|----------|--------|
| Type | `input[type="text"]` |
| Obligatoire | Oui (si vide : aucun tag affiché sur l'aperçu, mais requis à la soumission) |
| Validation | 2 à 4 caractères, `[A-Z0-9]` uniquement |
| Formatage automatique | `onChange` applique `.toUpperCase().replace(/[^A-Z0-9]/g, '')` |
| Placeholder | `ex : NK` |
| Disposition | Sur la même ligne que le Nom (grille 2 colonnes, `grid-cols-[1fr_auto]`, champ tag `w-24`) |

### 3.3 Région / Serveur

| Attribut | Valeur |
|----------|--------|
| Type | `select` natif ou segmented-control défilable |
| Obligatoire | Oui |
| Options | EUW, EUNE, NA, KR, BR, LAN, LAS, OCE, JP, TR, RU |
| Défaut | `'EUW'` (continent européen, cible principale) |
| Style | Identique aux inputs — `var(--bg-elevated)`, `var(--border-default)`, `rounded-sm` |

Préférer un `<select>` natif stylé plutôt qu'un composant custom : moins de code, accessible
nativement (keyboard navigation).

### 3.4 Couleur d'accent

| Attribut | Valeur |
|----------|--------|
| Type | Segmented control visuel — rangée de pastilles cliquables |
| Obligatoire | Oui (défaut : `'violet'`) |
| Comportement | Clic sur une pastille = sélection ; anneau de sélection visible |
| Rendu | 8 pastilles `h-7 w-7 rounded-full`, disposées en `flex flex-wrap gap-2` |

Chaque pastille :
- Fond = couleur hex de l'accent.
- État non sélectionné : `opacity-70`, pas d'anneau.
- État sélectionné : `opacity-100`, `ring-2 ring-offset-2` avec `ring-color = couleur` et
  `ring-offset-color = var(--bg-modal)`.
- Focus clavier : `outline: 2px solid var(--lol-violet)`, `outline-offset: 2px`.
- Attribut `aria-pressed` pour l'accessibilité.

### 3.5 Description (optionnel)

| Attribut | Valeur |
|----------|--------|
| Type | `textarea` |
| Obligatoire | Non |
| Limite | 200 caractères (compteur affiché : `ex : 42 / 200`) |
| Lignes | `rows="3"` |
| Placeholder | `ex : Roster semi-pro EUW, scrim du jeudi soir.` |
| Compteur | `text-xs`, aligné à droite, `var(--text-muted)`, Inter |
| Style resize | `resize-none` (cohérence visuelle) |

---

## 4. Sélecteur d'icône — `LolTeamIconPicker`

### Structure générale

```
┌─────────────────────────────────────────────────────┐
│  ICÔNE DE L'ÉQUIPE                    [label eyebrow]│
│  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │
│  │  Champion │  │  Emblème  │  │  Upload  🔒   │   │
│  └───────────┘  └───────────┘  └───────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │  [contenu de l'onglet actif]                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Segmented control (onglets)

Les 3 onglets sont un **segmented control** horizontal :
- Fond du contrôle : `var(--bg-elevated)`, `rounded-sm`, `p-0.5`.
- Onglet inactif : fond transparent, `color: var(--lol-text-muted)`.
- Onglet actif : fond `var(--lol-surface)`, `border: 1px solid var(--lol-border)`, `rounded-sm`,
  `color: var(--lol-text)`.
- Police : Rajdhani, `text-xs uppercase tracking-wider`.
- Transition : `transition-all duration-150`.
- Focus : `outline: 2px solid var(--lol-violet)`, `outline-offset: -2px`.
- Navigation clavier : touches fléchées gauche/droite changent d'onglet (`role="tablist"`,
  `role="tab"`, `aria-selected`).

### Onglet désactivé — Upload

- Texte : `Upload` suivi d'un badge `BIENTÔT` (`text-[10px] uppercase tracking-wider`,
  `background: var(--lol-surface)`, `color: var(--lol-text-muted)`, `rounded-sm px-1`).
- Onglet entier : `opacity-50 cursor-not-allowed pointer-events-none`.
- Attribut : `aria-disabled="true"`.
- Tooltip au survol (si hover détecté) : `« Disponible avec la base de données »`. Implémenté
  via `title` natif pour garder 0 dépendance supplémentaire.

---

### 4.1 Onglet Champion — `LolChampionPicker`

#### Dépendance de données — fichier à créer

Le sélecteur de champion a besoin d'une **liste statique de champions**. Elle doit être créée
dans `src/data/lolChampions.data.ts`.

Structure proposée :

```typescript
export interface LolChampionEntry {
  key:   string;   // Clé technique : 'Jinx', 'LeeSin', 'MissFortune'
  label: string;   // Nom affiché : 'Jinx', 'Lee Sin', 'Miss Fortune'
}

export const LOL_CHAMPIONS: LolChampionEntry[] = [
  { key: 'Aatrox',       label: 'Aatrox' },
  { key: 'Ahri',         label: 'Ahri' },
  { key: 'Akali',        label: 'Akali' },
  // ... liste complète ou sous-ensemble curé (voir note ci-dessous)
];
```

**Note sur la liste** : deux options au choix du dev-frontend.

1. **Liste complète** (~170 champions) : extraire depuis le fichier JSON `champion.json` de Data
   Dragon (disponible localement si déjà présent, sinon fetch unique au build).
2. **Sous-ensemble curé de ~60 champions populaires** : moins de charge initiale dans le modal,
   plus rapide à implémenter. Suffisant pour le lancement.

La clé `key` est la valeur stockée dans `icon.value`. Elle est passée à `championIcon(key)`
depuis `lolAssets.ts` pour construire l'URL d'image, et à `ChampionAvatar` via sa prop
`champKey`.

#### Layout de l'onglet

```
┌─────────────────────────────────────────────────┐
│  🔍 [input recherche]                            │  ~36px
│  ┌─────────────────────────────────────────┐    │
│  │  [avatar] [avatar] [avatar] [avatar]    │    │
│  │  [avatar] [avatar] [avatar] [avatar]    │  max-h-52
│  │  ...                                    │  overflow-y-auto
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

**Champ de recherche**

- Input `type="search"`, placeholder `Rechercher un champion…`.
- `autoFocus` quand l'onglet devient actif.
- Filtre en temps réel sur `label.toLowerCase().includes(query)`.
- Style identique aux autres inputs : `var(--bg-elevated)`, `var(--border-default)`, `rounded-sm`.
- Icône loupe SVG à gauche (`var(--lol-text-muted)`, `h-4 w-4`), padding-left ajusté.

**Grille de champions**

- `grid grid-cols-6 sm:grid-cols-8 gap-1.5` dans un conteneur `max-h-52 overflow-y-auto`.
- Chaque cellule : `rounded-sm`, `cursor-pointer`, `transition-all duration-150`.
- Réutilise `ChampionAvatar` avec `size={40}`.
- État non sélectionné : `opacity-70`, pas d'anneau.
- État sélectionné : `opacity-100`, `ring-2 ring-offset-1`,
  `ring-color: var(--accentColor)` (couleur d'accent choisie à l'étape 3.4),
  `ring-offset-color: var(--bg-modal)`.
- Hover : `opacity-100`, légère teinte `var(--lol-surface-hover)` sur la cellule.
- Focus clavier : navigation par touches fléchées dans la grille (`role="grid"`,
  `role="gridcell"`). `Tab` passe au champ suivant.
- Aucun texte de label sous l'avatar (la grille est dense — le nom est affiché dans l'aperçu).
- Si la recherche retourne 0 résultats :
  ```
  aucun champion trouvé   ← Inter xs var(--lol-text-muted), centré
  ```

---

### 4.2 Onglet Emblème — `LolEmblemPicker`

#### Données — `src/data/lolEmblems.data.ts`

```typescript
export interface LolEmblemEntry {
  id:   string;   // Identifiant stocké dans icon.value
  name: string;   // Nom accessible (aria-label)
  path: string;   // SVG path d (viewBox 24×24) ou SVG inline
}

export const LOL_EMBLEMS: LolEmblemEntry[] = [
  { id: 'sword',    name: 'Épée',          path: '...' },
  { id: 'shield',   name: 'Bouclier',      path: '...' },
  { id: 'crown',    name: 'Couronne',      path: '...' },
  { id: 'bolt',     name: 'Éclair',        path: '...' },
  { id: 'dragon',   name: 'Dragon',        path: '...' },
  { id: 'eye',      name: 'Œil',          path: '...' },
  { id: 'flame',    name: 'Flamme',        path: '...' },
  { id: 'star',     name: 'Étoile',        path: '...' },
  { id: 'diamond',  name: 'Diamant',       path: '...' },
  { id: 'target',   name: 'Cible',         path: '...' },
];
```

Les `path` sont des paths SVG simples, géométriques, mono-couleur — style « ligne » ou
« rempli plat ». Aucune dépendance à une lib d'icônes extérieure.

**Source recommandée** : Heroicons ou Lucide (MIT) — extraire uniquement les paths nécessaires
dans le fichier de données. Pas d'import de toute la librairie.

#### Layout de l'onglet

```
┌────────────────────────────────────────┐
│  [embl] [embl] [embl] [embl] [embl]   │
│  [embl] [embl] [embl] [embl] [embl]   │
└────────────────────────────────────────┘
```

- `grid grid-cols-5 gap-2`.
- Chaque cellule : carré `h-12 w-12`, `rounded-sm`, `flex items-center justify-center`.
- Fond cellule : `var(--lol-surface)`, `border: 1px solid var(--lol-border)`.
- Icône SVG inline : `h-6 w-6`, couleur = `accentColor` choisi (prop transmise depuis le
  formulaire parent). C'est ce qui crée l'effet « teinte par l'accent ».
- État non sélectionné : fond `var(--lol-surface)`, bordure `var(--lol-border)`.
- État sélectionné : fond `{accentColor}15`, bordure `{accentColor}`, icône `{accentColor}`
  (inchangé, déjà coloré).
- Hover : fond `{accentColor}0A`, bordure `{accentColor}55`. Transition `duration-150`.
- Focus clavier : `outline: 2px solid var(--lol-violet)`, navigation par flèches.
- `aria-label={emblem.name}` sur chaque cellule, `aria-pressed` pour l'état sélectionné.

---

### 4.3 Onglet Upload — désactivé

```
┌──────────────────────────────────────────────────────┐
│  [icône upload grisée]                                │
│  Bientôt disponible                   ← Rajdhani sm  │
│  Cette fonctionnalité sera disponible  ← Inter xs     │
│  une fois la base de données connectée.               │
└──────────────────────────────────────────────────────┘
```

- Fond : `var(--lol-surface)`, `border: 1px dashed var(--lol-border)`, `rounded-sm`.
- Padding : `py-8`, alignement centré.
- Couleurs : tout en `var(--lol-text-muted)` — pas de couleur vive.
- Pas de `<input type="file">` dans le DOM (évite les interactions accidentelles).
- Aucune logique d'upload côté JS — le composant est purement déclaratif.

---

## 5. Aperçu en direct — `LolTeamPreview`

L'aperçu est affiché **sticky** sous l'en-tête du modal, toujours visible pendant le scroll
du formulaire. Il se met à jour à chaque keystroke.

### Structure visuelle

```
┌─────────────────────────────────────────────────────┐
│  [icône 48×48]   NEON KNIGHTS             [NK]      │
│                  EUW · League of Legends             │
└─────────────────────────────────────────────────────┘
```

### Tokens

| Élément | Token / valeur |
|---------|----------------|
| Fond | `var(--lol-surface)`, `border: 1px solid var(--lol-border)`, `rounded-md` |
| Padding | `px-4 py-3` |
| Zone icône | `h-12 w-12`, `rounded-sm`, fond `{accentColor}18`, `border: 1px solid {accentColor}30` |
| Icône état vide | Initiale du nom, Rajdhani bold, `color: {accentColor}` |
| Nom | Rajdhani 700, `text-lg`, `color: var(--lol-text)` |
| Badge tag | Rajdhani 700 xs uppercase, `px-2 py-0.5`, `rounded-sm`, `border: 1px solid {accentColor}40`, `background: {accentColor}10`, `color: {accentColor}` |
| Sous-titre | Inter xs, `color: var(--lol-text-muted)` — `« {region} · League of Legends »` |
| Séparateur ligne | `border-b border-[var(--lol-border)]` entre preview et formulaire |

**Comportement de l'icône dans l'aperçu**

- Aucune icône sélectionnée → carré avec initiale du nom (ou `?` si nom vide).
- Champion sélectionné → `ChampionAvatar` avec `size={48}`, `ring={accentColor}`.
- Emblème sélectionné → SVG centré dans le carré coloré.

**État de repli (nom vide)**

- Affiche `NOM DE L'ÉQUIPE` en placeholder grisé : Rajdhani, `var(--lol-text-muted)`.
- L'aperçu est toujours rendu — pas de `null`. Cela rassure l'utilisateur sur la structure.

---

## 6. Découpage en composants

Tous les nouveaux composants sont sous `src/components/lol/teams/`.
Les fichiers de données sous `src/data/`.

### 6.1 Arborescence cible

```
src/
  components/
    lol/
      teams/
        LolCreateTeamModal.tsx      (conteneur principal, état global du formulaire)
        LolTeamPreview.tsx          (aperçu sticky de l'équipe)
        LolTeamIconPicker.tsx       (segmented control 3 onglets + dispatch vers pickers)
        LolChampionPicker.tsx       (onglet champion : recherche + grille)
        LolEmblemPicker.tsx         (onglet emblème : grille teintée)
        LolUploadPickerDisabled.tsx (onglet upload désactivé)
        LolTeamAccentPicker.tsx     (rangée de pastilles couleur)
        LolRegionSelect.tsx         (select natif stylé)
  data/
    lolChampions.data.ts            (liste statique des champions)
    lolEmblems.data.ts              (données des emblèmes SVG)
    lolTeamAccents.data.ts          (palette des 8 accents d'équipe)
```

### 6.2 Interfaces des composants

#### `LolCreateTeamModal`

```typescript
interface LolCreateTeamModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  onCreate:  (team: Omit<Team, 'id' | 'members' | 'createdAt' | 'updatedAt'>) => void;
}
```

Responsabilité : tenir l'état complet du formulaire, orchestrer les validations, appeler
`onCreate` à la soumission, puis `onClose`. Reset de l'état quand `isOpen` passe à `false`.

**Important** : `onCreate` reçoit les données brutes (sans `id`, `members`, dates). C'est
l'appelant (ex : `LolMyTeamsPreview`) qui les transmet à `useTeams().createTeam` après
enrichissement. Cela garde le modal indépendant du hook de persistance.

#### `LolTeamPreview`

```typescript
interface LolTeamPreviewProps {
  name:        string;
  tag:         string;
  region:      LolRegion | '';
  accentColor: string;         // clé ex: 'violet'
  icon:        LolTeamIcon | null;
}
```

Composant purement présentationnel — aucun état interne.

#### `LolTeamIconPicker`

```typescript
type IconTab = 'champion' | 'emblem' | 'upload';

interface LolTeamIconPickerProps {
  value:       LolTeamIcon | null;
  accentColor: string;              // pour teinter les emblèmes
  onChange:    (icon: LolTeamIcon | null) => void;
}
```

Responsabilité : gérer `activeTab`, transmettre `accentColor` aux pickers enfants, remonter
la valeur sélectionnée via `onChange`.

#### `LolChampionPicker`

```typescript
interface LolChampionPickerProps {
  selected:    string | null;       // champKey ou null
  accentColor: string;
  onChange:    (champKey: string) => void;
}
```

Responsabilité : état local de la query de recherche, filtrage de `LOL_CHAMPIONS`, rendu de
la grille.

#### `LolEmblemPicker`

```typescript
interface LolEmblemPickerProps {
  selected:    string | null;       // emblemId ou null
  accentColor: string;
  onChange:    (emblemId: string) => void;
}
```

Responsabilité : rendu de la grille de `LOL_EMBLEMS`, teinte dynamique via `accentColor`.

#### `LolUploadPickerDisabled`

Aucune prop. Composant statique.

#### `LolTeamAccentPicker`

```typescript
interface LolTeamAccentPickerProps {
  value:    string;                  // clé de couleur ex: 'violet'
  onChange: (key: string) => void;
}
```

Importe `LOL_TEAM_ACCENTS` depuis `lolTeamAccents.data.ts` pour construire les pastilles.

#### `LolRegionSelect`

```typescript
interface LolRegionSelectProps {
  value:    LolRegion | '';
  onChange: (region: LolRegion) => void;
}
```

Composant mince — encapsule un `<select>` natif avec les styles de la charte.

---

## 7. Affichage de la nouvelle donnée

### 7.1 `TeamCard` en contexte LoL

`TeamCard` est partagé entre LoL, Valorant et TFT — il ne doit pas être modifié pour
afficher les données LoL spécifiques.

**Stratégie** : créer un composant wrapper `LolTeamCard.tsx` dans
`src/components/lol/teams/` qui :
1. Affiche l'icône (champion ou emblème) à gauche au lieu du badge de jeu générique.
2. Affiche le `tag` entre crochets à côté du nom.
3. Utilise `accentColor` résolu depuis `lolTeamAccents.data.ts` pour la couleur d'accent (au
   lieu de `game.accentColor`).

`TeamCard` existant reste utilisé par les contextes Valorant et TFT sans modification.

#### Structure cible de `LolTeamCard`

```
┌─────────────────────────────────────────────────────┐
│  [icône 40×40]  NEON KNIGHTS  [NK]                  │
│                  EUW · Créée le 09 juin 2026         │
│  ─────────────────────────────────────────────────  │
│  ROSTER                              3 / 5           │
│  ████████░░ (barre de progression)                  │
└─────────────────────────────────────────────────────┘
```

La barre de progression utilise `accentColor` résolu (hex) au lieu de `game.accentColor`.
L'hover utilise `{resolvedAccent}50` pour la bordure et `{resolvedAccent}08` pour le fond.

**Props**

```typescript
interface LolTeamCardProps {
  team: Team;  // Team avec les champs optionnels LoL (tag?, accentColor?, icon?)
}
```

La résolution `accentColor (clé) → hex` se fait en interne via `lolTeamAccents.data.ts`.
Valeur de repli si `accentColor` absent : `LOL_ACCENTS.team.color` (#F472B6).

### 7.2 `LolTeamDetailHeader`

Enrichir `LolTeamDetailHeader` pour afficher :
- L'icône d'équipe (à gauche du nom, `h-14 w-14`, `rounded-sm`).
- Le tag entre crochets à droite du nom (`[NK]`), Rajdhani xs, couleur `accentColor`.
- La région sous le nom en eyebrow (`EUW · League of Legends · Équipe`).

**Nouvelle interface suggérée**

```typescript
interface LolTeamDetailHeaderProps {
  team:          Team;
  maxMembers:    number;
  confirmDelete: boolean;
  onDelete:      () => void;
  onDeleteLeave: () => void;
  // accentColor résolu depuis lolTeamAccents.data.ts — transmis par la page parente
  resolvedAccent: string;
}
```

La page parente (`LolTeamDetailPage` ou équivalent) importe `lolTeamAccents.data.ts` et
transmet la couleur hex résolue. Cela garde `LolTeamDetailHeader` présentationnel.

Aucune rupture des props existantes — `resolvedAccent` est ajouté. La valeur de repli
(si l'équipe n'a pas de `accentColor`) est gérée par la page parente.

---

## 8. Accessibilité

### Champs de formulaire

- Chaque `<input>`, `<select>`, `<textarea>` a un `<label>` avec `htmlFor` correspondant
  à l'`id` du champ. Pas de `placeholder` utilisé comme seul label.
- Messages d'erreur liés par `aria-describedby` (l'`id` du `<p>` d'erreur est passé à
  `aria-describedby` de l'input concerné).
- `aria-invalid="true"` sur les inputs en erreur.
- `aria-required="true"` sur les champs obligatoires.

### Segmented control (onglets icône)

- `role="tablist"` sur le conteneur.
- `role="tab"` sur chaque onglet, `aria-selected`, `aria-controls={panelId}`.
- Panneau actif : `role="tabpanel"`, `id` correspondant, `tabIndex={0}`.
- Onglet Upload : `aria-disabled="true"`, `tabIndex={-1}`.
- Navigation : flèches gauche/droite entre les onglets actifs (Upload ignoré).

### Grille de champions

- `role="grid"` sur le conteneur.
- `role="gridcell"` sur chaque cellule.
- `aria-label={champion.label}` sur chaque cellule.
- `aria-pressed="true"` sur la cellule sélectionnée.
- Navigation clavier : flèches directionnelles. `Tab` sort de la grille.

### Grille d'emblèmes

- `role="group"` avec `aria-label="Choisir un emblème"`.
- `aria-label={emblem.name}` + `aria-pressed` sur chaque cellule.
- Focus ring : `outline: 2px solid var(--lol-violet)`, `outline-offset: 2px`.

### Pastilles de couleur (accent picker)

- `role="radiogroup"` avec `aria-label="Couleur d'accent"`.
- `role="radio"` + `aria-checked` + `aria-label={colorName}` sur chaque pastille.
- Navigation : flèches gauche/droite dans le groupe.

### Modal générale

- `BaseModal` gère déjà Escape et le focus trap n'est pas implémenté — à noter pour le dev :
  ajouter un focus trap (piéger le focus à l'intérieur du modal pendant qu'il est ouvert).
  Librairie suggérée : `focus-trap-react` (légère, déjà compatible avec le portal).
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointant vers le `id` du `<h2>`
  du modal.
- À l'ouverture : `autoFocus` sur le premier champ (`input` Nom d'équipe).
- À la fermeture : restituer le focus sur l'élément qui a déclenché l'ouverture.

---

## 9. Tokens — récapitulatif et nouveaux besoins

Tous les tokens utilisés sont existants dans `src/index.css` ou `src/constants/lolTheme.ts`.
Aucune couleur n'est codée en dur dans les composants — uniquement via les clés de
`lolTeamAccents.data.ts`.

### Tokens existants réutilisés

| Token | Source | Usage dans ce modal |
|-------|--------|---------------------|
| `var(--bg-modal)` | `src/index.css` | Fond modal + zones sticky |
| `var(--bg-elevated)` | `src/index.css` | Fond des inputs |
| `var(--border-default)` | `src/index.css` | Bordures inputs |
| `var(--border-subtle)` | `src/index.css` | Séparateurs légers |
| `var(--text-primary)` | `src/index.css` | Texte principal |
| `var(--text-muted)` | `src/index.css` | Texte secondaire / placeholders |
| `var(--danger)` | `src/index.css` | Messages d'erreur |
| `var(--lol-surface)` | `lolTheme.ts` | Fond aperçu, cellules emblèmes |
| `var(--lol-surface-hover)` | `lolTheme.ts` | Hover items grille |
| `var(--lol-border)` | `lolTheme.ts` | Bordures dans le contexte LoL |
| `var(--lol-text)` | `lolTheme.ts` | Texte dans le contexte LoL |
| `var(--lol-text-muted)` | `lolTheme.ts` | Labels, placeholders LoL |
| `var(--lol-violet)` | `lolTheme.ts` | Focus ring, onglet actif |
| `var(--lol-violet-soft)` | `lolTheme.ts` | Eyebrow label, éléments secondaires |
| `var(--brand)` | `src/index.css` | Bouton de validation |

### Nouveau token à ajouter (si absent)

| Nom | Valeur dark | Valeur light | Usage |
|-----|-------------|--------------|-------|
| `--lol-bg-elevated` | `#0E0714` | `#FFFFFF` | Fond interne des avatars ChampionAvatar (déjà utilisé dans ce composant via style inline — à formaliser en variable CSS dans `src/index.css`) |

Vérifier d'abord si `--lol-bg-elevated` existe déjà dans `src/index.css`. Si oui, l'utiliser
directement. Si non, l'ajouter.

### Rayons

- Inputs, select, textarea : `rounded-sm` (cohérent avec `CreateTeamModal`).
- Aperçu preview : `rounded-md` (légèrement plus doux — composant carte, pas un input).
- Cellules grille champions/emblèmes : `rounded-sm`.
- Pastilles accent : `rounded-full` (cercles).
- Segmented control conteneur : `rounded-sm`.

---

## 10. Animations

Cohérent avec `lol-accueil-spec.md` — sobres, fonctionnelles.

| Élément | Animation | Paramètres |
|---------|-----------|------------|
| Ouverture modal | Géré par `BaseModal` (spring scale + fade) | Existant |
| Changement d'onglet | Fade du panneau entrant | `opacity: 0→1`, `duration: 0.15`, CSS `transition` |
| Hover pastille accent | `opacity`, `ring` | `transition duration-150` CSS |
| Hover cellule champion/emblème | `opacity`, `background` | `transition duration-150` CSS |
| Sélection pastille/cellule | Aucune animation — changement d'état immédiat | — |
| Aperçu live | Aucune animation — mise à jour synchrone | — |

Pas d'animation `scale`, `rotate`, ni `spring` sur les éléments du formulaire — le contexte
est un outil pro, pas une interface ludique.

---

## 11. Synthèse

### Fichiers à créer

| Fichier | Taille estimée | Rôle |
|---------|----------------|------|
| `src/components/lol/teams/LolCreateTeamModal.tsx` | ~130 lignes | Conteneur modal + état formulaire |
| `src/components/lol/teams/LolTeamPreview.tsx` | ~60 lignes | Aperçu live sticky |
| `src/components/lol/teams/LolTeamIconPicker.tsx` | ~80 lignes | Segmented control 3 onglets |
| `src/components/lol/teams/LolChampionPicker.tsx` | ~90 lignes | Onglet champion (recherche + grille) |
| `src/components/lol/teams/LolEmblemPicker.tsx` | ~70 lignes | Onglet emblème (grille teintée) |
| `src/components/lol/teams/LolUploadPickerDisabled.tsx` | ~25 lignes | Onglet upload désactivé |
| `src/components/lol/teams/LolTeamAccentPicker.tsx` | ~50 lignes | Pastilles couleur d'accent |
| `src/components/lol/teams/LolRegionSelect.tsx` | ~40 lignes | Select natif stylé |
| `src/components/lol/teams/LolTeamCard.tsx` | ~100 lignes | Carte équipe LoL enrichie |
| `src/data/lolChampions.data.ts` | ~200 lignes | Liste statique champions |
| `src/data/lolEmblems.data.ts` | ~60 lignes | Données emblèmes SVG |
| `src/data/lolTeamAccents.data.ts` | ~40 lignes | Palette 8 accents + résolution clé→hex |

### Fichiers à modifier (scope limité)

| Fichier | Modification |
|---------|-------------|
| `src/types/team.types.ts` | Ajouter `LolTeamIcon`, `LolRegion`, champs optionnels sur `Team` |
| `src/components/lol/teams/LolTeamDetailHeader.tsx` | Ajouter prop `resolvedAccent`, afficher icône + tag + région |
| `src/components/ui/BaseModal.tsx` | Ajouter prop optionnelle `maxWidth?: string` (défaut `'max-w-md'`) |
| `src/index.css` | Vérifier/ajouter `--lol-bg-elevated` si absent |

### Fichiers non touchés

- `src/components/teams/CreateTeamModal.tsx` — reste intact pour Valorant/TFT.
- `src/components/teams/TeamCard.tsx` — inchangé, contextes non-LoL préservés.
- `src/hooks/useTeams.ts` — `createTeam` sera appelé par le composant parent du modal avec
  les nouvelles données ; la signature `(name, game)` est insuffisante et devra être étendue
  dans un second temps, mais ce n'est pas dans le scope de ce modal seul.

### Champs ajoutés à `Team`

| Champ | Type | Obligatoire | Par défaut |
|-------|------|-------------|------------|
| `tag` | `string` (2–4 chars) | Non | `undefined` |
| `region` | `LolRegion` | Non | `undefined` |
| `accentColor` | `string` (clé) | Non | `undefined` (repli : `LOL_ACCENTS.team.color`) |
| `description` | `string` (max 200) | Non | `undefined` |
| `icon` | `LolTeamIcon` | Non | `undefined` |

---

*Spec rédigée le 2026-06-09 par l'agent designer. Prochaine étape : implémentation par
`dev-frontend`. Valider cette spec avant tout code.*
