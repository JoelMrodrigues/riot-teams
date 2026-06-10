/** Libellés + couleurs des types d'événement d'agenda. */
import type { LolEventType } from '../types/lolEvent.types';

export const EVENT_TYPE_LABEL: Record<LolEventType, string> = {
  scrim: 'Scrim',
  training: 'Entraînement',
  review: 'Review VOD',
  soloq: 'SoloQ groupée',
  other: 'Autre',
};

export const EVENT_TYPE_COLOR: Record<LolEventType, string> = {
  scrim: '#F472B6',
  training: '#22D3EE',
  review: '#FBBF24',
  soloq: '#A78BFA',
  other: '#94A3B8',
};

export const EVENT_TYPES: LolEventType[] = ['scrim', 'training', 'review', 'soloq', 'other'];
