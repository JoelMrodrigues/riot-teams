import type { Game } from '../types/game.types';

export const GAMES_DATA: Game[] = [
  {
    id: 'lol',
    name: 'League of Legends',
    shortName: 'League',
    tag: 'LoL',
    description: 'Ranked stats, champion mastery, match history and team composition analysis.',
    accentColor: '#C89B3C',
    darkColor: '#0A1428',
    midColor: '#0D2748',
    gradientStyle:
      'linear-gradient(to top, rgba(10,20,40,0.97) 0%, rgba(10,20,40,0.6) 50%, rgba(10,20,40,0.15) 100%)',
    imagePath: '/images/lol-bg.jpg',
    ctaLabel: 'Explore LoL Stats',
    maxMembers: 5,
    previewStats: [
      { label: 'Ranked', value: 'Solo / Flex' },
      { label: 'Champions', value: '165+' },
      { label: 'Metrics', value: 'KDA · CS · WR' },
    ],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'Valorant',
    tag: 'VAL',
    description: 'Agent performance, ACS tracking, headshot rate and competitive rank progression.',
    accentColor: '#FF4655',
    darkColor: '#0F0E0E',
    midColor: '#200A0F',
    gradientStyle:
      'linear-gradient(to top, rgba(15,14,14,0.97) 0%, rgba(15,14,14,0.55) 50%, rgba(15,14,14,0.1) 100%)',
    imagePath: '/images/valorant-bg.jpg',
    ctaLabel: 'Explore Valorant Stats',
    maxMembers: 5,
    previewStats: [
      { label: 'Ranked', value: 'Competitive' },
      { label: 'Agents', value: '25+' },
      { label: 'Metrics', value: 'ACS · HS% · ADR' },
    ],
  },
  {
    id: 'tft',
    name: 'Teamfight Tactics',
    shortName: 'TFT',
    tag: 'TFT',
    description: 'Composition tracker, augment win rates, trait synergies and placement history.',
    accentColor: '#9B72CF',
    darkColor: '#0D0B1A',
    midColor: '#1A1535',
    gradientStyle:
      'linear-gradient(to top, rgba(13,11,26,0.97) 0%, rgba(13,11,26,0.55) 50%, rgba(13,11,26,0.1) 100%)',
    imagePath: '/images/tft-bg.jpg',
    ctaLabel: 'Explore TFT Stats',
    maxMembers: 8,
    previewStats: [
      { label: 'Ranked', value: 'Hyper Roll' },
      { label: 'Traits', value: '50+' },
      { label: 'Metrics', value: 'Avg Place · Top 4%' },
    ],
  },
];
