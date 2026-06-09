-- =============================================================================
-- 03_lol_teams.sql
-- Table lol_teams : équipes League of Legends.
-- Reprend fidèlement les champs du modèle front (Team type + spec modal).
-- L'icône est éclatée en deux colonnes (icon_kind / icon_value) plutôt qu'un
-- champ JSONB, pour rester simple, lisible et indexable.
--
-- Décision produit : owner_id FK ON DELETE RESTRICT — impossible de supprimer
-- un compte qui possède encore des équipes (transfert requis au préalable).
--
-- Permissions : côté Express uniquement (pas de RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_teams (
  id           uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id     uuid        NOT NULL,
  name         text        NOT NULL,
  tag          text        NULL,
  region       text        NULL,
  accent_color text        NULL,
  description  text        NULL,
  icon_kind    text        NULL,
  icon_value   text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  -- RESTRICT : empêche la suppression d'un compte propriétaire d'équipes.
  CONSTRAINT fk_lol_teams_owner
    FOREIGN KEY (owner_id) REFERENCES profiles (id) ON DELETE RESTRICT,

  -- Validations métier (longueurs et valeurs autorisées).
  CONSTRAINT lol_teams_name_length
    CHECK (char_length(name) BETWEEN 2 AND 40),

  CONSTRAINT lol_teams_tag_format
    CHECK (tag IS NULL OR tag ~ '^[A-Z0-9]{2,4}$'),

  CONSTRAINT lol_teams_region_values
    CHECK (region IS NULL OR region IN (
      'EUW','EUNE','NA','KR','BR','LAN','LAS','OCE','JP','TR','RU'
    )),

  CONSTRAINT lol_teams_description_length
    CHECK (description IS NULL OR char_length(description) <= 200),

  CONSTRAINT lol_teams_icon_kind_values
    CHECK (icon_kind IS NULL OR icon_kind IN ('champion','emblem')),

  -- icon_kind et icon_value doivent être tous les deux NULL ou tous les deux non-NULL.
  CONSTRAINT lol_teams_icon_coherence
    CHECK (
      (icon_kind IS NULL AND icon_value IS NULL)
      OR (icon_kind IS NOT NULL AND icon_value IS NOT NULL)
    )
);

-- Lister les équipes d'un propriétaire.
CREATE INDEX IF NOT EXISTS idx_lol_teams_owner_id
  ON lol_teams (owner_id);

-- Trigger updated_at.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_teams_updated_at'
      AND tgrelid = 'lol_teams'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_teams_updated_at
      BEFORE UPDATE ON lol_teams
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
