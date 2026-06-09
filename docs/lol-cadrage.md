# Cadrage — Écosystème League of Legends (void.pro)

> Document de **planification** (pas de code applicatif). Périmètre : **front uniquement**,
> données de démonstration. Les API Riot viendront plus tard → on prévoit seulement les
> **emplacements / placeholders**.
> Contraintes : `CLAUDE.md` (1 fichier = 1 responsabilité, ≤ 150 lignes, TS strict, pas de `any`)
> + `docs/DESIGN.md` (sombre / minimaliste / futuriste / dense, tokens uniquement).
> Inspiration assumée : DPM.lol / op.gg pour **l'organisation** (barre de recherche centrale,
> carte de profil, historique dense) — **transposée à notre charte**, jamais copiée.

---

## 1. Inventaire de l'existant (factuel)

### 1.1 Routage & coquille
- **`src/router/AppRouter.tsx`** — l'écosystème LoL vit sous `/lol` via `LolLayout` (Outlet) :
  - `index` → `LolHomePage`
  - `search` → `LolSearchPage`
  - `teams` → `LolTeamsHomePage`
  - **Hors layout** (pas d'Outlet, pas de header LoL) : `/lol/player/:gameName/:tagLine` → `LolPlayerPage`,
    `/lol/team/:teamId` → `LolTeamPage`. → **incohérence** (voir §2).
- **`src/components/lol/layout/LolLayout.tsx`** — shell propre : palette violette scopée (`useLolTheme`),
  fond ambiant, header + `main` scrollable. **État : OK.**
- **`src/components/lol/header/LolHeader.tsx`** + **`LolNavLinks.tsx`** + **`src/config/lolNav.ts`** —
  header dédié 60px, nav par **liens de route** (`Accueil LoL` / `Recherche Solo` / `Gestion Équipe`).
  **État : OK structurellement**, mais logo « RT » / libellé « League » à revoir (branding void.pro).

### 1.2 Accueil LoL — `src/pages/lol/LolHomePage.tsx`
Page vitrine « marketing » assemblant : `LolAuroraBackground`, `LolHero` (+ `LolHeroPreview`),
`LolSoloShowcase` (+ `LolSoloProfileCard`), `LolTeamShowcase` (+ `LolScrimBoard`),
`LolSectionHeading`, `LolFeatureGrid` (+ `LolFeatureCard`, `LolFeatureIcon`, `data/lolFeatures.data`),
`LolCtaBanner`. Plus `LolComingSoon` (réutilisé par la page Équipes).
**État : à refaire entièrement** (demande explicite). Le code est propre et modulaire, mais c'est une
**landing promotionnelle** (grands titres dégradés, sections « showcase » verticales) — éloignée de
l'esprit **cockpit / outil dense** voulu, et redondante avec la home multi-jeux. Les composants
réutilisables (`LolSectionHeading`, `ChampionAvatar`, tokens d'accent) sont à conserver.

### 1.3 Solo / Recherche + Profil — `src/pages/lol/LolSearchPage.tsx`
Page recherche déjà avancée : `RiotIdSearch` → hook `useLolProfile` → `ProfileView` qui compose
`ProfileHeader` (bannière champion + icône + `RankBadge`), `MasteryStrip`, `MatchFilters` (+ `FilterChip`,
hook `useMatchFilters`), liste de `MatchRow` (+ `ChampionAvatar`).
**État : partiel / le plus abouti.** **Attention :** ce bloc est **déjà câblé à une vraie API**
(`useLolProfile` → `services/lolApi` → proxy, types `lolApi.types`) — ce qui **contredit le périmètre
« front uniquement »**. À neutraliser en mode démo (voir §2 et points à trancher).
Manques visuels : pas de **page de détail d'un match**, pas d'**onglets de profil** (Vue d'ensemble /
Champions / Maîtrise), pas d'**état vide / skeleton** soigné.

### 1.4 Équipes — `src/pages/lol/LolTeamsHomePage.tsx`
**Simple placeholder** `LolComingSoon` (« Étape 4 »). Aucune UI de gestion réelle sous `/lol/teams`.
**État : à refaire.**
À côté existe une **gestion d'équipe générique** (multi-jeux, hors layout LoL) :
- `src/pages/lol/LolTeamPage.tsx` → `GamePageLayout` + `TeamDetailView`.
- `src/components/teams/*` : `TeamCard`, `CreateTeamModal`, `AddPlayerModal`, `RosterSlot`, `TeamDetailView`.
- `src/hooks/useTeams.ts` + `src/storage/teamsStorage.ts` (persistance locale), types `team.types`.
**État : OK et réutilisable** (roster, création, ajout/suppression de joueurs en données locales),
mais **non intégré** dans l'écosystème LoL (`/lol/teams` ne l'utilise pas) et **sans la couche scrims**.

### 1.5 Stats LoL
**Inexistante.** Aucune route, page ou composant `stats` côté LoL.
Référence existante chez les autres jeux : **`src/components/game/GameStatsTab.tsx`** (placeholder
« Phase 4 ») — utilisé par `ValorantHomePage` / `TftHomePage` via le système d'onglets.

### 1.6 Comparaison avec les autres jeux (onglets)
Valorant / TFT utilisent un **modèle par onglets** : `GameLandingLayout` + `GameLandingHeader`
(`src/components/layout/`) avec les onglets **Solo / Équipes / Stats** (`types/gameTab.types.ts`),
rendant `GameSoloTab` / `GameTeamsTab` / `GameStatsTab`. **LoL n'utilise PAS ce modèle** : il a sa
propre coquille `LolLayout` + nav par routes, et **pas d'onglet Stats**. → **incohérence structurelle.**

### 1.7 Thème
`src/constants/lolTheme.ts` (palette dark/light + `LOL_ACCENTS` solo/team/stats) et `src/hooks/useLolTheme.ts`.
**État : OK**, déjà aligné sur le violet de la charte. Les accents par section (cyan / rose / ambre)
sont vifs — à utiliser avec parcimonie pour rester « feutré ».

---

## 2. Manques & incohérences

### Manques
1. **Page Stats LoL** : totalement absente (demandée comme placeholder structuré).
2. **Page Équipes LoL réelle** : aujourd'hui un simple « coming soon » sous `/lol/teams`.
3. **Couche Scrims** (cœur produit selon le cahier des charges) : aucune UI (liste, ajout, détail,
   stats d'équipe). Non demandée en priorité ici, mais à anticiper dans le sitemap.
4. **Détail d'un match** (vue match-by-match façon op.gg) : absent.
5. **États vides / chargement / erreur** soignés et cohérents (skeletons) : partiels.

### Incohérences
1. **Deux modèles de navigation** : LoL = coquille dédiée + nav par routes ; Valorant/TFT = onglets.
   **Parti pris recommandé : garder la coquille dédiée `/lol` (routes + `LolNavLinks`)**, car LoL est le
   jeu prioritaire et riche (profil, équipe, scrims, stats) — un sous-site mérite ses vraies pages/URLs
   (partageables, deep-linkables) plutôt que des onglets en état local. On **aligne les libellés** sur
   ceux des autres jeux (**Solo / Équipes / Stats**) pour la cohérence de vocabulaire, et on ajoute
   **Stats**. À terme, Valorant/TFT pourront adopter le même modèle de coquille.
2. **Pages joueur/équipe hors `LolLayout`** : `/lol/player/*` et `/lol/team/*` n'héritent pas du header
   LoL (ils passent par `GamePageLayout` générique) → rupture visuelle. **À rattacher au `LolLayout`.**
3. **Doublon de profil joueur** : `LolPlayerPage` (placeholder « API Phase 4 ») vs `LolSearchPage`
   (profil réel). **À unifier** : une seule expérience profil, accessible par recherche **et** par URL.
4. **API déjà branchée alors que le périmètre est « front »** : `useLolProfile`/`services/lolApi`.
   À découpler via une source de données démo, en gardant l'emplacement pour l'API plus tard.

### Manques de design vs charte
- L'accueil actuel est **« marketing »** (dégradés, grands vides, titres XXL) → à recadrer vers
  **dense / cockpit** (cartes d'information, peu de vide).
- Quelques **rayons trop grands** repérés (`rounded-3xl`, `rounded-2xl`, `rounded-full`, `rounded-xl`
  dans `ProfileHeader`, `MatchRow`, showcases) alors que la charte impose **petits rayons**
  (`rounded-sm` / `rounded-md`). À normaliser.
- **Texte de marque en dur** dans `LolHeader` (« RT », « League ») à rebrancher sur le branding void.pro.

---

## 3. Sitemap LoL cible + navigation

```
/lol                       Accueil LoL (hub d'entrée, dense)        → LolHomePage (refaite)
/lol/search                Solo — recherche + profil joueur          → LolSearchPage
/lol/player/:riotId        Profil joueur (deep-link, même UI)        → dans LolLayout
/lol/match/:matchId        Détail d'un match (plus tard)             → placeholder
/lol/teams                 Équipes — liste + création                → LolTeamsHomePage (réelle)
/lol/team/:teamId          Détail d'une équipe (roster, scrims)      → dans LolLayout
/lol/stats                 Stats (placeholder structuré)             → LolStatsPage (nouvelle)
```

**`LolNavLinks` (config `lolNav.ts`) cible** — vocabulaire aligné sur les autres jeux :

| Label    | Route         | `end` |
|----------|---------------|-------|
| Accueil  | `/lol`        | true  |
| Solo     | `/lol/search` | false |
| Équipes  | `/lol/teams`  | false |
| Stats    | `/lol/stats`  | false |

Décisions structurelles associées :
- **Rattacher** `/lol/player/*`, `/lol/team/*`, `/lol/match/*`, `/lol/stats` **sous `LolLayout`**
  (déplacer ces routes dans le bloc `<Route path="/lol" element={<LolLayout />}>`).
- **Unifier** `LolPlayerPage` et le profil de `LolSearchPage` (une seule vue profil réutilisable).

---

## 4. Structure page par page

> Principe transverse (op.gg / DPM.lol revisité charte void.pro) : **barre de recherche toujours
> accessible**, **carte de profil compacte en haut**, **historique dense en liste**, accents violets
> discrets, fonds `--bg-surface/--bg-elevated`, petits rayons, typo Rajdhani pour chiffres/labels.

### 4.1 Accueil LoL (`/lol`) — à refaire
Objectif : **hub d'entrée utile**, pas une landing. Esthétique cockpit, peu de vide.
Blocs :
1. **Barre de recherche centrale** (héro réduit) : Riot ID → redirige vers `/lol/player/...`. C'est
   l'action n°1 (façon op.gg/DPM home).
2. **Accès rapides** : 3 cartes denses → Solo / Équipes / Stats (état, raccourci).
3. **Mes équipes** (données locales `useTeams`) : aperçu des équipes existantes + « Créer une équipe ».
4. **Recherches récentes** (localStorage) : derniers Riot ID consultés.
5. **Bandeau d'info discret** : roadmap / « stats live à venir » (sobre, sans grand vide marketing).

Composants à **créer** (≤ 150 lignes, 1 rôle) :
- `components/lol/home/LolSearchHero.tsx` — barre de recherche centrale (réutilise `RiotIdSearch`).
- `components/lol/home/LolQuickAccess.tsx` + `LolQuickAccessCard.tsx` — cartes Solo/Équipes/Stats.
- `components/lol/home/LolMyTeamsPreview.tsx` — aperçu équipes locales.
- `components/lol/home/LolRecentSearches.tsx` — recherches récentes (+ hook `useRecentSearches.ts`).

À **réutiliser** : `LolSectionHeading`, `RiotIdSearch`, `TeamCard`, tokens `LOL_ACCENTS`.
À **retirer/archiver** de l'accueil : `LolHero`, `LolSoloShowcase`, `LolTeamShowcase`, `LolScrimBoard`,
`LolFeatureGrid`, `LolCtaBanner`, `LolAuroraBackground` (style marketing). On peut **garder
`LolSoloProfileCard` / `LolScrimBoard`** comme visuels de démo si utiles ailleurs.

### 4.2 Solo — Recherche + Profil (`/lol/search`, `/lol/player/:riotId`)
Une **expérience profil unique**, accessible par recherche et par URL.
Blocs (inspiration op.gg, densité void.pro) :
1. **Barre de recherche** persistante en haut (`RiotIdSearch`).
2. **Carte de profil** : icône, Riot ID, niveau, **classements** (Solo/Flex) → `ProfileHeader` + `RankBadge`.
3. **Onglets de profil** : `Vue d'ensemble` / `Champions` / `Maîtrise` (sous-navigation locale).
4. **Vue d'ensemble** : résumé winrate récent + **historique de matchs** filtrable (`MatchFilters` + `MatchRow`).
5. **Détail de match** (extensible / page `/lol/match/:id` plus tard) : placeholder.
6. **États** : recherche initiale (vide), chargement (skeleton), erreur, non classé.

Composants à **créer** :
- `components/lol/search/ProfileTabs.tsx` — sous-nav Vue d'ensemble/Champions/Maîtrise.
- `components/lol/search/ProfileSummaryCard.tsx` — bloc résumé winrate/forme récente.
- `components/lol/search/ChampionStatsTable.tsx` (+ `ChampionStatRow.tsx`) — onglet Champions.
- `components/lol/search/MatchDetail.tsx` — détail d'un match (placeholder structuré).
- `components/lol/search/ProfileSkeleton.tsx` + `SearchEmptyState.tsx` — états.
À **réutiliser** : `ProfileHeader`, `RankBadge`, `MasteryStrip`, `MatchFilters`, `MatchRow`, `ChampionAvatar`.
**Données** : remplacer la dépendance API directe par une **source démo** (`data/lolDemoProfiles.data.ts`)
derrière `useLolProfile`, en gardant l'emplacement de `services/lolApi` pour plus tard.
À **normaliser** : rayons (`rounded-3xl/2xl/xl` → `rounded-sm/md`).

### 4.3 Équipes (`/lol/teams`, `/lol/team/:teamId`)
Remplacer le `LolComingSoon` par une vraie UI, en **réutilisant la couche `useTeams`**.
Blocs page liste `/lol/teams` :
1. **En-tête** : titre « Équipes » + bouton « Nouvelle équipe » (`CreateTeamModal`).
2. **Grille d'équipes** (`TeamCard`) filtrées sur `game === 'lol'` + **état vide** soigné.
3. **Profils d'équipe** (Scrim / Flex / Fun) comme métadonnée à la création.

Blocs page détail `/lol/team/:teamId` (réutilise `TeamDetailView`, **rattaché à `LolLayout`**) :
1. **En-tête équipe** : nom, profil, effectif.
2. **Roster** : 5 slots `RosterSlot` (ajout/suppression, lien profil joueur LoL).
3. **Onglet Scrims** (placeholder structuré, V-future) : liste + « Ajouter un scrim » + stats d'équipe.
4. **Tableau de bord** mini (placeholder) : prochains scrims / derniers résultats.

Composants à **créer** :
- `pages/lol/LolTeamsHomePage.tsx` (réécriture) — conteneur liste équipes LoL.
- `components/lol/teams/LolTeamsGrid.tsx` — grille (wrapper LoL autour de `TeamCard` + état vide).
- `components/lol/teams/LolTeamScrimsTab.tsx` — placeholder scrims (structuré).
- `components/lol/teams/LolTeamDashboard.tsx` — placeholder dashboard.
À **réutiliser** : `useTeams`, `TeamCard`, `CreateTeamModal`, `AddPlayerModal`, `RosterSlot`, `TeamDetailView`.

### 4.4 Stats (`/lol/stats`) — nouvelle page placeholder structuré
Objectif : **squelette crédible** prêt à recevoir l'API, dans la charte.
Blocs :
1. **En-tête** : titre « Stats » + sélecteur de file (Solo/Flex) et de période (désactivés, démo).
2. **Cartes KPI** (4) : Winrate, KDA moyen, CS/min, Vision (valeurs « — » / placeholder).
3. **Bloc graphiques** : zone réservée (placeholder « bientôt ») façon `GameStatsTab` mais dense.
4. **Top champions** : tableau placeholder (réutilise `ChampionStatRow` si créé en 4.2).

Composants à **créer** :
- `pages/lol/LolStatsPage.tsx` — conteneur.
- `components/lol/stats/LolStatKpiCard.tsx` (+ `LolStatsKpiRow.tsx`) — cartes KPI.
- `components/lol/stats/LolStatsPlaceholder.tsx` — zone graphique « à venir » (style charte, pas le
  placeholder générique multi-jeux).
À **réutiliser** : `LolSectionHeading`, tokens `LOL_ACCENTS.stats`.

---

## 5. Roadmap priorisée (lots livrables)

> Chaque lot = ensemble cohérent **testable** à l'écran, sans casser le reste. Front + démo uniquement.
> Effort : **léger** (< quelques composants) · **moyen** · **lourd**.

**Lot 0 — Alignement structurel & branding** · *léger* · sans dépendance
Mettre `LolNavLinks` à 4 entrées (Accueil / Solo / Équipes / Stats), créer la route `/lol/stats`
(placeholder minimal), **rattacher** `/lol/player`, `/lol/team`, `/lol/stats` sous `LolLayout`,
corriger le branding du header (logo/libellé void.pro). Crée la fondation cohérente.
→ *Valeur : navigation complète et cohérente immédiatement.*

**Lot 1 — Accueil LoL refaite (hub)** · *moyen* · dépend de Lot 0
Nouvelle `LolHomePage` orientée cockpit : `LolSearchHero`, `LolQuickAccess`, `LolMyTeamsPreview`,
`LolRecentSearches`. Archiver les composants marketing inutilisés.
→ *Valeur : la page d'entrée devient utile et dans la charte.*

**Lot 2 — Solo / Profil finalisé (démo)** · *moyen→lourd* · dépend de Lot 0
Découpler de l'API (source démo derrière `useLolProfile`), unifier `LolPlayerPage` + `LolSearchPage`,
ajouter `ProfileTabs`, `ProfileSummaryCard`, `ChampionStatsTable`, états vides/skeleton, normaliser les
rayons. Détail de match en placeholder.
→ *Valeur : l'expérience cœur (recherche → profil) est complète visuellement.*

**Lot 3 — Équipes LoL réelles** · *moyen* · dépend de Lot 0
Remplacer le placeholder `/lol/teams` par la liste réelle (réutilise `useTeams`/`TeamCard`), rattacher
le détail d'équipe au `LolLayout`, ajouter les onglets Scrims/Dashboard en placeholders structurés.
→ *Valeur : gestion d'équipe utilisable (création/roster) dès maintenant, en local.*

**Lot 4 — Stats LoL enrichie** · *léger→moyen* · dépend de Lot 0 (et bénéficie de Lot 2)
Étoffer `/lol/stats` : KPI cards, top champions (réutilise `ChampionStatRow`), zone graphique placeholder.
→ *Valeur : page Stats crédible, prête pour l'API.*

**Lot 5 (plus tard) — Détail de match & couche Scrims** · *lourd* · dépend de Lot 2 / Lot 3
Page `/lol/match/:id` complète et saisie/affichage des scrims d'équipe. **Hors périmètre immédiat.**

Ordre recommandé : **0 → 1 → 2 → 3 → 4** (livraison de valeur rapide, site cohérent à chaque étape).
Lots 2 et 3 sont indépendants entre eux après le Lot 0 → parallélisables.

---

## 6. Points à trancher (décisions ouvertes)

1. **Navigation** : on confirme la **coquille dédiée `/lol` par routes** (recommandé) plutôt que des
   onglets comme Valorant/TFT ? (Et on aligne juste les **libellés** Solo/Équipes/Stats ?)
2. **API déjà branchée** : on **bascule la recherche profil en données démo** maintenant (cohérent avec
   « front uniquement ») en gardant l'emplacement API, ou on **garde le proxy actuel** pour le profil ?
3. **Accueil** : on **archive** les composants marketing (`LolHero`, showcases, `LolFeatureGrid`,
   `LolCtaBanner`, `LolAuroraBackground`) ou on en **recycle** certains visuels dans le nouveau hub ?
4. **Profil joueur** : URL canonique → on garde **`/lol/player/:gameName/:tagLine`** (deux segments) ou
   on passe à **`/lol/player/:riotId`** (un segment encodé) ? Et la recherche redirige-t-elle vers
   cette URL (deep-link) plutôt que d'afficher en place ?
5. **Scrims** : niveau de détail attendu **dès maintenant** (simple placeholder structuré) vs plus tard
   (Lot 5) ? Le cahier des charges en fait un cœur produit.
6. **Branding header LoL** : quel logo/texte void.pro afficher (remplacer « RT » / « League ») ?
7. **Accents par section** : garde-t-on les accents vifs (cyan/rose/ambre de `LOL_ACCENTS`) ou on
   resserre sur le **violet** pour rester plus « feutré » conforme à la charte ?

---

*Sources d'inspiration (organisation uniquement, pas de copie) :*
*[op.gg](https://op.gg/) · [DPM.LOL](https://dpm.lol/) · [Guide profils op.gg/u.gg — Wombo Combo](https://www.wombocombo.gg/blog/summoner-lookup/understanding-summoner-profile-stats)*
