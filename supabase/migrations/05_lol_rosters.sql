-- =============================================================================
-- 05_lol_rosters.sql
-- Table lol_rosters : joueurs d'une équipe LoL (entrées de roster).
-- Un joueur est avant tout un Riot ID (game_name + tag_line) ; le lien à un
-- compte void.pro (user_id) est optionnel (nullable).
--
-- Décision produit :
--   - user_id ON DELETE SET NULL : si le compte est supprimé, l'entrée roster
--     (le Riot ID) subsiste — la composition de l'équipe n'est pas effacée.
--   - UNIQUE(team_id, game_name, tag_line) : un même Riot ID n'apparaît qu'une
--     fois par équipe, mais peut être dans plusieurs équipes (many-to-many libre).
--   - Pas de contrainte d'unicité globale sur user_id → plusieurs équipes OK.
--
-- Permissions : côté Express uniquement (pas de RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_rosters (
  id           uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id      uuid        NOT NULL,
  user_id      uuid        NULL,
  game_name    text        NOT NULL,
  tag_line     text        NOT NULL,
  puuid        text        NULL,
  role_in_game text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  -- Supprimer l'équipe supprime ses entrées roster.
  CONSTRAINT fk_lol_rosters_team
    FOREIGN KEY (team_id) REFERENCES lol_teams (id) ON DELETE CASCADE,

  -- Si le compte est supprimé, l'entrée roster conserve le Riot ID (SET NULL).
  CONSTRAINT fk_lol_rosters_user
    FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE SET NULL,

  -- Un même Riot ID n'apparaît qu'une fois par équipe.
  CONSTRAINT lol_rosters_riot_id_per_team_unique
    UNIQUE (team_id, game_name, tag_line),

  CONSTRAINT lol_rosters_role_in_game_values
    CHECK (role_in_game IS NULL OR role_in_game IN (
      'Top','Jungle','Mid','ADC','Support','Fill'
    ))
);

-- Accélérer le chargement du roster d'une équipe.
CREATE INDEX IF NOT EXISTS idx_lol_rosters_team_id
  ON lol_rosters (team_id);

-- Retrouver les équipes où un compte est joueur.
CREATE INDEX IF NOT EXISTS idx_lol_rosters_user_id
  ON lol_rosters (user_id)
  WHERE user_id IS NOT NULL;

-- Trigger updated_at.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_rosters_updated_at'
      AND tgrelid = 'lol_rosters'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_rosters_updated_at
      BEFORE UPDATE ON lol_rosters
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
