import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ChampionAvatar } from '../shared/ChampionAvatar';
import { LOL_EMBLEMS } from '../../../data/lolEmblems.data';
import { resolveAccent } from '../../../data/lolTeamAccents.data';
import { GAMES_DATA } from '../../../data/games.data';
import { roleLabelFr } from '../../../utils/lolTeamRole';
import { teamLogoUrl } from '../../../services/lolPlayerStatsApi';
import type { LolApiTeam } from '../../../types/lolTeam.types';

interface LolTeamCardProps {
  team: LolApiTeam;
  /** Nombre de membres dans le roster — passé séparément car absent de LolApiTeam. */
  memberCount?: number;
}

/** Carte d'équipe enrichie LoL : icône, tag, couleur d'accent dynamique. */
export function LolTeamCard({ team, memberCount = 0 }: LolTeamCardProps): React.JSX.Element {
  const navigate   = useNavigate();
  const game       = GAMES_DATA.find((g) => g.id === 'lol')!;
  const accent     = resolveAccent(team.accentColor ?? undefined);
  const maxMembers = game.maxMembers;
  const [logoError, setLogoError] = useState(false);

  const createdDate = new Date(team.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const renderIcon = () => {
    if (team.hasLogo && !logoError) {
      return (
        <img
          src={teamLogoUrl(team.id)}
          alt={`Logo ${team.name}`}
          width={40}
          height={40}
          loading="lazy"
          onError={() => setLogoError(true)}
          className="h-10 w-10 rounded-sm object-cover"
          style={{ border: `1px solid ${accent}40` }}
        />
      );
    }
    if (team.icon?.kind === 'champion') {
      return <ChampionAvatar champKey={team.icon.value} label={team.icon.value} size={40} ring={accent} />;
    }
    if (team.icon?.kind === 'emblem') {
      const emblem = LOL_EMBLEMS.find((e) => e.id === team.icon!.value);
      if (emblem) {
        return (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-sm"
            style={{ background: `${accent}15`, border: `1px solid ${accent}40` }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={accent} aria-hidden="true">
              <path d={emblem.path} />
            </svg>
          </div>
        );
      }
    }
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-sm text-base font-bold"
        style={{
          background: `${accent}18`,
          border: `1px solid ${accent}30`,
          fontFamily: 'Rajdhani, sans-serif',
          color: accent,
        }}
      >
        {team.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <motion.div
      className="group relative flex flex-col gap-4 cursor-pointer rounded-sm border p-5 transition-colors duration-200"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
      whileHover={{ borderColor: `${accent}50`, background: `${accent}08` }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/lol/team/${team.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{renderIcon()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="truncate text-lg font-bold"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text)' }}
            >
              {team.name}
            </h3>
            {team.tag && (
              <span
                className="flex-shrink-0 rounded-sm px-1.5 py-0.5 text-xs font-bold uppercase"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  border: `1px solid ${accent}40`,
                  background: `${accent}10`,
                  color: accent,
                }}
              >
                {team.tag}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--lol-text-muted)' }}>
              {team.region ? `${team.region} · ` : ''}Créée le {createdDate}
            </span>
            {team.myRole && (
              <span
                className="flex-shrink-0 rounded-sm px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  background: 'var(--brand-muted)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  color: 'var(--brand-soft)',
                }}
              >
                {roleLabelFr(team.myRole)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--lol-text-muted)' }}>
            Roster
          </span>
          <span className="text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: accent }}>
            {memberCount} / {maxMembers}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: maxMembers }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-200"
              style={{ background: i < memberCount ? accent : 'var(--border-default)' }}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-30 transition-opacity duration-200 group-hover:opacity-70" style={{ color: 'var(--lol-text-muted)' }}>
        →
      </div>
    </motion.div>
  );
}
