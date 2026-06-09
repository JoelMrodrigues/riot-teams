# supabase/ — Scripts SQL versionnés (void.pro)

Ce dossier contient les migrations PostgreSQL du projet void.pro.
Le nom `supabase/` est conservé par convention (cf. CLAUDE.md §6) même si
le projet utilise un PostgreSQL nu sur Hetzner, sans Supabase.

## Ordre d'application obligatoire

Les fichiers sont préfixés numériquement ; les dépendances entre tables
imposent l'ordre suivant (respecter la séquence) :

```
00_init.sql              — pgcrypto + fonction trigger set_updated_at()
01_profiles.sql          — comptes utilisateurs (tronc commun)
02_user_connections.sql  — Riot IDs liés à un profil
03_lol_teams.sql         — équipes League of Legends
04_lol_team_managers.sql — rôles owner/captain sur une équipe
05_lol_rosters.sql       — joueurs du roster (Riot ID, user_id optionnel)
```

## Commandes d'application

```bash
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

psql "$DATABASE_URL" -f supabase/migrations/00_init.sql
psql "$DATABASE_URL" -f supabase/migrations/01_profiles.sql
psql "$DATABASE_URL" -f supabase/migrations/02_user_connections.sql
psql "$DATABASE_URL" -f supabase/migrations/03_lol_teams.sql
psql "$DATABASE_URL" -f supabase/migrations/04_lol_team_managers.sql
psql "$DATABASE_URL" -f supabase/migrations/05_lol_rosters.sql
```

Ou via un script shell (applique tous les fichiers dans l'ordre) :

```bash
for f in supabase/migrations/*.sql; do
  echo "Applying $f..."
  psql "$DATABASE_URL" -f "$f"
done
```

## Idempotence

Tous les fichiers sont idempotents (`CREATE TABLE IF NOT EXISTS`,
`CREATE INDEX IF NOT EXISTS`, `CREATE OR REPLACE FUNCTION`, blocs `DO $$`
pour les triggers). Ils peuvent être rejoués sans erreur.

## Conventions

- Pas de RLS : les permissions sont gérées dans le backend Express
  (cf. `docs/auth-teams-cadrage.md §0.2`).
- Préfixage par jeu : `lol_*` (futures tables : `vlr_*`, `tft_*`).
- Toutes les tables ont `created_at` et `updated_at` avec trigger automatique.
- Les FK utilisent `ON DELETE CASCADE / RESTRICT / SET NULL` selon le sens
  métier documenté dans chaque fichier.
