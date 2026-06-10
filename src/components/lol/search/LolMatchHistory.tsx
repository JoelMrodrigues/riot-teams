import React, { useState } from 'react';

import { MatchRow } from './MatchRow';
import { LolMatchDetail } from '../match/LolMatchDetail';
import { fetchMatchDetail } from '../../../services/lolMatchApi';
import { isDemoMode } from '../../../utils/demoMode';
import { DEMO_MATCH_DETAIL } from '../../../data/lolDemoMatch.data';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { MatchInfo } from '../../../types/lolApi.types';
import type { MatchDetail } from '../../../types/lolMatchDetail.types';

interface LolMatchHistoryProps {
  matches: MatchInfo[];
  /** Chargeur de détail injectable (mock en démo/sandbox). Défaut : API réelle. */
  loadDetail?: (matchId: string) => Promise<MatchDetail>;
}

function defaultLoad(matchId: string): Promise<MatchDetail> {
  if (isDemoMode()) return Promise.resolve(DEMO_MATCH_DETAIL);
  return fetchMatchDetail(matchId);
}

/**
 * Historique des parties avec détail déroulant (accordéon, façon OP.gg) :
 * cliquer une ligne déplie le détail complet en dessous (pas de modale).
 */
export function LolMatchHistory({ matches, loadDetail }: LolMatchHistoryProps): React.JSX.Element {
  const [openId, setOpenId]   = useState<string | null>(null);
  const [detail, setDetail]   = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const load = loadDetail ?? defaultLoad;

  const toggle = (id: string): void => {
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id);
    setDetail(null);
    setError(null);
    setLoading(true);
    load(id)
      .then(setDetail)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur de chargement.'))
      .finally(() => setLoading(false));
  };

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
              onClick={() => toggle(m.matchId)}
              aria-expanded={open}
              className="block w-full cursor-pointer text-left transition-opacity duration-150 hover:opacity-90"
            >
              <MatchRow match={m} />
            </button>
            {open && (
              <div className="mt-2">
                {loading ? (
                  <p className="py-4 text-center text-xs" style={{ color: 'var(--lol-text-muted)' }}>Chargement du détail…</p>
                ) : error ? (
                  <p className="py-4 text-center text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
                ) : detail ? (
                  <LolMatchDetail match={detail} accent={LOL_ACCENTS.solo.color} />
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
