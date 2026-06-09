import React from 'react';
import { useParams } from 'react-router-dom';

import { GamePageLayout } from '../../components/layout/GamePageLayout';
import { TeamDetailView } from '../../components/teams/TeamDetailView';
import { GAMES_DATA } from '../../data/games.data';
import type { GameType } from '../../types/team.types';

interface GameTeamPageProps {
  gameId: GameType;
}

/** Détail d'une équipe pour un jeu donné (commun aux 3 jeux). */
export function GameTeamPage({ gameId }: GameTeamPageProps): React.JSX.Element {
  const game = GAMES_DATA.find((g) => g.id === gameId)!;
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <GamePageLayout game={game}>
      <TeamDetailView game={game} teamId={teamId!} />
    </GamePageLayout>
  );
}
