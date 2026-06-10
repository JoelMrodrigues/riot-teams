/**
 * Agenda d'une équipe LoL : charge les événements (lol_events) et expose les
 * actions create/update/remove. Démo-aware : en ?demo=1, données fictives.
 */
import { useState, useEffect, useCallback } from 'react';

import { fetchTeamEvents, createTeamEvent, updateTeamEvent, deleteTeamEvent } from '../services/lolEventsApi';
import { useAuth } from './useAuth';
import { isDemoMode } from '../utils/demoMode';
import { DEMO_LOL_EVENTS } from '../data/lolDemoEvents.data';
import type { LolEvent, LolEventBody } from '../types/lolEvent.types';

export interface UseTeamEventsReturn {
  events: LolEvent[];
  loading: boolean;
  error: string | null;
  create: (body: LolEventBody) => Promise<void>;
  update: (id: string, body: Partial<LolEventBody>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useTeamEvents(teamId: string | undefined): UseTeamEventsReturn {
  const { token } = useAuth();
  const [events, setEvents] = useState<LolEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rev, setRev] = useState(0);
  const demo = isDemoMode();

  useEffect(() => {
    if (demo) { setEvents(DEMO_LOL_EVENTS); setLoading(false); return; }
    if (!teamId || !token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTeamEvents(teamId, token)
      .then((e) => { if (!cancelled) { setEvents(e); setLoading(false); } })
      .catch((err: unknown) => {
        if (!cancelled) { setError(err instanceof Error ? err.message : 'Erreur agenda'); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [teamId, token, rev, demo]);

  const bump = useCallback(() => setRev((v) => v + 1), []);

  const create = useCallback(async (body: LolEventBody) => {
    if (demo || !teamId || !token) return;
    await createTeamEvent(teamId, body, token);
    bump();
  }, [demo, teamId, token, bump]);

  const update = useCallback(async (id: string, body: Partial<LolEventBody>) => {
    if (demo || !teamId || !token) return;
    await updateTeamEvent(teamId, id, body, token);
    bump();
  }, [demo, teamId, token, bump]);

  const remove = useCallback(async (id: string) => {
    if (demo || !teamId || !token) return;
    await deleteTeamEvent(teamId, id, token);
    bump();
  }, [demo, teamId, token, bump]);

  return { events, loading, error, create, update, remove };
}
