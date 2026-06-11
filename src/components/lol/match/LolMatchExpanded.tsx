import React, { useState, useEffect } from 'react';

import { LolMatchDetail } from './LolMatchDetail';
import { LolMatchTimeline } from './LolMatchTimeline';
import { fetchMatchDetail, fetchMatchTimeline } from '../../../services/lolMatchApi';
import { isDemoMode } from '../../../utils/demoMode';
import { DEMO_MATCH_DETAIL } from '../../../data/lolDemoMatch.data';
import { DEMO_TIMELINE } from '../../../data/lolDemoTimeline.data';
import { LOL_ACCENTS } from '../../../constants/lolTheme';
import type { MatchDetail } from '../../../types/lolMatchDetail.types';
import type { MatchTimeline } from '../../../types/lolTimeline.types';

type Tab = 'detail' | 'timeline';

interface LolMatchExpandedProps {
  matchId: string;
  loadDetail?: (id: string) => Promise<MatchDetail>;
  loadTimeline?: (id: string) => Promise<MatchTimeline>;
}

const defDetail = (id: string): Promise<MatchDetail> => (isDemoMode() ? Promise.resolve(DEMO_MATCH_DETAIL) : fetchMatchDetail(id));
const defTimeline = (id: string): Promise<MatchTimeline> => (isDemoMode() ? Promise.resolve(DEMO_TIMELINE) : fetchMatchTimeline(id));

const ACCENT = LOL_ACCENTS.solo.color;

/** Contenu déroulé d'une partie : onglets « Vue globale » / « Timeline ». */
export function LolMatchExpanded({ matchId, loadDetail, loadTimeline }: LolMatchExpandedProps): React.JSX.Element {
  const [tab, setTab] = useState<Tab>('detail');
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [timeline, setTimeline] = useState<MatchTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const wantDetail = tab === 'detail';
    if ((wantDetail && detail) || (!wantDetail && timeline)) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    const p = wantDetail ? (loadDetail ?? defDetail)(matchId) : (loadTimeline ?? defTimeline)(matchId);
    p.then((data) => {
      if (cancelled) return;
      if (wantDetail) setDetail(data as MatchDetail); else setTimeline(data as MatchTimeline);
      setLoading(false);
    }).catch((e: unknown) => {
      if (!cancelled) { setError(e instanceof Error ? e.message : 'Erreur de chargement.'); setLoading(false); }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, matchId]);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: 'Rajdhani, sans-serif',
    background: active ? `${ACCENT}1A` : 'transparent',
    border: `1px solid ${active ? `${ACCENT}40` : 'var(--lol-border)'}`,
    color: active ? ACCENT : 'var(--lol-text-muted)',
  });

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-1.5">
        <button type="button" onClick={() => setTab('detail')} className="rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wider" style={tabStyle(tab === 'detail')}>
          Vue globale
        </button>
        <button type="button" onClick={() => setTab('timeline')} className="rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-wider" style={tabStyle(tab === 'timeline')}>
          Timeline
        </button>
      </div>

      {loading ? (
        <p className="py-4 text-center text-xs" style={{ color: 'var(--lol-text-muted)' }}>Chargement…</p>
      ) : error ? (
        <p className="py-4 text-center text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      ) : tab === 'detail' ? (
        detail && <LolMatchDetail match={detail} accent={ACCENT} />
      ) : (
        timeline && <LolMatchTimeline timeline={timeline} />
      )}
    </div>
  );
}
