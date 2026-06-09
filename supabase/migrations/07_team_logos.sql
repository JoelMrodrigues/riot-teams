-- =============================================================================
-- 07_team_logos.sql
-- Table lol_team_logos : stockage binaire (bytea) du logo d'une équipe LoL.
-- Un logo est lié 1-à-1 à une équipe (PK = team_id). La suppression de l'équipe
-- entraîne la suppression en cascade du logo (ON DELETE CASCADE).
--
-- Cette migration étend également la contrainte CHECK icon_kind_values sur
-- lol_teams pour accepter la valeur 'upload' (logo stocké en base).
--
-- Permissions : côté Express uniquement (pas de RLS Supabase — cohérent avec
-- les autres tables lol_*).
-- =============================================================================

-- Table logo : 1 ligne par équipe au maximum (PK = team_id).
CREATE TABLE IF NOT EXISTS lol_team_logos (
  team_id    uuid        NOT NULL PRIMARY KEY,
  mime       text        NOT NULL,
  data       bytea       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fk_lol_team_logos_team
    FOREIGN KEY (team_id) REFERENCES lol_teams (id) ON DELETE CASCADE,

  CONSTRAINT lol_team_logos_mime_values
    CHECK (mime IN ('image/png', 'image/jpeg', 'image/webp'))
);

-- Trigger pour mettre à jour updated_at lors d'un UPSERT.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_team_logos_updated_at'
      AND tgrelid = 'lol_team_logos'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_team_logos_updated_at
      BEFORE UPDATE ON lol_team_logos
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;

-- Extension de la contrainte icon_kind sur lol_teams pour autoriser 'upload'.
-- On remplace l'ancienne contrainte sans toucher aux données existantes.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lol_teams_icon_kind_values'
      AND conrelid = 'lol_teams'::regclass
  ) THEN
    ALTER TABLE lol_teams DROP CONSTRAINT lol_teams_icon_kind_values;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lol_teams_icon_kind_values'
      AND conrelid = 'lol_teams'::regclass
  ) THEN
    ALTER TABLE lol_teams
      ADD CONSTRAINT lol_teams_icon_kind_values
        CHECK (icon_kind IS NULL OR icon_kind IN ('champion', 'emblem', 'upload'));
  END IF;
END;
$$;
