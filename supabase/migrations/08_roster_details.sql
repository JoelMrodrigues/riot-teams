-- =============================================================================
-- 08_roster_details.sql
-- Enrichit lol_rosters avec les champs du formulaire « Ajouter un joueur » :
--   - display_name        : surnom du joueur dans l'équipe (libre, optionnel).
--   - region              : serveur Riot du compte principal.
--   - secondary_game_name : compte secondaire (smurf) — Riot ID, optionnel.
--   - secondary_tag_line  : tag du compte secondaire.
--   - is_substitute       : true = remplaçant (Sub), false = titulaire.
-- Tous nullables / par défaut sûrs : les entrées existantes restent valides.
-- =============================================================================

ALTER TABLE lol_rosters
  ADD COLUMN IF NOT EXISTS display_name        text    NULL,
  ADD COLUMN IF NOT EXISTS region              text    NULL,
  ADD COLUMN IF NOT EXISTS secondary_game_name text    NULL,
  ADD COLUMN IF NOT EXISTS secondary_tag_line  text    NULL,
  ADD COLUMN IF NOT EXISTS is_substitute       boolean NOT NULL DEFAULT false;

-- Mirroir de la liste de régions validée côté Express (zod).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'lol_rosters_region_values'
  ) THEN
    ALTER TABLE lol_rosters
      ADD CONSTRAINT lol_rosters_region_values
      CHECK (region IS NULL OR region IN (
        'EUW','EUNE','NA','KR','BR','LAN','LAS','OCE','JP','TR','RU'
      ));
  END IF;
END;
$$;
