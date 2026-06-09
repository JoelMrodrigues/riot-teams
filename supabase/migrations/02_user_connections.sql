-- =============================================================================
-- 02_user_connections.sql
-- Table user_connections : Riot IDs liés à un compte void.pro.
-- Un utilisateur peut avoir plusieurs Riot IDs ; chaque Riot ID n'est lié
-- qu'une seule fois au même compte (UNIQUE user_id + game_name + tag_line).
-- Un PUUID ne peut appartenir qu'à un seul compte (index partiel sur puuid NOT NULL).
--
-- Permissions : côté Express uniquement (pas de RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_connections (
  id          uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        NOT NULL,
  game_name   text        NOT NULL,
  tag_line    text        NOT NULL,
  puuid       text        NULL,
  platform    text        NULL,
  is_primary  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  -- Supprimer le compte supprime ses connexions Riot (orphelines inutiles).
  CONSTRAINT fk_user_connections_user
    FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,

  -- Un même Riot ID n'est lié qu'une fois au même compte.
  CONSTRAINT user_connections_riot_id_unique
    UNIQUE (user_id, game_name, tag_line)
);

-- Un PUUID n'appartient qu'à un seul compte (partiel : ignore les NULL).
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_connections_puuid_unique
  ON user_connections (puuid)
  WHERE puuid IS NOT NULL;

-- Accélérer la liste des connexions d'un utilisateur.
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id
  ON user_connections (user_id);

-- Trigger updated_at.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_user_connections_updated_at'
      AND tgrelid = 'user_connections'::regclass
  ) THEN
    CREATE TRIGGER trg_user_connections_updated_at
      BEFORE UPDATE ON user_connections
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
