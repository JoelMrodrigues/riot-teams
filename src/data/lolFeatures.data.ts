/** Données fictives des fonctionnalités mises en avant sur la vitrine LoL. */
export type LolFeatureIcon = 'search' | 'scrim' | 'stats' | 'team';

export interface LolFeature {
  id: string;
  title: string;
  description: string;
  icon: LolFeatureIcon;
  to: string;
  badge?: string;
  /** Taille dans la bento grid. */
  span: 'wide' | 'tall' | 'normal';
}

export const LOL_FEATURES: LolFeature[] = [
  {
    id: 'search',
    title: 'Recherche de Stats',
    description:
      'Analyse SoloQ complète par Riot ID : KDA, CS/min, winrate par champion, historique et progression de rang.',
    icon: 'search',
    to: '/lol/search',
    badge: 'Solo',
    span: 'wide',
  },
  {
    id: 'scrim',
    title: 'Gestion de Scrims',
    description:
      'Crée ton équipe, planifie tes scrims et suis les performances collectives match après match.',
    icon: 'scrim',
    to: '/lol/teams',
    badge: 'Équipe',
    span: 'tall',
  },
  {
    id: 'stats',
    title: 'Statistiques Avancées',
    description: 'Métriques détaillées : dégâts, vision, gold@15 et écarts par rôle.',
    icon: 'stats',
    to: '/lol/search',
    span: 'normal',
  },
  {
    id: 'team',
    title: 'Profils d’Équipe',
    description: 'Trois profils au choix : Scrim, Flex ou Fun, adaptés à ton ambition.',
    icon: 'team',
    to: '/lol/teams',
    span: 'normal',
  },
];
