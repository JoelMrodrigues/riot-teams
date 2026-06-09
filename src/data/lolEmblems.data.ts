/** Emblèmes SVG disponibles pour les équipes LoL. Paths extraits de Heroicons/Lucide (MIT). */

export interface LolEmblemEntry {
  id:   string;
  name: string;
  /** SVG path d (viewBox 0 0 24 24). */
  path: string;
}

export const LOL_EMBLEMS: LolEmblemEntry[] = [
  {
    id: 'sword',
    name: 'Épée',
    path: 'M14.5 2.5l7 7-10 10-3-3 7-7-7-7 3-3zM2 20l4-1-3-3-1 4z',
  },
  {
    id: 'shield',
    name: 'Bouclier',
    path: 'M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z',
  },
  {
    id: 'crown',
    name: 'Couronne',
    path: 'M3 18h18v2H3v-2zM2 6l4 7 6-9 6 9 4-7v10H2V6z',
  },
  {
    id: 'bolt',
    name: 'Éclair',
    path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    path: 'M12 2c1.5 0 3 .5 4 1.5L19 7l2 2-2 2-1-1-5 5v1l2 2-3 3-2-2-1 1-2-2 1-1-5-5-1 1-2-2 2-2 3 3 1-1V8L8 5C7 4 6.5 3 6.5 2H12z',
  },
  {
    id: 'eye',
    name: 'Œil',
    path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11-3a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    id: 'flame',
    name: 'Flamme',
    path: 'M12 2c0 0-5.5 6-5.5 10a5.5 5.5 0 0011 0C17.5 8 12 2 12 2zm0 14a3 3 0 01-3-3c0-2 2-4.5 3-6 1 1.5 3 4 3 6a3 3 0 01-3 3z',
  },
  {
    id: 'star',
    name: 'Étoile',
    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    id: 'diamond',
    name: 'Diamant',
    path: 'M6 3h12l4 6-10 13L2 9l4-6zm1.5 1L5 9l7 9.5L19 9l-2.5-5h-9z',
  },
  {
    id: 'target',
    name: 'Cible',
    path: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a6 6 0 110 12A6 6 0 0112 6zm0 4a2 2 0 100 4 2 2 0 000-4z',
  },
];
