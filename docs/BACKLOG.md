# BACKLOG — void.pro (front uniquement, sans API ni base de données)

> Avance **une tâche à la fois**, puis **relis** avant la suivante.
> Chaque tâche = un prompt prêt à coller dans Claude Code.
> Toutes suivent `CLAUDE.md` (archi : 1 fichier = 1 rôle, ≤ 150 lignes, TS strict, pas de `any`)
> **et** `docs/DESIGN.md` (visuel).

## Phase 0 — État des lieux (à faire en premier)

- [ ] **Audit de la dette technique**
  > Utilise l'agent `qa-securite` : audite le dossier `src/`. Liste les fichiers > 150 lignes,
  > les `any`, le code dupliqué et les incohérences de style vs `docs/DESIGN.md` et `CLAUDE.md`.
  > Classe par gravité. Ne corrige rien — propose un plan d'action priorisé.

- [ ] **Plan d'organisation des fichiers**
  > Utilise l'agent `dev-frontend` : propose une arborescence cible propre pour `src/`
  > (pages/, components/, hooks/, lib/, types/…) conforme au `CLAUDE.md`. Montre le plan
  > AVANT d'appliquer ; n'applique qu'après ma validation, sans rien casser.

## Phase 1 — Charte & coquille

- [ ] **Affiner la charte**
  > Utilise l'agent `designer` : relis `docs/DESIGN.md`, propose 2–3 améliorations concrètes
  > (échelle typographique, états de focus accessibles, tokens manquants) et applique-les
  > dans `src/index.css` uniquement.

- [ ] **Navigation / routes**
  > Utilise l'agent `dev-frontend` : cartographie puis implémente la navigation avec
  > react-router (accueil multi-jeux → `/lol` → onglets Solo / Équipes / Stats).
  > Les pages manquantes = placeholders propres, conformes à la charte.

## Phase 2 — Pages (données de démo, aucun appel API)

- [ ] Polir la **page d'accueil multi-jeux**
- [ ] Polir la **landing LoL**
- [ ] **Page Équipes** (liste + création) en données démo
- [ ] **Page Profil joueur** (maquette)
- [ ] **Page Stats** (maquette)

  > Modèle de prompt : « Utilise l'agent `dev-frontend` pour [PAGE], en suivant `docs/DESIGN.md`
  > et `CLAUDE.md`, avec des **données de démonstration** (pas d'appel API). Composants ≤ 150 lignes,
  > réutilise l'existant. »

## Plus tard (rappel — ne PAS faire maintenant)

Backend **self-host Supabase** (Hetzner) · auth · persistance des équipes · stats Riot ·
**import scrims via LCU**.

## Règle d'or

Après chaque tâche : relis le rendu (`npm run dev:full` → http://localhost:5173), puis coche
et passe à la suivante. **Qualité > vitesse.**
