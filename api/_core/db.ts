// Pool PostgreSQL partagé, initialisé une seule fois au démarrage du process.
// Toutes les requêtes DB du projet passent par le helper `query()` ci-dessous.
// La connexion est paramétrée — zéro concaténation SQL dans ce fichier ni
// dans les modules qui l'importent.

import pg from 'pg';
import type { QueryResultRow } from 'pg';

// pg est un package CommonJS ; on récupère Pool depuis l'export default.
const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('[db] DATABASE_URL manquante. Vérifie ton .env.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err: Error) => {
  // On log l'événement mais on ne fuit pas de détails sensibles vers le client.
  console.error('[db] erreur client idle:', err.message);
});

/** Résultat typé d'une requête paramétrée. */
export interface QueryResult<T> {
  rows: T[];
  rowCount: number | null;
}

/**
 * Exécute une requête paramétrée et renvoie les lignes typées.
 * Toujours utiliser des paramètres ($1, $2 …) — jamais de concaténation.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const result = await pool.query<T>(sql, params);
  return { rows: result.rows, rowCount: result.rowCount };
}

/**
 * Exécute plusieurs requêtes dans une transaction unique.
 * En cas d'erreur, rollback automatique.
 */
export async function withTransaction<T>(
  fn: (q: typeof query) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Fournit un helper de requête lié au client (pas au pool global).
    const clientQuery = async <R extends QueryResultRow = QueryResultRow>(
      sql: string,
      params: unknown[] = [],
    ): Promise<QueryResult<R>> => {
      const result = await client.query<R>(sql, params);
      return { rows: result.rows, rowCount: result.rowCount };
    };
    const result = await fn(clientQuery as typeof query);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
