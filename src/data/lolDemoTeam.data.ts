/**
 * Jeu de données fictives pour le MODE DÉMO (preview sans serveur) de la section
 * équipes LoL. Réutilise les joueurs mock par rôle (lolDemoRoster) pour rester
 * cohérent avec l'Aperçu.
 */
import type {
  LolApiTeam, LolApiTeamDetail, LolApiMember, LolApiRosterMember,
} from '../types/lolTeam.types';
import type { User } from '../types/auth';
import type { PlayerStatEntry } from '../hooks/useTeamPlayerStats';
import { ROLE_ORDER } from '../utils/organizeRosterByRole';
import { demoFillFor } from './lolDemoRoster.data';

export const DEMO_TOKEN = 'demo';

export const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@void.pro',
  pseudo: 'Marcel',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};

const TS = new Date().toISOString();

export const DEMO_TEAM: LolApiTeam = {
  id: 'demo',
  name: 'Los Raton Hess',
  tag: 'LRH',
  region: 'EUW',
  accentColor: null,
  description: 'Équipe de démonstration — données fictives.',
  icon: { kind: 'champion', value: 'Jhin' },
  ownerId: DEMO_USER.id,
  createdAt: TS,
  updatedAt: TS,
  myRole: 'owner',
  hasLogo: false,
};

const slots = ROLE_ORDER.map((r) => demoFillFor(r));

export const DEMO_ROSTER: LolApiRosterMember[] = slots.map((s) => s.member);

export const DEMO_MEMBERS: LolApiMember[] = [
  { userId: DEMO_USER.id, pseudo: 'Marcel',    role: 'owner' },
  { userId: 'demo-capt',  pseudo: 'Shyn',      role: 'captain' },
  { userId: 'demo-coach', pseudo: 'Coach Bob', role: 'coach' },
];

export const DEMO_TEAM_DETAIL: LolApiTeamDetail = {
  ...DEMO_TEAM,
  members: DEMO_MEMBERS,
  roster: DEMO_ROSTER,
};

export const DEMO_TEAMS_LIST: LolApiTeam[] = [DEMO_TEAM];

export const DEMO_STATS: Map<string, PlayerStatEntry> = new Map(
  slots.map((s) => [s.member.id, s.stats]),
);
