import React from 'react';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../../../components/lol/shared/ChampionAvatar';
import { tierColor, formatRankShort, winrateColor } from '../../../utils/lolRank';
import { normalizeRole, ROLE_LABEL } from '../../../utils/organizeRosterByRole';
import { sortPlayersByRank, aggregateTeamChampions } from '../../../utils/lolTeamAggregate';
import { LolStatsRefresh } from '../../../components/lol/teams/LolStatsRefresh';
import { useTeamOutlet } from './teamOutletContext';

/** Statistiques d'équipe — données réelles (rangs + champions des comptes liés). */
export function LolTeamStatsPage(): React.JSX.Element {
  const { actions, statsByRosterId, statsLoading, statsUpdatedAt, refreshStats, resolvedAccent } = useTeamOutlet();
  const roster = actions.roster;

  const ranked = sortPlayersByRank(roster, statsByRosterId);
  const champions = aggregateTeamChampions(roster, statsByRosterId);

  return (
    <motion.div
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 md:px-6 lg:px-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
            Statistiques d'équipe
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
            Basé sur les comptes SoloQ du roster. Les stats de parties d'équipe arriveront plus tard.
          </p>
        </div>
        <LolStatsRefresh updatedAt={statsUpdatedAt} loading={statsLoading} onRefresh={refreshStats} />
      </div>

      {statsLoading ? (
        <p className="py-12 text-center text-sm" style={{ color: 'var(--lol-text-muted)' }}>Chargement des stats…</p>
      ) : (
        <>
          {/* Classement interne */}
          <section className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
              Classement de l'équipe
            </span>
            {ranked.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>Aucun joueur classé pour le moment.</p>
            ) : ranked.map((p, i) => {
              const canon = normalizeRole(p.member.roleInGame);
              return (
                <div key={p.member.id} className="flex items-center gap-3 rounded-md border px-3 py-2" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
                  <span className="w-4 flex-shrink-0 text-center text-xs font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: i === 0 ? resolvedAccent : 'var(--lol-text-muted)' }}>{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>
                    {p.member.displayName || p.member.gameName}
                    {canon && <span className="ml-2 text-[10px] font-semibold uppercase" style={{ color: 'var(--lol-text-muted)' }}>{ROLE_LABEL[canon]}</span>}
                  </span>
                  <span className="flex-shrink-0 text-xs font-bold uppercase" style={{ fontFamily: 'Rajdhani, sans-serif', color: tierColor(p.rank.tier) }}>
                    {formatRankShort(p.rank.tier, p.rank.rank)} · {p.rank.lp} LP
                  </span>
                  <span className="w-10 flex-shrink-0 text-right text-xs font-semibold" style={{ color: winrateColor(p.rank.winrate) }}>{p.rank.winrate}%</span>
                </div>
              );
            })}
          </section>

          {/* Champions les plus joués */}
          <section className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
              Champions les plus joués
            </span>
            {champions.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--lol-text-muted)' }}>Aucune donnée de champion.</p>
            ) : champions.map((c) => (
              <div key={c.champion} className="flex items-center gap-3 rounded-md border px-3 py-2" style={{ background: 'var(--lol-surface)', borderColor: 'var(--lol-border)' }}>
                <ChampionAvatar champKey={c.champion} label={c.champion} size={32} ring={resolvedAccent} />
                <span className="w-24 flex-shrink-0 truncate text-sm font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}>{c.champion}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--lol-bg-elevated)' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.winrate}%`, background: winrateColor(c.winrate) }} />
                </div>
                <span className="w-10 flex-shrink-0 text-right text-xs font-bold" style={{ color: winrateColor(c.winrate) }}>{c.winrate}%</span>
                <span className="w-12 flex-shrink-0 text-right text-xs" style={{ color: 'var(--lol-text-muted)' }}>{c.games}g</span>
              </div>
            ))}
          </section>
        </>
      )}
    </motion.div>
  );
}
