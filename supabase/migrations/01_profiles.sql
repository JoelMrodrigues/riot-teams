-- =============================================================================
-- 01_profiles.sql
-- Table profiles : comptes utilisateurs (authentification maison).
-- Fusionne intentionnellement identité de connexion (email + password_hash) et
-- profil affiché (pseudo, avatar_url) — pas de Supabase Auth, pas de séparation.
--
-- Permissions : côté Express uniquement (pas de RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id           uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email        text        NOT NULL,
  password_hash text       NOT NULL,
  pseudo       text        NOT NULL,
  avatar_url   text        NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT profiles_email_unique UNIQUE (email)
);

-- Index implicite sur PK (id) et email (UNIQUE ci-dessus).

-- Trigger updated_at (réutilise la fonction partagée de 00_init.sql).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_profiles_updated_at'
      AND tgrelid = 'profiles'::regclass
  ) THEN
    CREATE TRIGGER trg_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
