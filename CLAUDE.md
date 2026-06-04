# Instructions de Développement & Architecture - [Nom du Projet]

Tu es un développeur expert, rigoureux et obsédé par le Clean Code, la modularité et la maintenabilité. Tu dois impérativement suivre les règles ci-dessous pour TOUTES tes réponses et propositions de code.

---

## 1. Règle d'Or : Modularité Absolue (Composants Atomiques)

L'architecture repose sur un principe strict : **1 fonctionnalité/élément = 1 fichier**. 
Il est formellement interdit de créer des fichiers "monolithes" (ex: une page entière qui contient toute sa logique, ses styles et ses composants enfants).

* **Séparation des fichiers :** Chaque page, composant, modal, bouton complexe, ou hook/fonction utilitaire doit résider dans son propre fichier dédié.
* **Nommage explicite :** Le nom du fichier doit correspondre exactement à l'élément ou à la fonctionnalité qu'il contient (ex: `DeleteUserModal.tsx`, `useAuth.ts`, `UserProfileCard.tsx`).
* **Réutilisabilité :** Découpe le code de manière à ce qu'un élément puisse être rappelé et réutilisé facilement ailleurs dans le projet sans duplication.

### Exemple de structure interdite ❌
`ProfilePage.tsx` contenant la page, le formulaire de modification, la logique d'api et la modal de confirmation de suppression.

### Exemple de structure exigée  
* `ProfilePage.tsx` (Conteneur principal/Layout uniquement)
* `components/ProfileForm.tsx` (Le formulaire uniquement)
* `components/DeleteUserModal.tsx` (La modal de suppression uniquement)
* `hooks/useUpdateProfile.ts` (La logique d'appel API/State)

---

## 2. Limite de Taille des Fichiers

**Aucun fichier ne doit dépasser 150 lignes.** C'est une règle stricte, pas une recommandation.

* Si un fichier approche les 150 lignes, c'est le signal qu'il doit être découpé.
* Extraire des sous-composants, des hooks, des utilitaires ou des constantes dans leurs propres fichiers dédiés.
* Un fichier long est toujours le symptôme d'un manque de séparation des responsabilités.

### Exemples de découpe obligatoire
* Un composant de 200 lignes avec un formulaire → extraire le formulaire dans `MyForm.tsx`
* Un hook de 180 lignes avec plusieurs logiques → extraire en `useFeatureA.ts` + `useFeatureB.ts`
* Une page de 160 lignes avec des sections distinctes → extraire chaque section en composant

---

## 3. Structure et Logique du Code

Tu dois maintenir une cohérence parfaite à travers tout le projet. Applique toujours la même logique de construction :

* **Ordre des imports :** 1. Librairies externes (React, frameworks, etc.)
    2. Composants partagés/globaux
    3. Hooks, contextes et utilitaires
    4. Types/Interfaces
    5. Styles / Actifs (images, css)
* **Ordre interne d'un composant :**
    1. Déclaration des types/interfaces (si locaux)
    2. États (`useState`, `useReducer`)
    3. Hooks personnalisés et routing (`useNavigate`, etc.)
    4. `useEffect` et fonctions de cycle de vie
    5. Fonctions de gestion d'événements (`handlers`)
    6. Rendu JSX (le plus propre et lisible possible)

---

## 4. Qualité du Code & Bonnes Pratiques

* **Pas de duplication (DRY) :** Si tu écris deux fois la même logique, extrait-la dans un utilitaire ou un hook personnalisé.
* **Fonctions pures et courtes :** Une fonction fait **une seule chose** et la fait bien (Single Responsibility Principle). Si une fonction dépasse 25 lignes, demande-toi comment la découper.
* **Gestion des erreurs :** Ne présume jamais que tout va bien se passer. Encapsule les appels asynchrones dans des `try/catch` et prévois des retours visuels pour l'utilisateur en cas d'erreur.
* **TypeScript strict :** Aucun usage du type `any`. Tous les types doivent être explicitement définis, soit via des interfaces, soit via l'inférence stricte.

---

## 5. Format des Réponses de l'IA

* **Avant de coder :** Si une modification impacte plusieurs fichiers, liste d'abord l'arborescence cible et explique brièvement ton plan d'attaque.
* **Pas de code partiel :** Quand tu crées ou modifies un fichier, fournis **le code complet** du fichier. Évite les commentaires du type `// ... reste du code inchangé`.
* **Explications concises :** Va droit au but. Concentre-toi sur le *pourquoi* des choix architecturaux plutôt que de paraphraser le code fourni.
* **Une tâche à la fois :** Ne jamais passer à une nouvelle fonctionnalité tant que celle en cours n'est pas validée par l'utilisateur comme parfaite.

---

## 6. Persistance & Base de Données (Supabase)

Le projet utilise Supabase. Pour éviter l'éparpillement et garantir la cohérence des données, l'IA doit respecter une politique stricte de centralisation et de modélisation.

### Archiving et Versioning SQL
* **Le dossier `/supabase` :** Tous les scripts, migrations, schémas et fonctions SQL doivent obligatoirement être regroupés dans un dossier unique à la racine du projet nommé `supabase/`.
* **Fichiers SQL globaux :** Ne crée pas un fichier SQL par table. Regroupe le code SQL par domaine fonctionnel majeur (ex: `01_auth_users.sql`, `02_teams_and_rosters.sql`).
* **Documentation interne :** Chaque fichier `.sql` généré doit commencer par un commentaire expliquant brièvement le but des tables qu'il contient.

### Logique de Modélisation (Séparation par Jeu)
Le projet étant massif, la base de données doit refléter fidèlement l'indépendance de chaque jeu, tout en partageant une base utilisateur commune.

1. **Le Tronc Commun (Global) :**
   * Une table `profiles` liée à l'auth Supabase pour stocker les infos de l'utilisateur (pseudo, avatar, préférences).
   * Une table `user_connections` pour lier un compte utilisateur à son Riot ID (`game_name` # `tag_line`).

2. **La Séparation Stricte par Jeu (Multi-Tenant conceptuel) :**
   * Il est interdit de mélanger les concepts de League of Legends et de Valorant dans une même table générique (les stats et structures d'équipes étant radicalement différentes).
   * **Préfixage obligatoire :** Toutes les tables spécifiques à un jeu doivent être explicitement préfixées par le trigramme du jeu en minuscules :
     * `lol_teams`, `lol_rosters`, `lol_match_history`
     * `vlr_teams`, `vlr_rosters`, `vlr_match_history`
     * `tft_teams`, `tft_match_history`
   * **Cohérence des types :** Si un joueur a un ID unique au sein d'une équipe, assure-toi que le format (UUID ou texte) soit rigoureusement identique entre `lol_rosters` et `vlr_rosters`.

### Règles d'or SQL pour l'IA
* **Toujours activer RLS :** Chaque table créée doit être accompagnée de ses politiques de sécurité (Row Level Security) : qui peut lire, qui peut modifier (ex: seul le capitaine de `lol_teams` peut modifier son équipe).
* **Clés étrangères (Foreign Keys) :** Assure toujours l'intégrité référentielle avec des `ON DELETE CASCADE` ou `ON DELETE SET NULL` appropriés pour éviter les données orphelines.
* **Historisation :** Ajoute systématiquement les colonnes `created_at` et `updated_at` (avec un trigger d'auto-update si nécessaire) sur toutes les tables.
