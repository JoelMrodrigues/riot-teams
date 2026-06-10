-- =============================================================================
-- 09_lol_events.sql
-- Table lol_events : agenda d'une équipe LoL (scrims, entraînements, reviews,
-- sessions SoloQ…). Modèle unifié : un scrim = un événement type='scrim' avec
-- des champs spécifiques optionnels (opponent, bo, result, score).
--
-- Permissions (côté Express) : lecture par les membres ; création/édition par
-- owner | captain | manager | coach (requireCanManageRoster).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_events (
  id           uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id      uuid        NOT NULL,
  type         text        NOT NULL DEFAULT 'training',
  title        text        NOT NULL,
  starts_at    timestamptz NOT NULL,
  duration_min integer     NULL,

  -- Champs spécifiques aux scrims (nullables pour les autres types).
  opponent     text        NULL,
  bo           smallint    NULL,
  result       text        NULL,
  score        text        NULL,

  notes        text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fk_lol_events_team
    FOREIGN KEY (team_id) REFERENCES lol_teams (id) ON DELETE CASCADE,

  CONSTRAINT lol_events_type_values
    CHECK (type IN ('scrim', 'training', 'review', 'soloq', 'other')),

  CONSTRAINT lol_events_result_values
    CHECK (result IS NULL OR result IN ('win', 'loss'))
);

CREATE INDEX IF NOT EXISTS idx_lol_events_team_id ON lol_events (team_id);
CREATE INDEX IF NOT EXISTS idx_lol_events_team_start ON lol_events (team_id, starts_at);

-- Trigger updated_at (fonction set_updated_at définie dans 00_init).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_events_updated_at'
      AND tgrelid = 'lol_events'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_events_updated_at
      BEFORE UPDATE ON lol_events
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
