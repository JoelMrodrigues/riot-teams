-- =============================================================================
-- 10_lol_players.sql
-- Table joueurs Riot canonique (1 ligne par compte, identifié par puuid) +
-- cache des stats (rang SoloQ, top champions) PARTAGÉ entre toutes les équipes.
--
-- Le puuid ne vit QUE dans cette table : le roster pointe vers le joueur via
-- player_id. Le puuid est en colonne UNIQUE (pas clé primaire) → on peut le
-- ré-résoudre (self-heal sur 404) sans casser les liens des rosters.
--
-- champions NULL = jamais synchronisé (force un 1er refresh complet).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_players (
  id            uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  puuid         text        NOT NULL UNIQUE,
  game_name     text        NOT NULL,
  tag_line      text        NOT NULL,
  rank          jsonb       NULL,
  champions     jsonb       NULL,
  last_match_id text        NULL,
  synced_at     timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Lien roster → joueur (le roster conserve son Riot ID si le joueur est purgé).
ALTER TABLE lol_rosters ADD COLUMN IF NOT EXISTS player_id uuid NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_lol_rosters_player') THEN
    ALTER TABLE lol_rosters
      ADD CONSTRAINT fk_lol_rosters_player
      FOREIGN KEY (player_id) REFERENCES lol_players (id) ON DELETE SET NULL;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_lol_rosters_player_id
  ON lol_rosters (player_id) WHERE player_id IS NOT NULL;
