-- =============================================================================
-- 06_team_members.sql
-- Évolution de lol_team_managers → lol_team_members.
--
-- Changements :
--   1. Rename la table lol_team_managers en lol_team_members (idempotent).
--   2. Remplace la contrainte CHECK sur 'role' pour accepter les 6 rôles :
--      owner, captain, manager, coach, staff, player.
--   3. Conserve UNIQUE(team_id, user_id) via la PK composite existante.
--   4. Conserve l'index unique partiel garantissant un seul owner par équipe.
--   5. Déplace le trigger updated_at sur la nouvelle table.
--
-- Permissions : côté backend Express uniquement (pas de RLS — Postgres nu).
-- =============================================================================

-- 1. Renommer la table (ne fait rien si lol_team_managers n'existe plus).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'lol_team_managers'
  ) THEN
    ALTER TABLE lol_team_managers RENAME TO lol_team_members;
  END IF;
END;
$$;

-- 2. Créer la table directement si elle n'existe ni sous l'un ni l'autre nom.
--    (cas d'une installation fraîche sans migration 04 appliquée)
CREATE TABLE IF NOT EXISTS lol_team_members (
  team_id    uuid        NOT NULL,
  user_id    uuid        NOT NULL,
  role       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (team_id, user_id),

  CONSTRAINT fk_lol_team_members_team
    FOREIGN KEY (team_id) REFERENCES lol_teams (id) ON DELETE CASCADE,

  CONSTRAINT fk_lol_team_members_user
    FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,

  CONSTRAINT lol_team_members_role_values
    CHECK (role IN ('owner','captain','manager','coach','staff','player'))
);

-- 3. Drop l'ancienne contrainte CHECK sur 'role' (nom issu de la migration 04)
--    et la remplace par la nouvelle. Idempotent via bloc DO.
DO $$
BEGIN
  -- Supprime l'ancienne contrainte si elle porte encore l'ancien nom.
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'lol_team_members'
      AND constraint_name = 'lol_team_managers_role_values'
  ) THEN
    ALTER TABLE lol_team_members DROP CONSTRAINT lol_team_managers_role_values;
  END IF;

  -- Ajoute la nouvelle contrainte seulement si elle n'existe pas encore.
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'lol_team_members'
      AND constraint_name = 'lol_team_members_role_values'
  ) THEN
    ALTER TABLE lol_team_members
      ADD CONSTRAINT lol_team_members_role_values
        CHECK (role IN ('owner','captain','manager','coach','staff','player'));
  END IF;
END;
$$;

-- 4. Recréer l'index unique partiel (un seul owner par équipe).
--    Gère le renommage éventuel de l'ancien index.
DO $$
BEGIN
  -- Si l'ancien index porte l'ancien nom, on le supprime pour le recréer proprement.
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'lol_team_members'
      AND indexname = 'idx_lol_team_managers_one_owner'
  ) THEN
    DROP INDEX idx_lol_team_managers_one_owner;
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_lol_team_members_one_owner
  ON lol_team_members (team_id)
  WHERE role = 'owner';

-- 5. Trigger updated_at — supprime l'ancien (nom lié à l'ancien nom de table)
--    et crée le nouveau si absent.
DO $$
BEGIN
  -- Supprime l'ancien trigger s'il existe encore sur la table renommée.
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_team_managers_updated_at'
      AND tgrelid = 'lol_team_members'::regclass
  ) THEN
    DROP TRIGGER trg_lol_team_managers_updated_at ON lol_team_members;
  END IF;

  -- Crée le nouveau trigger si absent.
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_team_members_updated_at'
      AND tgrelid = 'lol_team_members'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_team_members_updated_at
      BEFORE UPDATE ON lol_team_members
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
