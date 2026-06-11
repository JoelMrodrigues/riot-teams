-- =============================================================================
-- 11_lol_match_brackets.sql
-- Stats par tranche de 5 min d'un joueur sur une partie (pour la timeline agrégée
-- Solo : courbe or/cs/xp + différence vs adversaire de rôle).
--
-- 1 ligne par (joueur, partie, tranche). Immuable une fois ingéré.
-- Agrégation : AVG(...) GROUP BY champion_id, bracket_min WHERE game_creation > …
-- =============================================================================

CREATE TABLE IF NOT EXISTS lol_match_brackets (
  player_id     uuid        NOT NULL,
  match_id      text        NOT NULL,
  champion_id   integer     NOT NULL,
  role          text        NULL,
  win           boolean     NOT NULL,
  game_creation timestamptz NOT NULL,
  bracket_min   smallint    NOT NULL,   -- 5, 10, 15, 20, 25, 30
  my_gold       integer     NOT NULL,
  my_cs         integer     NOT NULL,
  my_xp         integer     NOT NULL,
  diff_gold     integer     NULL,       -- vs adversaire de rôle (null si absent)
  diff_cs       integer     NULL,
  diff_xp       integer     NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT pk_lol_match_brackets PRIMARY KEY (player_id, match_id, bracket_min),
  CONSTRAINT fk_lol_match_brackets_player
    FOREIGN KEY (player_id) REFERENCES lol_players (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lol_match_brackets_agg
  ON lol_match_brackets (player_id, champion_id, game_creation);
