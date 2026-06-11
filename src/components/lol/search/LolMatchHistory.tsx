import React, { useState } from 'react';

import { MatchRow } from './MatchRow';
import { LolMatchExpanded } from '../match/LolMatchExpanded';
import type { MatchInfo } from '../../../types/lolApi.types';
import type { MatchDetail } from '../../../types/lolMatchDetail.types';
import type { MatchTimeline } from '../../../types/lolTimeline.types';

interface LolMatchHistoryProps {
  matches: MatchInfo[];
  /** Chargeurs injectables (mock en démo/sandbox). Défaut : API réelle. */
  loadDetail?: (matchId: string) => Promise<MatchDetail>;
  loadTimeline?: (matchId: string) => Promise<MatchTimeline>;
}

/**
 * Historique des parties avec contenu déroulant (accordéon, façon OP.gg) :
 * cliquer une ligne déplie « Vue globale » / « Timeline » en dessous (pas de modale).
 */
export function LolMatchHistory({ matches, loadDetail, loadTimeline }: LolMatchHistoryProps): React.JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  if (matches.length === 0) {
    return (
      <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>
        Aucune partie ne correspond à ces filtres.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {matches.map((m) => {
        const open = openId === m.matchId;
        return (
          <div key={m.matchId} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : m.matchId)}
              aria-expanded={open}
              className="block w-full cursor-pointer text-left transition-opacity duration-150 hover:opacity-90"
            >
              <MatchRow match={m} />
            </button>
            {open && (
              <LolMatchExpanded matchId={m.matchId} loadDetail={loadDetail} loadTimeline={loadTimeline} />
            )}
          </div>
        );
      })}
    </div>
  );
}
