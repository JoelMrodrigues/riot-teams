-- =============================================================================
-- 00_init.sql
-- Fondations partagées : extension pgcrypto (gen_random_uuid) et fonction
-- trigger set_updated_at() réutilisée par toutes les tables du projet.
--
-- Permissions : appliquées côté backend Express, pas de RLS (PostgreSQL nu,
-- un seul utilisateur applicatif dans le pool — cf. docs/auth-teams-cadrage.md §0.2).
-- =============================================================================

-- Extension nécessaire pour gen_random_uuid() (disponible dès PostgreSQL 13).
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction trigger partagée : met à jour updated_at avant chaque UPDATE.
-- Branchée sur chaque table via un trigger BEFORE UPDATE (DRY).
CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
