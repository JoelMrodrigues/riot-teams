/** Contenu (FR) des sections de l'accueil exploration. */

export const HOME_SUMMARY =
  "void.pro réunit profils détaillés, gestion d'équipe, organisation de scrims et statistiques — pensé pour les équipes amateurs et semi-pro.";

export const HOME_OUTRO =
  "On espère que l'expérience te plaira. Bienvenue dans le void.";

export type HomeGameStatus = 'active' | 'soon';

export interface HomeGameSectionData {
  id: string;
  name: string;
  status: HomeGameStatus;
  tagline: string;
  features: string[];
  accent: string;
  to?: string;
}

export const HOME_GAME_SECTIONS: HomeGameSectionData[] = [
  {
    id: 'lol',
    name: 'League of Legends',
    status: 'active',
    tagline: 'Le jeu phare de void.pro, disponible maintenant.',
    features: [
      'Profils détaillés : rang, champions, historique de parties',
      "Gestion d'équipe : roster par rôle, membres, logo",
      'Scrims, calendrier et classements',
    ],
    accent: '#8B5CF6',
    to: '/lol',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    status: 'soon',
    tagline: 'Bientôt sur void.pro.',
    features: [
      'Stats agents : ACS, HS%, ADR',
      "Gestion d'équipe 5v5",
    ],
    accent: '#FF4655',
  },
  {
    id: 'tft',
    name: 'Teamfight Tactics',
    status: 'soon',
    tagline: 'Bientôt sur void.pro.',
    features: [
      'Compositions, augments et synergies',
      'Historique de placements',
    ],
    accent: '#9B72CF',
  },
];
