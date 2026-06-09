// GET /api/users/search?q=...
// Cherche des utilisateurs par pseudo (ILIKE) OU par Riot ID (game_name#tag_line).
//
// Règles :
//   - requireAuth dans le router (route privée).
//   - Paramètre 'q' requis, 2 caractères minimum, 64 max.
//   - Résultats : max 10, jamais l'email ni le password_hash.
//   - Cherche dans profiles.pseudo ET dans user_connections (game_name + tag_line).
//   - Si q contient '#', tente un match exact game_name/tag_line.

import type { Request, Response } from 'express';

import { query } from '../_core/db.js';

const SEARCH_MIN_LEN = 2;
const SEARCH_MAX_LEN = 64;
const RESULTS_LIMIT = 10;

interface ProfileResult {
  id: string;
  pseudo: string;
  riot_game_name: string | null;
  riot_tag_line: string | null;
}

export async function userSearchHandler(req: Request, res: Response): Promise<void> {
  const raw = req.query['q'];
  if (typeof raw !== 'string' || raw.trim().length < SEARCH_MIN_LEN) {
    res.status(400).json({ error: `Le paramètre 'q' doit contenir au moins ${SEARCH_MIN_LEN} caractères.` });
    return;
  }
  if (raw.trim().length > SEARCH_MAX_LEN) {
    res.status(400).json({ error: `Le paramètre 'q' ne peut pas dépasser ${SEARCH_MAX_LEN} caractères.` });
    return;
  }

  const q = raw.trim();

  // Si la recherche contient '#', on tente un match Riot ID (game_name#tag_line).
  const hashIdx = q.indexOf('#');
  const isRiotIdSearch = hashIdx > 0 && hashIdx < q.length - 1;

  let rows: ProfileResult[];

  if (isRiotIdSearch) {
    const gameName = q.slice(0, hashIdx);
    const tagLine = q.slice(hashIdx + 1);

    const result = await query<ProfileResult>(
      `SELECT DISTINCT p.id, p.pseudo,
              uc.game_name AS riot_game_name,
              uc.tag_line  AS riot_tag_line
       FROM profiles p
       LEFT JOIN user_connections uc ON uc.user_id = p.id
       WHERE uc.game_name ILIKE $1
         AND uc.tag_line  ILIKE $2
       LIMIT $3`,
      [`${gameName}%`, `${tagLine}%`, RESULTS_LIMIT],
    );
    rows = result.rows;
  } else {
    // Recherche combinée : pseudo OU game_name contenant q.
    const result = await query<ProfileResult>(
      `SELECT DISTINCT p.id, p.pseudo,
              uc.game_name AS riot_game_name,
              uc.tag_line  AS riot_tag_line
       FROM profiles p
       LEFT JOIN user_connections uc ON uc.user_id = p.id
       WHERE p.pseudo ILIKE $1
          OR uc.game_name ILIKE $1
       LIMIT $2`,
      [`%${q}%`, RESULTS_LIMIT],
    );
    rows = result.rows;
  }

  const users = rows.map((r) => ({
    id: r.id,
    pseudo: r.pseudo,
    riotId: r.riot_game_name && r.riot_tag_line
      ? `${r.riot_game_name}#${r.riot_tag_line}`
      : null,
  }));

  res.json({ users });
}
