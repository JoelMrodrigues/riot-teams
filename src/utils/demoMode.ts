/**
 * Mode démo : permet de prévisualiser tout le front avec des données fictives,
 * SANS serveur ni connexion (utile quand l'API est injoignable, ex. réseau pro).
 *
 * Activation : ajouter `?demo=1` à l'URL (mémorisé en localStorage → reste actif
 * en naviguant). Désactivation : `?demo=0`.
 */
const KEY = 'voidpro_demo';

export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;

  const q = new URLSearchParams(window.location.search).get('demo');
  if (q === '1') {
    try { localStorage.setItem(KEY, '1'); } catch { /* stockage indispo */ }
    return true;
  }
  if (q === '0') {
    try { localStorage.removeItem(KEY); } catch { /* stockage indispo */ }
    return false;
  }

  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
