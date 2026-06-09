-- =============================================================================
-- 04_lol_team_managers.sql
-- Table lol_team_managers : rôles de gestion d'une équipe LoL.
-- Deux rôles possibles : 'owner' (propriétaire) et 'captain' (capitaine).
-- Décision produit : plusieurs capitaines autorisés par équipe.
-- Invariant : exactement UN propriétaire par équipe (index unique partiel).
-- Le propriétaire ne peut pas être rétrogradé/retiré — enforced côté Express.
--
-- Permissions : côté Express uniquement (pas de RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_team_managers (
  team_id    uuid        NOT NULL,
  user_id    uuid        NOT NULL,
  role       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Clé primaire composite : un utilisateur a au plus un rôle de gestion par équipe.
  PRIMARY KEY (team_id, user_id),

  -- Supprimer l'équipe supprime ses rôles (CASCADE).
  CONSTRAINT fk_lol_team_managers_team
    FOREIGN KEY (team_id) REFERENCES lol_teams (id) ON DELETE CASCADE,

  -- Supprimer le compte le retire des staffs (CASCADE).
  CONSTRAINT fk_lol_team_managers_user
    FOREIGN KEY (user_id) REFERENCES profiles (id) ON DELETE CASCADE,

  CONSTRAINT lol_team_managers_role_values
    CHECK (role IN ('owner', 'captain'))
);

-- Garantit l'unicité du propriétaire par équipe (index unique partiel).
-- Un seul 'owner' peut exister pour chaque team_id.
CREATE UNIQUE INDEX IF NOT EXISTS idx_lol_team_managers_one_owner
  ON lol_team_managers (team_id)
  WHERE role = 'owner';

-- Trigger updated_at.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_lol_team_managers_updated_at'
      AND tgrelid = 'lol_team_managers'::regclass
  ) THEN
    CREATE TRIGGER trg_lol_team_managers_updated_at
      BEFORE UPDATE ON lol_team_managers
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
